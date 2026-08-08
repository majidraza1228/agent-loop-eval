# Project-Scoped Extensions Setup

This directory contains **Team-Wide Copilot Extensions** that are automatically available to everyone on this project when they clone the repository.

## Available Extensions

### 1. **Agent Loop Evaluator** (`agent-loop-eval`)
**Real-time visualization of agent execution loops**

- 👁️ Watch each agent turn in real-time
- 🔍 See which tools were called and when
- 📊 Get automated eval verdict (PASS/FAIL/REVIEW)
- ⚙️ Configurable turn budget (1-100 turns)
- 🎯 Optimize agent prompts to reduce turns/costs

**Quick Start:**
```bash
copilot
# Type your task, then say: "open canvas agent-loop-eval"
# or programmatically:
open_canvas({ canvasId: "agent-loop-eval", instanceId: "my-task" })
```

**Input Options:**
```json
{
  "budgetLimit": 15  // Max turns allowed (default: 15)
}
```

**Use Cases:**
- Optimize agent performance (reduce turns = reduce API costs)
- Debug failing agents (see which turn fails and why)
- Onboard new team members (visual explanation of loops)
- CI/CD testing (automated verdicts for reliability)

---

### 2. **Agent Metrics Dashboard** (`agent-metrics-dashboard`)
**Track agent performance over time with charts and analytics**

- 📈 Line chart of turn counts (last 30 runs)
- 🎯 Pass rate percentage
- 💰 Estimated monthly API costs
- 📊 Verdict distribution (PASS/FAIL/REVIEW)
- 📋 Recent runs history

**Quick Start:**
```bash
open_canvas({ canvasId: "agent-metrics-dashboard", instanceId: "metrics" })
```

**Data Storage:**
Metrics are persisted in `~/.copilot/metrics/agent-metrics.json` so they persist across sessions.

**Use Cases:**
- Track team productivity (avg turns per task)
- Monitor cost trends (predict monthly spend)
- Measure improvements (before/after optimizations)
- Team dashboards (shared metrics view)

---

## 📦 How Extensions Work

1. **Installation:** Automatic when you clone the repo
2. **Discovery:** Run `copilot` and extensions load in background
3. **Activation:** Use `open_canvas()` to display in the side panel
4. **Persistence:** Team files are in `.github/extensions/`
5. **User files:** Metrics stored in `~/.copilot/metrics/` (per-user)

---

## 🚀 Team Deployment

### Step 1: Clone & Start Using
```bash
git clone <your-repo>
cd <your-repo>
copilot
# Extensions auto-load from .github/extensions/
```

### Step 2: Run Agent Loop Evaluator
```bash
copilot -i "Your agent task here"
# Then in Copilot: "open canvas agent-loop-eval"
```

### Step 3: Track Metrics
```bash
# Periodically open metrics dashboard
copilot
# Then: "open canvas agent-metrics-dashboard"
```

---

## 📋 Configuration

### Agent Loop Evaluator (`agent-loop-eval/config.json`)
Edit to change defaults for the entire team:

```json
{
  "budgetLimit": 15,  // Default turn budget (per task)
  "settings": {
    "turnBudget": {
      "value": 15,
      "min": 1,
      "max": 100
    },
    "autoRefreshInterval": 2000
  }
}
```

Changes are picked up immediately on next run.

---

## 🔍 Troubleshooting

### Extension Not Loading?
1. Verify files exist: `.github/extensions/agent-loop-eval/extension.mjs`
2. Check Copilot logs: `~/.copilot/logs/`
3. Reload: `extensions_reload`

### Metrics Not Appearing?
1. Run at least one agent task
2. Open dashboard: `open_canvas({ canvasId: "agent-metrics-dashboard" })`
3. Metrics file: `~/.copilot/metrics/agent-metrics.json`

### Canvas Won't Open?
1. Ensure extensions are loaded: `extensions_manage({ operation: "list" })`
2. Check extension status: `extensions_manage({ operation: "inspect", name: "agent-loop-eval" })`

---

## 👥 For Team Leads

### Setup Checklist
- ✅ Commit `.github/extensions/` to repo
- ✅ Add to team onboarding docs
- ✅ Share DEVELOPER-GUIDE.md (see repo root)
- ✅ Monitor team metrics dashboard weekly
- ✅ Set team budget limits (config.json)

### Best Practices
1. **Optimize gradually:** Start with budgetLimit: 20, reduce over time
2. **Track metrics:** Save weekly snapshots to measure progress
3. **Alert on regressions:** Monitor average turn count vs baseline
4. **Share wins:** Celebrate when team agents hit 10/10 PASS

### Integration with CI/CD
See `DEPLOYMENT.md` in repo root for GitHub Actions workflow templates.

---

## 📚 Related Documentation

- `DEVELOPER-GUIDE.md` - How developers use these tools
- `BENEFITS.md` - ROI and metrics calculations
- `DEPLOYMENT.md` - Full CI/CD setup
- `REAL-TASKS.md` - Production-ready test scenarios

---

## 🛠️ For Extension Developers

To modify extensions:
1. Edit files in `.github/extensions/<name>/extension.mjs`
2. Reload: `extensions_reload`
3. Test locally: `open_canvas()`
4. Commit changes to repo

Extensions are JavaScript/Node.js-only (no TypeScript). See `~/.copilot/docs/extensions.md` for SDK docs.
