# 📋 New Project Quick Reference

## 🎯 TL;DR: Why These Tools for New Projects?

```
Your New Agent Project
    ↓
    ├─ Day 1: "Does my agent work?"
    │  ✅ open_canvas({ canvasId: "agent-loop-eval" })
    │  → INSTANT VERDICT: PASS (10/10) or FAIL (3/10)
    │
    ├─ Week 1: "Is it efficient?"
    │  ✅ open_canvas({ canvasId: "agent-metrics-dashboard" })
    │  → See: 4 turns (good), $0.20/task (budget)
    │
    └─ Month 1: "Ready to scale?"
       ✅ Metrics show: 100% PASS, 4.2 avg turns, $250/month predicted
       → Deploy with confidence 🚀
```

---

## ⚡ Setup (Choose One)

### **Option 1: Clone as Template** (Easiest)
```bash
git clone https://github.com/majidraza1228/loop-engineering.git my-agent-project
cd my-agent-project
# ✅ Extensions ready! Start building agents.
```

### **Option 2: Add to Existing Project** (5 min)
```bash
mkdir -p .github/extensions/{agent-loop-eval,agent-metrics-dashboard}
# Copy 3 files (27 KB total):
#   1. agent-loop-eval/extension.mjs
#   2. agent-metrics-dashboard/extension.mjs
#   3. agent-loop-eval/config.json
git add .github/extensions/ && git commit -m "Add canvases"
extensions_reload
```

### **Option 3: Share via Gist** (For Teams)
```bash
# In existing repo:
share_extension({ name: "agent-loop-eval", scope: "project" })
# → Copy gist URL

# In new project:
install_extension({ url: "https://gist.github.com/..." })
```

---

## 📊 What You Get Immediately

| When | What | Result |
|------|------|--------|
| **Day 1** | Write agent → open canvas | PASS/FAIL verdict in real-time |
| **Day 2-3** | Optimize weak agents | Turn count: 8 → 5 (-37%) |
| **Day 4-5** | All agents PASS | Ready for production |
| **Week 2** | Accumulate metrics | Dashboard shows trends |
| **Month 1** | 10+ agents optimized | Cost predicted & managed |

---

## 💡 Real Example: Search Agent Progression

```
Day 1: Build
  Code: "Search repo for TODOs"
  Canvas: Turn 1 → 2 → 3 → task_complete()
  Result: PASS (10/10), 4 turns, $0.20

Day 2: Optimize prompt
  Add examples: "Here's how to format output..."
  Canvas: Turn 1 → 2 → 3 → task_complete()
  Result: PASS (10/10), 3 turns, $0.15 (cleaner)

Day 3: Optimize logic
  Pre-filter files: "Only check src/ folder"
  Canvas: Turn 1 → 2 → task_complete()
  Result: PASS (10/10), 2 turns, $0.10 (50% faster!)

Week 1 Dashboard:
  Agent Runs: 15
  Avg Turns: 2.5 (was 4)
  Pass Rate: 100%
  Cost Per Task: $0.125 (was $0.20)
  Saved: 37% ✅
```

---

## 🚀 Key Resources

```
Setup:        QUICKSTART.md (5 min read)
Day-by-day:   NEW-PROJECT-TEMPLATE.md (15 min read)
Why it works: NEW-PROJECT-BENEFITS.md (20 min read)
How to use:   DEVELOPER-GUIDE.md (15 min read)
Examples:     REAL-TASKS.md (copy these!)
Learning:     hello-world-demo.mjs (run this!)
```

---

## ✅ Progress Checkpoints

### **Day 1 ✓**
- [ ] Extensions setup in `.github/extensions/`
- [ ] First agent built
- [ ] Canvas shows PASS verdict
- [ ] Baseline recorded in dashboard

### **Day 2-3 ✓**
- [ ] 3-5 agents built
- [ ] Metrics dashboard populated
- [ ] Dashboard shows: avg turns, pass rate, cost
- [ ] Weak agents identified

### **Day 4-5 ✓**
- [ ] All agents PASS (10/10)
- [ ] Turn counts optimized
- [ ] Prompts documented
- [ ] Ready for team review

### **Week 2 ✓**
- [ ] 5+ agents in production
- [ ] 100% pass rate
- [ ] Avg 4 turns per agent
- [ ] Cost predictions accurate
- [ ] Metrics tracked over time

### **Month 1 ✓**
- [ ] 10+ agents deployed
- [ ] CI/CD testing on every PR
- [ ] Metrics dashboards shared
- [ ] Team optimizing agents
- [ ] ROI demonstrated

---

## 💰 Cost Comparison

### Without Canvases
```
Build agents blind
Ship without testing
Production failures
Expensive debugging
Total: High cost, low confidence
```

### With Canvases
```
Build with real-time feedback: $0 (free!)
Test before shipping: PASS verdict
Predict costs: $250/month known
Optimize iteratively: measured improvements
Total: Lower cost, high confidence ✅
```

---

## 🎯 Success Metric

**If you're doing this right:**

```
Week 1:
  ✅ 5 agents built in 5 days (1/day)
  ✅ 100% PASS rate on all agents
  ✅ Avg 4 turns per agent
  ✅ Cost: $0.20 per task
  ✅ Projected monthly: $200 (5 agents, 1000 runs)
  ✅ Dashboard populated with 50+ data points

Month 1:
  ✅ 20+ agents operational
  ✅ 98%+ PASS rate
  ✅ Metrics show consistent 3.8 avg turns
  ✅ Cost trends visible (optimizing over time)
  ✅ Team using canvases daily
  ✅ CI/CD auto-tests every PR
```

---

## ❓ FAQ

**Q: Can I add these to an existing project?**
A: Yes! `mkdir .github/extensions/` and copy files. Takes 5 min.

**Q: Do I need all features from day 1?**
A: Just agent-loop-eval (visual) is enough. Metrics dashboard is nice-to-have but not required.

**Q: How much setup time?**
A: 5 minutes. Copy 3 files + commit + reload.

**Q: Will this slow down my agents?**
A: No. Canvases are async monitoring. Agents run normally.

**Q: Can my team share metrics?**
A: Yes. Metrics in `~/.copilot/metrics/agent-metrics.json` are shareable.

**Q: What if I don't know agent prompts?**
A: Copy from REAL-TASKS.md + adapt. Examples included.

---

## 🚀 Start Now!

1. **5 min:** Setup (copy 3 files)
2. **15 min:** Read NEW-PROJECT-BENEFITS.md
3. **30 min:** Build first agent + test with canvas
4. **Repeat:** Optimize + scale

**Result:** New agents shipped with visibility, metrics, and confidence. 💪

See `QUICKSTART.md` for copy-paste commands.
