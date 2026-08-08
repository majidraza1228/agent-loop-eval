# How Agent Loop Evaluator Helps Developers

The Agent Loop Evaluator is a **debugging and optimization tool** for building reliable, efficient autonomous agents. Here's how it helps:

---

## 🎯 Problem It Solves

**Without the canvas:**
- ❌ Agents run in a black box
- ❌ You can't see individual turns (LLM calls)
- ❌ Can't tell if agent is stuck or looping
- ❌ No metrics for efficiency
- ❌ Hard to know why agents fail

**With the canvas:**
- ✅ See every LLM turn in real-time
- ✅ Track all tool calls and their results
- ✅ Automated eval verdict (pass/fail)
- ✅ Measure efficiency (turn count, errors)
- ✅ Debug failures instantly

---

## 👨‍💻 Developer Use Cases

### **1. Optimize Agent Prompts**

**Scenario:** Your agent takes 8 turns to complete a task. You want to reduce it to 3 turns (save 62% on API costs).

**With canvas:**
```
Open: open_canvas({ canvasId: "agent-loop-eval", instanceId: "opt-1" })
Send task → Watch turns in real-time
```

You see:
- **Turn 1-3:** Agent asks clarifying questions (wasteful)
- **Turn 4-5:** Finally reads files
- **Turn 6-8:** Synthesizes and completes

**Fix:** Improve system prompt to reduce clarification questions

**Result:** Re-run with better prompt → 3 turns (10/10 PASS) ✅

**Cost savings:** 62% fewer API calls per task!

---

### **2. Detect Infinite Loops**

**Scenario:** Agent seems stuck, keeps retrying same tools.

**With canvas:**
```
Status: RUNNING (for 5+ minutes)
Timeline shows:
  Turn 1: tool_x
  Turn 2: tool_x (same tool)
  Turn 3: tool_x (REPEAT!)
  ...
  Turn 15+: (exceeds budget)
```

**Fix:** Add guardrail to `task_complete` prompt or limit retries.

**Result:** Agent now stops at turn 5 (REVIEW 7/10) ✅

---

### **3. Find Tool Failures**

**Scenario:** Agent says it completed the task, but you're suspicious.

**With canvas:**
```
Timeline shows:
  Turn 1: read_file → SUCCESS
  Turn 2: bash("rm -rf /") → FAIL ❌
  Turn 3: task_complete → called anyway!
```

**Insight:** Agent didn't check tool errors before marking complete.

**Fix:** Add error-checking logic to agent prompt.

**Result:** Now catches failures (FAIL 3/10) → you fix before prod ✅

---

### **4. Test Agents in CI/CD**

**Scenario:** You have 10 agent tasks. You want automated testing on every commit.

**Without canvas:**
- ❌ Run agents manually
- ❌ Eyeball results
- ❌ Easy to miss failures

**With canvas + eval verdict:**
```bash
# .github/workflows/agent-test.yml
- name: Test agent loops
  run: |
    for task in task1 task2 task3; do
      result=$(copilot -i "$task")
      verdict=$(parse_verdict "$result")
      if [ "$verdict" != "PASS" ]; then
        echo "Agent $task FAILED: $verdict"
        exit 1
      fi
    done
```

**Result:** Agents auto-tested on every PR ✅

---

### **5. Compare Agent Strategies**

**Scenario:** You have 2 agent designs. Which is better?

**Approach A:**
- Budget: 20 turns
- Result: PASS (10/10)

**Approach B:**
- Budget: 5 turns
- Result: PASS (10/10)

**Verdict:** **Approach B is better** — same quality, 75% fewer API calls!

Use canvas to run both and compare verdicts.

---

### **6. Onboard New Team Members**

**Without canvas:**
- ❌ Hard to explain how agents work
- ❌ "Just read the code"
- ❌ Takes weeks to understand loops

**With canvas:**
- ✅ Run task → See loop in real-time
- ✅ Each turn is clearly labeled
- ✅ "This turn called 3 tools, that's why it succeeded"
- ✅ Understanding in minutes!

---

### **7. Debug Failed Agent Deployments**

**Scenario:** Agent works locally but fails in production.

**With canvas:**
```
Production run:
  Turn 1: ✓
  Turn 2: ✓
  Turn 3: Tool fails (network issue) ❌
  Turn 4: Agent gives up (FAIL)

Local run:
  All turns succeed (PASS)
```

**Insight:** Network resilience issue.

**Fix:** Add retry logic to tools, test with unreliable network.

---

## 📊 Concrete Metrics

### **Cost Optimization**

| Scenario | Turns | Cost | Budget | Verdict |
|----------|-------|------|--------|---------|
| Before optimization | 10 | $0.50 | 10 | PASS |
| After optimization | 4 | $0.20 | 10 | PASS |
| **Savings** | **60%** | **$0.30** | — | — |

**Scale to 1000 tasks/month:**
- Before: $500/month
- After: $200/month
- **Savings: $300/month** 💰

---

## 🛠️ Developer Workflow

### **Step 1: Write Agent Task**
```
Task: "Search repo for TODO comments and create issue"
```

### **Step 2: Open Canvas**
```javascript
open_canvas({ canvasId: "agent-loop-eval", instanceId: "dev-1", input: { budgetLimit: 5 } })
```

### **Step 3: Run Task & Observe**
```
Send task → Watch canvas → See turns in real-time
```

### **Step 4: Interpret Verdict**
- **PASS (10/10)** → Deploy! ✅
- **REVIEW (6-9/10)** → Check which checks failed, optimize
- **FAIL (0-5/10)** → Fix agent prompt or logic

### **Step 5: Iterate & Optimize**
- Tweak prompt → Re-run → Better verdict → Repeat

---

## 🚀 Advanced: Integrate Into Workflows

### **Scenario 1: Pre-Deploy Testing**
```bash
# Before shipping new agent:
copilot -i "Test task 1"     # Check verdict
copilot -i "Test task 2"     # Check verdict
copilot -i "Test task 3"     # Check verdict
# All PASS? → Ship! 🚀
```

### **Scenario 2: Daily Agent Health Check**
```bash
# Scheduled workflow (hourly/daily):
- Run production agents
- Collect verdicts
- Alert if score drops below 8/10
- Investigate root cause
```

### **Scenario 3: A/B Testing Agents**
```
Agent V1 (old): 8 turns, PASS
Agent V2 (new): 5 turns, PASS
→ Deploy V2 (25% more efficient) 📈
```

---

## 📈 Key Metrics You Can Track

| Metric | What It Means | Action |
|--------|---|---|
| **Turn Count** | LLM API calls | Lower = cheaper |
| **Verdict Score** | Quality rating (0-10) | >8 = production ready |
| **Tool Errors** | Failed tool calls | Reliability check |
| **Budget Utilization** | Turns vs limit | Efficiency vs safety |
| **Task Complete** | Explicit completion signal | Required for automation |

---

## 🎓 Real Example: Optimize Agent Loop

**Before:**
```
Task: "Analyze code quality"
Turns: 12 (exceeds budget of 10)
Verdict: FAIL (3/10) ❌

Issues:
- Turn 1-3: Asks clarifying questions
- Turn 4-6: Reads files inefficiently
- Turn 7-12: Tries different tools
```

**Optimization:**
1. Improved prompt with clear examples → reduces clarification
2. Provided file list upfront → skips discovery
3. Used `grep` instead of reading full files → faster analysis

**After:**
```
Task: "Analyze code quality"
Turns: 5 (under budget of 10)
Verdict: PASS (10/10) ✅

Improvements:
- 58% fewer API calls
- Faster execution
- More reliable
```

---

## 💡 Summary: Why Developers Need This

| Problem | Solution | Benefit |
|---------|----------|---------|
| Black-box agent execution | Real-time loop visualization | Understand what's happening |
| Inefficient agents | Turn-count metrics | Optimize costs |
| Hard to debug | Detailed timeline + eval checks | Fix issues faster |
| No quality gates | Automated verdicts (0-10) | Confidence before deploy |
| Scaling challenges | Metrics + CI/CD integration | Manage fleet of agents |

---

## 🚀 Quick Start for Your Use Case

**What do you want to do?**

1. **Optimize agent costs** → Set `budgetLimit: 5`, optimize until PASS
2. **Debug failing agent** → Watch canvas, identify turn where it fails
3. **Test in CI/CD** → Integrate eval verdict into GitHub Actions
4. **Compare designs** → Run both agents side-by-side, compare scores
5. **Monitor in production** → Track verdicts over time, alert on drops

**Next:** Try one of the REAL-TASKS again, but this time **focus on the turn count**. Can you get a PASS with fewer turns? 🎯
