/**
 * Bundle Type Definitions
 *
 * Bundles are curated collections of skills designed for specific
 * workflows or user personas.
 */

/**
 * A skill included in a bundle
 */
export interface BundleSkill {
  /** Skill identifier (matches skills data) */
  id: string;

  /** How this skill is used in the bundle workflow */
  role: string;

  /** Whether this skill is optional */
  optional?: boolean;
}

/**
 * Estimated cost for running the bundle
 */
export interface BundleCost {
  /** Estimated tokens for a typical run */
  tokens: number;

  /** Estimated USD cost (at current Claude pricing) */
  usd: number;
}

/**
 * Target audience for the bundle
 */
export type BundleAudience =
  | 'developers'
  | 'entrepreneurs'
  | 'teams'
  | 'technical-writers'
  | 'ml-engineers'
  | 'newcomers'
  | 'everyone';

/**
 * Bundle difficulty level
 */
export type BundleDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * A curated skill bundle
 */
export interface Bundle {
  /** URL-safe identifier */
  id: string;

  /** Display name */
  title: string;

  /** Short description (1-2 sentences) */
  description: string;

  /** Target audience */
  audience: BundleAudience;

  /** Difficulty level */
  difficulty: BundleDifficulty;

  /** Skills included in the bundle */
  skills: BundleSkill[];

  /** Command to install the bundle */
  installCommand: string;

  /** Estimated cost per run */
  estimatedCost: BundleCost;

  /** Example use cases */
  useCases: string[];

  /** Tags for filtering */
  tags: string[];

  /** Hero image path (optional) */
  heroImage?: string;

  /** Featured on homepage */
  featured?: boolean;

  /** Recommended related bundles */
  relatedBundles?: string[];
}
