import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { stripFrontmatter } from "./markdown";
import { processSkillMarkdown } from "./mdx/pipeline";
import type { Skill, SkillPairing, SkillFolderFile, SkillFolderMeta } from "@/types/skill";

/**
 * Skills directory lives at the repo root, two levels up from website-next/.
 * In Next.js, process.cwd() returns the website-next/ directory during build.
 */
const SKILLS_DIR = path.join(process.cwd(), "..", ".claude", "skills");

/** Cache to avoid re-reading the filesystem on every call within a single build. */
let _cache: Skill[] | null = null;

/* ── Category normalization ───────────────────────────────────────────────── */

/**
 * "Design & Creative" (35 skills) is split into two balanced buckets.
 * Skills listed here move to "Creative & Media"; everything else
 * in "Design & Creative" lands in "Design & UX".
 */
const CREATIVE_MEDIA_SKILLS = new Set([
  "2000s-visualization-expert",
  "collage-layout-expert",
  "color-theory-palette-harmony-expert",
  "hand-drawn-infographic-creator",
  "interior-design-expert",
  "maximalist-wall-decorator",
  "photo-composition-critic",
  "pixel-art-infographic-creator",
  "pixel-art-scaler",
  "sound-engineer",
  "voice-audio-engineer",
  "web-cloud-designer",
  "web-wave-designer",
  "web-weather-creator",
  "win31-audio-design",
  "win31-pixel-art-designer",
]);

/** Skills that are individually misfiled and need to move. */
const SKILL_CATEGORY_OVERRIDE: Record<string, string> = {
  "database-design-patterns":  "Data & Analytics",
  "pwa-expert":                "DevOps & Infrastructure",
  "drizzle-migrations":        "DevOps & Infrastructure",
  "postgresql-optimization":   "Data & Analytics",
};

/**
 * Normalize raw category strings from SKILL.md frontmatter to
 * canonical category names. Handles case variants and orphans.
 */
function resolveCategory(rawCategory: string, skillId: string): string {
  // Per-skill overrides first
  if (SKILL_CATEGORY_OVERRIDE[skillId]) return SKILL_CATEGORY_OVERRIDE[skillId];

  // Split the oversized "Design & Creative" bucket
  if (rawCategory === "Design & Creative") {
    return CREATIVE_MEDIA_SKILLS.has(skillId) ? "Creative & Media" : "Design & UX";
  }

  // Normalize orphan / case-variant categories to canonical names
  const MAP: Record<string, string> = {
    "Design":                    "Design & UX",
    "design":                    "Design & UX",
    "Frontend Development":      "Design & UX",
    "frontend":                  "Design & UX",
    "Testing":                   "Code Quality & Testing",
    "testing":                   "Code Quality & Testing",
    "Development":               "Code Quality & Testing",
    "development":               "Code Quality & Testing",
    "security":                  "Security & DevOps",
    "DevOps & Site Reliability": "DevOps & Infrastructure",
    "DevOps & Automation":       "DevOps & Infrastructure",
    "devops":                    "DevOps & Infrastructure",
    "database":                  "Data & Analytics",
    "Documentation":             "Content & Writing",
    "documentation":             "Content & Writing",
    "Project Management":        "Productivity & Meta",
    "Legal & Compliance":        "Business & Monetization",
    "Research & Analysis":       "Productivity & Meta",
  };

  return MAP[rawCategory] ?? rawCategory;
}

/**
 * Parse the YAML frontmatter block from raw markdown using js-yaml
 * for proper nested structure support (metadata.category, metadata.tags, etc.).
 */
function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  try {
    const parsed = yaml.load(match[1]);
    return (parsed && typeof parsed === "object" ? parsed : {}) as Record<
      string,
      unknown
    >;
  } catch {
    return {};
  }
}

/**
 * Convert a kebab-case directory name to Title Case.
 * "computer-vision-pipeline" -> "Computer Vision Pipeline"
 */
function titleCase(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extract tags from the parsed frontmatter metadata.
 * Tags can be a YAML array of strings or a comma-separated string.
 */
function extractTags(meta: Record<string, unknown>): string[] {
  const metadata = meta.metadata as Record<string, unknown> | undefined;
  if (!metadata) return [];

  const raw = metadata.tags;
  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Extract pairs-with entries from parsed frontmatter metadata.
 */
function extractPairings(meta: Record<string, unknown>): SkillPairing[] | undefined {
  const metadata = meta.metadata as Record<string, unknown> | undefined;
  if (!metadata) return undefined;

  const raw = metadata["pairs-with"];
  if (!Array.isArray(raw)) return undefined;

  const pairings: SkillPairing[] = [];
  for (const entry of raw) {
    if (
      entry &&
      typeof entry === "object" &&
      "skill" in entry &&
      "reason" in entry
    ) {
      pairings.push({
        skill: String((entry as Record<string, unknown>).skill),
        reason: String((entry as Record<string, unknown>).reason),
      });
    }
  }
  return pairings.length > 0 ? pairings : undefined;
}

/**
 * Recursively enumerate a skill directory into a SkillFolderFile tree.
 */
function enumerateFolder(
  dirPath: string,
  relativeTo: string
): SkillFolderFile[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const result: SkillFolderFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(relativeTo, fullPath);

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        type: "folder",
        path: relPath,
        children: enumerateFolder(fullPath, relativeTo),
      });
    } else {
      const stats = fs.statSync(fullPath);
      result.push({
        name: entry.name,
        type: "file",
        path: relPath,
        size: stats.size,
      });
    }
  }

  return result.sort((a, b) => {
    // Folders first, then alphabetical
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Build folder metadata for a skill directory.
 */
function buildFolderMeta(skillDir: string): SkillFolderMeta {
  const files = enumerateFolder(skillDir, skillDir);

  let fileCount = 0;
  let folderCount = 0;

  function count(items: SkillFolderFile[]) {
    for (const item of items) {
      if (item.type === "file") fileCount++;
      else {
        folderCount++;
        if (item.children) count(item.children);
      }
    }
  }
  count(files);

  return {
    fileCount,
    folderCount,
    hasContent: fileCount > 1 || folderCount > 0,
    files,
  };
}

/**
 * Read all SKILL.md files from the skills directory and return parsed Skill objects.
 * Results are cached for the lifetime of the process (one build).
 *
 * Async because the unified pipeline processes markdown at build time.
 */
export async function getAllSkills(): Promise<Skill[]> {
  if (_cache) return _cache;

  if (!fs.existsSync(SKILLS_DIR)) {
    console.warn(`Skills directory not found: ${SKILLS_DIR}`);
    return [];
  }

  const dirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const skills: Skill[] = [];

  for (const dir of dirs) {
    const skillPath = path.join(SKILLS_DIR, dir, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;

    try {
      const raw = fs.readFileSync(skillPath, "utf-8");
      const meta = parseFrontmatter(raw);
      const body = stripFrontmatter(raw);

      const metadata = (meta.metadata ?? {}) as Record<string, unknown>;
      const rawCategory = typeof metadata.category === "string"
        ? metadata.category
        : "Uncategorized";
      const category = resolveCategory(rawCategory, dir);

      const name = typeof meta.name === "string" ? meta.name : "";
      const description = typeof meta.description === "string" ? meta.description : "";

      // Process markdown through unified pipeline at build time
      const contentHtml = await processSkillMarkdown(body);

      // Enumerate folder contents
      const skillDir = path.join(SKILLS_DIR, dir);
      const folderMeta = buildFolderMeta(skillDir);

      skills.push({
        id: dir,
        title: name || titleCase(dir),
        category,
        description,
        tags: extractTags(meta),
        badge: typeof metadata.badge === "string"
          ? (metadata.badge as Skill["badge"])
          : undefined,
        heroImage: `/img/skills/${dir}-hero.webp`,
        pairsWith: extractPairings(meta),
        content: body,
        contentHtml,
        folderMeta,
      });
    } catch (err) {
      console.warn(`Failed to parse skill: ${dir}`, err);
    }
  }

  _cache = skills.sort((a, b) => a.title.localeCompare(b.title));

  // ── Side-effect: write static JSON for client-side loading ──
  //
  // Instead of passing the full skills corpus through RSC props (which
  // serializes ~15MB into EVERY page's payload), we write it once to
  // public/data/skills.json. The client-side Zustand store fetches this
  // single file on mount. This drops total build output from ~6.8GB to ~200MB.
  try {
    const categories = [...new Set(_cache.map((s) => s.category))].sort();
    const grouped: Record<string, Skill[]> = {};
    for (const skill of _cache) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    }

    const outDir = path.join(process.cwd(), "public", "data");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, "skills.json");
    fs.writeFileSync(
      outPath,
      JSON.stringify({ skills: _cache, categories, skillsByCategory: grouped })
    );
    const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
    console.log(`✓ Generated public/data/skills.json (${sizeMB} MB, ${_cache.length} skills)`);
  } catch (err) {
    console.warn("Failed to write skills.json (non-fatal):", err);
  }

  return _cache;
}

/** Look up a single skill by its directory id. */
export async function getSkillById(id: string): Promise<Skill | undefined> {
  const skills = await getAllSkills();
  return skills.find((s) => s.id === id);
}

/** Return sorted list of unique category names. */
export async function getSkillCategories(): Promise<string[]> {
  const skills = await getAllSkills();
  const cats = new Set(skills.map((s) => s.category));
  return [...cats].sort();
}

/** Return skills grouped by category. */
export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getAllSkills();
  const grouped: Record<string, Skill[]> = {};
  for (const skill of skills) {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  }
  return grouped;
}
