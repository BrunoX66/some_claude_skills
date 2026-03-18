/**
 * Tutorial step content — real, teaching-quality walkthroughs with code excerpts.
 * Each tutorial maps to a key in TUTORIALS (TutorialsWindow.tsx).
 * Steps are rendered sequentially in the TutorialDetailView.
 */

export interface TutorialStep {
  heading: string;
  /** Content lines. Lines starting with ``` open/close code blocks. */
  body: string;
}

export const TUTORIAL_CONTENT: Record<string, TutorialStep[]> = {
  "first-email": [
    {
      heading: "What You'll Build",
      body: `By the end of this tutorial, you'll know how to use the **email-composer** skill to draft professional, warm, or difficult emails — all from a single Claude Code command. No programming experience needed.`,
    },
    {
      heading: "Step 1: Install the Skill",
      body: `First, install the email-composer skill into your Claude Code setup:

\`\`\`bash
# In your terminal, run:
claude install-skill email-composer
\`\`\`

This copies the skill's SKILL.md file into your \`~/.claude/skills/\` directory. Claude will automatically use it when you ask for email help.`,
    },
    {
      heading: "Step 2: Write Your First Email",
      body: `Open Claude Code and describe the email you want to write. Be specific about:

- **Who** you're writing to (boss, client, friend)
- **What** you need to say
- **What tone** you want (professional, warm, apologetic)

\`\`\`
claude "Write a professional email to my manager Sarah
requesting time off next Friday for a dentist appointment.
Keep it brief and polite."
\`\`\`

Claude will generate a complete email with subject line, greeting, body, and sign-off.`,
    },
    {
      heading: "Step 3: Handling Difficult Emails",
      body: `The email-composer skill really shines with tricky situations — messages you'd normally agonize over:

\`\`\`
claude "Help me write an email to a vendor who delivered
the wrong order. I need a replacement shipped overnight.
Be firm but professional — we want to keep the relationship."
\`\`\`

The skill will:
- Set the right tone (assertive but not aggressive)
- Include specific details you should fill in (order number, date)
- Suggest a clear call to action
- Offer a subject line that gets the email opened`,
    },
    {
      heading: "Step 4: Iterating on Drafts",
      body: `Don't settle for the first draft. Claude remembers context within a session:

\`\`\`
claude "Make it shorter — two paragraphs max"
claude "Add a line about our 5-year relationship"
claude "Change the tone to be warmer"
\`\`\`

Each follow-up refines the email without losing the original intent. This is faster than writing from scratch.`,
    },
    {
      heading: "Tips & Tricks",
      body: `**Pro tips for better emails:**

- Start with the hardest part — what you're asking for. Claude handles the rest.
- Mention cultural context if relevant ("formal Japanese business email" vs "casual Silicon Valley").
- Ask for multiple versions: "Give me a formal version and a casual version."
- Use "reply to this email: [paste]" to generate responses to messages you've received.

**Common patterns:**
- \`"Write a follow-up email — it's been 3 days with no response"\`
- \`"Draft a thank-you note for a job interview at [company]"\`
- \`"Write a cold email introducing my product to [audience]"\``,
    },
  ],

  "plan-vacation": [
    {
      heading: "What You'll Build",
      body: `You'll use Claude as an AI travel planner to research destinations, build day-by-day itineraries, and estimate costs — all in conversational English. The **personal-finance-coach** skill adds budget tracking.`,
    },
    {
      heading: "Step 1: Start with Your Constraints",
      body: `Tell Claude your real constraints — budget, dates, and preferences:

\`\`\`
claude "I want to plan a 7-day trip to Japan in October.
Budget: $3,000 total (not including flights).
I love food, temples, and avoiding crowds.
I don't want to move hotels more than twice."
\`\`\`

Claude will suggest a realistic itinerary based on your constraints rather than a generic tourist guide.`,
    },
    {
      heading: "Step 2: Deep-Dive on a Destination",
      body: `Once you've picked a destination, go deep:

\`\`\`
claude "Break down the Kyoto portion: 3 full days.
Give me a morning/afternoon/evening schedule.
Include restaurant recommendations with price ranges.
Note which temples need advance booking."
\`\`\`

Claude will produce a structured day plan:

\`\`\`
Day 1 — Eastern Kyoto
  Morning: Fushimi Inari (free, arrive by 6:30 AM to avoid crowds)
  Lunch: Vermillion Café near the shrine (~¥1,200)
  Afternoon: Kiyomizu-dera (¥400, no advance booking needed)
  Evening: Pontocho alley for dinner (~¥3,000-5,000)

Day 2 — Western Kyoto
  Morning: Arashiyama Bamboo Grove (free, arrive before 8 AM)
  ...
\`\`\``,
    },
    {
      heading: "Step 3: Budget Tracking",
      body: `Use the personal-finance-coach skill to keep costs organized:

\`\`\`
claude "Create a budget spreadsheet for my Japan trip.
Categories: accommodation, food, transport, activities, shopping.
Include the costs from our itinerary so far."
\`\`\`

Claude will generate a structured breakdown:

\`\`\`
| Category       | Budget   | Estimated | Remaining |
|---------------|----------|-----------|-----------|
| Accommodation | $1,200   | $1,050    | $150      |
| Food          | $800     | $720      | $80       |
| Transport     | $500     | $380      | $120      |
| Activities    | $300     | $180      | $120      |
| Shopping      | $200     | -         | $200      |
| **Total**     | **$3,000** | **$2,330** | **$670** |
\`\`\``,
    },
    {
      heading: "Step 4: Logistics & Booking Checklist",
      body: `Before you book, ask Claude for a pre-trip checklist:

\`\`\`
claude "Give me a booking checklist for Japan in October.
What needs advance reservation? What can I do day-of?
Include visa, rail pass, and SIM card details."
\`\`\`

This catches things you'd forget:
- Japan Rail Pass (order 2+ weeks before)
- Pocket Wi-Fi or SIM card
- Restaurant reservations for kaiseki places (weeks in advance)
- Temple special viewing periods in October (fall foliage season)`,
    },
  ],

  "health-letter": [
    {
      heading: "What You'll Build",
      body: `You'll describe your symptoms in plain language and use Claude to write a clear, organized medical summary letter for your doctor. The **clinical-diagnostic-reasoning** skill helps structure your symptoms logically.

**Important:** Claude is not a doctor. This tutorial helps you communicate more effectively with your healthcare provider — not replace their judgment.`,
    },
    {
      heading: "Step 1: Describe What's Going On",
      body: `Start by telling Claude everything, in whatever order it comes to mind:

\`\`\`
claude "Help me write a letter for my doctor appointment.
I've been having headaches for about 3 weeks, mostly in
the afternoon. They're behind my eyes. Ibuprofen helps
sometimes but not always. I also started a new desk job
and I'm staring at screens all day. My neck is stiff too.
I drink maybe 3 cups of coffee a day."
\`\`\`

Don't worry about medical terminology — write how you'd describe it to a friend. Claude will organize it.`,
    },
    {
      heading: "Step 2: Get It Organized",
      body: `Claude will restructure your description into a medical summary format:

\`\`\`
PATIENT SUMMARY — Prepared for Dr. [Your Doctor]
Date: [Appointment Date]

CHIEF COMPLAINT:
Recurring bilateral retro-orbital headaches × 3 weeks

ONSET & PATTERN:
- Duration: 3 weeks
- Frequency: Daily, predominantly afternoon onset
- Location: Behind both eyes, associated neck stiffness

ASSOCIATED FACTORS:
- Recent lifestyle change: new desk job with prolonged
  screen exposure
- Caffeine intake: ~3 cups coffee/day
- Cervical stiffness (neck)

CURRENT MANAGEMENT:
- Ibuprofen: partial relief (inconsistent)

QUESTIONS FOR PROVIDER:
1. Could this be tension-type or cervicogenic headache?
2. Should I try ergonomic changes before medication?
3. Is my caffeine intake contributing?
\`\`\``,
    },
    {
      heading: "Step 3: Add Context Your Doctor Needs",
      body: `Follow up with additional details Claude might ask about:

\`\`\`
claude "Add that I wear glasses (prescription is 2 years old),
I have no history of migraines in my family, and I started
taking vitamin D supplements last month."
\`\`\`

Claude will integrate these into the appropriate sections and might flag the outdated glasses prescription as potentially relevant.`,
    },
    {
      heading: "Step 4: Print or Share",
      body: `Ask Claude to format it for printing:

\`\`\`
claude "Format this as a clean one-page letter I can print
and hand to my doctor at the appointment."
\`\`\`

**Why this works better than explaining verbally:**
- You won't forget details under appointment pressure
- Your doctor gets structured information they can scan quickly
- It saves appointment time for discussion, not information gathering
- You have a written record of what you reported`,
    },
  ],

  "budget-help": [
    {
      heading: "What You'll Build",
      body: `A personal monthly budget spreadsheet with categories, formulas, and tracking — created entirely through conversation with Claude. Export to Excel or Google Sheets. No spreadsheet knowledge required.`,
    },
    {
      heading: "Step 1: Tell Claude About Your Finances",
      body: `Be honest about your income and spending patterns:

\`\`\`
claude "Help me create a monthly budget. I make $4,500/month
after taxes. My fixed expenses are rent ($1,400), car payment
($350), insurance ($180), phone ($85). I probably spend too
much on eating out and subscriptions but I'm not sure how much."
\`\`\`

Claude will ask follow-up questions about variable expenses you might not think of (gas, groceries, pet costs, etc.).`,
    },
    {
      heading: "Step 2: Generate the Spreadsheet",
      body: `Once Claude understands your situation, ask for a structured budget:

\`\`\`
claude "Create a CSV file I can open in Google Sheets.
Include categories, budgeted amount, actual amount column,
and difference. Use the 50/30/20 rule as a guideline."
\`\`\`

Claude generates a file you can open directly:

\`\`\`csv
Category,Type,Budgeted,Actual,Difference
Rent,Need,$1400,,=C2-D2
Car Payment,Need,$350,,=C3-D3
Car Insurance,Need,$180,,=C4-D4
Phone,Need,$85,,=C5-D5
Groceries,Need,$400,,=C6-D6
Gas/Transport,Need,$150,,=C7-D7
Dining Out,Want,$200,,=C8-D8
Subscriptions,Want,$50,,=C9-D9
Entertainment,Want,$150,,=C10-D10
Clothing,Want,$75,,=C11-D11
Savings,Save,$500,,=C12-D12
Emergency Fund,Save,$200,,=C13-D13
\`\`\`

The 50/30/20 split: 50% needs, 30% wants, 20% savings.`,
    },
    {
      heading: "Step 3: Find Hidden Spending",
      body: `The hardest part of budgeting is finding where money leaks:

\`\`\`
claude "I just checked and I'm paying for: Netflix ($15),
Spotify ($11), iCloud ($3), gym ($45), NYT ($17), some app
called Headspace ($13), and I think there's an old Hulu
subscription. Help me audit these."
\`\`\`

Claude will total your subscriptions ($104+/month = $1,248/year), suggest which to cut, and update your budget.`,
    },
    {
      heading: "Step 4: Set Up Monthly Review",
      body: `Ask Claude to create a monthly check-in template:

\`\`\`
claude "Create a monthly review checklist I can follow on
the 1st of each month. Include: updating actual spending,
checking subscriptions, reviewing savings progress."
\`\`\`

**Key insight:** The budget isn't useful if you make it once and forget it. The monthly review habit is what makes budgeting actually work.`,
    },
  ],

  "photo-organize": [
    {
      heading: "What You'll Build",
      body: `An organized photo library using Claude's **photo-content-recognition-curation-expert** skill to describe, tag, and sort your photos. Works with any folder of images on your computer.`,
    },
    {
      heading: "Step 1: Install and Point to Your Photos",
      body: `First, install the skill and tell Claude where your photos are:

\`\`\`bash
claude install-skill photo-content-recognition-curation-expert
\`\`\`

Then start a session in your photos directory:

\`\`\`bash
cd ~/Pictures/Camera Roll 2024
claude "I have a folder of photos here. Help me organize them
into subfolders by content type (people, landscapes, food, etc.)
and suggest which ones to keep vs delete."
\`\`\``,
    },
    {
      heading: "Step 2: Let Claude Analyze Your Photos",
      body: `Claude will read images and describe what it sees:

\`\`\`
claude "Look at the first 20 photos and give me:
1. A one-line description of each
2. Suggested tags (people, place, event)
3. Quality assessment (keep, maybe, delete)
4. Which ones are duplicates or near-duplicates"
\`\`\`

Output looks like:
\`\`\`
IMG_3421.jpg — Sunset over ocean, golden hour, sharp
  Tags: landscape, sunset, beach
  Quality: KEEP (strong composition, good light)

IMG_3422.jpg — Same sunset, slightly tilted
  Tags: landscape, sunset, beach
  Quality: DELETE (duplicate of 3421, worse framing)

IMG_3423.jpg — Group selfie at restaurant, 4 people
  Tags: people, food, social
  Quality: KEEP (only group photo from this dinner)
\`\`\``,
    },
    {
      heading: "Step 3: Create Folder Structure",
      body: `Once Claude has analyzed your photos, ask it to organize:

\`\`\`
claude "Create subfolders and move the photos:
- People/ (portraits, group photos)
- Travel/ (landscapes, landmarks)
- Food/ (restaurant pics, cooking)
- Archive/ (duplicates, blurry shots I might want later)
- Delete/ (clear deletes — I'll review before removing)"
\`\`\`

Claude will generate the shell commands to move files:

\`\`\`bash
mkdir -p People Travel Food Archive Delete
mv IMG_3423.jpg IMG_3425.jpg IMG_3430.jpg People/
mv IMG_3421.jpg IMG_3426.jpg IMG_3428.jpg Travel/
mv IMG_3424.jpg IMG_3429.jpg Food/
mv IMG_3422.jpg IMG_3427.jpg Archive/
\`\`\``,
    },
    {
      heading: "Tips for Large Libraries",
      body: `**For libraries with hundreds or thousands of photos:**

- Process in batches of 20-50 at a time
- Ask Claude to create a spreadsheet log of all photos + tags
- Use the tagging data to search later: \`"Which photos have tag 'birthday'?"\`
- Consider creating a \`metadata.json\` file per folder for future reference

**Privacy note:** Claude processes images locally in your Claude Code session. Your photos are not uploaded to a server — they stay on your machine.`,
    },
  ],

  "first-agent-swarm": [
    {
      heading: "What You'll Build",
      body: `A 3-node agent swarm that takes a single goal, decomposes it into parallel tasks, runs specialist agents simultaneously, and merges their outputs into a coherent result. This is the foundational multi-agent pattern that everything else builds on.

**Prerequisites:**
- Claude Code installed and working
- Skills: \`orchestrator\`, \`recursive-synthesis\`, \`agent-creator\`
- Basic familiarity with the terminal`,
    },
    {
      heading: "Step 1: Understand the Pattern",
      body: `Every agent swarm follows the same three-phase pattern:

\`\`\`
           ┌──── Agent A ────┐
Goal → Decompose ──── Agent B ──── Merge → Result
           └──── Agent C ────┘
\`\`\`

1. **Decompose**: Break the goal into independent subtasks
2. **Parallelize**: Run specialist agents on each subtask simultaneously
3. **Merge**: Synthesize all outputs into a single result

The \`orchestrator\` skill handles phases 1 and 3. You configure the specialist agents for phase 2.`,
    },
    {
      heading: "Step 2: Set Up the Orchestrator",
      body: `Install the required skills:

\`\`\`bash
claude install-skill orchestrator
claude install-skill recursive-synthesis
claude install-skill agent-creator
\`\`\`

Now create a simple orchestration config. Create a file called \`swarm-config.md\`:

\`\`\`markdown
# Agent Swarm: Code Review

## Goal
Review the pull request in this repository for quality, security, and test coverage.

## Agents
1. **security-auditor** — Check for vulnerabilities (injection, auth bypass, etc.)
2. **code-architecture** — Evaluate design patterns and maintainability
3. **vitest-testing-patterns** — Assess test coverage and suggest missing tests

## Merge Strategy
Combine all findings into a single review document with sections per agent.
Highlight conflicts between agent recommendations.
\`\`\``,
    },
    {
      heading: "Step 3: Run the Swarm",
      body: `Invoke the orchestrator with your config:

\`\`\`bash
claude "Using the orchestrator skill, run a parallel agent swarm
as defined in swarm-config.md against this repository.
Use the Task tool to launch each agent in parallel."
\`\`\`

Claude's orchestrator will:

1. Parse your config and identify the 3 agents
2. Launch them as parallel subagents using the Task tool:

\`\`\`typescript
// What the orchestrator does internally:
// (you don't write this — the skill handles it)

// Agent 1: Security audit (runs in parallel)
Task({ subagent_type: "guardian", prompt: "Audit for vulnerabilities..." })

// Agent 2: Architecture review (runs in parallel)
Task({ subagent_type: "auditor", prompt: "Review code architecture..." })

// Agent 3: Test coverage (runs in parallel)
Task({ subagent_type: "general-purpose", prompt: "Assess test coverage..." })
\`\`\`

3. Wait for all three to complete
4. Merge their outputs using \`recursive-synthesis\``,
    },
    {
      heading: "Step 4: Understanding the Output",
      body: `The merged output combines all three agents' findings:

\`\`\`markdown
# Parallel PR Review — Merged Report

## Security (via security-auditor)
- ⚠️ SQL injection risk in \`src/api/users.ts:47\`
- ✅ Auth middleware properly validates JWT tokens
- ⚠️ Missing rate limiting on /api/login endpoint

## Architecture (via code-architecture)
- ✅ Clean separation of concerns
- ⚠️ UserService is doing too much — consider splitting
- ❌ Direct database calls in route handlers (use repository pattern)

## Test Coverage (via vitest-testing-patterns)
- Coverage: 62% (target: 80%)
- Missing: No tests for error paths in UserService
- Missing: No integration tests for auth flow
- Suggestion: Add parametrized tests for input validation

## Conflicts & Cross-Cutting Concerns
- Architecture recommends splitting UserService, but current
  tests are coupled to its interface — split will require
  test rewrites
- Security finding on users.ts overlaps with architecture
  recommendation for repository pattern — fixing one fixes both
\`\`\`

The last section is the key value-add — the orchestrator identifies where agent recommendations interact.`,
    },
    {
      heading: "Step 5: Customizing Your Swarm",
      body: `Now that you have the basic pattern, customize it:

**Change the agents:**
\`\`\`
claude "Replace the test agent with typescript-advanced-patterns
and add a performance-profiling agent as a 4th parallel node."
\`\`\`

**Change the merge strategy:**
\`\`\`
claude "Instead of a document, merge the outputs into a
GitHub PR comment with checkboxes for each finding."
\`\`\`

**Add a quality gate:**
\`\`\`
claude "After the merge, run a final pass that scores the PR
as APPROVE, REQUEST_CHANGES, or NEEDS_DISCUSSION based on
the severity of findings."
\`\`\`

This is the foundation for every multi-agent system. Master this 3-node pattern and you can scale to any number of specialist agents.`,
    },
  ],

  "adhd-os": [
    {
      heading: "What You'll Build",
      body: `A personal productivity system designed for ADHD brains that:
- Generates your day plan every morning via a cron-triggered agent
- Breaks tasks into time-boxed chunks (no vague "work on project" items)
- Tracks streaks with forgiveness (missing a day doesn't reset to zero)
- Stores memory across sessions so Claude remembers your patterns

**Prerequisites:**
- Claude Code with \`adhd-daily-planner\`, \`background-job-orchestrator\`, \`wisdom-accountability-coach\` skills
- cron or launchd for scheduling (macOS/Linux)
- 90 minutes for setup`,
    },
    {
      heading: "Step 1: Configure the Daily Planner",
      body: `The \`adhd-daily-planner\` skill is designed for time-blind brains. Install it:

\`\`\`bash
claude install-skill adhd-daily-planner
claude install-skill background-job-orchestrator
claude install-skill wisdom-accountability-coach
\`\`\`

Create your personal config at \`~/.adhd-os/config.md\`:

\`\`\`markdown
# ADHD-OS Personal Config

## My Constraints
- I can focus for ~25 minutes before needing a break
- Mornings (8-11am) are my peak focus time
- I tend to skip lunch when hyperfocusing
- I have 3 standing meetings per week (Mon/Wed/Fri 2pm)

## Task Sources
- GitHub issues assigned to me
- ~/TODO.md (my running task list)
- Calendar events (already blocked)

## Rules
- Never schedule more than 3 deep-focus blocks per day
- Always include a lunch reminder at 12:30pm
- End-of-day review at 5pm (5 min, non-negotiable)
- Saturday and Sunday: no work tasks, only personal
\`\`\``,
    },
    {
      heading: "Step 2: Create the Morning Agent Script",
      body: `Create \`~/.adhd-os/morning-plan.sh\`:

\`\`\`bash
#!/bin/bash
# ADHD-OS Morning Planning Agent
# Runs daily at 7:45 AM via cron

DATE=$(date +%Y-%m-%d)
LOG_DIR=~/.adhd-os/logs
PLAN_DIR=~/.adhd-os/plans
mkdir -p "$LOG_DIR" "$PLAN_DIR"

# Run Claude with the daily planner skill
claude --skill adhd-daily-planner \\
  --print \\
  "Generate my day plan for $DATE. \\
   Read my config at ~/.adhd-os/config.md. \\
   Check my TODO.md for pending tasks. \\
   Check yesterday's plan at $PLAN_DIR/$(date -v-1d +%Y-%m-%d).md \\
   for anything I didn't finish. \\
   Output as markdown." \\
  > "$PLAN_DIR/$DATE.md" 2>"$LOG_DIR/$DATE.log"

# macOS: show notification
osascript -e "display notification \\"Your day plan is ready\\" with title \\"ADHD-OS\\""
\`\`\`

Make it executable:
\`\`\`bash
chmod +x ~/.adhd-os/morning-plan.sh
\`\`\``,
    },
    {
      heading: "Step 3: Set Up the Cron Job",
      body: `Schedule it to run every morning:

\`\`\`bash
# Open crontab editor
crontab -e

# Add this line (runs at 7:45 AM every day):
45 7 * * * ~/.adhd-os/morning-plan.sh
\`\`\`

On macOS, you might prefer launchd. Create \`~/Library/LaunchAgents/com.adhd-os.morning.plist\`:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.adhd-os.morning</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>~/.adhd-os/morning-plan.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key><integer>7</integer>
    <key>Minute</key><integer>45</integer>
  </dict>
</dict>
</plist>
\`\`\`

Load it: \`launchctl load ~/Library/LaunchAgents/com.adhd-os.morning.plist\``,
    },
    {
      heading: "Step 4: Streak Tracking with Forgiveness",
      body: `The \`wisdom-accountability-coach\` skill tracks your habits but never punishes:

\`\`\`bash
claude "Using wisdom-accountability-coach, create a streak
tracker at ~/.adhd-os/streaks.json. Track:
- morning-plan-reviewed (did I look at today's plan?)
- lunch-eaten (did I eat lunch before 1:30pm?)
- end-of-day-review (did I do the 5-min review?)

Rules:
- Missing 1 day keeps the streak (life happens)
- Missing 2 consecutive days pauses the streak (not resets)
- Show percentage over last 30 days, not absolute streak count
- Never use shame language in reports"
\`\`\`

The streaks file:
\`\`\`json
{
  "morning-plan-reviewed": {
    "last_30_days": 26,
    "percentage": 87,
    "current_streak": 5,
    "best_streak": 14,
    "status": "active"
  }
}
\`\`\`

**Why percentages > streaks for ADHD:** A broken streak triggers rejection sensitivity. "87% this month" feels like a win. "Streak broken: 0 days" feels like failure.`,
    },
    {
      heading: "Step 5: The End-of-Day Review",
      body: `Create \`~/.adhd-os/eod-review.sh\`:

\`\`\`bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
PLAN=~/.adhd-os/plans/$DATE.md

claude "It's end of day. Read my plan at $PLAN.
For each task, ask me: done, partial, or skipped.
Update streaks.json.
Write a 3-line summary to ~/.adhd-os/logs/$DATE-review.md.
If anything was skipped, move it to tomorrow (don't judge)."
\`\`\`

This 5-minute ritual closes the loop. The planner learns from your patterns — if you consistently skip afternoon tasks, it'll start scheduling fewer of them.`,
    },
  ],

  "pr-review-swarm": [
    {
      heading: "What You'll Build",
      body: `A parallel PR review pipeline where 4 specialist agents analyze your code simultaneously. Each agent focuses on one dimension of quality, then their findings merge into a single comprehensive review.

**Agents used:**
- \`security-auditor\` — vulnerabilities and auth issues
- \`code-architecture\` — design patterns and SOLID principles
- \`vitest-testing-patterns\` — test coverage gaps
- \`typescript-advanced-patterns\` — type safety and TS best practices`,
    },
    {
      heading: "Step 1: Set Up the Review Script",
      body: `Create a reusable review script at \`scripts/pr-review.sh\`:

\`\`\`bash
#!/bin/bash
# Parallel PR Review — runs 4 agents simultaneously
# Usage: ./scripts/pr-review.sh [base-branch]

BASE=\${1:-main}
DIFF=$(git diff "$BASE"...HEAD --name-only)

echo "Reviewing changes against $BASE:"
echo "$DIFF"
echo "---"

claude "I need a thorough PR review of this branch against $BASE.

The changed files are:
$DIFF

Run these 4 agents IN PARALLEL using the Task tool:

1. Task(subagent_type='guardian', prompt='Security audit of the
   diff between $BASE and HEAD. Check for injection, auth bypass,
   secrets in code, and OWASP top 10.')

2. Task(subagent_type='auditor', prompt='Architecture review of
   the diff. Check SOLID principles, coupling, and suggest any
   refactoring.')

3. Task(subagent_type='general-purpose', prompt='Using vitest-testing-patterns,
   identify missing test cases for the changed code. Show example
   test code for each gap.')

4. Task(subagent_type='general-purpose', prompt='Using typescript-advanced-patterns,
   review type safety. Find any uses of \`any\`, missing generics,
   or type assertions that could be eliminated.')

After ALL 4 complete, merge into a structured review with:
- Critical (must fix before merge)
- Warnings (should fix)
- Suggestions (nice to have)
- One-line verdict: APPROVE / REQUEST_CHANGES / DISCUSS"
\`\`\``,
    },
    {
      heading: "Step 2: Understanding Parallel Execution",
      body: `When Claude launches 4 Task agents in parallel, here's what happens:

\`\`\`
Time ──────────────────────────────────>

Agent 1 (Security):     ████████████░░░░░  (12s)
Agent 2 (Architecture): ████████░░░░░░░░░  (8s)
Agent 3 (Tests):        ████████████████░  (16s)
Agent 4 (TypeScript):   ██████████░░░░░░░  (10s)
                                      ▲
                                      │
Merge starts when ALL finish ─────────┘
\`\`\`

Total time ≈ max(individual times), not sum. A 4-agent review that would take 46 seconds sequentially completes in ~16 seconds parallel.

**Key insight:** Each agent gets its own context window. They don't interfere with each other. The orchestrator waits for all to finish, then merges.`,
    },
    {
      heading: "Step 3: Interpreting the Merged Output",
      body: `The merged review looks like this:

\`\`\`markdown
# PR Review: feature/user-dashboard

## Critical (Must Fix)
1. **[Security]** SQL injection in \`src/api/users.ts:47\`
   - Raw string interpolation in query
   - Fix: Use parameterized queries

2. **[TypeScript]** \`any\` type on API response in \`src/hooks/useUser.ts:23\`
   - Loses type safety for entire downstream chain
   - Fix: Define \`UserResponse\` interface

## Warnings (Should Fix)
3. **[Architecture]** UserService (340 lines) violates SRP
   - Handles auth, profile, AND notification logic
   - Fix: Extract NotificationService

4. **[Tests]** No error path tests for \`updateProfile()\`
   - Happy path covered, but 0/4 error cases tested
   \`\`\`typescript
   // Suggested test:
   it('rejects invalid email format', async () => {
     await expect(updateProfile({ email: 'not-an-email' }))
       .rejects.toThrow('Invalid email');
   });
   \`\`\`

## Suggestions (Nice to Have)
5. **[TypeScript]** Could use discriminated union for API states
6. **[Architecture]** Consider adding JSDoc to public methods

## Verdict: REQUEST_CHANGES
2 critical issues must be resolved before merge.
\`\`\``,
    },
    {
      heading: "Step 4: Integrate with GitHub",
      body: `Post the review as a PR comment automatically:

\`\`\`bash
#!/bin/bash
# Post review to GitHub PR
PR_NUMBER=$(gh pr view --json number -q '.number')
REVIEW=$(claude --print "Run pr-review.sh against main")

gh pr comment "$PR_NUMBER" --body "$REVIEW"
\`\`\`

Or use it as a GitHub Action:

\`\`\`yaml
# .github/workflows/pr-review.yml
name: AI PR Review
on: pull_request

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run parallel review
        run: ./scripts/pr-review.sh \${{ github.event.pull_request.base.ref }}
\`\`\`

**Pro tip:** Start with the review as a PR comment. Once you trust it, upgrade to a required check that blocks merge on critical findings.`,
    },
  ],

  "skill-composition": [
    {
      heading: "What You'll Build",
      body: `You'll learn how to chain skills as sub-agents, pass structured outputs between them, and build higher-order tools from existing primitives. This is how you go from "I have 200 skills" to "I have a composable toolkit."

**Core concept:** Skills are functions. Composition is calling one skill's output as another skill's input. The \`recursive-synthesis\` skill demonstrates this at its most extreme — it chains skills recursively until a quality threshold is met.`,
    },
    {
      heading: "Step 1: The Simplest Composition",
      body: `Two skills, sequential. Output of one feeds the other:

\`\`\`bash
claude "First, use the research-analyst skill to research
the latest Next.js 15 features and produce a structured summary.

Then, take that summary and use the technical-writer skill
to turn it into a blog post with code examples."
\`\`\`

This is **serial composition**: research → writing. The key insight is that Claude passes the structured output of the first skill directly to the second, maintaining context.

\`\`\`
research-analyst          technical-writer
    │                         │
    ├── Structured findings    │
    ├── Key features list  ──→ ├── Blog post with examples
    ├── Code snippets          ├── Correct technical details
    └── Source links           └── Natural narrative flow
\`\`\``,
    },
    {
      heading: "Step 2: Parallel Composition with Fan-Out",
      body: `Run multiple skills on the same input simultaneously:

\`\`\`bash
claude "I have a component at src/components/Dashboard.tsx.
Run these skills IN PARALLEL using Task:

1. react-performance-optimizer — Find render performance issues
2. design-accessibility-auditor — Check WCAG compliance
3. typescript-advanced-patterns — Improve type safety

Each should produce a structured list of findings.
After all complete, merge into a prioritized action list."
\`\`\`

This is **fan-out composition**: one input → multiple specialists → merged output.

\`\`\`
                ┌── performance-optimizer ──┐
Dashboard.tsx ──┼── accessibility-auditor ──┼── Merged priority list
                └── typescript-patterns ────┘
\`\`\``,
    },
    {
      heading: "Step 3: Conditional Composition",
      body: `Choose which skill to invoke based on runtime analysis:

\`\`\`bash
claude "Analyze this codebase and decide which of these skills
would be most valuable to run:

- If there are security concerns → security-auditor
- If test coverage is below 70% → test-automation-expert
- If there are performance hotspots → performance-profiling
- If the architecture is tangled → refactoring-surgeon

Run ONLY the relevant ones. Skip any that aren't needed.
Explain why you chose or skipped each."
\`\`\`

This is **conditional composition**: the orchestrator examines the input and routes to the appropriate specialists. Not every skill runs every time.`,
    },
    {
      heading: "Step 4: Recursive Composition",
      body: `The most powerful pattern — a skill that calls itself until quality converges:

\`\`\`bash
claude "Using recursive-synthesis, improve this API design
document iteratively:

Round 1: research-analyst reviews for completeness
Round 2: api-architect reviews for design quality
Round 3: security-auditor reviews for auth/authz gaps
Round 4: technical-writer polishes the prose

After each round, integrate the feedback and re-evaluate.
Stop when all reviewers score > 8/10 or after 3 iterations,
whichever comes first."
\`\`\`

The recursive pattern:
\`\`\`
Draft v1 → [Review cycle] → Draft v2 → [Review cycle] → Draft v3
             │                            │
             ├── Score: 6/10              ├── Score: 9/10
             └── Continue                 └── STOP (threshold met)
\`\`\`

**Warning:** Recursive composition can be expensive. Each iteration runs multiple agents. Set hard iteration limits and quality thresholds to prevent runaway costs.`,
    },
    {
      heading: "Step 5: Building Your Own Composite Skill",
      body: `Once you've found a composition pattern that works, crystallize it into a new skill:

\`\`\`bash
claude "Using skill-architect, create a new skill called
'full-stack-review' that composes these existing skills:

1. security-auditor (parallel)
2. code-architecture (parallel)
3. typescript-advanced-patterns (parallel)
4. vitest-testing-patterns (parallel)
5. recursive-synthesis (merges all outputs)

The skill should:
- Accept a file path or PR number as input
- Run all 4 reviewers in parallel
- Merge findings into severity-ranked list
- Output a single structured review document"
\`\`\`

The \`skill-architect\` will generate a \`SKILL.md\` that encodes this composition pattern. Now you can invoke it with a single command instead of orchestrating 5 skills manually.

**This is the power of composition:** You start with 200 individual skills. Through composition, you build higher-order tools that encode your team's specific workflows.`,
    },
  ],

  "self-healing-cron": [
    {
      heading: "What You'll Build",
      body: `A cron job system that:
- Detects its own failures via structured logging
- Attempts auto-repair for known failure patterns
- Escalates to you with a diagnosis when it can't self-heal
- Uses the \`site-reliability-engineer\` skill for on-call playbook generation

**This is SRE-in-a-box for your personal infrastructure.**`,
    },
    {
      heading: "Step 1: Structured Logging Foundation",
      body: `Every self-healing system starts with structured logs. Create \`lib/job-logger.ts\`:

\`\`\`typescript
import { writeFileSync, appendFileSync } from 'fs';

interface JobLog {
  timestamp: string;
  job_id: string;
  status: 'started' | 'success' | 'failed' | 'retrying' | 'escalated';
  duration_ms?: number;
  error?: string;
  error_class?: string;
  retry_count?: number;
  auto_healed?: boolean;
}

export function logJob(entry: JobLog) {
  const line = JSON.stringify(entry) + '\\n';
  appendFileSync(
    \`~/.jobs/logs/\${entry.job_id}.jsonl\`,
    line
  );

  if (entry.status === 'failed' || entry.status === 'escalated') {
    // Also write to the alert log
    appendFileSync('~/.jobs/logs/alerts.jsonl', line);
  }
}
\`\`\`

**Why JSONL?** Each line is a complete JSON object. You can \`grep\`, \`jq\`, and parse without loading the entire file. Claude can read it too.`,
    },
    {
      heading: "Step 2: The Self-Healing Wrapper",
      body: `Create a wrapper that runs any job with auto-recovery. \`lib/resilient-job.sh\`:

\`\`\`bash
#!/bin/bash
# Resilient Job Wrapper
# Usage: resilient-job.sh <job-name> <command>

JOB_NAME=$1
shift
COMMAND="$@"
MAX_RETRIES=3
RETRY_COUNT=0
LOG_DIR=~/.jobs/logs

mkdir -p "$LOG_DIR"

log_event() {
  echo "{\\"timestamp\\":\\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\\",\\"job_id\\":\\"$JOB_NAME\\",\\"status\\":\\"$1\\",\\"retry_count\\":$RETRY_COUNT,\\"error\\":\\"$2\\"}" >> "$LOG_DIR/$JOB_NAME.jsonl"
}

run_job() {
  log_event "started" ""
  START=$(date +%s%N)

  OUTPUT=$($COMMAND 2>&1)
  EXIT_CODE=$?

  DURATION=$(( ($(date +%s%N) - START) / 1000000 ))

  if [ $EXIT_CODE -eq 0 ]; then
    log_event "success" ""
    return 0
  else
    log_event "failed" "$OUTPUT"
    return $EXIT_CODE
  fi
}

# Main loop: try, diagnose, retry
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  run_job && exit 0

  RETRY_COUNT=$((RETRY_COUNT + 1))

  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    # Ask Claude to diagnose and attempt repair
    log_event "retrying" "Attempting auto-heal"

    DIAGNOSIS=$(claude --print "A cron job failed.
      Job: $JOB_NAME
      Error output: $OUTPUT
      Retry: $RETRY_COUNT of $MAX_RETRIES

      Using logging-observability skill, diagnose the failure.
      If it's a known pattern (network timeout, disk full,
      stale lock file), fix it and respond with HEALED.
      Otherwise respond with ESCALATE.")

    if echo "$DIAGNOSIS" | grep -q "HEALED"; then
      log_event "retrying" "Auto-healed, retrying"
      sleep 5
    else
      break
    fi
  fi
done

# All retries exhausted — escalate
log_event "escalated" "Max retries reached"
claude --print "Using site-reliability-engineer skill, generate
an incident report for job $JOB_NAME. Include:
- Timeline from $LOG_DIR/$JOB_NAME.jsonl
- Root cause analysis
- Recommended fix
Send a macOS notification."

osascript -e "display notification \\"Job $JOB_NAME failed after $MAX_RETRIES retries\\" with title \\"ALERT: Job Failed\\""
\`\`\``,
    },
    {
      heading: "Step 3: Common Auto-Heal Patterns",
      body: `The diagnosis step handles known failure classes:

\`\`\`
Failure Pattern          │ Auto-Heal Action
─────────────────────────┼─────────────────────────
Network timeout          │ Wait 30s, retry
Stale lock file          │ Check PID, remove if dead
Disk full                │ Clean /tmp, remove old logs
Port in use              │ Kill stale process
Auth token expired       │ Refresh token
Rate limited             │ Exponential backoff
Database connection lost │ Reconnect with backoff
\`\`\`

Claude's \`logging-observability\` skill recognizes these patterns from the error output and applies the appropriate fix. If the error doesn't match a known pattern, it escalates immediately rather than wasting retries.`,
    },
    {
      heading: "Step 4: Wire It Into Your Cron Jobs",
      body: `Replace direct cron commands with the resilient wrapper:

\`\`\`bash
# Before (fragile):
0 */6 * * * /usr/local/bin/sync-data.sh

# After (self-healing):
0 */6 * * * ~/.jobs/resilient-job.sh "data-sync" /usr/local/bin/sync-data.sh

# Before (fragile):
0 2 * * * /usr/local/bin/backup-db.sh

# After (self-healing):
0 2 * * * ~/.jobs/resilient-job.sh "db-backup" /usr/local/bin/backup-db.sh
\`\`\`

Every job now gets:
- Structured logging (success/failure/timing)
- Up to 3 automatic retry attempts with AI diagnosis
- Auto-healing for known failure patterns
- Escalation with incident reports for unknown failures`,
    },
    {
      heading: "Step 5: The Weekly SRE Report",
      body: `Create a weekly summary job:

\`\`\`bash
# Every Sunday at 9 AM
0 9 * * 0 claude --print "Using site-reliability-engineer skill,
  analyze all logs in ~/.jobs/logs/ from the past 7 days.
  Produce a weekly reliability report:

  - Total jobs run / succeeded / failed
  - Auto-healed vs escalated ratio
  - Trending failure patterns (increasing?)
  - Recommendations for reliability improvements

  Write to ~/.jobs/reports/week-\$(date +%Y-W%U).md"
\`\`\`

Over time, this builds a reliability history that shows whether your infrastructure is getting more or less stable. The SRE skill will notice patterns like "backup job fails every time disk usage exceeds 85%" and recommend proactive fixes.`,
    },
  ],
};
