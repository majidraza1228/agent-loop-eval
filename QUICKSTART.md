# ⚡ 5-Minute Setup for Any Project

## Copy-Paste These Commands

### **Step 1: Create Extensions Directory**
```bash
mkdir -p .github/extensions/agent-loop-eval
mkdir -p .github/extensions/agent-metrics-dashboard
```

### **Step 2: Create Agent Loop Evaluator**

Copy this into `.github/extensions/agent-loop-eval/extension.mjs`:
- Source: [In repo]
- Size: ~12.6 KB
- What it does: Real-time loop visualization + verdicts

### **Step 3: Create Metrics Dashboard**

Copy this into `.github/extensions/agent-metrics-dashboard/extension.mjs`:
- Source: [In repo]
- Size: ~14.5 KB
- What it does: Charts, metrics, cost tracking

### **Step 4: Create Config**

Copy this into `.github/extensions/agent-loop-eval/config.json`:
```json
{
  "budgetLimit": 15,
  "description": "Agent Loop Evaluator Configuration",
  "settings": {
    "turnBudget": {
      "value": 15,
      "description": "Maximum turns allowed before failing budget check",
      "min": 1,
      "max": 100
    },
    "scoreWeights": {
      "taskComplete": 3,
      "noErrors": 3,
      "efficiency": 4
    },
    "autoRefreshInterval": 2000
  }
}
```

### **Step 5: Commit & Push**
```bash
git add .github/extensions/
git commit -m "Add: Agent Loop Evaluator + Metrics Dashboard"
git push origin main
```

### **Step 6: Reload Extensions**
```bash
extensions_reload
```

---

## ✅ Verify Setup

```bash
# Check extensions loaded
extensions_manage({ operation: "list" })

# You should see:
# ✓ agent-loop-eval [project] — ready
# ✓ agent-metrics-dashboard [project] — ready
```

---

## 🚀 Your First Agent Test

```bash
# Open Copilot
copilot

# Create your first task (example):
# "Search for Python files in current directory and count them"

# While agent runs, open canvas:
open_canvas({ canvasId: "agent-loop-eval", instanceId: "test-1" })

# Watch real-time:
# - Turn 1: Find files
# - Turn 2: Count results
# - Turn 3: task_complete()
# Result: PASS (10/10) ✅
```

---

## 📊 View Metrics

```bash
# After running a few tasks:
open_canvas({ canvasId: "agent-metrics-dashboard", instanceId: "metrics" })

# See dashboard with:
# - Average turns
# - Pass rate
# - Cost estimates
# - Charts & trends
```

---

## 📁 File Sources (Copy From)

If you don't have the repo cloned, you can get files here:

**Option A: Clone as template**
```bash
git clone https://github.com/majidraza1228/loop-engineering.git my-project
cd my-project
# ✅ Extensions ready to use
```

**Option B: Copy from GitHub (raw URLs)**
```bash
# agent-loop-eval extension
curl -o .github/extensions/agent-loop-eval/extension.mjs \
  'https://raw.githubusercontent.com/majidraza1228/loop-engineering/main/.github/extensions/agent-loop-eval/extension.mjs'

# agent-metrics-dashboard extension
curl -o .github/extensions/agent-metrics-dashboard/extension.mjs \
  'https://raw.githubusercontent.com/majidraza1228/loop-engineering/main/.github/extensions/agent-metrics-dashboard/extension.mjs'

# Config
curl -o .github/extensions/agent-loop-eval/config.json \
  'https://raw.githubusercontent.com/majidraza1228/loop-engineering/main/.github/extensions/agent-loop-eval/config.json'
```

**Option C: Share via Gist**
```bash
# Generate gist (from existing repo)
share_extension({ name: "agent-loop-eval", scope: "project" })

# Install to your project
install_extension({ url: "https://gist.github.com/.../..." })
```

---

## 🎯 Next Steps

1. **Read:** `NEW-PROJECT-BENEFITS.md` (why these tools matter)
2. **Read:** `NEW-PROJECT-TEMPLATE.md` (day-by-day workflow)
3. **Read:** `DEVELOPER-GUIDE.md` (how to use canvas)
4. **Try:** `hello-world-demo.mjs` (standalone eval examples)
5. **Build:** Your first agent with canvas open
6. **Ship:** With metrics backing it up

---

## ❓ Troubleshooting

**Q: Extensions not showing up?**
```bash
extensions_reload
extensions_manage({ operation: "list" })
# Check status (should be "ready")
```

**Q: Canvas won't open?**
```bash
# Verify extension loaded
extensions_manage({ operation: "inspect", name: "agent-loop-eval" })

# Check logs if marked "failed"
# File path shown in output
```

**Q: Metrics not appearing?**
```bash
# Run at least one task first
copilot -i "your task"

# Metrics auto-record to:
# ~/.copilot/metrics/agent-metrics.json

# View dashboard
open_canvas({ canvasId: "agent-metrics-dashboard" })
```

---

**Ready to build? Start with 5-minute setup above! 🚀**
