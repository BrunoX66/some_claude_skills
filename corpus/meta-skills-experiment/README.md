# Meta-Skills Experiment: When Meta-Skills Collide

What happens when you point two skill-building agents at each other?

This directory contains the complete output of a cross-evaluation experiment between **skill-architect** (WinDAGs' skill-building agent) and **skill-creator** (Anthropic's skill-building agent). Each evaluated and improved the other's work, and we compared the results to self-evaluation.

**Blog post**: [When Meta-Skills Collide](https://windags.ai/blog/when-meta-skills-collide)

## Directory Structure

```
meta-skills-experiment/
+-- originals/                    # Baseline skills (SA0, SC0)
|   +-- skill-architect/          # WinDAGs' skill-architect v2.1
|   +-- skill-creator/            # Anthropic's skill-creator (from Claude Code)
+-- self-improved/                # Each agent improved its own skill
|   +-- skill-architect/          # SA self-eval: 8.9/10 (B+)
|   +-- skill-creator/            # SC self-eval: 8.6/10 (B+)
+-- cross-improved/               # Each agent improved the OTHER's skill
|   +-- skill-architect/          # SC improved SA: 8.97/10 (A-)
|   +-- skill-creator/            # SA improved SC: 7.83/10 (B+)
+-- evaluations/                  # All evaluation reports
|   +-- sa-self-eval.md           # SA evaluating its own improvement
|   +-- sc-self-eval.md           # SC evaluating its own improvement
|   +-- sc-evaluates-sa.md        # SC cross-evaluating SA (the A- grade card)
|   +-- sa-evaluates-sc.md        # SA cross-evaluating SC
|   +-- fresh-read-sa.md          # Fresh agent reading SA cross-improved: 8.5/10
|   +-- fresh-read-sc.md          # Fresh agent reading SC cross-improved: 6.8/10
+-- baseline.json                 # Initial evaluation scores
+-- exposition.md                 # Detailed experiment narrative
```

## Key Findings

### Cross-evaluation beats self-evaluation

| Metric | Self-Improved SA | Cross-Improved SA | Self-Improved SC | Cross-Improved SC |
|--------|:---:|:---:|:---:|:---:|
| Composite Score | 8.9 (B+) | **8.97 (A-)** | 8.6 (B+) | **7.83 (B+)** |
| Fresh Agent Score | -- | **8.5/10** | -- | **6.8/10** |
| SKILL.md Lines | 381 | **467** (under 500) | **625** (over 500!) | -- |
| NOT Clause | Present | **Present** | Missing | -- |
| Mermaid Diagrams | 1 | **2** | 0 | -- |
| check_self_contained.py | FAIL | **PASS** | -- | -- |

### What cross-evaluation catches that self-evaluation misses

1. **Phantom self-contamination**: Self-eval wrote paths in its evaluation document that made the self-containment checker fail on its own output
2. **Blind spot inheritance**: Self-eval only fixed what its own validator caught, missing blind spots in the validator itself
3. **Optimistic self-scoring**: SA scored itself 9/10 on Self-Containment while its checker was still failing
4. **Math errors**: SA reported SC's composite as 8.8/10 but the actual dimension math gives 7.83/10

### The showdown (SC's rubric applied to both)

| Dimension | SA (cross) | SC (cross) | Winner |
|-----------|:---:|:---:|:---:|
| Activation Precision | 9 | 8 | SA |
| Domain Expertise | 9 | 8 | SA |
| Progressive Disclosure | 8 | 8 | TIE |
| Self-Containment | 10 | 9 | SA |
| Maintainability | 9 | 8 | SA |
| Visual Artifacts | 9 | 6 | SA |
| **Composite** | **9.00** | **7.83** | **SA** |

SA wins 4 dimensions, 2 tied, SC wins 0.

## Using the Cross-Improved Skills

The **cross-improved versions** (`cross-improved/`) are the recommended production skills. They incorporate feedback from a different agent's perspective, which catches blind spots that self-evaluation misses.

```bash
# Install the cross-improved skill-architect
cp -R cross-improved/skill-architect/ ~/.claude/skills/skill-architect/

# Install the cross-improved skill-creator
cp -R cross-improved/skill-creator/ ~/.claude/skills/skill-creator/
```

## Experiment Process

1. **Round 1**: Each agent evaluated the other's baseline skill (SA₀, SC₀)
2. **Round 2**: Each agent improved the other's skill based on their evaluation
3. **Round 3**: Each agent cross-evaluated the improved version + each self-evaluated their own improvement
4. **Fresh readings**: New agents with no context read each final skill cold

Three iterations of the braid: evaluate, improve, re-evaluate. The cross-evaluator uniquely caught structural blind spots that self-evaluation can't easily detect.

## License

- **skill-architect**: Created by WinDAGs/Curiositech
- **skill-creator**: Originally from Anthropic's Claude Code agent skills; modifications under experiment
