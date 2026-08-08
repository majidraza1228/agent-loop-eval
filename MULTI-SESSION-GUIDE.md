# 🔄 Multi-Session Workflow Guide

## 🎯 Your Question

> "Can I run this tool in GitHub Copilot one session and create new project in another session?"

**Answer: ✅ YES! Here's how it works:**

---

## 📊 Session Types

### **Session 1: Testing/Learning**
```
GitHub Copilot (existing repo)
  ↓
Run agent tasks
  ↓
Open Agent Loop Evaluator canvas
  ↓
Learn patterns, test ideas
```

### **Session 2: New Project**
```
New GitHub Copilot (different repo)
  ↓
Copy extensions from Session 1
  ↓
Build agents with canvas
  ↓
Metrics auto-tracked
```

---

## 🚀 Real Workflow Example

### **Session 1: loop-engineering Repo** (You're here now!)
```bash
# Terminal 1
cd /Users/syedraza/copilot-worktrees/loop-engineering/majidraza1228-congenial-fiesta
copilot -i

# Copilot Session 1 active
open_canvas({ canvasId: "agent-loop-eval" })
# Testing agents, learning, experimenting
# Canvas open in panel ↑
```

### **Session 2: New Project Repo** (Open separately)
```bash
# Terminal 2 (different terminal window)
cd /path/to/new-project
copilot -i

# Copilot Session 2 active (separate from Session 1)
# Canvas opens in its own panel
open_canvas({ canvasId: "agent-loop-eval" })
# Build new agents here
```

**Result:** Both sessions run simultaneously with separate canvases! 🎉

---

## 💡 Three Common Workflows

### **Workflow 1: Learn in One, Build in Another**

```
Session 1 (Learning):
  copilot -i "test search agent"
  open_canvas({ canvasId: "agent-loop-eval" })
  → Watch canvas, understand loops
  → See: Turn 1 → 2 → 3 → PASS ✅
  → Copy successful prompt

Session 2 (Building):
  copilot -i "build production search agent"
  open_canvas({ canvasId: "agent-loop-eval" })
  → Paste learned prompt
  → See: Same pattern works ✅
  → Optimize for your project
  → Commit to new repo

Result: Learned in Session 1, implemented in Session 2 ✅
```

---

### **Workflow 2: Parallel Development**

```
Session 1 (loop-engineering):
  Testing new canvas features
  Building example agents
  Generating metrics data
  Dashboard showing trends

Session 2 (my-new-agent-project):
  Building Agent #1 (search)
  Building Agent #2 (analyze)
  Building Agent #3 (report)
  Canvas tracks each independently

Result: Two projects running simultaneously, both using tools ✅
```

---

### **Workflow 3: Reference + Build**

```
Session 1 (loop-engineering): 
  Keep open in left panel
  Reference: REAL-TASKS.md
  Reference: DEVELOPER-GUIDE.md
  Reference: Agent Loop canvas
  
Session 2 (my-new-agent-project):
  Main work in right panel
  Copy patterns from Session 1
  Test with canvas in Session 2
  See metrics accumulate

Result: Session 1 = reference library, Session 2 = active work ✅
```

---

## 🔀 How Data Flows Across Sessions

### **Shared (Global)**
```
~/.copilot/metrics/agent-metrics.json
├─ Session 1 agents → write to file
├─ Session 2 agents → write to file
└─ Both can read same metrics dashboard ✅
```

**Example:**
```bash
# Session 1: Run agent
copilot -i "task 1"
→ Metrics saved to ~/.copilot/metrics/agent-metrics.json

# Session 2: Open dashboard
open_canvas({ canvasId: "agent-metrics-dashboard" })
→ Shows metrics from both sessions! ✅
```

---

### **Session-Specific (Local)**
```
Session 1 Canvas
├─ Extension: session:agent-loop-eval (port 57391)
├─ Live tracking of agents in Session 1
└─ Closes when Session 1 ends

Session 2 Canvas
├─ Extension: session:agent-loop-eval (port 62613 - different!)
├─ Live tracking of agents in Session 2
└─ Independent from Session 1
```

---

## 📁 File Storage Across Sessions

### **Metrics (Shared)**
```
Location: ~/.copilot/metrics/agent-metrics.json

Session 1 adds:
{
  "task": "search agent",
  "turns": 4,
  "verdict": "PASS",
  "timestamp": "2026-08-08T01:00:00Z"
}

Session 2 adds:
{
  "task": "analyze agent", 
  "turns": 6,
  "verdict": "PASS",
  "timestamp": "2026-08-08T01:30:00Z"
}

Dashboard sees BOTH ✅
```

---

### **Extensions (Per Project)**
```
loop-engineering/
├─ .github/extensions/agent-loop-eval/
│  ├─ extension.mjs
│  └─ config.json

my-new-agent-project/
├─ .github/extensions/agent-loop-eval/
│  ├─ extension.mjs
│  └─ config.json

Same files, different repos → Independent sessions ✅
```

---

## 🎯 Practical Multi-Session Setup

### **Step 1: Open Terminal 1 (Session 1 - Learning)**
```bash
# Terminal 1
cd ~/loop-engineering-repo  # or current repo
copilot -i

# In Copilot:
open_canvas({ canvasId: "agent-loop-eval", instanceId: "learn-1" })

# Testing/learning mode
# Keep this open as reference
```

### **Step 2: Open Terminal 2 (Session 2 - New Project)**
```bash
# Terminal 2 (NEW window)
cd ~/my-new-agent-project
copilot -i

# In Copilot:
open_canvas({ canvasId: "agent-loop-eval", instanceId: "build-1" })

# Building mode
# Run agents here
```

### **Step 3: View Unified Metrics** (Both Sessions)
```bash
# From either session:
open_canvas({ canvasId: "agent-metrics-dashboard", instanceId: "metrics" })

# Shows ALL runs from both Session 1 + Session 2 ✅
```

---

## 🔗 Data Sharing Across Sessions

### **What's Shared?**
```
✅ Metrics dashboard
   └─ ~/.copilot/metrics/agent-metrics.json
   └─ Visible to all sessions
   └─ Cumulative (never deleted)

✅ Configuration
   └─ .github/extensions/agent-loop-eval/config.json
   └─ Can edit in one session, used by both

✅ Code/Prompts
   └─ Stored in git
   └─ Copy patterns across projects
```

---

### **What's NOT Shared?**
```
❌ Canvas state (live tracking)
   └─ Each session = separate port
   └─ Independent visualization
   └─ Close session → canvas stops

❌ Copilot context
   └─ Each session has own conversation
   └─ Separate agent instances
   └─ No memory between sessions
```

---

## 🌍 Real-World Example: Your Workflow

### **Right Now (Current State)**
```
Session A: loop-engineering (This session)
  ├─ Agent Loop Evaluator open (port 57391)
  ├─ Metrics Dashboard open (port 62612)
  ├─ Project-scoped extensions (.github/extensions/)
  ├─ Learning, testing, iterating
  └─ Metrics accumulate here
```

### **Soon (New Project)**
```
Session B: my-awesome-agent-project (NEW)
  ├─ Git clone → copy .github/extensions/
  ├─ Agent Loop Evaluator open (port 62613 - auto-assigned)
  ├─ Project-scoped extensions active
  ├─ Build 5 agents
  └─ Metrics from both sessions visible in dashboard ✅
```

### **Unified View**
```
Metrics Dashboard (auto-updated)
├─ Agent runs from Session A (loop-engineering)
├─ Agent runs from Session B (my-awesome-agent-project)
├─ Shows combined statistics
├─ Trends visible across projects
└─ Cost predictions include both ✅
```

---

## 📊 Step-by-Step: Multi-Session Example

### **Step 1: Session 1 - Learn Patterns**

```bash
# Terminal 1
$ copilot -i

# In Copilot Session 1:
Prompt: "Build a code search agent"

open_canvas({
  canvasId: "agent-loop-eval",
  instanceId: "learn-search"
})

# Canvas shows:
#   Turn 1: Find files
#   Turn 2: Filter .py
#   Turn 3: task_complete()
#   Result: PASS (10/10), 3 turns

# Observation: Good pattern for search agents ✅
# Save this prompt structure mentally
```

---

### **Step 2: Session 2 - Build New Project**

```bash
# Terminal 2 (NEW window)
$ mkdir my-agent-project
$ cd my-agent-project
$ git init

# Copy extensions from Session 1
$ cp -r ~/loop-engineering/.github/extensions .

$ copilot -i

# In Copilot Session 2:
Prompt: "Build search agent for our codebase (use same pattern)"

open_canvas({
  canvasId: "agent-loop-eval",
  instanceId: "build-search"
})

# Canvas shows (independent from Session 1):
#   Turn 1: Find files
#   Turn 2: Filter .py
#   Turn 3: task_complete()
#   Result: PASS (10/10), 3 turns ✅

# Metrics auto-recorded to ~/.copilot/metrics/agent-metrics.json
```

---

### **Step 3: View Unified Metrics**

```bash
# From either session:
open_canvas({
  canvasId: "agent-metrics-dashboard",
  instanceId: "all-metrics"
})

# Dashboard shows:
# ┌─────────────────────────────────┐
# │ Agent Metrics - Combined View   │
# ├─────────────────────────────────┤
# │ Avg Turns: 3.2 (both sessions)  │
# │ Pass Rate: 100% (both sessions) │
# │ Total Runs: 8 (4 + 4)           │
# │ Est. Cost: $160/month (combined)│
# └─────────────────────────────────┘

# You see:
# - Session 1 results (4 test runs)
# - Session 2 results (4 build runs)
# - Combined statistics ✅
```

---

## ✅ Practical Advantages

### **Advantage 1: Learn Without Affecting Build**
```
Session 1: Experiment, test ideas, break things
Session 2: Build with confidence, use proven patterns
Result: Cleaner separation, faster development ✅
```

---

### **Advantage 2: Reference While Building**
```
Session 1: Keep DEVELOPER-GUIDE.md open, run examples
Session 2: Implement in your new project
Result: Learn + Build simultaneously ✅
```

---

### **Advantage 3: Unified Metrics**
```
Session 1: Gather baseline metrics
Session 2: Compare against baseline
Result: Track progress across projects ✅
```

---

### **Advantage 4: Isolated Testing**
```
Session 1: Break existing agents, learn limits
Session 2: Production agents stay stable
Result: Safe experimentation + reliable work ✅
```

---

## 🚀 Recommended Setup

### **For Maximum Productivity**

```
┌─ Monitor/Reference ──────────┐
│                              │
│ Session 1: loop-engineering  │
│ ├─ Agent Loop canvas         │
│ ├─ Metrics dashboard         │
│ └─ DEVELOPER-GUIDE.md        │
│    (Keep visible as reference)
│                              │
└──────────────────────────────┘

┌─ Active Development ─────────┐
│                              │
│ Session 2: my-new-project    │
│ ├─ Agent Loop canvas         │
│ ├─ Code editor               │
│ └─ Terminal                  │
│    (Your main work window)   │
│                              │
└──────────────────────────────┘

┌─ Shared Across Both ─────────┐
│                              │
│ Metrics Dashboard            │
│ ├─ All runs from both        │
│ ├─ Cost predictions          │
│ └─ Trend analysis            │
│    (Open in either session)  │
│                              │
└──────────────────────────────┘
```

---

## ❓ FAQ

**Q: Can I have Session 1 and Session 2 both open at same time?**
A: Yes! Each opens in separate terminal windows/tabs.

**Q: Will they interfere with each other?**
A: No! Each session is independent (different ports, different contexts).

**Q: Do metrics merge?**
A: Yes! Metrics write to same file, dashboard shows combined stats.

**Q: Can I share canvases between sessions?**
A: No, but you can view same metrics dashboard from either session.

**Q: If I close Session 1, does Session 2 stop?**
A: No! Sessions are independent. Closing one doesn't affect the other.

**Q: How do I keep metrics separate by project?**
A: Tag them! Example:
  ```json
  {
    "project": "session-1-learning",
    "task": "test",
    "turns": 3
  }
  ```

**Q: Can I run 5 projects simultaneously?**
A: Yes! Each gets its own Copilot session, canvas ports, etc.
   Metrics all aggregate in same dashboard.

---

## ✅ Summary

**Your Question:** Can I use these tools in one session and create new project in another?

**Answer:** ✅ YES!

**How:**
1. Session 1 (loop-engineering): Learn, test, reference
2. Session 2 (my-new-project): Build, experiment, develop
3. Metrics dashboard: Unified view of both

**Setup:** Just `copilot -i` in each terminal, open canvases independently.

**Result:** Maximum productivity, isolated testing, unified metrics! 🚀

---

## 📚 Next Steps

1. Keep this session open (learn & reference)
2. Open Terminal 2, `cd` to new project
3. Run `copilot -i` in Terminal 2
4. `open_canvas()` in both → Independent canvases
5. Run agents in Session 2
6. View unified metrics anytime

**Everything just works! ✅**
