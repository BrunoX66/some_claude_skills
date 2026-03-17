# Didactic Exposition: Two Meta-Skills Under the Microscope

*Generated during session 2026-03-10. Reconstructed from context for blog condensation.*

---

## The Six Questions, Answered for Both Skills

### Q1: What is a skill?

**skill-creator (SC):** A skill is a prompt enhancement package — a folder (SKILL.md + optional scripts/references/assets/agents) that gets loaded into Claude's context when a user's query matches the skill's description. Fundamentally, SC sees a skill as something that needs to *trigger correctly* and *produce good outputs*. It's a unit that can be evaluated, benchmarked, and iteratively improved.

**skill-architect (SA):** A skill is a progressive disclosure machine. It's a three-layer knowledge system: metadata (always in context, ~100 tokens), SKILL.md (loaded on activation, &lt;5k tokens), and reference files (loaded on-demand, unlimited). SA sees a skill as an *architecture problem* — the challenge is encoding real domain expertise (shibboleths, anti-patterns, temporal knowledge) in a form that activates precisely without bloating every query's context window.

*The difference:* SC asks "does it work?" SA asks "is it built right?"

---

### Q2: How does a skill "do" anything?

**SC:** Identity injection via file loading. When a skill triggers, Claude reads SKILL.md and becomes that skill's worldview. The scripts, references, and agents in the folder are tools the activated Claude can then pick up and use. The skill "does" things by shaping what Claude is when it responds.

**SA:** Same mechanism, but with more architectural nuance. SA distinguishes *activation* (does the metadata description route the right queries?) from *execution* (does SKILL.md give Claude the right expertise once activated?). SA's emphasis: the three-layer architecture means SKILL.md should be a lean process guide, not a knowledge dump — deep content belongs in references, which Claude loads selectively.

*The shared insight:* Neither skill is a script. Both are a way to make Claude become a specialized agent.

---

### Q3: How can a skill be improved, by what metrics, on what domain?

**SC:** Two separate problems:
1. **Triggering accuracy** — measured empirically: create a test set of queries labeled `should_trigger: true/false`, run `claude -p` through them, measure precision/recall. Optimize the description text to improve these metrics. This is automated via `run_loop.py`.
2. **Output quality** — measured via assertions (concrete expected outputs) + human review. Less automated; the eval viewer shows actual outputs for human judgment.

The improvement domain is: *what description text causes the right activation pattern?*

**SA:** Also two problems, but different ones:
1. **Structural quality** — measured via validators: `validate_skill.py` (frontmatter, line count, CHANGELOG), `check_self_contained.py` (phantom references), `validate_mermaid.py` (diagram syntax). These are binary pass/fail.
2. **Qualitative quality** — measured via scoring rubric: 5 categories (Activation Precision, Domain Expertise Depth, Progressive Disclosure, Self-Containment, Maintainability), each 0-10. This requires a human or evaluator Claude.

The improvement domain is: *what structural and architectural changes make the skill more precise, more expert, more maintainable?*

*The key asymmetry:* SC has automated triggering loops. SA has structural validators. Neither has automated output quality measurement.

---

### Q4: Does improving mean better triggering, better output, or generalization?

**SC:** All three, in roughly that priority:
- Triggering first (can't use the skill if it doesn't activate)
- Output quality second (the skill must produce usable results)
- Generalization explicitly guards against overfitting: the train/test split with 40% holdout ensures description improvements generalize beyond the specific test cases

**SA:** Primarily structural correctness and activation precision:
- Structural: line count, NOT clause, description formula, Mermaid diagrams
- Precision: the NOT clause is SA's main tool for preventing false positives
- Generalization is implicit (good structure generalizes), not measured

---

### Q5: What is the role of scripts and references? How do you improve them without analytics?

**SC scripts** do the empirical work:
- `run_eval.py` — testing harness (spawns `claude -p --output-format stream-json`, watches for Skill/Read tool calls on the skill file to detect triggering)
- `run_loop.py` — description optimization loop (runs eval → improve → eval → improve, picks best by test score)
- `improve_description.py` — calls Claude to generalize from failures to broader intent categories
- `aggregate_benchmark.py` — variance analysis across multiple runs
- `generate_report.py` — HTML eval viewer with two tabs: Outputs + Benchmark

SC improves scripts when the eval harness reveals gaps: new failure modes → new test cases → run loop again.

**SA scripts** do structural validation:
- `validate_skill.py` — frontmatter, line count, CHANGELOG presence
- `check_self_contained.py` — phantom reference detection
- `validate_mermaid.py` — Mermaid diagram syntax
- `init_skill.py` — scaffolder for new skills

SA improves scripts when new validation rules are discovered (new anti-patterns, new frontmatter fields). No automated quality loop — improvement is architecture-driven, not metric-driven.

**SC references:** 1 file (`schemas.md` — eval JSON schemas). Minimal; the work is in the scripts.

**SA references:** 13 files — everything from the description formula guide to scoring rubrics, anti-patterns, shibboleth templates, Mermaid patterns, platform constraints. The references ARE the expertise. SA's SKILL.md is a lean index; the knowledge lives in references.

---

### Q6: What do the scripts do / what does the HTML show / what are inputs and outputs?

**SC's run_eval.py:**
- Input: eval set JSON (`[{query, should_trigger}, ...]`), skill path, model
- Process: for each query, creates a temp `.claude/commands/` file with the skill, runs `claude -p --output-format stream-json`, parses the JSON stream for `tool_use` events (Skill invocation or Read on SKILL.md file = triggered)
- Output: `{results: [{query, should_trigger, triggers, runs, pass}], summary: {passed, failed, total}}`

**SC's run_loop.py:**
- Input: eval set JSON, skill path, max iterations (5), runs_per_query (3), holdout (0.4)
- Process: stratified train/test split → eval loop (run_eval → improve_description → repeat) → pick best by TEST score
- Output: JSON with best_description, iteration history, train/test scores per iteration

**SC's HTML eval viewer (eval-viewer/viewer.html + generate_review.py):**
- Two tabs: "Outputs" (actual Claude responses for each query) + "Benchmark" (pass rates, variance, delta with_skill vs without_skill)
- Shows precision, recall, accuracy, per-query pass/fail

**SA's validate_skill.py:**
- Input: skill directory path
- Output: pass/fail with specific errors (line count, missing CHANGELOG, invalid frontmatter keys, HTML entities in markdown)

**SA's check_self_contained.py:**
- Input: skill directory path
- Output: list of phantom references (file paths mentioned in SKILL.md or references that don't exist in the folder)

**SA's scoring rubric (references/scoring-rubric.md):**
- 5 categories × 0-10: Activation Precision, Domain Expertise Depth, Progressive Disclosure, Self-Containment, Maintainability
- Each category has detailed criteria + common failure modes

---

## The Fundamental Tension

SC is empirical: measure triggering accuracy, optimize descriptions against holdout sets, let the data guide improvement. It treats skill improvement as a software testing problem.

SA is architectural: enforce structural constraints, encode domain expertise precisely, design for maintainability. It treats skill improvement as a design problem.

Both are right. A skill that never triggers is useless (SC's concern). A skill with great triggering but 600-line SKILL.md that dumps all references eagerly is also useless (SA's concern).

The cross-evaluation experiment explores what happens when each philosophy critiques the other: does SA find SC's SKILL.md bloated? Does SC find SA's description under-optimized? Do they converge on the same improvements or disagree?

---

## The Harness

The cross-evaluator template lives at `eval-data/originals/sa0/agents/cross-evaluator.md`. It works by:

1. **Identity injection**: The source skill's expertise bullets replace `{{SOURCE_EXPERTISE_BULLETS}}`, making Claude "be" that skill
2. **Target injection**: The target SKILL.md is appended after the template
3. **Structured output**: Evaluation Summary (with 7 dimension scores) → Improved SKILL.md → Key Changes → Diff → Self-Assessment

For SA-as-evaluator: use cross-evaluator.md directly with SA's expertise bullets.
For SC-as-evaluator: use same template structure but substitute SC's evaluation methodology (triggering, output quality, eval loop support, description optimization).

The SC evaluator's Phase 1 criteria differ from SA's:
- Description eval: would this trigger correctly? what's the false positive risk?
- Output quality: can assertions be written for this skill's outputs?
- Iteration readiness: does the skill have clear metrics for "better"?
- Eval set design: what would the test cases look like?
- Communication: accessible across technical levels?
- Description optimization: under 1024 chars, imperative form, user intent focus?
- Benchmark readiness: could run_eval.py work on this?
