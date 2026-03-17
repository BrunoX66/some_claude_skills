# Troubleshooting

Common errors and fixes when running skill-creator workflows.

---

## Eval viewer / generate_review.py

### "Address already in use" when launching the viewer

The viewer tries to bind to a port (default 3117). If something is already there:

```bash
# Find and kill the old server
lsof -ti :3117 | xargs kill -9

# Or just use a different port
python eval-viewer/generate_review.py <workspace>/iteration-N --port 3118
```

### Viewer launches but shows no runs

The viewer discovers runs by looking for directories with an `outputs/` subdirectory inside them. If the directory structure does not match, it finds nothing.

Check that the workspace has this layout:
```
iteration-N/
+-- eval-<name>/
    +-- with_skill/
        +-- run-1/
            +-- outputs/       <-- this directory must exist
```

If outputs are placed directly in `with_skill/` (not inside `run-1/`), both the viewer and `aggregate_benchmark.py` will miss them.

### No display / "webbrowser.open() failed" in headless environments

Pass `--static` to write a self-contained HTML file instead:

```bash
python eval-viewer/generate_review.py <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  --static /tmp/review.html
```

Then open `/tmp/review.html` in a browser. The "Submit All Reviews" button will download `feedback.json` to the Downloads folder.

---

## `claude -p` failures (run_eval.py, run_loop.py)

### "CLAUDECODE environment variable" error

The scripts already strip `CLAUDECODE` from the subprocess environment. If this error appears anyway, it may be from a nested wrapper. Try running the script outside of a Claude Code session, or check if a shell hook is re-setting the variable.

### Process hangs / timeout

`run_eval.py` has a `--timeout` flag (default 30 seconds per query). If the skill is slow to respond:

```bash
python -m scripts.run_eval ... --timeout 60
```

For `run_loop.py`, pass `--timeout 60` as well.

### "No SKILL.md found" error

The `--skill-path` argument must point to the **directory** containing `SKILL.md`, not to `SKILL.md` itself.

```bash
# Wrong
python -m scripts.run_loop --skill-path /path/to/my-skill/SKILL.md ...

# Right
python -m scripts.run_loop --skill-path /path/to/my-skill/ ...
```

### "claude: command not found"

The scripts require the `claude` CLI to be installed and on PATH. Install with:

```bash
npm install -g @anthropic-ai/claude-code
```

---

## aggregate_benchmark.py

### "No eval directories found"

The script looks for directories matching `eval-*` inside the benchmark directory. If eval directories use a different naming prefix, the script will not find them.

Rename directories to start with `eval-` or pass a `--benchmark-dir` that contains `eval-*` directories.

### Grading results not included / pass rate shows 0%

The aggregator reads `grading.json` from each `run-*` subdirectory inside each config directory. If `grading.json` is missing from a run directory, that run is skipped with a warning.

Check that:
1. The grader agent was run for each config/run combination
2. `grading.json` exists at `eval-<name>/with_skill/run-1/grading.json`
3. The `grading.json` is valid JSON with a `summary.pass_rate` field

### eval_metadata.json not found

Place `eval_metadata.json` at the eval level (`eval-<name>/eval_metadata.json`), not inside a config or run directory. Both `generate_review.py` and `aggregate_benchmark.py` check for it at `run_dir.parent` (the eval directory when the run is inside a config directory). If it is missing, the aggregator uses the directory enumeration index as the eval ID, which works but produces less readable output.

---

## quick_validate.py / package_skill.py

### "Unexpected key(s) in SKILL.md frontmatter"

Valid frontmatter keys are: `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`. Any other key causes validation to fail.

Common mistakes:
- Using `tags:` (not a valid top-level key -- move to `metadata.tags`)
- Using `pairs-with:` (not a valid key -- this is a skill-creator-internal concept, not part of the spec)
- Using `author:` (not a valid key -- remove it or move to `metadata`)

### "Description is too long"

The description field has a hard limit of 1024 characters. Check the length:

```bash
python -c "
import yaml, re
content = open('SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
fm = yaml.safe_load(m.group(1))
print(len(fm['description']), 'chars')
"
```

### Packaging fails validation

`package_skill.py` runs `quick_validate.py` before packaging. Fix any validation errors first, then repackage.

---

## Mid-run recovery

### A subagent crashed mid-iteration

If a with_skill or without_skill subagent died before saving outputs:

1. Do not re-run the whole iteration -- just re-run the failed subagent with the same prompt and output path
2. If grading already happened for some runs, do not re-grade those -- the aggregator handles partial results
3. If a full restart is needed: delete the iteration directory and start a new iteration

### feedback.json not found after clicking "Submit All Reviews"

In headless/static mode, the viewer downloads `feedback.json` to the browser's default download folder (usually `~/Downloads/`). Check there. If multiple downloads occurred, look for `feedback (1).json` etc. -- take the most recent one.

Copy it to the workspace:
```bash
cp ~/Downloads/feedback.json <workspace>/iteration-N/feedback.json
```
