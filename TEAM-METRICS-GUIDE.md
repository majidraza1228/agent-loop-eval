# Agent Metrics Tracking Guide for Teams

This guide shows teams how to use the **Agent Loop Evaluator** and **Metrics Dashboard** to measure, optimize, and scale agent performance.

---

## 🎯 Phase 1: Baseline Measurement (Week 1)

### Goal: Understand current agent performance

1. **Run 5-10 representative agent tasks**
   ```bash
   copilot -i "Search repo for TODOs"
   # Open: open_canvas({ canvasId: "agent-loop-eval" })
   
   copilot -i "Analyze code quality"
   # Watch the canvas, record: turns, verdict, score
   ```

2. **Let metrics accumulate** (~5 runs)
   - Each run auto-records to `~/.copilot/metrics/agent-metrics.json`
   - No manual logging needed

3. **View baseline dashboard**
   ```bash
   open_canvas({ canvasId: "agent-metrics-dashboard" })
   ```
   You should see:
   - Avg turns: ~6-8 (typical)
   - Pass rate: 80-100%
   - Avg score: ~8/10

---

## 🔧 Phase 2: Optimization (Week 2-3)

### Goal: Reduce turns & improve scores

**Metrics to track:**
| Metric | Baseline | Target | Savings |
|--------|----------|--------|---------|
| Avg Turns | 8 | 5 | 37.5% cost reduction |
| Pass Rate | 80% | 95%+ | More reliable |
| Avg Score | 8/10 | 10/10 | Production ready |

**Optimization techniques:**

1. **Improve system prompt**
   - Add examples to reduce clarification questions
   - Be explicit about expected output format
   - Re-run: watch turns decrease

2. **Better tool selection**
   - Provide file lists upfront (skip discovery)
   - Pre-filter data (reduce scans)
   - Re-run: watch turns decrease

3. **Context management**
   - Add constraints ("max 500 chars", "only active files")
   - Use budget limits aggressively (budgetLimit: 5)
   - Fail fast on budget exceeded

**Workflow:**
```
↓
Baseline: 8 turns, 80% pass rate
↓
Tweak prompt (add examples)
↓
Re-run same task
↓
Dashboard shows: 6 turns, 90% pass rate ✅
↓
Commit optimized prompt
↓
Measure across team
```

---

## 📊 Phase 3: Team Rollout (Week 4+)

### Goal: Standardize across all agents

**Rollout checklist:**
- [ ] Add optimized prompts to codebase
- [ ] Share DEVELOPER-GUIDE.md with team
- [ ] Run "Agent Testing" CI/CD workflow on every PR
- [ ] Weekly metrics review (screenshot dashboard)
- [ ] Alert if pass rate drops below 80%

**CI/CD Integration:**
```yaml
# .github/workflows/agent-test.yml
name: Test Agents
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test agent loops
        run: |
          for task in $(cat .github/agent-tasks.txt); do
            result=$(copilot -i "$task")
            verdict=$(echo "$result" | grep -o 'PASS\|FAIL\|REVIEW')
            if [ "$verdict" != "PASS" ]; then
              echo "Agent task failed: $task ($verdict)"
              exit 1
            fi
          done
```

---

## 💡 Real Example: Search & Report Agent

### Before Optimization
```
Task: "Search repo for security issues, write report"

Canvas shows:
- Turn 1: Asks what kind of issues
- Turn 2: Asks what format for report
- Turn 3-5: Reads files inefficiently
- Turn 6-9: Tries different grep patterns
- Turn 10: Gives up, partial report

Metrics:
- Turns: 10
- Pass rate: 60% (incomplete)
- Score: 4/10 (FAIL)
- Cost: $0.50 per task × 100 tasks/month = $50/month
```

### Optimization Steps
1. **Add examples to prompt:**
   ```
   "Security issues: SQL injection, XSS, hardcoded secrets.
    Output format: # Issues Found\n- File: issue: severity"
   ```
   
2. **Provide file list upfront:**
   ```
   "Scan these files: src/api/*.js, src/auth/*.js"
   ```

3. **Use budget limits:**
   ```javascript
   open_canvas({
     canvasId: "agent-loop-eval",
     input: { budgetLimit: 5 }  // Force efficiency
   })
   ```

### After Optimization
```
Canvas shows:
- Turn 1: Searches specified files
- Turn 2: Parses results
- Turn 3: Formats report
- Turn 4: task_complete()

Metrics:
- Turns: 4 (60% reduction!)
- Pass rate: 100% ✅
- Score: 10/10 (PASS) ✅
- Cost: $0.20 per task × 100 tasks/month = $20/month

Savings: $30/month per agent × 5 agents = $150/month! 💰
```

---

## 📈 Metrics to Watch

### Per-Task Metrics
- **Turn Count:** Lower = cheaper. Alert if > baseline × 1.5
- **Pass Rate:** Higher = more reliable. Target: 95%+
- **Score:** 10/10 = production ready
- **Tool Errors:** Should be 0

### Team Metrics
- **Avg Turns:** Trend over time (should decrease)
- **Pass Rate:** Team average (target: 90%+)
- **Cost Trend:** $ per task (should decrease)
- **Efficiency:** Turns per task type

### Dashboard Snapshot Template
```markdown
## Agent Metrics - Week of [DATE]

| Metric | Last Week | This Week | Change |
|--------|-----------|-----------|--------|
| Avg Turns | 7.2 | 6.1 | ↓ 15% ✅ |
| Pass Rate | 85% | 92% | ↑ 7% ✅ |
| Avg Score | 7.8 | 9.2 | ↑ 1.4 ✅ |
| Est. Cost | $360 | $305 | ↓ $55 ✅ |

**Wins:** Search agent now 4 turns (was 8). Report generation 10/10.
**Next:** Fix analysis agent (6 turns, 80% pass) and data validation agent.
```

---

## 🚀 Scaling to Production

### Monthly Review (All Teams)
1. Pull latest metrics dashboard
2. Identify top 3 agents needing optimization
3. Assign optimization task for next sprint
4. Track cost savings

### Yearly Target
- 30-40% reduction in total API spend
- 95%+ pass rate across all agents
- 4-5 turns average per task

**Example ROI:**
- Current: 500 agent tasks/month × 7 turns × $0.05 = $1,750/month
- Optimized: 500 tasks/month × 4 turns × $0.05 = $1,000/month
- **Savings: $750/month = $9,000/year**

---

## 🔍 Debugging Failed Agents

When a task shows FAIL (0-5/10):

1. **Check Canvas Timeline:**
   - Which turn failed?
   - What tool caused the error?
   - Did task_complete get called?

2. **Common Failures:**
   - ❌ Tool errors: Add error handling to prompt
   - ❌ Exceeds budget: Simplify task or increase limit
   - ❌ No task_complete: Agent doesn't know it's done (improve prompt)

3. **Fix & Re-test:**
   - Modify prompt
   - Re-run same task
   - Confirm PASS in canvas
   - Commit fix

---

## 📚 Team Resources

- **DEVELOPER-GUIDE.md** - How to use canvas
- **BENEFITS.md** - ROI calculations
- **DEPLOYMENT.md** - Full CI/CD setup
- **REAL-TASKS.md** - Test scenarios
- **Sample Dashboard:** Screenshot weekly results

---

## 🎓 Training Plan

### New Hire Onboarding (1 hour)
1. Read DEVELOPER-GUIDE.md (15 min)
2. Run hello-world-demo.mjs (10 min)
3. Run one real task with canvas (20 min)
4. Explain one metric (15 min)

### Weekly Sync (15 min)
1. Review metrics dashboard
2. Celebrate wins
3. Flag any regressions
4. Assign optimizations

### Quarterly Review (1 hour)
1. Analyze full quarter trends
2. Plan next quarter targets
3. Update team documentation
4. Share ROI wins with leadership

---

## ❓ FAQ

**Q: How often should we track metrics?**
A: Every agent run auto-records. Weekly reviews are sufficient. Daily is good for active optimization.

**Q: Can we share metrics across repos?**
A: Yes! All metrics in `~/.copilot/metrics/` are shared. Move file to cloud storage for org-wide tracking.

**Q: What's a good turn count target?**
A: 3-5 turns for most tasks. Simple tasks: 2 turns. Complex analysis: 6-8 turns max.

**Q: How do we set team budgets?**
A: Edit `.github/extensions/agent-loop-eval/config.json` and commit. All team members get updated limits.

**Q: Is there a way to alert on regressions?**
A: Yes! GitHub Actions can check if pass rate < 90% and notify Slack.

---

**Start measuring today. Optimize tomorrow. 🚀**
