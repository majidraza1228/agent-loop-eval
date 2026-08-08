# Agent Loop Evaluator — Getting Started

Learn how the **Agent Loop Evaluator** canvas helps you visualize and understand agent behavior.

## Files in this guide

| File | Purpose |
|------|---------|
| `hello-world-example.md` | Interactive guide to using the canvas UI |
| `hello-world-demo.mjs` | Node.js script showing eval checks in action |

## The Agent Loop (in 30 seconds)

```
User: "Create hello.txt"
  ↓
[LLM Turn 1] → "I'll use the file creation tool"
  → Calls: create_file("hello.txt", "Hello, world!")
  ↓
[LLM Turn 2] → "Task complete!"
  → Calls: task_complete()
  ↓
[Loop ends] → session.idle fired
  ↓
[Eval runs] → Checks: task_complete? tools ok? turns ≤10?
  ↓
[Verdict] → Pass/Review/Fail (0-10 score)
```

**Key insight:** Each turn is exactly one LLM API call. The model decides when to stop.

## Quick Start

### 1. Read the guide

Open `hello-world-example.md` to learn the concepts.

### 2. See it live

Open the Agent Loop Evaluator canvas while you interact with an agent:

```bash
# In any Copilot CLI session:
open_canvas({ canvasId: "agent-loop-eval", instanceId: "my-eval" })
```

Then send a task to the agent and watch the canvas update in real-time:
- **Turns** — Each LLM call appears as a row in the timeline
- **Tools** — Tool names show what the model requested
- **Status** — Running/Idle badge tells you when the loop ended
- **Verdict** — Eval score and pass/fail checks

### 3. Run the demo script (optional)

```bash
node hello-world-demo.mjs
```

The script:
- Sends a simple task to the agent
- Logs each turn and tool call
- Calculates the eval score offline
- Prints the final verdict

## Understanding the eval checks

The canvas (and demo script) run 3 automated checks when the loop ends:

| Check | Passes when | Score |
|-------|---|---|
| **Task Complete** | Model called `task_complete` | 3 pts |
| **No Tool Errors** | All tools succeeded | 3 pts |
| **Efficient Loop** | Used ≤10 turns | 4 pts |

**Total: 0-10 points**

- **10 pts** — PASS ✅ (all checks pass)
- **6-9 pts** — REVIEW 📋 (some checks fail, task may still work)
- **0-5 pts** — FAIL ❌ (multiple failures)

## Example scenarios

### Scenario 1: Simple task (best case)

```
Task: "Create hello.txt"
Turn 1: create_file() → success
Turn 2: task_complete() → success
Result: 10/10 PASS ✅
```

### Scenario 2: Multi-step task

```
Task: "Count Python test files"
Turn 1: glob("**/*.py") → finds files
Turn 2: read_file() → reads content
Turn 3: task_complete() → done
Result: 10/10 PASS ✅
```

### Scenario 3: Task with errors

```
Task: "Run nonexistent command"
Turn 1: bash("invalid_cmd") → FAILS
Turn 2: (agent retries)
Turn 3: task_complete() → done but with errors
Result: 6/10 REVIEW 📋
```

### Scenario 4: Loop doesn't end

```
Task: "Do something ambiguous"
Turn 1: asks for clarification
Turn 2: asks more questions
... (many turns)
Turn 11+: turns > 10 budget
Result: 3-6/10 FAIL ❌
```

## Visual walkthrough

The canvas shows:

```
╔═══════════════════════════════════════════╗
║  Agent Loop Evaluator                     ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Status: IDLE                             ║
║  Turns: 2 | Task Complete: Yes            ║
║                                           ║
║  Loop Timeline:                           ║
║  ├─ Turn 1                                ║
║  │  Tools: create_file                    ║
║  │                                        ║
║  └─ Turn 2                                ║
║     Tools: None (final response)          ║
║                                           ║
║  Evaluation: PASS                         ║
║  ✓ Task marked complete                   ║
║  ✓ No tool errors (0 found)               ║
║  ✓ Turn budget under 10 (2 turns used)    ║
║                                           ║
║  Score: 10/10                             ║
╚═══════════════════════════════════════════╝
```

## Troubleshooting

**Q: The canvas says "Waiting for idle state"**
A: Your agent is still running. Wait for the status badge to change to IDLE.

**Q: Why doesn't the verdict show up?**
A: The eval only runs when `session.idle` is emitted. Make sure your agent finishes its task.

**Q: How do I interpret a low score?**
A: Check which checks failed. If "Task Complete" fails, the model didn't call `task_complete`. If "Turn Budget" fails, the loop used too many LLM calls (inefficient).

**Q: Can I customize the eval checks?**
A: Yes! The canvas extension is in your session state. You can fork/modify it. See the create-canvas skill for details.

## Next steps

1. **Try it yourself** — Open the canvas and run a few agent tasks
2. **Optimize** — Use the turn count to identify expensive operations
3. **Automate** — Integrate eval verdicts into CI/CD for agent testing
4. **Extend** — Add custom checks (e.g., "outputs must be under 500 chars")

## Further reading

- [Agent Loop Architecture](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/agent-loop)
- [Canvas Extension Guide](https://github.com/github/copilot-extensions)
- [Copilot SDK Reference](https://github.com/github/copilot-sdk)
