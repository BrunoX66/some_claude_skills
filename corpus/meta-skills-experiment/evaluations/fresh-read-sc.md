# Fresh-Eyes Evaluation: skill-creator (iter-3 output)

**Evaluator**: Fresh reader with zero prior context
**Target**: `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sa-on-sc/iter-3/output/`
**Date**: 2026-03-16

---

## 1. Does This Skill Make Sense?

**Yes, mostly.** After reading the SKILL.md top to bottom, I understand:

- **What it does**: Helps create, test, iterate on, and package Claude skills
- **When to use it**: When someone says "make a skill for X", "improve my skill", "run evals on my skill", etc.
- **How to use it**: Follow the loop: capture intent, draft SKILL.md, run test cases, grade/review, iterate, optimize description, package

The Mermaid flowchart near the top is genuinely helpful. The conversational tone ("Cool? Cool.") is unusual for a skill but actually works -- it signals this is a collaborative, flexible process, not a rigid checklist.

**However**, the first 37 lines (the "high level" section) partially repeat the flowchart and the detailed sections below. You read the overview, then the flowchart, then the detailed "Creating a skill" section, and the structure is slightly different each time. The three-pass redundancy is mild but noticeable.

## 2. Is It Internally Consistent?

**Mostly yes, with notable exceptions:**

### Consistency wins:
- The grading.json schema in `references/schemas.md` matches what `agents/grader.md` says to produce. The field names `text`, `passed`, `evidence` are consistent across SKILL.md, schemas.md, and grader.md.
- The workspace directory layout is consistent across SKILL.md and `references/troubleshooting.md`.
- The `aggregate_benchmark.py` script matches the schema it claims to produce.

### Inconsistencies and contradictions:

**a) `evals/evals.json` vs `eval_metadata.json` -- field name mismatch.**
In SKILL.md (line 166-178), the evals.json schema uses the field `expectations` (a list of strings). But in the `eval_metadata.json` example (line 229-236), the field is `assertions` (empty array). These are supposed to be the same concept. The SKILL.md text at line 180 says "See references/schemas.md for the full schema (including the `assertions` field, which you'll add later)" -- so it knows the field is `assertions` in evals.json. But schemas.md calls them `expectations`. This is confusing: are they "assertions" or "expectations"? The skill uses both terms interchangeably in different places.

**b) The original skill-creator (in the user prompt) references `scripts/init_skill.py` extensively. This iter-3 output does not contain `init_skill.py`.** The file is completely absent from the output directory. There is no grep match for "init_skill" anywhere in the output. This is a significant omission -- the original skill-creator devoted a full Step 3 ("Initializing the Skill") to this script. The iter-3 SKILL.md does not reference init_skill.py either, which means it was intentionally dropped. But this means a core capability described in the source-of-truth skill (the one injected at the top of this conversation) is missing.

**c) SKILL.md says to use `python -m scripts.aggregate_benchmark` (line 283), which implies running from the skill-creator directory with `scripts/` as a package. But the script has `from pathlib import Path` and standard library imports only. The `scripts/__init__.py` file exists but is empty.** This actually works fine for `python -m` invocation. Consistent.

**d) The description says "Use this skill when creating a new Claude skill from scratch" but the SKILL.md body never references an init_skill.py or any scaffolding mechanism.** If someone says "make me a skill from scratch", the skill tells them to do "Capture Intent", "Interview and Research", "Write the SKILL.md" -- but there is no initialization step. The original skill-creator had one. This is a functional regression.

**e) "Package and Present" section (line 429) says to check for `present_files` tool, but `package_skill.py` produces a `.skill` file (a zip), not something that uses `present_files`.** The connection between the tool check and the packaging is unclear. This section feels vestigial.

## 3. Is It Actually Helpful?

**Yes, this is a genuinely useful skill.** If I were an agent with this injected, I would know:

- The high-level loop and where to jump in based on what the user already has
- How to spawn with-skill and without-skill subagent runs
- How to capture timing data from task notifications (critical detail that would be lost otherwise)
- How to grade using the grader agent
- How to aggregate benchmarks
- How to launch the eval viewer
- How to read feedback and iterate

**The reference files are excellent.** Specifically:

- `references/eval-patterns.md` is standout. The "Discriminating Assertion Test" and the patterns-by-task-type sections would genuinely prevent an agent from writing weak assertions. The anti-pattern table ("A file was created" -- why it is weak) is immediately actionable.
- `references/schemas.md` is thorough and the field descriptions are precise. The warning about viewer field name sensitivity is a smart detail.
- `references/troubleshooting.md` covers the exact errors you would actually hit (port in use, no display, claude command not found, CLAUDECODE env var issue).
- `references/description-optimization.md` has excellent examples of good vs. bad trigger eval queries.

**The agent files are well-designed:**

- `agents/grader.md` asks graders to critique the evals themselves (Step 6) -- this is a smart feedback loop that most eval frameworks miss.
- `agents/comparator.md` correctly enforces blindness and provides a structured rubric.
- `agents/analyzer.md` cleanly separates two modes (post-hoc analysis vs. benchmark analysis) and tells the reader to skip to the relevant section.

**The scripts are functional and well-engineered:**

- `scripts/run_eval.py` has sophisticated stream event parsing to detect skill triggering early. The `select.select()` usage for non-blocking reads is correct.
- `scripts/run_loop.py` properly implements train/test split with stratification, blinds test scores from the improvement model, and selects by test score not train score.
- `scripts/improve_description.py` has a safety net for over-length descriptions and logs transcripts.
- `scripts/aggregate_benchmark.py` handles two directory layouts and extracts timing from both grading.json and sibling timing.json.

## 4. What Is Confusing or Missing?

### Confusing:

**a) The "Communicating with the user" section (lines 51-61) is oddly placed.** It appears before any actual instructions. It reads like a meta-note about UX sensitivity. The content is valid (plumbers and grandparents are now using Claude), but it interrupts the flow between the overview and the actual creation process. It would fit better as a sidebar or after the core process is described.

**b) The workspace layout (lines 188-205) is dense.** The nested directory structure with `eval-<name>/with_skill/run-1/outputs/` is hard to parse on first read. The troubleshooting doc helps, but a concrete small example (not just the abstract tree) would clarify.

**c) "Step 1: Spawn all runs" says to spawn with-skill AND baseline "in the same turn."** This is good advice but the phrasing "in the same turn" is jargon specific to Claude Code's subagent model. A non-expert user (per the "Communicating with the user" section) would not know what "turn" means here.

**d) The "Improving the skill" section (lines 346-376) is the philosophical heart of the skill and it is excellent writing.** But it is buried deep. The points about generalization over overfitting, explaining "why" instead of using ALL-CAPS MUSTs, and looking for repeated work across test cases are the most valuable paragraphs in the entire skill. They deserve more prominence.

### Missing:

**a) No `init_skill.py` script.** The original skill-creator had this. The iter-3 version dropped it without replacement. A new skill created from scratch has no scaffolding.

**b) No example of a complete small skill.** The skill teaches how to create skills but never shows a finished example. Even a 20-line SKILL.md for a trivial skill (e.g., "pdf-rotator") as a reference file would dramatically improve first-time comprehension.

**c) The "Output Contract" concept is absent.** The original skill-creator (from the user prompt) had an "Output Contract" section listing what the skill produces. The iter-3 SKILL.md has no such section. An agent completing the skill creation process does not have a clear list of final deliverables.

**d) No guidance on when to use assets/ vs scripts/ vs references/.** The "Skill Writing Guide" section (lines 92-128) explains anatomy and progressive disclosure but gives almost no guidance on the decision between "should this be a script, a reference, or an asset?" The original skill had detailed examples (rotate_pdf.py as a script, schema.md as a reference, logo.png as an asset). The iter-3 version has a bare directory listing.

**e) The `eval-viewer/` directory is not a standard skill directory.** The skill anatomy says skills have `scripts/`, `references/`, and `assets/`. The `eval-viewer/` directory is a fourth, undocumented category. It contains `generate_review.py` (which is really a script) and `viewer.html` (which is really an asset/template). This violates the skill's own structural guidance.

**f) The `agents/` directory is also non-standard.** Same issue. The skill teaches `scripts/`, `references/`, `assets/` but uses `agents/` itself. This is defensible (agent prompt files are a legitimate category) but the skill never acknowledges or explains this.

## 5. Scores (1-10)

| Criterion | Score | Rationale |
|-----------|-------|-----------|
| **Clarity** | 7/10 | The core loop is clear and the writing is good. But the three-pass redundancy (overview, flowchart, detailed steps) and the buried philosophy section reduce clarity. The "assertions vs expectations" naming confusion is a real stumble. |
| **Consistency** | 6/10 | The schemas, agent files, and scripts are internally consistent with each other. But the skill violates its own structural rules (eval-viewer/, agents/ as non-standard directories), uses "assertions" and "expectations" interchangeably, and dropped init_skill.py without adjusting the description's claim to handle "creating a new skill from scratch." |
| **Helpfulness** | 8/10 | If injected into an agent, this skill would genuinely enable that agent to create, test, and iterate on skills. The eval loop is well-designed. The reference files are excellent. The scripts work. The grader's self-critique step is clever. The description optimization loop with train/test split is sophisticated. |
| **Completeness** | 6/10 | Missing init_skill.py (scaffolding), missing example skill, missing output contract, missing explanation of non-standard directories (agents/, eval-viewer/), missing guidance on when to use scripts vs references vs assets. The skill is thorough on the eval/iterate loop but thin on the initial creation phase. |

**Composite: 6.75 / 10**

---

## 6. Comparison to Source Skill

The source skill-creator (injected at the top of this conversation via `~/.claude/skills/skill-creator`) has several things the iter-3 version lacks:

1. **`init_skill.py` and Step 3 (Initializing the Skill)** -- a concrete scaffolding mechanism
2. **Step 2 (Planning the Reusable Skill Contents)** -- explicit guidance on analyzing examples to determine what goes in scripts/ vs references/ vs assets/, with three worked examples (pdf-editor, frontend-webapp-builder, big-query)
3. **Clear output contract** listing deliverables
4. **The "About Skills" educational section** explaining what skills are, what they provide, and the progressive disclosure design principle -- with more depth and clarity than iter-3's compressed version

The iter-3 version has things the source lacks:
1. **Eval loop with subagent orchestration** -- the entire "Running and evaluating test cases" section with workspace layout, timing capture, grading, benchmark aggregation, and viewer
2. **Description optimization loop** with train/test split and overfitting prevention
3. **Agent files** for grader, comparator, and analyzer
4. **Sophisticated scripts** (run_eval.py, run_loop.py, improve_description.py, aggregate_benchmark.py, generate_report.py)
5. **Reference files** (eval-patterns.md, troubleshooting.md, description-optimization.md, schemas.md)

The iter-3 version is stronger on the eval/iterate/optimize workflow. The source is stronger on the initial creation/scaffolding phase. An ideal version would combine both.

---

## 7. Summary

This is a sophisticated, well-engineered skill with an impressive eval loop, good agent files, and excellent reference material. The scripts are functional and thoughtfully designed (the stream event parsing in run_eval.py, the train/test split in run_loop.py, the grader self-critique in grader.md).

The main weaknesses are:
- **Structural self-contradiction**: The skill teaches a 3-directory structure (scripts, references, assets) but uses 5 directories itself
- **Dropped scaffolding**: No init_skill.py means "create a skill from scratch" has no mechanical support
- **Naming confusion**: "assertions" vs "expectations" used interchangeably
- **Front-loaded meta-commentary**: The "Communicating with the user" section and conversational asides interrupt the core workflow

The skill is a B+. It would be an A- with the structural issues cleaned up and the scaffolding restored.
