# Fresh-Eyes Evaluation: skill-architect (iter-3 output)

**Evaluator**: Fresh read -- no prior context about this skill's evolution
**Target**: `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sc-on-sa/iter-3/output/`
**Date**: 2026-03-16

---

## 1. Does This Skill Make Sense?

**Yes, emphatically.** This is a meta-skill that teaches an agent how to build other skills well. Within 30 seconds of reading the SKILL.md, I understood:

- What it does: design, create, audit, and improve Agent Skills
- When to use it: building new skills, reviewing existing ones, debugging activation, encoding domain expertise
- What NOT to use it for: general coding, MCP server implementation, runtime debugging
- The core mental model: skills are progressive-disclosure machines with three layers (metadata, SKILL.md, references)

The six-step creation process is crystal clear: Gather Examples, Plan Contents, Initialize, Write, Validate, Ship. The Mermaid flowchart reinforces this at a glance.

**Key insight for an agent**: If I were an agent that got this skill injected, I would know immediately what to do. The "Quick Wins" section at the top is the best part -- it gives me six ordered actions I can take right now on any existing skill. The description formula (`[What] [When to use]. NOT for [Exclusions]`) is memorable and actionable. The anti-pattern summary table on line 376 is a quick-scan diagnostic I could apply instantly.

---

## 2. Is It Internally Consistent?

**Mostly yes.** The skill practices what it preaches to a remarkable degree:

**Consistency wins:**
- The skill's own description follows its own formula (What + When + NOT)
- The SKILL.md is 466 lines -- under its own 500-line limit
- It uses Mermaid diagrams for its own process (the 6-step flowchart) -- anti-pattern #10 says to do this
- Reference files are indexed with 1-line "Consult when" descriptions, exactly as prescribed
- The skill ships working scripts (validate_skill.py, check_self_contained.py, validate_mermaid.py, init_skill.py), not templates
- It has its own CHANGELOG.md -- exactly as it recommends

**Minor inconsistencies found:**

1. **Description formula varies slightly across the file.** Quick Wins says `[What] [When to use]. NOT for [Exclusions]`. The Description Formula section says `[What it does] [When to use -- be slightly pushy]. NOT for [Exclusions].` The template says `[What it does] [When to use -- be slightly pushy]. NOT for [Exclusions].` The Validation Checklist says `[What][When to use] NOT [Exclusions]`. These are all the same idea, but the slight variations could confuse an agent trying to follow the formula literally. The "be slightly pushy" addition is the most valuable variant -- it should be the canonical one everywhere.

2. **`dependencies`, `bundled-resources`, `distribution` in Optional Fields table.** These appear in the Optional Fields table on lines 108-110 but are not standard Claude Code frontmatter keys. The skill's own Invalid Keys section (lines 118-126) says custom keys get "silently ignored" -- but these are in the *valid* table. The `claude-extension-taxonomy.md` reference does list them (lines 59-61), but there is tension: are these real runtime keys or custom metadata keys? The SKILL.md should clarify they are custom/API-specific, not Claude Code runtime keys.

3. **The `Note` on line 112** says "The Skills API uses hyphenated variants (context-fork, model-override)" but these specific key names do not appear anywhere else in the skill. This is a dangling claim with no supporting evidence in the reference files.

---

## 3. Is It Actually Helpful?

**Extremely.** This is one of the most immediately actionable skills I have read. Here is what makes it work:

### What works well

**Progressive disclosure done right.** The SKILL.md contains everything an agent needs for 80% of tasks. The 15 reference files are clearly indexed and cover the long tail. An agent reading this skill would NOT need to load all references to be productive -- it would load `description-guide.md` when writing a description, `antipatterns.md` when encoding shibboleths, `visual-artifacts.md` when adding diagrams, etc.

**The scripts are real and useful.** I ran all four scripts:
- `validate_skill.py` on the skill itself: PASS (0 errors, 5 warnings -- all expected for directory-name mismatch and known intentional entities)
- `check_self_contained.py` with orphan detection: PASS (45 references, 0 phantoms, 0 orphans)
- `validate_mermaid.py` on the skill: PASS (38 diagrams, 0 errors, 1 minor warning)
- `init_skill.py` was not run but the code is correct, handles edge cases, and validates names

These scripts are the skill's crown jewel. They turn abstract advice ("don't have phantom references") into enforceable checks. The `check_self_contained.py` script is particularly sophisticated -- it skips code blocks, handles illustrative markers, and supports `<!-- phantom-ok -->` annotations for intentional exceptions.

**The anti-patterns are concrete and temporal.** The shibboleth template (Novice/Expert/Timeline/LLM mistake/Detection) is an excellent format. The case studies in `antipatterns.md` (Photo Expert Explosion, Phantom MCP, Time Bomb, Activation Black Hole) tell memorable stories with clear lessons. An agent would internalize these as patterns to watch for.

**The Common Rejection Causes table (lines 416-431) is gold.** A quick-reference table of things that make skills fail at parse time -- `tools:` instead of `allowed-tools:`, YAML lists in allowed-tools, name-directory mismatches -- is exactly what an agent needs to avoid silent failures.

### What could be better

**The scoring rubric (references/scoring-rubric.md) is thin.** Six dimensions scored 0-10 with a simple average. The descriptions are reasonable but the rubric does not differentiate between dimensions that matter more vs less. Activation Precision arguably matters 3x more than Maintainability for a skill that nobody can use because it never activates. A weighted composite would be more useful.

**The knowledge-engineering reference (references/knowledge-engineering.md) is interesting but disconnected.** It covers Protocol Analysis, Repertory Grids, Card Sorting, Critical Incident Technique, and Concept Mapping -- all real KE methods. It even has a "Source Material: Books That Expose Expert Thinking" section with a curated reading list. But the SKILL.md itself never tells the agent HOW to use these methods in practice. The 6-step process says "Gather Concrete Examples" (Step 1) and "Plan Reusable Contents" (Step 2) but does not say "If you are extracting knowledge from a domain expert, use Protocol Analysis (see references/knowledge-engineering.md)." The bridge between the KE methods and the skill-creation workflow is implicit.

**The `agents/cross-evaluator.md` is a template, not a working tool.** It uses `{{SOURCE_SKILL_NAME}}`, `{{SOURCE_EXPERTISE_BULLETS}}`, `{{TARGET_SKILL_NAME}}` placeholders. The Usage section shows a bash pipeline to fill these, but this is a template that requires manual assembly -- which contradicts anti-pattern #4 (Template Soup). It should either be a proper script that assembles the prompt, or the template nature should be explicitly acknowledged as intentional.

---

## 4. What Is Confusing or Missing?

### Confusing

1. **The term "shibboleth" is used throughout but never defined in SKILL.md.** Line 30 says "They encode real domain expertise (shibboleths), not surface instructions." Line 40 says "Encoding domain expertise (shibboleths, anti-patterns, temporal knowledge)." The Encoding Shibboleths section on line 315 says "Expert knowledge that separates novices from experts." This is close but not quite a definition. The word itself is unusual enough that many readers (and agents) will not know what it means. A one-sentence definition on first use would help: something like "Expert knowledge that reveals whether someone is truly experienced or just parroting surface-level patterns."

2. **The relationship between `dependencies`, `bundled-resources`, `distribution` keys and Claude Code runtime behavior is unclear.** Are these parsed by Claude Code? By the Skills API? By some future system? The frontmatter section needs a clearer delineation between "Claude Code reads this key" and "this key is for tooling/future use."

3. **Platform Constraints section (lines 130-144) introduces new concerns without tying them to actions.** "Skills do NOT sync across Claude.ai, Claude API, and Claude Code." OK, what should the agent do about this? "Maintain source files in Git as single source of truth" is good advice but could be more actionable.

### Missing

1. **No concrete example of a complete, well-built skill.** The skill describes what good looks like but never shows a finished example. The `references/antipatterns.md` shows bad-then-good code snippets, but a single complete "here is what an excellent skill looks like end-to-end" example -- even a small one -- would be more helpful than all the abstract rules.

2. **No activation test script.** The skill repeatedly says "write 5 queries that should trigger and 5 that shouldn't" (Quick Wins #6, Step 1 of creation, activation-debugging.md) but provides no script to automate this. There is `validate_skill.py` (structural), `check_self_contained.py` (references), and `validate_mermaid.py` (diagrams) -- but no `test_activation.py`. For a skill that correctly identifies activation as the most important concern, this is a notable gap.

3. **The `pairs-with` metadata on lines 15-21 is declared but never explained.** What does it mean operationally when a skill "pairs with" another? Does Claude Code read this? Does it influence skill selection? Is it purely informational? The frontmatter documentation section does not mention `pairs-with` at all -- it is only in the `metadata` block.

---

## 5. Scores (1-10)

### Clarity: 9/10

The skill is exceptionally well-organized. The three-layer architecture is explained clearly. The Quick Wins section provides immediate actionability. Tables, Mermaid diagrams, and code examples break up the text effectively. The minor inconsistency in description formula wording across sections prevents a perfect 10.

### Consistency: 8/10

The skill practices what it preaches to a high degree. It follows its own 500-line limit, uses Mermaid diagrams, ships working scripts, has a CHANGELOG, uses progressive disclosure. The `dependencies`/`bundled-resources`/`distribution` frontmatter keys being listed as "Optional Fields" when they may not be Claude Code runtime keys is the main inconsistency. The description formula wording varies slightly. The `agents/cross-evaluator.md` is effectively a template despite the skill's own anti-pattern against templates.

### Helpfulness: 9/10

If I were an agent that received this skill, I could immediately create or improve skills. The Quick Wins are prioritized. The scripts give me automated checks. The anti-patterns give me concrete things to watch for. The Common Rejection Causes table would save me from common silent failures. The one gap -- no activation test script despite activation being the stated #1 concern -- prevents a 10.

### Completeness: 8/10

The skill covers an impressive range: creation workflow, description writing, frontmatter rules, progressive disclosure, platform constraints, subagent design, visual artifacts, extension taxonomy, plugins, tool permissions, anti-patterns, validation, success metrics. 15 reference files cover deep dives. 4 working scripts. 1 agent template. The knowledge-engineering reference is a genuine value-add. Missing: a concrete complete-skill example, an activation test script, and definition of the `pairs-with` metadata key.

---

## 6. Additional Observations

### The HTML entity problem persists

Despite three rounds of iteration specifically targeting HTML entities, the `references/visual-artifacts.md` file still contained ~30 `--&gt;` entities in Mermaid code examples inside ````markdown fences. The iter-3 EVALUATION.md explicitly examined this and concluded they were "intentional" and "render correctly as documentation."

**This conclusion is wrong.** These are inside illustrative code examples that users are meant to copy-paste. If a user copies the flowchart example on line 174 of visual-artifacts.md, they get `A[User asks to create skill] --&gt; B{Existing skill?}` which is broken Mermaid. The `--&gt;` should be `-->`. The fact that they are inside outer fences does not change that the examples should be correct and copy-pasteable.

I have fixed these (approximately 30 entity replacements across 8 blocks in visual-artifacts.md).

### The self-contained-tools.md has a duplicate Goal line

Lines 383-385 of `references/self-contained-tools.md` had two nearly identical "Goal" sentences:
- "Every skill with repeatable operations should ship working tools."
- "Every skill with repeatable operations should have working tools."

I removed the duplicate.

### The meta-recursion is both a strength and a weakness

This skill has been through at least 3 rounds of self-evaluation and cross-evaluation. The CHANGELOG documents this history meticulously. The validators have been hardened through real failures. The `ILLUSTRATIVE_MARKERS` in `check_self_contained.py` now handle evaluation-document prose patterns.

But the meta-recursion also shows diminishing returns. Each iteration finds smaller issues. The core architecture was sound from v1.0.0. The last two iterations primarily fixed HTML entities and validator blind spots -- important but not transformative.

### The skill is longer than it needs to be

At 466 lines, the SKILL.md is pushing its own 500-line limit. Several sections could be compressed:

- The "Designing Skills for Subagent Consumption" section (lines 261-288) is 27 lines that could be 15, with detail deferred to `references/subagent-design.md`
- The "Self-Contained Tools and the Extension Taxonomy" section (lines 342-361) is 20 lines that largely duplicate `references/claude-extension-taxonomy.md`
- The "Common Rejection Causes" table (lines 416-431) overlaps significantly with the Invalid Keys section (lines 118-126)

Compression would free up budget for the missing complete-skill example.

---

## Summary Judgment

This is a genuinely excellent meta-skill. It is well-structured, internally consistent, immediately actionable, and backed by working tooling. The progressive disclosure architecture works: the SKILL.md gives you what you need, the references go deep when you want depth. The scripts are the standout feature -- they turn abstract quality criteria into automated checks.

The main weaknesses are: (a) no activation test script despite activation being the stated #1 concern, (b) no complete example of a finished skill, (c) some lingering inconsistencies in frontmatter key documentation, and (d) the visual-artifacts.md still had broken HTML entities in code examples (now fixed).

**Overall: 8.5/10** -- solidly excellent, with clear paths to 9+.
