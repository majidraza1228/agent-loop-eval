# Real Agent Tasks for Testing Agent Loop Evaluator

Here are practical tasks to test the Agent Loop Evaluator canvas with your current repo. Each demonstrates different loop patterns.

## 🎯 Suggested Tasks (Try These!)

### Task 1: Analyze Python Files (Multi-turn, Simple) ⭐ START HERE
```
Find all Python files in the patterns/ directory and count how many contain 
the word "decorator". List the filenames.
```

**Expected:**
- Turn 1: `glob` to find `**/*.py` files
- Turn 2: `read_file` on pattern files
- Turn 3: Final answer + `task_complete`
- **Verdict:** PASS (10/10) ✅

**Why it's good:** Shows multi-step workflow with file I/O.

---

### Task 2: Document Review (Complex, Read-Heavy)
```
Read the README.md and STATE.md files from this repo. 
What are the top 3 key projects mentioned? 
List them with a one-line summary each.
```

**Expected:**
- Turn 1: `read_file` on README.md
- Turn 2: `read_file` on STATE.md
- Turn 3: Synthesize + `task_complete`
- **Verdict:** PASS (10/10) ✅

**Why it's good:** Tests file reading and synthesis logic.

---

### Task 3: Code Statistics (Computational)
```
Look at the loop_engine.py and demo_server.py files. 
For each file, count:
1. Total number of lines
2. Number of function definitions (def statements)
3. Number of class definitions (class statements)

Report as a table.
```

**Expected:**
- Turn 1: `read_file` on both Python files
- Turn 2: Parse and count (processing, no tool call)
- Turn 3: Format results + `task_complete`
- **Verdict:** PASS (10/10) ✅

**Why it's good:** Exercises parsing and no-tool-call turns.

---

### Task 4: Search and Report (Grep-Heavy)
```
Search for all occurrences of the word "agent" (case-insensitive) 
in Python files in the repo. 
Report:
- Total files containing "agent"
- Which file has the most occurrences
- A snippet from the top result
```

**Expected:**
- Turn 1: `grep` to find "agent" in Python files
- Turn 2: Analyze results + `task_complete`
- **Verdict:** PASS (10/10) ✅

**Why it's good:** Shows tool-driven search pattern.

---

### Task 5: Create a Summary File (Write Output)
```
Create a new file called LOOP_SUMMARY.md with:
- A one-sentence description of this project
- List the top 3 directories in this repo with their purpose
- Add a "Created by Agent Loop Evaluator" footer

Then verify the file was created successfully.
```

**Expected:**
- Turn 1: Create file with content
- Turn 2: Read file to verify
- Turn 3: Confirm + `task_complete`
- **Verdict:** PASS (10/10) ✅

**Why it's good:** Tests file creation + verification loop.

---

### Challenge Task: Multiple Aggregations (Near Budget Limit) ⚠️
```
For the patterns/ directory:
1. List all subdirectories
2. For each subdirectory, count Python files
3. Find the subdirectory with the most Python files
4. Read one representative file from that subdirectory
5. Report findings in a structured format
```

**Expected:**
- Turn 1: `glob` for directories
- Turn 2: `glob` for Python files per dir
- Turn 3: Analysis
- Turn 4: Read file
- Turn 5: Format output + `task_complete`
- **Verdict:** PASS or REVIEW (8-10 pts) 🚀

**Why it's good:** Stresses multi-step workflows; watch turn count.

---

## 🧪 How to Test Each Task

1. **Open the canvas:**
   ```
   open_canvas({ canvasId: "agent-loop-eval", instanceId: "test-1" })
   ```

2. **Send the task prompt** (copy/paste one above)

3. **Watch the canvas update in real-time:**
   - ✓ Status changes from "RUNNING" → "IDLE"
   - ✓ Each turn appears in the timeline
   - ✓ Tools are listed per turn
   - ✓ Eval verdict appears when idle

4. **Interpret the result:**
   - **PASS (10/10)** — Perfect! All checks passed.
   - **REVIEW (6-9/10)** — Task likely works, but some checks failed.
   - **FAIL (0-5/10)** — Task incomplete or too many turns.

---

## 📊 Expected Canvas Output (Example)

After running Task 1:

```
╔════════════════════════════════════════╗
║ Agent Loop Evaluator                  ║
╠════════════════════════════════════════╣
║ Status: IDLE                           ║
║ Turns: 3 | Task Complete: Yes          ║
║                                        ║
║ Loop Timeline:                         ║
║ ├─ Turn 1: glob                        ║
║ ├─ Turn 2: read_file                   ║
║ └─ Turn 3: (final response)            ║
║                                        ║
║ Evaluation: PASS                       ║
║ ✓ Task marked complete (3 pts)         ║
║ ✓ No tool errors (3 pts)               ║
║ ✓ Turn budget: 3/10 (4 pts)            ║
║                                        ║
║ 🎯 Score: 10/10 (100%) 🎉              ║
╚════════════════════════════════════════╝
```

---

## 💡 Tips

- **Start simple (Task 1)** to see the basic flow
- **Progress to complex** tasks to stress the loop
- **Watch the score** — lower scores often mean inefficient loops
- **Check the timeline** — each row is one LLM call
- **Review the verdict checks** — each tells you what went wrong

---

## 🚨 Debug if Loop Doesn't End

If the canvas shows "Waiting for idle state..." after 5 minutes:
- The agent may be stuck or confused
- Check the agent's response in chat
- Try a simpler task first
- Increase timeout in agent settings

---

Enjoy testing! 🚀
