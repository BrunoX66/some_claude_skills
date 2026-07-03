# Claude Skills Collection

**185 production-ready skills** and **3 companion MCP servers** for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

Built by [Erich Owens](https://www.erichowens.com) — Ex-Meta ML Engineer (12 years), 12 patents, MS Applied Math.

---

## Quick Start

### Option 1: Plugin Marketplace (Recommended)

```bash
# Add the marketplace
/plugin marketplace add BrunoX66/some_claude_skills

# Install any skill
/plugin install adhd-design-expert@some-claude-skills

# Or install the full collection
/plugin install some-claude-skills@some-claude-skills
```

### Option 2: Manual Installation

```bash
git clone https://github.com/BrunoX66/some_claude_skills.git
cp -r some_claude_skills/skills/* ~/.claude/skills/
```

### Option 3: Download Individual Skills

**[someclaudeskills.com/skills](https://someclaudeskills.com/skills)** — Browse, search, and download ZIP files.

---

## MCP Servers

Three companion MCP servers ship in [`mcp-servers/`](mcp-servers/) as TypeScript source.
Build one before use:

```bash
cd mcp-servers/<server> && npm install && npm run build
```

Then register it in your project's `.mcp.json` (or `~/.claude/settings.json`), pointing at
the built entry point:

```json
{
  "mcpServers": {
    "skills-search": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/skills-search/dist/index.js"]
    }
  }
}
```

| Server | Description |
|--------|-------------|
| [`skills-search`](mcp-servers/skills-search) | Semantic search over the skills using RAG and pre-computed embeddings |
| [`skill-matcher`](mcp-servers/skill-matcher) | Find the right skill for any prompt via semantic embeddings |
| [`plant-database`](mcp-servers/plant-database) | Plant info, USDA hardiness zones, and landscaping data (pairs with `fancy-yard-landscaper`) |

See each server's README for its specific tools, environment variables, and requirements.

---

## What Are Claude Skills?

Skills are modular prompt extensions that teach Claude domain expertise. Instead of telling Claude what to do, skills teach Claude:

| Aspect | What Skills Provide |
|--------|---------------------|
| **How experts think** | Decision frameworks, mental models |
| **What experts know** | Domain knowledge, best practices |
| **How experts work** | Proven methodologies, workflows |
| **Why experts choose** | Reasoning behind decisions |

Read the full guide: **[How to Write Great Claude Skills](https://someclaudeskills.com/docs/guides/claude-skills-guide)**

---

## Skills by Category

### Design & Creative (10 skills)

| Skill | Description |
|-------|-------------|
| `design-system-creator` | Design tokens, CSS architecture, component libraries |
| `native-app-designer` | iOS/Mac/web apps with organic, non-AI aesthetic |
| `typography-expert` | Font pairing, hierarchy, OpenType features |
| `vaporwave-glassomorphic-ui-designer` | Retro-futuristic UI with glassmorphism |
| `web-design-expert` | Brand identity, color theory, UI/UX |
| `windows-3-1-web-designer` | Windows 3.1 aesthetic (powers this site!) |
| `interior-design-expert` | Space planning, color theory, lighting |
| `vibe-matcher` | Translate emotional vibes to visual DNA |
| `design-archivist` | Build visual databases from 500-1000 examples |
| `2000s-visualization-expert` | Milkdrop, AVS, WebGL music visualizers |

### Computer Vision & Graphics (8 skills)

| Skill | Description |
|-------|-------------|
| `clip-aware-embeddings` | Semantic image-text matching with CLIP |
| `collage-layout-expert` | Hockney-style computational collage composition |
| `color-theory-palette-harmony-expert` | Color science for photo composition |
| `drone-cv-expert` | Drone systems, SLAM, object detection |
| `drone-inspection-specialist` | Infrastructure inspection, thermal analysis |
| `metal-shader-expert` | Real-time graphics, MSL shaders, PBR |
| `photo-composition-critic` | Graduate-level visual aesthetics analysis |
| `photo-content-recognition-curation-expert` | Face/place recognition, de-duplication |

### Development & Engineering (8 skills)

| Skill | Description |
|-------|-------------|
| `bot-developer` | Discord, Telegram, Slack automation |
| `physics-rendering-expert` | Rope/cable dynamics, constraint solving |
| `site-reliability-engineer` | Docusaurus build validation, pre-commit hooks |
| `sound-engineer` | Spatial audio, procedural sound design |
| `voice-audio-engineer` | ElevenLabs integration, TTS, audio processing |
| `vr-avatar-engineer` | VR avatars, motion capture, real-time animation |
| `event-detection-temporal-intelligence-expert` | ST-DBSCAN, temporal event detection |
| `code-necromancer` | Resurrect and modernize legacy codebases |

### Coaching & Personal Development (11 skills)

| Skill | Description |
|-------|-------------|
| `career-biographer` | Extract structured career narratives |
| `competitive-cartographer` | Map competitive landscapes, find white space |
| `cv-creator` | ATS-optimized resumes in multiple formats |
| `hr-network-analyst` | Professional network graph analysis |
| `job-application-optimizer` | Resume SEO and job matching |
| `jungian-psychologist` | Analytical psychology, shadow work |
| `personal-finance-coach` | Tax optimization, investment theory |
| `project-management-guru-adhd` | PM for ADHD engineers |
| `tech-entrepreneur-coach-adhd` | Big tech → indie founder transition |
| `wisdom-accountability-coach` | Philosophy teaching, commitment tracking |
| `indie-monetization-strategist` | Freemium, SaaS pricing, passive income |

### Health & Neuroscience (3 skills)

| Skill | Description |
|-------|-------------|
| `adhd-design-expert` | Neuroscience-backed UX for ADHD brains |
| `hrv-alexithymia-expert` | HRV biometrics, interoception training |
| `speech-pathology-ai` | Speech therapy, phoneme analysis |

### Meta & Orchestration (8 skills)

| Skill | Description |
|-------|-------------|
| `agent-creator` | Create new custom agents, skills, MCP integrations |
| `orchestrator` | Coordinate specialists and create skills on-the-fly |
| `research-analyst` | Landscape research, competitive analysis |
| `skill-coach` | Guide creation of high-quality Claude Skills |
| `skill-documentarian` | Document skills, sync showcase website |
| `swift-executor` | Rapid task execution without hesitation |
| `team-builder` | Team composition, personality balancing, skill gap analysis |
| `automatic-stateful-prompt-improver` | Auto-optimize prompts with APE, OPRO, DSPy |
| `seo-visibility-expert` | SEO, llms.txt, Answer Engine Optimization |

---

## Documentation

| Resource | Description |
|----------|-------------|
| **[Skills Gallery](https://someclaudeskills.com/skills)** | Browse all skills with search and filtering |
| **[Skills Guide](https://someclaudeskills.com/docs/guides/claude-skills-guide)** | How skills work and how to create your own |
| **[Artifacts](https://someclaudeskills.com/artifacts)** | Real-world examples showing skills in action |
| **[Full Docs](https://someclaudeskills.com/docs/intro)** | Complete documentation |

---

## Philosophy

These skills embody **AI that knows better than you** in specific domains.

The result? AI agents that bring genuine expertise to every interaction — not just following instructions, but understanding *why* certain approaches work.

---

## Contributing

1. Follow the structure in `skills/`
2. Include clear mission, competencies, and outputs
3. Provide examples and best practices
4. Submit a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) and the **[Skills Guide](https://someclaudeskills.com/docs/guides/claude-skills-guide)** for detailed instructions.

---

## License

MIT License — See [LICENSE](LICENSE)

---

**Built by [Erich Owens](https://www.erichowens.com)** · Ex-Meta 12 years · 12 Patents · MS Applied Math

*Documentation is a love letter to your future self. Skills are a love letter to Claude.*
