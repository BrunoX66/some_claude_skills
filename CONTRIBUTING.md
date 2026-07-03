# Contributing to Claude Skills Collection

Thanks for your interest in contributing! This repository is a Claude Code plugin
marketplace of **skills** and companion **MCP servers**. Contributions are made via
pull request.

## Contributing a Skill

1. Fork the repository.
2. Create your skill at `skills/your-skill-name/SKILL.md`.
3. Add any optional supporting files alongside it (see structure below).
4. Register the skill in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)
   so it is installable from the marketplace:

   ```json
   {
     "name": "your-skill-name",
     "source": "./skills/your-skill-name",
     "description": "One-line summary of what the skill does."
   }
   ```

5. Open a pull request.

### Skill structure

```
skills/
  your-skill-name/
    SKILL.md        # Required: the skill definition (YAML frontmatter + body)
    references/     # Optional supporting reference docs
    scripts/        # Optional helper scripts
    assets/         # Optional templates, examples, images
```

### SKILL.md frontmatter

Every `SKILL.md` begins with YAML frontmatter followed by the skill body:

```yaml
---
name: my-skill-name
description: What this skill does and when to use it (roughly 50-500 characters).
allowed-tools: Read, Write, Edit, Bash
---

# My Skill Title

Main content describing what the skill does and how it works.

## When to Use

- Use case 1
- Use case 2
```

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Lowercase kebab-case ID (3-50 chars), matching the folder name | `my-awesome-skill` |
| `description` | Full description with activation cues (50-500 chars) | `Comprehensive skill for...` |
| `allowed-tools` | Comma-separated tool list (optional) | `Read, Write, Edit, Bash` |

### Checklist

- [ ] Folder name matches the `name` field.
- [ ] `SKILL.md` has valid YAML frontmatter with `name` and `description`.
- [ ] A `## When to Use` (or equivalent) section makes activation clear.
- [ ] A matching entry was added to `.claude-plugin/marketplace.json`.

## Contributing an MCP Server

MCP servers live in [`mcp-servers/`](mcp-servers/), one directory per server — each a
self-contained TypeScript project with its own `package.json` and README. Use the
existing servers (e.g. `skills-search`, `skill-matcher`) as templates: include a `build`
script and document the server's tools, environment variables, and requirements in its
README.

## Getting Help

- Open an issue for questions.
- Browse existing skills in `skills/` for examples.

## License

By contributing, you agree that your contributions will be licensed under the project's
[MIT License](LICENSE).
