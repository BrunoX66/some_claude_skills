#!/usr/bin/env npx tsx
/**
 * Hero Image Prompt Generator
 *
 * Generates Ideogram-ready prompts for skill hero images using the established
 * isometric pixel art style. Reads skill metadata (name, description, category)
 * and produces prompts that match the visual language of existing hero images.
 *
 * Usage:
 *   npx tsx scripts/generate-hero-prompts.ts                # Show missing only
 *   npx tsx scripts/generate-hero-prompts.ts --all          # All skills
 *   npx tsx scripts/generate-hero-prompts.ts --skill <id>   # Single skill
 *   npx tsx scripts/generate-hero-prompts.ts --json         # JSON output
 *   npx tsx scripts/generate-hero-prompts.ts --validate     # Check coverage
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseAllSkills } from './lib/skill-parser';
import { ParsedSkill, SKILL_CATEGORIES } from './lib/types';

// =============================================================================
// CONSTANTS — Ideogram settings for all hero images
// =============================================================================

export const IDEOGRAM_SETTINGS = {
  aspect_ratio: '16x9' as const,
  style_type: 'DESIGN' as const,
  magic_prompt: 'OFF' as const,
  rendering_speed: 'QUALITY' as const,
  num_images: 1,
  output_dir: 'website/static/img/skills',
} as const;

export const NEGATIVE_PROMPT =
  'text, words, letters, numbers, labels, watermark, signature, blurry, smooth gradients, photorealistic, 3D render, anime, cartoon, logo';

const PROMPT_SUFFIX =
  'teal sage mint background, dark slate isometric platform with subtle grid, ' +
  '16-bit pixel art aesthetic with visible pixels and dark outlines, ' +
  'muted professional pastel color palette, no text, no anti-aliasing, clean pixel art style';

// =============================================================================
// SCENE METAPHOR ENGINE
// =============================================================================

/**
 * Composition families — the isometric "stage" that best fits a skill's domain.
 */
type CompositionFamily =
  | 'workspace'    // Dev tools, productivity, strategy
  | 'room'         // Lifestyle, design, personal
  | 'platform'     // Infrastructure, systems, data
  | 'command'      // Security, monitoring, crisis
  | 'workshop'     // Creative, engineering, building
  | 'lab'          // Testing, analysis, research
  | 'studio'       // Design, audio, visual
  | 'office';      // Business, writing, planning

/**
 * Maps a category to its default composition family and accent flavor.
 */
const CATEGORY_DEFAULTS: Record<string, { family: CompositionFamily; accents: string }> = {
  'AI & Machine Learning':      { family: 'lab',       accents: 'terminal green, cyan, neural glow' },
  'Code Quality & Testing':     { family: 'lab',       accents: 'green checkmarks, red alerts' },
  'Content & Writing':          { family: 'office',    accents: 'warm amber, parchment, ink' },
  'Data & Analytics':           { family: 'workspace', accents: 'chart colors, data blue, grid cyan' },
  'Design & Creative':          { family: 'studio',    accents: 'lavender, pink, coral, palette colors' },
  'DevOps & Site Reliability':  { family: 'platform',  accents: 'pipeline green, container blue' },
  'Business & Monetization':    { family: 'office',    accents: 'gold, warm amber, chart green' },
  'Research & Analysis':        { family: 'lab',       accents: 'magnifier glass, specimen cyan' },
  'Productivity & Meta':        { family: 'workspace', accents: 'clean blue, organized white' },
  'Lifestyle & Personal':       { family: 'room',      accents: 'soft purple, sky blue, warm green' },
  'DAG Framework':              { family: 'command',    accents: 'node cyan, edge green, flow arrows' },
  'Legal & Compliance':         { family: 'office',    accents: 'justice gold, document cream, gavel brown' },
};

/**
 * Keyword-to-scene overrides for specific skill domains.
 * These take priority over category defaults when a skill name matches.
 */
const KEYWORD_SCENES: Array<{
  keywords: string[];
  scene: string;
  details: string;
}> = [
  // Security & Auth
  { keywords: ['security', 'auth', 'oauth', 'hipaa', 'compliance'],
    scene: 'a security operations center',
    details: 'analyst at desk with shield icons and lock symbols on monitors, security compliance checklists, authentication key forge' },
  // Testing
  { keywords: ['test', 'playwright', 'e2e', 'qa'],
    scene: 'an automated testing laboratory',
    details: 'test robots running suites on conveyor belt, green pass and red fail indicators, coverage gauge meters, assertion stamps' },
  // Database & Migration
  { keywords: ['database', 'supabase', 'drizzle', 'migration', 'sql'],
    scene: 'a database administration console',
    details: 'person at desk with schema editor on screen, table relationship diagrams, migration version arrows, query optimizer' },
  // Deployment & CI/CD
  { keywords: ['deploy', 'vercel', 'github-actions', 'ci', 'cd', 'devops'],
    scene: 'a deployment launchpad',
    details: 'mission control launching deployment rockets, pipeline stages with green gates, build progress dashboard' },
  // Design & UI
  { keywords: ['design', 'ui', 'ux', 'css', 'layout', 'typography'],
    scene: 'a design studio',
    details: 'designer at desk with component library, color swatches, responsive layout grids, style guide reference' },
  // Audio & Sound
  { keywords: ['audio', 'sound', 'music', 'speech', 'voice'],
    scene: 'an audio engineering studio',
    details: 'engineer at mixing console with waveform displays, speakers on stands, equalizer sliders, microphone on boom arm' },
  // Recovery & Wellness
  { keywords: ['recovery', 'sobriety', 'sober', 'rehab', 'grief', 'wellness'],
    scene: 'a wellness support room',
    details: 'comfortable space with milestone trackers, support tools, warm lighting, progress charts, accountability devices' },
  // Map & Geo
  { keywords: ['map', 'geo', 'cartograph', 'spatial'],
    scene: 'a cartography station',
    details: 'person at desk with globe and map overlays, satellite imagery layers, coordinate grid tools, zoom level controls' },
  // Drone & CV
  { keywords: ['drone', 'computer-vision', 'cv-expert'],
    scene: 'a drone computer vision workshop',
    details: 'drone hovering above workbench, aerial photographs on monitors, detection bounding boxes, camera lenses and circuit boards' },
  // DAG & Pipeline
  { keywords: ['dag', 'pipeline', 'workflow', 'orchestrat'],
    scene: 'a workflow orchestration control room',
    details: 'operator monitoring DAG execution on screens, node graph with flowing data, pipeline stages lighting up in sequence' },
  // Writing & Documentation
  { keywords: ['writer', 'writing', 'document', 'content', 'blog'],
    scene: 'a technical writing desk',
    details: 'writer at desk with reference manuals, style guide, structured outline on screen, diagram annotation tools' },
  // Performance & Optimization
  { keywords: ['performance', 'optimi', 'profil', 'react-performance'],
    scene: 'a performance tuning garage',
    details: 'engineer at workbench with flame graphs on screen, render timelines, optimization tools on pegboard, bundle size scale' },
];

// =============================================================================
// PROMPT GENERATION
// =============================================================================

export interface HeroPrompt {
  skillId: string;
  skillName: string;
  category: string;
  prompt: string;
  negativePrompt: string;
  hasExistingImage: boolean;
  imagePath: string;
}

/**
 * Generates an Ideogram prompt for a skill based on its metadata.
 */
export function generatePromptForSkill(skill: ParsedSkill): string {
  const { scene, details } = resolveSceneMetaphor(skill);
  return `Isometric pixel art illustration of ${scene}, ${details}, ${PROMPT_SUFFIX}`;
}

/**
 * Resolves the best scene metaphor for a skill.
 * Priority: keyword match > category default > generic fallback.
 */
function resolveSceneMetaphor(skill: ParsedSkill): { scene: string; details: string } {
  const lowerName = skill.name.toLowerCase();
  const lowerDesc = skill.description.toLowerCase();
  const combined = `${lowerName} ${lowerDesc}`;

  // 1. Try keyword overrides
  for (const entry of KEYWORD_SCENES) {
    for (const kw of entry.keywords) {
      if (combined.includes(kw)) {
        return { scene: entry.scene, details: entry.details };
      }
    }
  }

  // 2. Category-based defaults
  const catDefaults = CATEGORY_DEFAULTS[skill.category];
  if (catDefaults) {
    const titleWords = skill.title.toLowerCase();
    const scene = `a ${titleWords} ${catDefaults.family}`;
    const details = `person working at specialized ${catDefaults.family} station with domain-specific tools and ${catDefaults.accents} accents`;
    return { scene, details };
  }

  // 3. Generic fallback
  return {
    scene: `a ${skill.title.toLowerCase()} workspace`,
    details: 'person at desk with specialized tools and domain-specific equipment, organized workspace with reference materials',
  };
}

/**
 * Check which skills have hero images and which don't.
 */
function checkHeroImageCoverage(skills: ParsedSkill[]): Map<string, boolean> {
  const staticDir = path.resolve(__dirname, '../static/img/skills');
  const coverage = new Map<string, boolean>();

  for (const skill of skills) {
    const extensions = ['.webp', '.png', '.jpg', '.jpeg'];
    let found = false;
    for (const ext of extensions) {
      if (fs.existsSync(path.join(staticDir, `${skill.id}-hero${ext}`))) {
        found = true;
        break;
      }
    }
    coverage.set(skill.id, found);
  }

  return coverage;
}

/**
 * Generates all hero prompts with coverage info.
 */
export function generateAllHeroPrompts(skills: ParsedSkill[]): HeroPrompt[] {
  const coverage = checkHeroImageCoverage(skills);

  return skills.map(skill => ({
    skillId: skill.id,
    skillName: skill.title,
    category: skill.category,
    prompt: generatePromptForSkill(skill),
    negativePrompt: NEGATIVE_PROMPT,
    hasExistingImage: coverage.get(skill.id) || false,
    imagePath: `/img/skills/${skill.id}-hero.webp`,
  }));
}

// =============================================================================
// CLI
// =============================================================================

function main() {
  const args = process.argv.slice(2);
  const skillsDir = path.resolve(__dirname, '../../.claude/skills');
  const skills = parseAllSkills(skillsDir);

  const showAll = args.includes('--all');
  const jsonOutput = args.includes('--json');
  const validateOnly = args.includes('--validate');
  const singleSkillIdx = args.indexOf('--skill');
  const singleSkillId = singleSkillIdx >= 0 ? args[singleSkillIdx + 1] : null;

  const prompts = generateAllHeroPrompts(skills);

  // Validate mode
  if (validateOnly) {
    const missing = prompts.filter(p => !p.hasExistingImage);
    const total = prompts.length;
    const covered = total - missing.length;
    const pct = ((covered / total) * 100).toFixed(1);

    console.log(`Hero Image Coverage: ${covered}/${total} (${pct}%)`);
    if (missing.length > 0) {
      console.log(`\nMissing (${missing.length}):`);
      for (const m of missing) {
        console.log(`  - ${m.skillId} (${m.category})`);
      }
    } else {
      console.log('All skills have hero images!');
    }
    process.exit(missing.length > 0 ? 1 : 0);
  }

  // Single skill mode
  if (singleSkillId) {
    const prompt = prompts.find(p => p.skillId === singleSkillId);
    if (!prompt) {
      console.error(`Skill not found: ${singleSkillId}`);
      process.exit(1);
    }
    if (jsonOutput) {
      console.log(JSON.stringify(prompt, null, 2));
    } else {
      printPrompt(prompt);
    }
    return;
  }

  // Filter to missing only (unless --all)
  const filtered = showAll ? prompts : prompts.filter(p => !p.hasExistingImage);

  if (filtered.length === 0) {
    console.log('All skills have hero images! Use --all to see all prompts.');
    return;
  }

  if (jsonOutput) {
    console.log(JSON.stringify(filtered, null, 2));
  } else {
    console.log(`Hero Image Prompts (${filtered.length} ${showAll ? 'total' : 'missing'}):\n`);
    for (const prompt of filtered) {
      printPrompt(prompt);
    }
  }
}

function printPrompt(p: HeroPrompt) {
  const status = p.hasExistingImage ? '[EXISTS]' : '[MISSING]';
  console.log(`--- ${p.skillId} ${status} ---`);
  console.log(`Category: ${p.category}`);
  console.log(`Prompt: ${p.prompt}`);
  console.log(`Negative: ${p.negativePrompt}`);
  console.log(`Settings: aspect=16x9 style=DESIGN magic=OFF speed=QUALITY`);
  console.log(`Filename: ${p.skillId}-hero`);
  console.log('');
}

main();
