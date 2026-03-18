/**
 * Cloudflare Pages Function — MSPaint AI generation proxy.
 *
 * Proxies drawing prompts to Anthropic's Claude API.
 * The user provides their own API key from the Settings window.
 * If ANTHROPIC_API_KEY is set as an env var, it serves as fallback.
 */

interface Env {
  ANTHROPIC_API_KEY?: string;
}

const SYSTEM_PROMPT = `You are an artist working in MS Paint (Windows 3.1 style). You create drawings by emitting a sequence of paint commands in JSON format.

## Canvas
- Size: 640 x 480 pixels
- Origin (0,0) is top-left
- X increases rightward, Y increases downward
- Background starts as white (#FFFFFF)

## Available Colors (28-color palette)
Row 1 (dark): #000000, #808080, #800000, #808000, #008000, #008080, #000080, #800080, #008B8B, #556B2F, #8B4513, #483D8B, #4B0082, #191970
Row 2 (light): #FFFFFF, #C0C0C0, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FFA500, #FFC0CB, #ADD8E6, #90EE90, #E6E6FA, #FFDAB9

## Command Types

### Color Commands
- \`{ "type": "setForegroundColor", "color": "#RRGGBB" }\`
- \`{ "type": "setBackgroundColor", "color": "#RRGGBB" }\`

### Drawing Commands
- \`{ "type": "drawPixel", "x": N, "y": N }\`
- \`{ "type": "drawLine", "x1": N, "y1": N, "x2": N, "y2": N }\`
- \`{ "type": "drawFreehand", "points": [{"x": N, "y": N}, ...] }\`
- \`{ "type": "drawCurve", "startX": N, "startY": N, "endX": N, "endY": N, "controlX1": N, "controlY1": N }\`

### Shape Commands (fillMode: "outline" | "filled" | "both")
- \`{ "type": "drawRectangle", "x": N, "y": N, "width": N, "height": N, "fillMode": "..." }\`
- \`{ "type": "drawEllipse", "x": N, "y": N, "width": N, "height": N, "fillMode": "..." }\`
- \`{ "type": "drawRoundedRectangle", "x": N, "y": N, "width": N, "height": N, "radius": N, "fillMode": "..." }\`
- \`{ "type": "drawPolygon", "points": [{"x": N, "y": N}, ...], "fillMode": "..." }\`

### Other Commands
- \`{ "type": "floodFill", "x": N, "y": N }\`
- \`{ "type": "placeText", "x": N, "y": N, "text": "...", "fontSize": N, "bold": bool, "italic": bool }\`
- \`{ "type": "spray", "x": N, "y": N, "duration": N }\`
- \`{ "type": "sprayPath", "points": [{"x": N, "y": N}, ...] }\`
- \`{ "type": "setSprayDensity", "density": N }\`
- \`{ "type": "setToolSize", "size": N }\`
- \`{ "type": "setBrushShape", "shape": "round" | "square" | "slash" | "backslash" }\`
- \`{ "type": "clearCanvas" }\`

## Response Format
Return ONLY a JSON object:
{
  "thinking": "Your artistic planning process",
  "description": "Brief description of what you're drawing",
  "commands": [ ... ]
}`;

const ALLOWED_MODELS = new Set([
  "claude-haiku-4-5-20251001",
  "claude-sonnet-4-20250514",
]);
const DEFAULT_MODEL = "claude-sonnet-4-20250514";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      prompt?: string;
      canvasSnapshot?: string;
      apiKey?: string;
      model?: string;
    };

    const { prompt, canvasSnapshot, apiKey: userApiKey, model: userModel } = body;

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = userApiKey || context.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({
        error: "No Anthropic API key. Add one in Settings or configure ANTHROPIC_API_KEY.",
      }, { status: 500 });
    }

    const model = (userModel && ALLOWED_MODELS.has(userModel)) ? userModel : DEFAULT_MODEL;

    // Build message content
    const content: Array<Record<string, unknown>> = [];

    if (canvasSnapshot) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: canvasSnapshot.replace(/^data:image\/png;base64,/, ""),
        },
      });
    }

    let textPrompt = "";
    if (canvasSnapshot) textPrompt += "Current canvas state is shown above.\n\n";
    textPrompt += prompt;
    content.push({ type: "text", text: textPrompt });

    // Call Anthropic API directly (no SDK needed in Workers)
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return Response.json(
        { error: `Claude API error: ${errText}` },
        { status: anthropicRes.status }
      );
    }

    const result = await anthropicRes.json() as {
      content: Array<{ type: string; text?: string }>;
      model: string;
      stop_reason: string;
      usage: { input_tokens: number; output_tokens: number };
    };

    const textBlock = result.content.find((b) => b.type === "text");
    if (!textBlock?.text) {
      return Response.json({ error: "No text response from Claude" }, { status: 500 });
    }

    let parsed: { thinking?: string; description?: string; commands?: unknown[] };
    try {
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return Response.json(
        { error: "Failed to parse paint commands", raw: textBlock.text },
        { status: 500 }
      );
    }

    if (!parsed.commands || !Array.isArray(parsed.commands)) {
      return Response.json({ error: "Invalid response — missing commands array" }, { status: 500 });
    }

    return Response.json({
      thinking: parsed.thinking || null,
      description: parsed.description || "Drawing",
      commands: parsed.commands,
      recommendedTools: [],
      classification: { category: "unknown", subcategories: [] },
      referenceImages: [],
      debug: {
        model: result.model,
        stopReason: result.stop_reason,
        referenceSearchQuery: null,
      },
      usage: result.usage,
    });
  } catch (error) {
    console.error("[MSPaint generate]", error);
    return Response.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "unknown"}` },
      { status: 500 }
    );
  }
};
