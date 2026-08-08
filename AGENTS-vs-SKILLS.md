# AGENTS.md vs SKILLS.md: Complete Guide

## Quick Answer

| **AGENTS.md** | **SKILLS.md (SKILL.md)** |
|---------------|------------------------|
| Defines **WHO** (personas) | Defines **HOW** (procedures) |
| Agent personalities/roles | Reusable knowledge/capabilities |
| System prompts, responsibilities | How-to guides, rules, checklists |
| Single file, all agents | Many files (one per skill) |
| Read by orchestrator | Read by developers & agents |

---

## Side-by-Side Comparison

### AGENTS.md

**Purpose**: Define agent roles and personalities  
**Location**: `/AGENTS.md` (repo root, single file)  
**Format**: Markdown with system prompts  
**Contains**: Role definitions, system prompts, input/output  
**Who reads it**: Loop orchestrator, other agents  

**Example**:
```markdown
## triage-agent

**Role**: Discovery and prioritisation. Never writes code.
**Input**: STATE.md + recent git log + CI summary
**Output**: Updated STATE.md with prioritised findings

**System prompt**:
```
You are a triage agent. Your only job is to read the repo state and 
produce a prioritised list of what needs attention. Flag items as 
high/med/low. Be concise. Max 8 items per run.
```
```

### SKILLS.md

**Purpose**: Document reusable knowledge and procedures  
**Location**: `/.skills/<skill>/SKILL.md` (folder per skill)  
**Format**: YAML frontmatter + Markdown guide  
**Contains**: How-to guides, rules, checklists, examples  
**Who reads it**: Developers (before coding), agents (at runtime)  

**Example**:
```markdown
---
name: loop-triage
description: Reads repo state and produces prioritised task list
---

# Triage Skill

## What to look for
1. Files with TODO/FIXME added in last 7 days
2. Functions > 50 lines (complexity risk)
3. Missing tests for recently added files
4. CI failures (check run log)

## Output format
Return ONLY markdown list, max 8 items

## Rules
- Skip auto-generated files
- Flag security issues as high priority
```

---

## Conceptual Model: School Analogy

### AGENTS.md = Job Titles

```
"Alice is the math teacher (triage-agent)"
├─ Role: Teach mathematics
├─ Personality: Patient, detail-oriented
├─ Input: Student questions
└─ Output: Answered questions, learning materials

"Bob is the chemistry teacher (maker-agent)"
├─ Role: Teach chemistry
├─ Personality: Hands-on, experimental
├─ Input: Lab experiments
└─ Output: Lab reports, student understanding

"Carol is the principal (checker-agent)"
├─ Role: Evaluate quality
├─ Personality: Critical, fair
├─ Input: Teacher performance
└─ Output: Performance reviews, improvements
```

**Purpose**: Define who does what and how they should behave

### SKILLS.md = Training Manuals

```
"Math Teaching Skill"
├─ How to explain algebra
├─ Common student mistakes
├─ Practice problems
└─ Assessment strategies

"Chemistry Teaching Skill"
├─ How to run experiments safely
├─ Lab equipment handling
├─ Calculation methods
└─ Safety protocols

"Management Skill"
├─ How to evaluate teacher performance
├─ Documentation standards
├─ Improvement planning
└─ Feedback delivery
```

**Purpose**: Document how to do the job well

---

## How They Work Together

```
Alice (triage-agent) gets to work:
│
├─ 1. Reads AGENTS.md (her job description)
│     "You are triage-agent. Find problems."
│
├─ 2. Reads loop-triage/SKILL.md (training manual)
│     "Check for: TODOs, complex functions, missing tests, CI failures"
│
├─ 3. Executes based on skill rules
│     ✓ Look for TODOs added in last 7 days
│     ✓ Check function length (>50 lines)
│     ✓ Find missing tests
│     ✓ Check CI failures
│
└─ 4. Makes decisions based on findings
      "3 issues found: 1 HIGH, 2 MED"

AGENTS.md says WHO YOU ARE
SKILLS.md says HOW TO DO IT

Agent = PERSONALITY (from AGENTS.md)
Agent = KNOWLEDGE (from SKILLS.md)
```

---

## File Structure

### AGENTS.md Structure

Located at: `/AGENTS.md`

```markdown
# AGENTS.md

Sub-agent definitions for this repo's loops. Each agent has a single responsibility.

---

## agent-name

**Role**: What does this agent do?
**Input**: What does it take in?
**Output**: What does it produce?
**Skill**: Which skill guides this agent?

**System prompt**:
```
Your personality and behavior guidelines...
```

---

## next-agent-name

... (more agents)
```

### SKILLS.md Structure

Located at: `/.skills/<skill-name>/SKILL.md`

```markdown
---
name: skill-name
description: One-line description
---

# Skill Name

## What to look for
List of things to check/do

## Output format
How to format the result

## Rules
Guidelines and constraints

## Examples
Sample scenarios and expected output
```

---

## Examples in Your Repo

### AGENTS.md Agents

```
1. triage-agent
   └─ Read state, find what to fix
   
2. maker-agent
   └─ Write code fixes
   
3. checker-agent
   └─ Review code quality
   
4. changelog-agent
   └─ Draft CHANGELOG
```

### SKILLS.md Skills

```
1. loop-triage/SKILL.md
   └─ How to find problems
   
2. minimal-fix/SKILL.md
   └─ How to fix issues cleanly
   
3. ci-reader/SKILL.md
   └─ How to read CI logs
   
4. changelog/SKILL.md
   └─ How to write changelog entries
   
5. coverage-reader/SKILL.md
   └─ How to read coverage reports
   
6. test-drafter/SKILL.md
   └─ How to write tests
```

---

## Key Relationships

### AGENTS.md Contains

| Element | Example |
|---------|---------|
| Agent name | `triage-agent` |
| Role/purpose | "Find problems in repo" |
| Input | STATE.md + git log + CI |
| Output | Updated STATE.md |
| System prompt | "You are a triage agent..." |
| Skill used | loop-triage |
| Plugins needed | GitHub API, CI reader |

### SKILLS.md Contains

| Element | Example |
|---------|---------|
| Skill name | loop-triage |
| Description | "Reads repo state and finds problems" |
| What to check | TODOs, complex functions, missing tests |
| Output format | Markdown list, max 8 items |
| Rules/constraints | Skip auto-generated files |
| Examples | "If file has no tests..." |

---

## When to Edit What

### Edit AGENTS.md when:

- You want to change an agent's role or responsibility
- You want to change what an agent should focus on (system prompt)
- You want to add a new agent to the workflow
- You want to change inputs/outputs
- You want to assign a different skill to an agent

**Example change**:
```markdown
# BEFORE
**Role**: Find problems. Never write code.

# AFTER  
**Role**: Find problems AND suggest fixes (but don't implement)
```

### Edit SKILLS.md (SKILL.md) when:

- You want to improve HOW an agent does its job
- You want to add new checking criteria
- You want to clarify rules or constraints
- You want to add examples
- You want to change output format

**Example change**:
```markdown
# BEFORE
## What to look for
1. Files with TODO/FIXME

# AFTER
## What to look for
1. Files with TODO/FIXME (added in last 7 days)
2. Functions > 50 lines
3. Missing tests
4. CI failures
```

---

## Workflow: How Orchestrator Uses Both

```
Loop Orchestrator starts:
│
├─ 1. Reads AGENTS.md
│     "I have 4 agents: triage, maker, checker, changelog"
│
├─ 2. Spawns triage-agent with system prompt from AGENTS.md
│     System prompt: "You are triage-agent. Find problems..."
│
├─ 3. Triage-agent reads loop-triage/SKILL.md
│     Skill: "Check TODOs, complexity, tests, CI"
│
├─ 4. Triage-agent executes and finds 3 issues
│
├─ 5. Orchestrator reads AGENTS.md again
│     "Next agent is maker-agent"
│
├─ 6. Spawns maker-agent with issues from triage
│     System prompt: "You are maker-agent. Fix these..."
│
├─ 7. Maker-agent reads minimal-fix/SKILL.md
│     Skill: "Use type hints, add docstrings, output code only"
│
├─ 8. Maker-agent implements fixes
│
└─ ... (continues for checker, changelog)
```

---

## Comparison Table

| Aspect | AGENTS.md | SKILLS.md (SKILL.md) |
|--------|-----------|----------------------|
| **Defines** | Agent personalities | Knowledge/procedures |
| **File location** | `/AGENTS.md` | `/.skills/<*/SKILL.md` |
| **How many** | One file | Many files (one/skill) |
| **Structure** | Markdown headings | YAML + Markdown |
| **Contains** | System prompts | How-to guides/rules |
| **Read by** | Orchestrator, agents | Developers, agents |
| **Use case** | Tell agent WHO to be | Tell agent WHAT to do |
| **Example** | "You are triage-agent" | "Check for TODOs" |
| **Scope** | Global (all workflow) | Per-skill (reusable) |
| **Change frequency** | Rarely (role changes) | Often (process improvements) |
| **Team editing** | Tech lead | Individual contributors |

---

## Real-World Scenario

### Situation: Performance is slow

**Triage-agent takes too long, finding many false positives**

#### Option 1: Edit AGENTS.md (Role change)
```markdown
# BEFORE
**Role**: Find all problems in repo. Be thorough.

# AFTER
**Role**: Find critical problems only (blockers). Skip minor issues.
```
Result: Agent's personality changes, it focuses differently

#### Option 2: Edit loop-triage/SKILL.md (Process improvement)
```markdown
# BEFORE
## What to look for
1. All TODOs (thousands)
2. All functions > 40 lines
3. All missing tests

# AFTER
## What to look for
1. TODOs from last 7 days (not all)
2. Functions > 80 lines (only really complex)
3. Missing tests on recent files (not old code)
```
Result: Same agent, but uses better filtering, finds fewer but more relevant issues

**Which to change?**
- Change AGENTS.md if you want to CHANGE RESPONSIBILITY
- Change SKILL.md if you want to IMPROVE EXECUTION

---

## Key Takeaway

```
AGENTS.md = WHO (personality, role, responsibility)
SKILLS.md = HOW (procedures, rules, execution details)

Together they form a complete agent:
Agent = Personality (AGENTS.md) + Knowledge (SKILLS.md)

Analogy:
├─ AGENTS.md = "This is Alice, the triage expert"
└─ SKILLS.md = "Here's how to do triage well"

Alice reads both to know:
├─ WHO she is (AGENTS.md)
└─ HOW to do her job (SKILLS.md)
```

---

## Summary

**AGENTS.md answers**: "Who does what?"
- Defines personalities
- Assigns responsibilities
- Sets expectations
- Provides system prompts

**SKILLS.md answers**: "How do they do it?"
- Documents procedures
- Provides checklists
- Explains rules
- Shares examples

Both are needed. They work together.

**Remember**: 
- Change AGENTS.md to change RESPONSIBILITY
- Change SKILLS.md to improve HOW
- Both describe the same agent, just different aspects
