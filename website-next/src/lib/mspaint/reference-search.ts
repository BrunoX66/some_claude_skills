/**
 * Reference Image Search for MS Paint Drawing (website-next version)
 * ===================================================================
 * Fetches 1-2 reference images from Pexels so Claude can see the subject before drawing.
 * Uses process.env directly (no fs/readFileSync — compatible with Cloudflare Pages).
 * Graceful degradation: if Pexels fails or no API key, silently returns empty.
 */

export interface ReferenceImage {
  url: string;
  query: string;
  base64: string;
  width: number;
  height: number;
  photographer?: string;
  photographerUrl?: string;
}

export interface ReferenceResult {
  images: ReferenceImage[];
  searchQuery: string;
}

/**
 * Extract the best image search query from a drawing prompt.
 * Aggressive stopword removal + fantasy-to-real mapping.
 */
export function extractSearchTerms(prompt: string): string {
  const stopwords = new Set([
    'a', 'an', 'the', 'this', 'that', 'these', 'those', 'my', 'your', 'its',
    'draw', 'paint', 'create', 'make', 'sketch', 'render', 'design', 'illustrate', 'depict', 'show',
    'simple', 'basic', 'easy', 'complex', 'detailed', 'beautiful', 'pretty', 'nice',
    'cute', 'lovely', 'gorgeous', 'stunning', 'amazing', 'cool', 'awesome', 'great',
    'very', 'really', 'quite', 'extremely', 'super', 'ultra', 'highly',
    'with', 'and', 'or', 'in', 'on', 'at', 'to', 'of', 'for', 'by', 'from',
    'into', 'over', 'under', 'above', 'below', 'between', 'through', 'around',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'has', 'have', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may',
    'sitting', 'standing', 'flying', 'running', 'walking', 'looking', 'holding',
    'please', 'me', 'you', 'some', 'like', 'just', 'also', 'much', 'many',
    'thing', 'things', 'something', 'style', 'scene',
  ]);

  const fantasyMap: Record<string, string> = {
    'dragon': 'lizard', 'dragons': 'lizards', 'unicorn': 'horse', 'unicorns': 'horses',
    'wizard': 'old man robe', 'witch': 'woman cloak', 'elf': 'person forest',
    'phoenix': 'bird fire', 'griffin': 'eagle', 'centaur': 'horse rider',
    'mermaid': 'woman ocean', 'alien': 'creature', 'spaceship': 'spacecraft',
    'cyberpunk': 'neon city', 'steampunk': 'victorian machinery',
  };

  let cleaned = prompt.toLowerCase().replace(/[^\w\s-]/g, '');
  for (const [fantasy, real] of Object.entries(fantasyMap)) {
    cleaned = cleaned.replace(new RegExp(`\\b${fantasy}\\b`, 'g'), real);
  }

  const words = cleaned.split(/\s+/).filter(w => !stopwords.has(w) && w.length > 2);
  return Array.from(new Set(words)).slice(0, 4).join(' ');
}

/**
 * Search Pexels for reference images matching a drawing prompt.
 */
export async function searchReferences(prompt: string, count = 2): Promise<ReferenceResult> {
  const apiKey = process.env.PEXELS_API_KEY || '';
  const searchQuery = extractSearchTerms(prompt);

  if (!apiKey || !searchQuery) {
    return { images: [], searchQuery: searchQuery || prompt };
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=${count}&size=small&orientation=landscape`;
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return { images: [], searchQuery };

    const data = await response.json();
    const photos = (data.photos || []).slice(0, count);

    const imagePromises = photos.map(async (photo: any): Promise<ReferenceImage | null> => {
      try {
        const imgUrl = photo.src?.small || photo.src?.tiny;
        if (!imgUrl) return null;
        const imgResponse = await fetch(imgUrl, { signal: AbortSignal.timeout(5000) });
        if (!imgResponse.ok) return null;
        const buffer = await imgResponse.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return {
          url: photo.src?.medium || imgUrl,
          query: searchQuery,
          base64,
          width: photo.width || 400,
          height: photo.height || 300,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(imagePromises);
    const images = results.filter((img): img is ReferenceImage => img !== null);
    return { images, searchQuery };
  } catch {
    return { images: [], searchQuery };
  }
}
