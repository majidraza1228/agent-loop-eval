# Quick Start: New Agent Project Template

This template gets you started with Agent Loop Evaluator + Metrics from Day 1.

## 🚀 5-Minute Setup

```bash
# 1. Create your project
mkdir my-agent-project && cd my-agent-project
git init

# 2. Copy extensions (see setup below)
mkdir -p .github/extensions/agent-loop-eval
mkdir -p .github/extensions/agent-metrics-dashboard

# 3. Copy extension files (see SETUP.md or use curl)

# 4. Create first agent
echo "your agent logic" > agents/search.md

# 5. Test with canvas
copilot -i "your first task"
# Then: open_canvas({ canvasId: "agent-loop-eval" })
```

---

## 📋 Project Structure

```
my-agent-project/
├── .github/
│   └── extensions/
│       ├── agent-loop-eval/          ← Visual loop debugger
│       │   ├── extension.mjs
│       │   └── config.json
│       └── agent-metrics-dashboard/  ← Performance tracking
│           └── extension.mjs
├── agents/
│   ├── search.md                      ← Agent prompts
│   ├── analyze.md
│   └── report.md
├── tasks/
│   ├── test-search.txt                ← Test cases
│   ├── test-analyze.txt
│   └── test-report.txt
├── README.md
├── ARCHITECTURE.md                    ← Design docs
└── package.json
```

---

## 🎯 Day-by-Day Workflow

### **Day 1: Build + Test First Agent**

```bash
# 1. Write agent prompt
cat > agents/search.md << 'EOF'
You are a code search expert.
- Task: Search repository for specific patterns
- Output: List of matching files with line numbers
- Budget: 5 turns max
EOF

# 2. Test with metrics enabled
copilot -i "Find all Python files with 'decorator' keyword"

# 3. Open canvas to watch
open_canvas({ canvasId: "agent-loop-eval", input: { budgetLimit: 5 } })

# 4. Check verdict
# Expected: PASS (10/10), 3-4 turns

# 5. Metrics auto-recorded
# View: open_canvas({ canvasId: "agent-metrics-dashboard" })
```

**Day 1 Checkpoint:** ✅ 1 agent, baseline established

---

### **Day 2-3: Build More Agents**

```bash
# Agent 2: Code Analysis
cat > agents/analyze.md << 'EOF'
You are a code quality analyzer.
- Task: Analyze code quality metrics
- Output: Score (0-100), top 3 issues
EOF

# Agent 3: Report Generation
cat > agents/report.md << 'EOF'
You are a technical writer.
- Task: Generate analysis report
- Output: Markdown formatted report
EOF

# Test all 3
for agent in search analyze report; do
  echo "Testing $agent..."
  copilot -i "test-$agent task"
  # Watch canvas for each
done
```

**Day 2-3 Checkpoint:**
```
Dashboard shows:
- Agent 1 (search):  3 turns, PASS ✅
- Agent 2 (analyze): 8 turns, REVIEW ⚠️
- Agent 3 (report):  10 turns, FAIL ❌
```

---

### **Day 4-5: Optimize Weak Agents**

```bash
# Agent 2 needs work (8 turns)
# Before optimization: 8 turns, REVIEW (6/10)

# Fix: Add examples + pre-filter
cat > agents/analyze.md << 'EOF'
You are a code quality analyzer.

Example input:
  function getData() {
    // Missing error handling
    return fetch(url);
  }

Expected output:
  Score: 45/100
  Issues:
  1. Missing error handling (line 3)
  2. No input validation (line 1)
  3. No timeout handling (line 3)

- Task: Analyze ONLY these files: src/api/*.js, src/auth/*.js
- Budget: 5 turns
EOF

# Re-test
copilot -i "test-analyze task"
# Canvas shows: 5 turns (was 8), PASS (10/10) ✅

# Same for Agent 3
```

**Day 4-5 Checkpoint:**
```
Dashboard shows improvement:
- Agent 1 (search):  3 turns, PASS ✅
- Agent 2 (analyze): 5 turns, PASS ✅ (was 8, REVIEW)
- Agent 3 (report):  6 turns, PASS ✅ (was 10, FAIL)

Team avg: 4.7 turns (was 7)
Pass rate: 100% (was 33%)
Cost per run: $0.24 (was $0.35)
```

---

## 🔗 Key Files to Copy

### 1. **Agent Loop Evaluator** (12.6 KB)
Paste into `.github/extensions/agent-loop-eval/extension.mjs`
- Tracks turns, tools, errors
- Gives verdict (PASS/FAIL/REVIEW)
- Budget enforcement

### 2. **Metrics Dashboard** (14.5 KB)
Paste into `.github/extensions/agent-metrics-dashboard/extension.mjs`
- Charts: turn trends, pass rates, scores
- KPIs: avg turns, pass rate, cost/month
- Table: recent runs

### 3. **Config** (450 bytes)
Paste into `.github/extensions/agent-loop-eval/config.json`
```json
{
  "budgetLimit": 15,
  "settings": {
    "turnBudget": { "value": 15, "min": 1, "max": 100 }
  }
}
```

---

## 💡 Example Prompts (Copy & Adapt)

### **Search Agent**
```markdown
You are a repository search expert.

Task: Find and list specific code patterns.
- Only search provided file paths
- Return: filename, line number, matched text
- Stop after finding 10 results
- Budget: 5 turns max

Example:
Input: "Find @cached decorators in src/"
Output:
  src/api/users.py:12 - @cached(ttl=300)
  src/api/posts.py:45 - @cached(ttl=600)
  ...
```

### **Analysis Agent**
```markdown
You are a code quality analyzer.

Task: Score code on quality metrics.
- Analyze ONLY these files: [specific list]
- Score 0-100 based on:
  * Error handling (20%)
  * Documentation (20%)
  * Code style (20%)
  * Performance (20%)
  * Security (20%)
- Return: JSON with scores
- Budget: 6 turns max

Example output:
{
  "score": 72,
  "issues": [
    "Missing error handling in getUserData()",
    "No input validation on API endpoints"
  ]
}
```

### **Report Agent**
```markdown
You are a technical writer.

Task: Generate a status report.
- Input: Analysis data (JSON)
- Output: Professional Markdown report
- Include: Summary, Key Metrics, Issues, Recommendations
- Keep to 1 page
- Budget: 4 turns max

Format:
# Code Quality Report
## Summary
[1 sentence]

## Metrics
- Overall Score: X/100
- Lines: Y
- Issues: Z

## Top Issues
1. [issue]
2. [issue]
```

---

## 🎯 Success Metrics for NEW Projects

### **Week 1 Target**
- [ ] 3+ agents built
- [ ] All agents PASS verdict (10/10)
- [ ] Avg 5 turns per agent
- [ ] Zero tool errors

### **Week 2 Target**
- [ ] 5+ agents
- [ ] 100% pass rate
- [ ] Avg 4 turns per agent (20% reduction)
- [ ] Cost estimate < $0.20/task

### **Month 1 Target**
- [ ] 10+ production agents
- [ ] 98%+ pass rate
- [ ] Avg 3 turns per agent
- [ ] Optimized prompts in repo
- [ ] CI/CD testing on every PR

---

## 🚀 From Development → Production

### **When You're Ready to Deploy**

```bash
# 1. Ensure all agents PASS consistently
open_canvas({ canvasId: "agent-metrics-dashboard" })
# Check: pass_rate = 95%+, avg_score = 9+

# 2. Freeze agent prompts
git tag v1.0-agents-stable

# 3. Set up CI/CD (see DEPLOYMENT.md)
cat > .github/workflows/agent-test.yml << 'EOF'
name: Agent Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test agents
        run: |
          for task in $(cat .github/agent-tasks.txt); do
            result=$(copilot -i "$task")
            verdict=$(echo "$result" | grep PASS)
            [ -n "$verdict" ] || exit 1
          done
EOF

# 4. Deploy with confidence
git push origin main
# Agents automatically tested on every PR
```

---

## 📚 Helpful Resources

- `DEVELOPER-GUIDE.md` - How developers use canvas
- `TEAM-METRICS-GUIDE.md` - Detailed metrics tracking
- `REAL-TASKS.md` - 5 production test scenarios
- `DEPLOYMENT.md` - CI/CD setup

---

## ❓ Common Questions for NEW Projects

**Q: Do I need the metrics dashboard from Day 1?**
A: Yes! It costs nothing and shows progress. You'll see trends over days/weeks.

**Q: What's a realistic turn count?**
A: Simple tasks: 2-3 turns. Complex: 5-7 turns. Budget: never exceed 10.

**Q: How do I know if my agent is good?**
A: PASS verdict (10/10) + turn count ≤ budget.

**Q: Can I share metrics with my team?**
A: Yes! Metrics stored in `~/.copilot/metrics/agent-metrics.json`. Commit to repo or upload to shared drive.

**Q: Should I optimize every agent?**
A: No. Only optimize agents that: (1) fail often, or (2) exceed budget, or (3) are production critical.

---

## ✅ Next Steps

1. **Create your project** with `.github/extensions/` structure
2. **Copy extension files** from reference repo
3. **Write first agent prompt** (copy examples above)
4. **Test with canvas open** (`open_canvas(...)`)
5. **Watch metrics accumulate** (dashboard updates live)
6. **Optimize based on verdicts** (PASS/FAIL guidance)

**You're ready to build! 🚀**
