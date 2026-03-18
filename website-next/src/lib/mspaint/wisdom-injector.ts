/**
 * Wisdom Injector (stripped for website-next)
 * ============================================
 * Haiku-powered prompt classification only.
 * Knowledge map / disk-based learning removed — not compatible with Cloudflare Pages.
 */

import Anthropic from '@anthropic-ai/sdk';

export interface PromptClassification {
  category: string;
  subcategories: string[];
  tools: string[];
}

// In-memory cache: same prompt in one server instance = same classification
const classificationCache = new Map<string, PromptClassification>();

function buildClassificationPrompt(): string {
  return `You analyze drawing prompts for an MS Paint AI. Decompose the prompt into its drawable elements and recommend tools.

Return JSON only. No explanation text.

{
  "category": "primary drawable element — one of: characters, animals, landscape, architecture, objects, vehicles, text_art, abstract, scene",
  "subcategories": ["1-3 specific compositional aspects, e.g. 'facial expression', 'outdoor lighting', 'foliage', 'motion', 'perspective'"],
  "tools": ["3-5 most important MS Paint tools from the list below, ordered by priority"]
}

Valid tool IDs (use ONLY these):
- pencil: 1px freehand lines, outlines, fine detail
- brush: variable-width strokes (circle/square/diagonal)
- airbrush: soft spray particles for shading, clouds, gradients
- fill: flood-fill a closed region with solid color
- line: straight line between two points
- curve: bézier curve with control points, smooth arcs
- rectangle: rectangles (outline, filled, or both)
- ellipse: ellipses and circles (outline, filled, or both)
- polygon: multi-point closed shapes
- roundedRectangle: rounded-corner rectangles
- text: place text with font control
- eraser: erase to background color
- colorPicker: sample color from canvas
- gradient: linear or radial color gradients
- clone: stamp/duplicate from a source region

Category guidance:
- "characters" = people, figures, faces, portraits, any human form
- "animals" = creatures, pets, wildlife, insects, fish
- "landscape" = nature, outdoors, skies, water, terrain
- "architecture" = buildings, interiors, rooms, structures, cities
- "objects" = still life, food, items, tools, instruments
- "vehicles" = cars, boats, planes, bikes, machines
- "text_art" = signs, labels, lettering, logos, typography
- "abstract" = patterns, geometric, non-representational
- "scene" = complex compositions with multiple element types`;
}

/**
 * Classify a drawing prompt using Haiku. Returns category + recommended tools.
 * Falls back to 'general' with no tools on failure.
 */
export async function preclassifyPrompt(prompt: string): Promise<PromptClassification> {
  const cached = classificationCache.get(prompt);
  if (cached) return cached;

  const fallback: PromptClassification = { category: 'general', subcategories: [], tools: [] };

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return fallback;

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 256,
      system: buildClassificationPrompt(),
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find(b => b.type === 'text');
    if (!text || text.type !== 'text') return fallback;

    const jsonMatch = text.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;

    const parsed = JSON.parse(jsonMatch[0]);
    const result: PromptClassification = {
      category: parsed.category || 'general',
      subcategories: parsed.subcategories || [],
      tools: parsed.tools || [],
    };

    classificationCache.set(prompt, result);
    return result;
  } catch (e) {
    console.warn('[WisdomInjector] Haiku classification failed:', e);
    return fallback;
  }
}
