import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { stripFrontmatter } from "./markdown";
import type { Skill, SkillPairing } from "@/types/skill";

/**
 * Skills directory lives at the repo root, two levels up from website-next/.
 * In Next.js, process.cwd() returns the website-next/ directory during build.
 */
const SKILLS_DIR = path.join(process.cwd(), "..", ".claude", "skills");

/** Cache to avoid re-reading the filesystem on every call within a single build. */
let _cache: Skill[] | null = null;

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
 * Read all SKILL.md files from the skills directory and return parsed Skill objects.
 * Results are cached for the lifetime of the process (one build).
 */
export function getAllSkills(): Skill[] {
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
      const category = typeof metadata.category === "string"
        ? metadata.category
        : "Uncategorized";

      const name = typeof meta.name === "string" ? meta.name : "";
      const description = typeof meta.description === "string" ? meta.description : "";

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
      });
    } catch (err) {
      console.warn(`Failed to parse skill: ${dir}`, err);
    }
  }

  _cache = skills.sort((a, b) => a.title.localeCompare(b.title));
  return _cache;
}

/** Look up a single skill by its directory id. */
export function getSkillById(id: string): Skill | undefined {
  return getAllSkills().find((s) => s.id === id);
}

/** Return sorted list of unique category names. */
export function getSkillCategories(): string[] {
  const cats = new Set(getAllSkills().map((s) => s.category));
  return [...cats].sort();
}

/** Return skills grouped by category. */
export function getSkillsByCategory(): Record<string, Skill[]> {
  const skills = getAllSkills();
  const grouped: Record<string, Skill[]> = {};
  for (const skill of skills) {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  }
  return grouped;
}
