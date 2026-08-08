# Agent Loop Evaluator — Hello World Example

This guide demonstrates how to use the Agent Loop Evaluator canvas to observe and evaluate agent behavior.

## What you'll learn

- **How the agent loop works** — turns, tool calls, completion signals
- **How eval checks validate behavior** — task_complete, tool errors, turn budget
- **How to read the canvas** — timeline, status, verdict

## Quick Start

### 1. Open the canvas

In any session, open the Agent Loop Evaluator:

```
open_canvas({ canvasId: "agent-loop-eval", instanceId: "hello-world-1" })
```

The canvas displays:
- **Status badge** — running/idle/error
- **Loop timeline** — each turn with tools called
- **Eval verdict** — pass/review/fail with scoring

### 2. Run a simple agent task

Trigger an agent task while the canvas is open:

```
send a simple message like: "Create a file hello.txt with 'Hello, world!' in it"
```

Watch the canvas update in real-time as the agent:
1. **Turn 1** — LLM decides to use a file creation tool
2. **Turn 2** (optional) — LLM verifies the result or stops
3. **session.idle** — Loop ends, eval verdict is calculated

### 3. Interpret the verdict

The canvas runs 3 checks:

| Check | Pass Condition | Score |
|-------|---|---|
| **Task complete** | Model called `task_complete` tool | +3 pts |
| **No tool errors** | All tool calls succeeded | +3 pts |
| **Turn budget** | ≤ 10 turns used (efficient loop) | +4 pts |

- **10/10 (Pass)** — All checks passed, task is done
- **6-9/10 (Review)** — Some checks failed, but task may still be complete
- **0-5/10 (Fail)** — Multiple failures; task incomplete or inefficient

### 4. Multi-turn example

Try a task requiring multiple steps to see the full loop:

```
"Search for Python files in this repo, then count how many have 'def test_' in them"
```

Expected flow:
- **Turn 1**: LLM calls `glob` to find `.py` files
- **Turn 2**: LLM reads files and counts test functions
- **Turn 3**: LLM produces final answer and calls `task_complete`
- **session.idle**: Eval runs — should be 10/10

### 5. Watch error handling

Intentionally trigger an error:

```
"Run a command that doesn't exist: 'nonexistent_command --help'"
```

You'll see:
- **Turn 1**: LLM tries the command
- **Tool fails** — marked in timeline
- **Eval check fails** — "No tool errors" → FAIL
- **Verdict**: Lower score (tool errors exist)

## Key takeaways

| Concept | What it means |
|---------|---|
| **Turn** | One LLM API call; each turn can request tools or produce final response |
| **session.idle** | Reliable "loop ended" signal; always emitted when CLI stops processing |
| **session.task_complete** | Semantic "task is done"; model must explicitly call it (only in autopilot mode) |
| **Eval checks** | Automated validation: did we finish? any errors? was it efficient? |

## Troubleshooting

**Canvas shows "Waiting for idle state"?**
- The task is still running. Wait for the status badge to turn "IDLE".

**Verdict says FAIL but task looks done?**
- Check if `task_complete` was called. In interactive mode, the model may skip it.
- Check tool errors in the timeline.

**Too many turns?**
- The agent may need refinement. Each turn is an LLM call (costs tokens). Look for inefficient loops.

## Next steps

- Use the eval score to optimize agent prompts
- Track turn count to identify expensive tasks
- Integrate eval verdict into CI/CD for agent testing
- Build custom checks by forking the canvas extension
