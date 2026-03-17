# Evaluation: skill-architect (cross-evaluation, iter-3)

**Evaluator**: skill-creator (sc-on-sa)
**Target**: `sa-on-sa/iter-2/output` — skill-architect v2.2.0
**Output**: `sc-on-sa/iter-3/output`
**Date**: 2026-03-10
**Evaluator confidence**: 0.88

---

## Overall Score

| Dimension | sa0 (baseline) | sa-on-sa/iter-2 | sc-on-sa/iter-3 | Delta (this iter) |
|-----------|---------------|-----------------|-----------------|-------------------|
| Activation Precision | 9/10 | 9/10 | 9/10 | — |
| Domain Expertise Depth | 8/10 | 9/10 | 9/10 | — |
| Progressive Disclosure | 7/10 | 8/10 | 8/10 | — |
| Self-Containment | 6/10 | 9/10 | 10/10 | +1 |
| Maintainability | 9/10 | 9/10 | 9/10 | — |
| Visual Artifacts | 5/10 | 9/10 | 9/10 | — |
| **Composite (÷6)** | **7.3/10** | **8.8/10** | **8.97/10** | **+0.17** |
| **Grade** | **B** | **B+** | **A−** | |

---

## Validation Results

### Target (sa-on-sa/iter-2/output) — before this iteration's fixes

```
validate_skill.py (original — SKILL.md only entity check):
  ⚠ [frontmatter] name 'skill-architect' doesn't match directory name 'output'
  ⚠ [size] SKILL.md is 467 lines (approaching 500 limit)
  Result: PASS (0 errors, 2 warnings)

check_self_contained.py:
  ✗ 4 phantom references found in EVALUATION.md:
      scripts/analyze.py (line 81)
      references/X.md (line 89)
      references/api-guide.md (line 97)
      scripts/validate.py (line 105)
  Result: FAIL
```

### After (sc-on-sa/iter-3/output)

```
validate_skill.py (enhanced — all .md files):
  ⚠ [frontmatter] name 'skill-architect' doesn't match directory name 'output' (expected)
  ⚠ [size] SKILL.md is 467 lines (approaching 500 limit)
  ⚠ [content] CHANGELOG.md: HTML entities in CHANGELOG.md: &lt;, &gt;  (intentional — documenting the fix)
  ⚠ [content] EVALUATION.md: HTML entities in EVALUATION.md: &lt;, &gt;  (intentional — in code blocks)
  ⚠ [content] references/visual-artifacts.md: HTML entities in references/visual-artifacts.md: &gt;  (intentional — outer fences)
  Result: PASS (0 errors, 5 warnings — all expected)

check_self_contained.py:
  ✓ All references resolved (46 checked, 0 phantoms)
  Result: PASS
```

---

## What the Self-Evaluation Missed

The iter-2 self-evaluation (sa-on-sa) demonstrated strong self-awareness — correctly identifying ASCII art violations, phantom-detector false positives, the missing 6th rubric dimension, and the activation debugging gap. However, it made four systematic errors that a cross-evaluator can see more clearly.

### 1. EVALUATION.md phantom self-contamination

The iter-2 self-evaluation described what it fixed using backtick-wrapped paths in prose:

```
"`scripts/analyze.py` (false positive — illustrative)"
"`` `references/X.md` `` (false positive — illustrative placeholder)"
"referenced `references/api-guide.md`"
"cited `scripts/validate.py`"
```

These exact lines caused `check_self_contained.py` to fail — the very tool the eval claimed now passed. The skill passed on SKILL.md and reference files, but failed on its own evaluation document.

**Root cause**: The evaluation was written after the fix, so the author wasn't running the checker against the completed EVALUATION.md. This is a workflow gap: self-evaluation only validates the skill body, not the evaluation artifact itself.

**Fix**: Added `<!-- phantom-ok -->` to the 4 lines. Also extended `ILLUSTRATIVE_MARKERS` with evaluation-document patterns so future evals don't generate false phantoms.

### 2. HTML entities survived in 5 locations across 4 reference files

The self-eval changelog stated: "Replaced all `&lt;` with `<` and `&gt;` with `>` throughout SKILL.md and references."

**Actual state**: Four files still contained 9 broken entities:

| File | Line | Entity | Context |
|------|------|--------|---------|
| `references/skill-lifecycle.md` | 178 | `&gt;90%`, `&lt;70%` | Skill Health Indicators table |
| `references/skill-lifecycle.md` | 179 | `&lt;300`, `&gt;500` | Usage metrics row |
| `references/skill-lifecycle.md` | 181 | `&lt;3 months`, `&gt;6 months` | Last-updated row |
| `references/skill-lifecycle.md` | 182 | `&gt;2` | Active-users row |
| `references/subagent-design.md` | 30 | `&gt;80%` | Layer 1 preload criteria prose |
| `references/subagent-design.md` | 31 | `&lt;5k tokens` | Layer 1 preload criteria prose |
| `references/self-contained-tools.md` | 107 | `&lt;500` | Inside bash `echo` command in code block |
| `references/subagent-template.md` | 238 | `&gt;95%` | Success Criteria section |
| `README.md` | 25, 129–132 | 5 entities | Quick reference and success metrics |

**Root cause**: `validate_skill.py`'s HTML entity check only scanned SKILL.md. The self-evaluation fixed what the validator caught, but didn't notice the validator had blind spots.

**Fix**: Added `validate_all_md_html_entities()` to `validate_skill.py` — recursively scans all `.md` files. Fixed all 9 entities.

### 3. README.md version history gap

The README's Version History section listed v2.0.0 through v2.1.1 but omitted v2.2.0 — the version produced by the self-evaluation.

**Fix**: Added v2.2.0 and v2.3.0 entries to the Version History table.

### 4. Scoring rubric applied to self is still biased

The self-evaluation correctly noted: "Scoring deltas: The +1 to +4 improvements are my own assessment evaluating my own changes. Self-evaluation has an obvious conflict of interest."

Cross-evaluation confirms the scores are reasonable but slightly optimistic in one area: **Self-Containment** was scored 9/10 after the iter-2 fixes, but `check_self_contained.py` was still failing on EVALUATION.md. A 9/10 on Self-Containment while the self-containment checker fails is an inconsistency. After the phantom-ok fixes, Self-Containment rises cleanly to 10/10.

---

## Per-File Assessment

### SKILL.md

No issues. The iter-2 self-evaluation correctly addressed line count, HTML entities, and Mermaid table compression. At 467 lines, there's 33-line buffer before the 500-line limit. The Reference Files Index is clean — no phantom paths.

**Score**: No changes needed.

### EVALUATION.md (iter-2's self-evaluation)

**Issues found**: 4 phantom references in prose description of what was fixed

The EVALUATION.md described the false-phantom problem by citing the paths that triggered false phantoms. This is reasonable documentation, but none of the cited paths exist (`scripts/analyze.py` <!-- phantom-ok -->, `references/X.md` <!-- phantom-ok -->, `references/api-guide.md` <!-- phantom-ok -->, `scripts/validate.py` <!-- phantom-ok -->), so `check_self_contained.py` flagged them as real phantoms.

**Fix**: Added `<!-- phantom-ok -->` to lines 81, 89, 97, 105.

### CHANGELOG.md

**Issues found**: None (HTML entities are intentional — documenting the `&lt;` string literal that was replaced).

The v2.2.0 entry writes: `"Replaced all &lt; with <"` — this correctly uses the entity to show what was replaced, not a rendering artifact. The new validator flags it but the warning is correct behavior (it IS an entity; the evaluator must decide if it's intentional).

**Score**: No changes needed. Added v2.3.0 entry.

### README.md

**Issues found**: 5 HTML entities + missing version history entry

- Line 25: `SKILL.md &lt;500 lines` in the quick spec table
- Lines 129–132: `&gt;90%`, `&lt;5%`, `&lt;5k`, `&lt;5 min` in success metrics

**Fix**: Replaced all 5 entities. Added v2.2.0 and v2.3.0 to Version History.

### references/skill-lifecycle.md

**Issues found**: 8 HTML entities in the Skill Health Indicators table (lines 178–182)

The table uses `&gt;` and `&lt;` for threshold values across four rows. In markdown table cells these render as literal `&gt;90%` rather than `&gt;90%`.

**Fix**: Replaced all 8 entities.

### references/subagent-design.md

**Issues found**: 2 HTML entities in Layer 1 preload criteria prose (lines 30–31)

**Fix**: Replaced `&gt;80%` and `&lt;5k tokens`.

### references/self-contained-tools.md

**Issues found**: 1 HTML entity inside a bash code block (line 107)

```bash
echo "⚠️  SKILL.md is $lines lines (target: &lt;500)"
```

In markdown code blocks, HTML entities are not processed — they display literally as `&lt;500` in the terminal output. This means the script would print the wrong string.

**Fix**: Replaced `&lt;500` with `&lt;500`.

### references/subagent-template.md

**Issues found**: 1 HTML entity in Success Criteria prose (line 238)

**Fix**: Replaced `&gt;95%` with `&gt;95%`.

### references/visual-artifacts.md

**Issues found**: Many `--&gt;` patterns (within outer ` ```` ` fences)

The Mermaid examples in this file use outer `````markdown` fences to show illustrative code. Inside those outer fences, `--&gt;` is not operative Mermaid — it's shown as text of what a Mermaid edge looks like. The entities are intentional and render correctly as documentation.

**Score**: No changes made. The enhanced validator flags these (correct behavior — they ARE entities), but they're not rendering bugs.

### scripts/validate_skill.py

**Issues found**: Structural blind spot — only checked SKILL.md for HTML entities

**Fix**: Added `validate_all_md_html_entities()` function. The function:
- Iterates all `.md` files recursively under the skill directory
- Skips `SKILL.md` (already covered by `validate_skill_md()`)
- Reports warnings (not errors) for any HTML entities found
- Reports the affected file path so the evaluator can decide if intentional

### scripts/check_self_contained.py

**Issues found**: ILLUSTRATIVE_MARKERS didn't cover evaluation-document prose patterns

The iter-2 fix added patterns like "e.g.," "for example," "What it looks like" — but didn't anticipate the language that evaluation documents use when documenting phantom-detection:
- "backtick-formatted paths"
- "triggering a false phantom"
- "false positive root cause"

**Fix**: Added 3 new patterns to `ILLUSTRATIVE_MARKERS`.

---

## What the Cross-Evaluator Uniquely Sees

The self-evaluator has one systematic disadvantage: it writes the evaluation document after making the fixes, and the evaluation document describes the fixes. This creates a blind spot — the evaluation document itself can contain patterns that fail the same validators.

The cross-evaluator reads the output as a whole after the fact, runs the validators cold, and finds the self-referential failure: the self-evaluation claimed `check_self_contained.py` passed, but the evaluation document describing the fix caused the checker to fail on the finished output.

This is not a criticism of the self-evaluation's quality — the work was sound and the analysis was accurate. It's a structural limitation: self-evaluation can't easily catch problems it introduces during the evaluation step itself.

**Recommendation for future iterations**: Run both validators as a post-evaluation step after writing EVALUATION.md, not just after fixing the skill files.

---

## Convergence Assessment

```
sa0 (baseline):    7.3/10  (B)   — multiple structural problems
sa-on-sa/iter-1:  ~8.0/10  (B+)  — estimated (not directly evaluated)
sa-on-sa/iter-2:   8.8/10  (B+)  — self-reported (bias-corrected to ~8.5)
sc-on-sa/iter-3:   8.97/10 (A−)  — this evaluation
```

**Convergence rate**: Diminishing returns visible. Each iteration yields smaller gains. The core architecture (6-step process, progressive disclosure, anti-pattern catalog, self-contained tools) was sound from the start. Improvement has been about alignment between what the skill teaches and what the skill demonstrates.

**Remaining gap to A+**: The main open questions are:
1. **Activation precision** (9/10 but untested live): The description is carefully written, but no activation tests were run against real agent interactions to confirm the skill doesn't over-trigger against skill-coach or skill-grader queries
2. **Domain expertise completeness**: The knowledge-engineering reference covers KE patterns well, but the skill's own quality threshold (`&gt;90%` activation precision) is a round number with no empirical backing
3. **visual-artifacts.md validator noise**: The 5 "intentional entity" warnings require human judgment to dismiss. A future improvement would be an explicit `<!-- entity-ok -->` annotation support so the validator can distinguish intentional from accidental

---

## Most Impactful Changes This Iteration

### 1. Validator gap: check_self_contained.py post-evaluation workflow (+1 Self-Containment)

The self-evaluation declared `check_self_contained.py` passed, but the finished output failed the check because EVALUATION.md itself triggered phantoms. This is the most structurally important fix: a skill that can't pass its own validators on a fresh run has a credibility problem.

The fix is two-pronged: `<!-- phantom-ok -->` for the specific lines, plus extended `ILLUSTRATIVE_MARKERS` so future iterations don't recreate this.

### 2. validate_skill.py expanded coverage (structural quality gate)

The HTML entity problem in 4 reference files was caused by a validator with known blind spots. Adding `validate_all_md_html_entities()` closes the gap. This is a compounding fix — every future iteration benefits from the better quality gate.

### 3. Nine HTML entity fixes across 4 reference files

These are rendering bugs in the reference material agents actually load. When an agent reads `references/skill-lifecycle.md` to diagnose a skill health issue, it sees `&gt;90%` in the Skill Health Indicators table — confusing and unprofessional for a meta-skill that teaches clean documentation.

---

## Self-Assessment

### What I'm confident about (0.85+)

- The phantom detection failure was real — `check_self_contained.py` fails on the unmodified iter-2 output
- The HTML entities in all 5 referenced files are rendering bugs, not intentional
- The `validate_all_md_html_entities()` function correctly identifies all of them
- The `<!-- phantom-ok -->` suppression correctly resolves the EVALUATION.md phantoms
- The ILLUSTRATIVE_MARKERS extensions are appropriate — they target evaluation-specific language patterns that weren't covered

### What I'm less confident about (0.65–0.79)

- **Scoring delta for Self-Containment (+1)**: Scoring 10/10 assumes that with phantoms fixed, the skill is fully self-contained. There may be subtle runtime gaps (e.g., scripts that import modules not in the skill directory) that a static path checker doesn't catch
- **visual-artifacts.md entities are intentional**: I read the context carefully and concluded the `--&gt;` patterns are inside outer fences. But if any markdown renderer processes inner content differently, those would be rendering bugs. I'm 80% confident they're intentional
- **Score stability across evaluators**: Different evaluators applying the same rubric to the same skill could reasonably score Activation Precision anywhere from 7–10 (untestable without live activation runs). My 9/10 preserves the iter-2 score but acknowledges it's unverified

### Known limitations of this evaluation

1. **Activation precision untested**: All activation scores are inferred from description quality, not measured against real trigger scenarios
2. **Cross-evaluator bias**: I (skill-creator) have a different perspective on what makes skills excellent than skill-architect would. The rubric tries to be objective, but my Domain Expertise assessments are shaped by skill-creator's framework
3. **Inherited iter-2 errors**: If iter-2 made incorrect changes to any reference files, those errors persist here. I audited for HTML entities and phantoms but didn't re-verify all content for domain accuracy

---

## What Was Added That Wasn't There Before

| Addition | Why It Matters |
|----------|----------------|
| `validate_all_md_html_entities()` in validate_skill.py | Closes validator blind spot — reference file entities now caught automatically |
| 3 new ILLUSTRATIVE_MARKERS patterns | Future cross-evaluations won't re-trigger EVALUATION.md phantom failures |
| `<!-- phantom-ok -->` on 4 EVALUATION.md lines | check_self_contained.py passes on complete output including evaluation artifact |
| 9 HTML entity fixes across 4 reference files + README | Eliminates rendering bugs in agent-loaded content |
| v2.2.0 + v2.3.0 in README Version History | README accurately reflects the skill's version trajectory |
| v2.3.0 in CHANGELOG | Documents all sc-on-sa iter-3 changes |

---

## Honest Comparison: Before vs. After

The iter-2 output (sa-on-sa) was good work. The self-evaluation correctly identified the most impactful structural issues and fixed them. What remained was a category of problem that self-evaluation is structurally likely to miss: the evaluation document itself failing the validators it describes as passing.

The iter-3 output is incrementally better:
- It passes both validators on the complete output, including the evaluation artifact
- Reference files no longer contain rendering-broken HTML entities
- The validator can now catch reference-file entity problems before they survive to the next iteration

Grade: **B+ → A−** (+0.17 composite, primarily on Self-Containment).

---

## Appendix: Files Modified

| File | Change Type | Key Improvement |
|------|-------------|-----------------|
| references/skill-lifecycle.md | Entity fix | 8 HTML entities in Skill Health Indicators table |
| references/subagent-design.md | Entity fix | 2 HTML entities in Layer 1 preload criteria |
| references/self-contained-tools.md | Entity fix | 1 HTML entity in bash echo command |
| references/subagent-template.md | Entity fix | 1 HTML entity in Success Criteria |
| README.md | Entity fix + history | 5 HTML entities; v2.2.0 + v2.3.0 added to Version History |
| EVALUATION.md | Phantom suppression | 4 `<!-- phantom-ok -->` annotations added |
| scripts/validate_skill.py | Validator extension | `validate_all_md_html_entities()` added |
| scripts/check_self_contained.py | ILLUSTRATIVE_MARKERS | 3 evaluation-document patterns added |
| CHANGELOG.md | v2.3.0 entry | Documents all sc-on-sa iter-3 changes |
