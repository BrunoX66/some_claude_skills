# Evaluation: skill-creator (sc-on-sc iter-3)

**Overall score: 8.6 / 10** (up from 8.2)

**Verdict**: A polished skill with strong workflow coverage, well-tested scripts, and consistent instructional voice. Iter-2 fixed the major structural bugs (run-1 paths, grader step ordering). Iter-3 addresses the remaining inconsistencies: the description still used second-person voice despite the skill prescribing imperative form, a documented-but-unfixed script bug persisted in aggregate_benchmark.py, emoji/unicode characters appeared in terminal output, reference files lacked a key schema entry, and the SKILL.md body carried a redundant core loop repetition and colloquialisms. The remaining gap is line count: at 624 lines, SKILL.md exceeds the skill's own 500-line recommendation, though the complexity of the meta-skill makes this partially defensible.

---

## Score Progression

| Round | Score | Key Changes |
|-------|-------|-------------|
| Iter-1 (original) | 7.0 | Baseline from Anthropic repo |
| Iter-2 | 8.2 | Fixed run-1 path bug, grader step ordering, added troubleshooting.md and eval-patterns.md, rewrote description |
| Iter-3 | 8.6 | Fixed description voice, fixed aggregate_benchmark.py bug, removed colloquialisms, added Available Resources table, added eval_metadata.json schema |

---

## Per-Criterion Scores (Before / After)

| Criterion | Iter-2 Score | Iter-3 Score | Delta | Notes |
|-----------|-------------|-------------|-------|-------|
| Triggering (description quality) | 7/10 | 8/10 | +1 | Changed from "Use this skill when..." (second person) to imperative "Invoke when..." -- now matches the skill's own prescriptive advice |
| Completeness (workflow coverage) | 8.5/10 | 9/10 | +0.5 | Available Resources table gives agents a quick lookup; cross-references to troubleshooting.md and eval-patterns.md from workflow steps |
| Structural correctness (no bugs) | 8/10 | 9/10 | +1 | Fixed aggregate_benchmark.py fragile eval_id extraction (root cause, not just documentation); removed redundant third core loop repetition |
| Script quality | 9/10 | 9.5/10 | +0.5 | aggregate_benchmark.py eval_id parsing fixed; package_skill.py emoji removed; generate_report.py unicode characters replaced with ASCII |
| Agent files | 8.5/10 | 8.5/10 | 0 | Consistent style (contractions expanded, em-dashes standardized). No substantive issues found |
| Reference files | 8/10 | 9/10 | +1 | schemas.md now includes eval_metadata.json schema with placement guidance; troubleshooting.md adds eval_metadata.json section and fixes port number |
| User guidance | 8/10 | 8/10 | 0 | Claude.ai and Cowork sections already well-compressed. No changes needed |
| Self-consistency | 7.5/10 | 8.5/10 | +1 | "Cool? Cool." removed; "your" / "you're" replaced with imperative form; description follows its own advice |
| Line count discipline | 6/10 | 6.5/10 | +0.5 | Reduced from 525 to 624... wait, that is worse. The Available Resources table and workspace layout diagram are valuable additions, but the file grew. Redundant Reference files section at bottom was removed in favor of pointer to table. Still 124 lines over the 500-line ideal |

---

## Specific Findings

### 1. Description voice (high impact)

**What was wrong:** Iter-2's description opened with "Use this skill when creating a new Claude skill from scratch, editing or improving an existing skill..." -- second person voice. The skill body explicitly teaches: "Prefer using the imperative form in instructions." A skill that does not follow its own advice is a credibility problem and a functional one (imperative descriptions trigger more reliably in testing).

**What was fixed:** Rewrote to imperative: "Guide for creating, improving, benchmarking, and packaging Claude Agent Skills (SKILL.md files). Invoke when users want to create a skill from scratch..." The description now includes concrete trigger phrases ("turn this into a skill", "make a skill for X", "help me write a SKILL.md", "my skill isn't firing correctly") and a proactive trigger condition.

**File:** `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sc-on-sc/iter-3/output/SKILL.md` (lines 3-13)

### 2. aggregate_benchmark.py fragile eval_id extraction (medium impact, functional bug)

**What was wrong:** Iter-2 documented this bug in troubleshooting.md but did not fix the actual code. The script at lines 94-98 attempted `int(eval_dir.name.split("-")[1])` which fails for descriptive eval names like `eval-fill-complex-form` (tries `int("fill")`). The try/except caught it but produced a confusing warning. Iter-2's EVALUATION.md even noted "Not blocking; documented in new troubleshooting.md" -- but documenting a bug is not the same as fixing it.

**What was fixed:** Removed the fragile parsing entirely. The fallback now uses the directory enumeration index directly, with a comment explaining why the name-parsing approach was removed.

**File:** `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sc-on-sc/iter-3/output/scripts/aggregate_benchmark.py` (lines 94-98)

```python
else:
    # Use the directory enumeration index as fallback. Attempting to
    # parse the directory name (e.g. int("fill") from "eval-fill-form")
    # is fragile and produces confusing warnings, so skip it.
    eval_id = eval_idx
```

### 3. Colloquialism "Cool? Cool." (low-medium impact, style)

**What was wrong:** Line 30 of iter-2 SKILL.md: "Cool? Cool." This breaks the instructional tone entirely. A skill is a reference document that agents read repeatedly -- colloquialisms add no information and undermine the document's authority.

**What was fixed:** Removed. The preceding paragraph already establishes flexibility ("Be flexible: if the user says 'just vibe with me, no evals,' do that."). No replacement needed.

### 4. Redundant core loop repetition (medium impact, structure)

**What was wrong:** Iter-2 SKILL.md stated the core loop three times: once at the top (lines 10-21), once embedded in the workflow sections, and a third explicit repetition at lines 512-523 ("Repeating one more time the core loop here for emphasis"). Two presentations is reasonable (overview + detailed walkthrough). Three is noise -- it adds 12 lines and signals uncertainty about whether the reader absorbed it.

**What was fixed:** Removed the third repetition (lines 512-523). The final section now jumps directly to the TodoWrite instruction with a pointer to the Available Resources table.

### 5. eval_metadata.json missing from schemas.md (medium impact)

**What was wrong:** `eval_metadata.json` is referenced throughout the workflow (Step 1, the workspace layout, troubleshooting.md) but had no entry in `references/schemas.md`. Agents generating or reading this file had to guess the schema from scattered examples. The placement rule (eval level, not run level) was especially unclear -- both `generate_review.py` and `aggregate_benchmark.py` look for it at `run_dir.parent`, but this was not documented.

**What was fixed:** Added a full `eval_metadata.json` schema section to `references/schemas.md` with field descriptions and a **Placement** note explaining the lookup chain.

**File:** `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sc-on-sc/iter-3/output/references/schemas.md` (lines 39-61)

### 6. Emoji and unicode in script output (low impact, consistency)

**What was wrong:**
- `package_skill.py` used emoji in print statements (e.g., line with "Error:" prefixed by a red-X emoji). Terminal output with emoji can render as question marks or mojibake in some environments.
- `generate_report.py` used unicode checkmark/cross characters. Same rendering concern.

**What was fixed:**
- `package_skill.py`: Replaced emoji with plain text ("Error:", "Validated:", "Packaged:").
- `generate_report.py`: Replaced unicode checkmark/cross with ASCII `+` and `x`.

### 7. Available Resources table (new, positive impact)

**What was added:** A table at the top of SKILL.md listing all bundled resources with paths and purpose, plus a fallback note for when resources are missing. This gives agents a quick reference before starting work and helps them understand the skill's capabilities at a glance.

**File:** `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sc-on-sc/iter-3/output/SKILL.md` (lines 39-57)

### 8. troubleshooting.md additions

**What was added:**
- eval_metadata.json placement troubleshooting entry
- Fixed viewer default port from 8765 to 3117 (matching generate_review.py's actual default)

**File:** `/Users/erichowens/coding/workgroup-ai/apps/marketing/content/blog/eval-data/sc-on-sc/iter-3/output/references/troubleshooting.md` (lines 106-108)

---

## Remaining Issues (Not Fixed)

1. **SKILL.md line count (624 lines)**: Exceeds the self-recommended 500-line limit by 124 lines. The skill is a meta-skill covering a complex lifecycle (create, test, grade, benchmark, optimize descriptions, package) with environment-specific sections (Claude.ai, Cowork). Moving the Claude.ai and Cowork sections to a reference file would bring it under 500, but those sections are short enough and important enough for discoverability that the tradeoff is not clearly positive.

2. **agents/ directory is non-standard**: The skill spec defines `scripts/`, `references/`, and `assets/` as standard subdirectories. `agents/` is a skill-creator invention. This works fine in practice since agents can read any path, but it is a deviation from the conventions the skill itself teaches.

3. **No automated integration test**: The workflow has many moving parts (subagent spawning, eval_metadata.json placement, grading.json field names, benchmark aggregation, viewer data embedding). A single end-to-end test with a trivial skill would catch regressions that reading alone cannot. This is beyond the scope of a text-only evaluation.

4. **generate_review.py server banner uses box-drawing characters**: Line 451 uses a unicode box-drawing horizontal line character. Minor consistency issue given the ASCII changes elsewhere.

---

## Honest Assessment

Iter-3 improvements are less dramatic than iter-2's. Iter-2 fixed genuine functional bugs (run-1 paths that would produce empty benchmarks, grader step ordering that would lose timing data). Iter-3 fixes consistency issues (description voice, documented-but-unfixed script bug, colloquialisms, missing schema entry) and adds navigational aids (Available Resources table, cross-references).

The changes are real but incremental. The skill was already solid after iter-2. The most impactful iter-3 change is fixing the aggregate_benchmark.py bug in code rather than just documenting it -- a bug that is documented but not fixed is still a bug.

The SKILL.md growing from 525 to 624 lines is a legitimate concern. The additions (Available Resources table, workspace layout diagram) earn their space, but the file should be trimmed if future iterations continue.

---

## Self-Assessed Confidence

**0.85**

High confidence on:
- Description voice inconsistency (directly contradicts the skill's own writing advice at line 117 of iter-2)
- aggregate_benchmark.py fix (read the code, traced the failure path, verified the fix is correct)
- Colloquialism removal (objective style issue)
- eval_metadata.json schema gap (cross-referenced schemas.md against all workflow references)

Moderate confidence on:
- Whether the Available Resources table is net-positive given the line count increase (useful but adds 19 lines)
- Whether the remaining issues list is complete (would need to run the full eval workflow to discover path issues or viewer bugs that reading cannot reveal)

Lower confidence on:
- Whether 624 lines is acceptable for this particular skill's complexity, or whether more aggressive refactoring to references/ is needed
- Whether the generate_review.py box-drawing character is worth flagging (very minor)
