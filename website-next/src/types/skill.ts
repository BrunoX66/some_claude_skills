export interface SkillPairing {
  skill: string;
  reason: string;
}

export interface Skill {
  /** Directory name, e.g. "computer-vision-pipeline" */
  id: string;
  /** Human-readable title derived from frontmatter `name` */
  title: string;
  /** Frontmatter `metadata.category`, e.g. "AI & Machine Learning" */
  category: string;
  /** Frontmatter `description` */
  description: string;
  /** Frontmatter `metadata.tags` list */
  tags: string[];
  /** Optional editorial badge */
  badge?: "NEW" | "HOT" | "ADVANCED" | "EXPERIMENTAL";
  /** Path to the hero image in /public */
  heroImage: string;
  /** Related skills from `metadata.pairs-with` */
  pairsWith?: SkillPairing[];
  /** Markdown body with frontmatter stripped */
  content: string;
}
