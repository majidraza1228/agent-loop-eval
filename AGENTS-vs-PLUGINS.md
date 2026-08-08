# Agents vs Plugins: When to Create Each

## Quick Answer

| **PLUGIN** | **AGENT** |
|-----------|----------|
| **Adds tools** (HOW to do) | **Makes decisions** (WHEN/WHY to do) |
| Slack API, GitHub connector | Triage worker, maker worker |
| Passive (called by agents) | Active (runs on schedule) |
| Used by multiple agents | Standalone decision-maker |

---

## Core Difference

### PLUGIN = Capability Extension
- **Purpose**: Add new tools/integrations
- **Question it answers**: "How do I talk to X?" or "How do I do Y?"
- **Acts like**: Library, SDK, wrapper, function
- **Lifecycle**: On-demand (agent calls it)
- **Examples**: Slack API, GitHub connector, CI log parser

### AGENT = Autonomous Worker
- **Purpose**: Make autonomous decisions
- **Question it answers**: "Who decides what to do?" or "When should this run?"
- **Acts like**: Employee, bot, autonomous worker
- **Lifecycle**: Runs on schedule or event trigger
- **Examples**: Triage agent, maker agent, checker agent

---

## Factory Analogy

### AGENTS = Workers (Decision Makers)
```
├─ Alice (triage-agent)
│  "My job: Inspect products for defects"
│  
├─ Bob (maker-agent)
│  "My job: Fix the defects"
│  
├─ Carol (checker-agent)
│  "My job: Quality check Bob's work"
│  
└─ David (changelog-agent)
   "My job: Document what changed"

Workers DECIDE WHAT TO DO
```

### PLUGINS = Tools & Machines (Executors)
```
├─ Slack notifier
│  "I send messages to Slack"
│  
├─ GitHub API client
│  "I read/write to GitHub repos"
│  
├─ CI log reader
│  "I parse CI logs and extract errors"
│  
├─ Coverage tool
│  "I read coverage reports"
│  
└─ Deploy script runner
   "I execute deployment commands"

Tools DO WHAT WORKERS TELL THEM TO DO
```

---

## How They Work Together

```
Alice (worker/agent) uses:
  ├─ CI log reader plugin → "What failed?"
  ├─ GitHub API plugin → "What's changed?"
  └─ Coverage tool plugin → "What's untested?"

Alice decides: "3 things need fixing"
  └─ Tells Bob to fix them

Bob (worker/agent) uses:
  └─ GitHub API plugin → "Create PR with fixes"

Bob finishes, Carol (worker/agent) uses:
  ├─ GitHub API plugin → "Review the PR"
  └─ CI log reader plugin → "Are tests passing?"

David (worker/agent) uses:
  ├─ Git tool plugin → "Get recent commits"
  └─ Slack plugin → "Announce what changed"

WORKERS make decisions, use TOOLS to execute

AGENT = WHO DECIDES
PLUGIN = HOW TO EXECUTE
```

---

## Decision Tree: Plugin or Agent?

```
START HERE: "What problem are you solving?"
│
├─ "I need to connect to a 3rd party (Slack, GitHub, Jira, etc.)"
│  └─ CREATE A PLUGIN ✅
│
├─ "I need to parse/read something (logs, reports, files)"
│  └─ CREATE A PLUGIN ✅
│
├─ "I need to run commands/scripts repeatedly"
│  └─ CREATE A PLUGIN ✅
│
├─ "I need to DECIDE what to do (autonomously)"
│  └─ CREATE AN AGENT ✅
│
├─ "I need something to RUN ON A SCHEDULE"
│  └─ CREATE AN AGENT ✅
│
├─ "I need something to COORDINATE other agents"
│  └─ CREATE AN AGENT ✅
│
└─ "I'm not sure..."
   └─ Ask: "Does it make decisions autonomously?"
      ├─ YES → AGENT ✅
      └─ NO  → PLUGIN ✅
```

---

## Real Examples

### PLUGIN Examples (Tools & Integrations)

#### 1. Slack Notifier Plugin
- **What**: Sends messages to Slack
- **When**: Triage-agent says "Hey, send update to team"
- **How**: Uses Slack webhook

#### 2. GitHub API Plugin
- **What**: Read/write GitHub (PRs, issues, repos)
- **When**: Maker-agent says "Create PR with my fix"
- **How**: Uses GitHub REST API

#### 3. CI Reader Plugin
- **What**: Parse CI logs
- **When**: Triage-agent says "What failed?"
- **How**: Fetches GitHub Actions logs, extracts errors

#### 4. Coverage Plugin
- **What**: Read coverage reports
- **When**: Checker-agent says "What's not tested?"
- **How**: Parses coverage.xml, finds gaps

#### 5. Deploy Plugin
- **What**: Run deployment scripts
- **When**: Release-agent says "Deploy to production"
- **How**: SSH/kubectl/terraform

### AGENT Examples (Autonomous Workers)

#### 1. Triage-Agent
```
Role: Find problems
Uses plugins: GitHub API, CI reader, coverage reader
Runs: Every day at 9 AM
Decides: "3 issues found, prioritize as high/med/low"
```

#### 2. Maker-Agent
```
Role: Fix problems
Uses plugins: GitHub API, code formatter
Runs: When triage finds issues
Decides: "I'll write tests, update changelog, create PR"
```

#### 3. Checker-Agent
```
Role: Review fixes
Uses plugins: GitHub API, CI reader
Runs: After maker creates PR
Decides: "PASS - merge it" or "FAIL - needs changes"
```

#### 4. Changelog-Agent
```
Role: Document changes
Uses plugins: Git tool, Slack notifier
Runs: Daily at EOD
Decides: "Group commits as Added/Changed/Fixed/Removed"
```

#### 5. Dependency-Update-Agent
```
Role: Keep dependencies fresh
Uses plugins: NPM API, GitHub API
Runs: Weekly
Decides: "Bump 3 packages, test, create PR"
```

---

## Common Scenarios

### Scenario 1: "I want to send alerts to Slack"
```
Question: Who decides when to send?

If triage-agent decides:
├─ Agent: triage-agent (decides "send alert")
└─ Plugin: slack-notifier (does the sending)

If you want automated alerts:
├─ Agent: alert-agent (runs on schedule)
└─ Plugin: slack-notifier (triage-agent uses it)
```

### Scenario 2: "I want to auto-merge safe PRs"
```
Question: What decides if a PR is safe?

Create Agent: pr-merger-agent
├─ Uses plugin: GitHub API
├─ Runs: On every PR
└─ Decides: "Tests pass + coverage > 80% → merge"
```

### Scenario 3: "I need to connect to our internal API"
```
Question: Do agents use it, or does it decide things?

If agents USE it to fetch data:
└─ Create Plugin: internal-api-client

If it COORDINATES work autonomously:
└─ Create Agent: workflow-coordinator-agent
```

### Scenario 4: "I want daily deployment reports"
```
Question: Who creates the report?

Create Agent: report-generator-agent
├─ Runs: Daily at 5 PM
└─ Uses plugins: Deploy API, Slack notifier

Uses Plugin: deploy-api-reader
```

---

## Decision Checklist

Ask these questions in order:

```
1. "Does it make autonomous decisions?"
   ├─ YES → AGENT ✅
   └─ NO  → Continue to Q2

2. "Is it a tool/integration/wrapper?"
   ├─ YES → PLUGIN ✅
   └─ NO  → Continue to Q3

3. "Do other agents use it?"
   ├─ YES → PLUGIN ✅
   └─ NO  → Continue to Q4

4. "Does it run on a schedule?"
   ├─ YES → AGENT ✅
   └─ NO  → Continue to Q5

5. "Is it reactive to events (PR, issue, commit)?"
   ├─ YES → AGENT ✅
   └─ NO  → Hmm, rethink the design
```

---

## Quick Reference Table

| Criteria | PLUGIN | AGENT |
|----------|--------|-------|
| **Makes decisions** | NO (passive) | YES (active) |
| **Runs autonomously** | NO (on-demand) | YES (schedule/event) |
| **Used by others** | YES (reusable) | NO (standalone) |
| **Location** | `tools/`, `plugins/` | `AGENTS.md`, `starters/` |
| **When to create** | Need new capability | Need autonomous work |
| **Examples** | Slack, GitHub API | Triage, maker |
| **Lifecycle** | Function call | Scheduled or event |
| **Can fail safely** | Plugin handles it | Orchestrator retries |
| **Integrates with** | Agents | Other agents |
| **Single concern** | "How to do X" | "When/why to do X" |

---

## Architecture: How They Fit Together

```
Loop Orchestrator (Scheduler)
│
├─ Triage-Agent (AGENT)
│  ├─ Uses: GitHub API plugin
│  ├─ Uses: CI reader plugin
│  └─ Uses: Coverage plugin
│  └─ Runs: Daily 9 AM
│  └─ Decides: "3 issues found"
│
├─ Maker-Agent (AGENT)
│  ├─ Uses: GitHub API plugin
│  ├─ Uses: Code formatter plugin
│  └─ Runs: When triage finds issues
│  └─ Decides: "I'll fix issue #1"
│
├─ Checker-Agent (AGENT)
│  ├─ Uses: GitHub API plugin
│  ├─ Uses: CI reader plugin
│  └─ Runs: After maker creates PR
│  └─ Decides: "Tests pass, merge it"
│
└─ Changelog-Agent (AGENT)
   ├─ Uses: Git tool plugin
   ├─ Uses: Slack notifier plugin
   └─ Runs: Daily 6 PM
   └─ Decides: "Announce what changed"

PLUGINS (Passive Tools):
├─ GitHub API client
├─ CI reader
├─ Coverage reader
├─ Code formatter
├─ Git tool
├─ Slack notifier
└─ Deploy runner
```

Flow:
1. Orchestrator spawns triage-agent
2. Triage-agent uses GitHub API plugin (reads repos)
3. Triage-agent uses CI reader plugin (checks failures)
4. Triage-agent uses coverage plugin (finds untested code)
5. Triage-agent returns findings
6. Orchestrator spawns maker-agent with findings
7. Maker-agent uses GitHub API plugin (creates PR)
8. Orchestrator spawns checker-agent
9. Checker-agent uses GitHub API plugin (reviews)
10. Checker-agent uses CI reader plugin (checks tests)
11. Orchestrator spawns changelog-agent
12. Changelog-agent uses Slack notifier plugin (announces)

Each AGENT makes decisions
Each AGENT uses PLUGINS to execute
Orchestrator coordinates AGENTS

---

## Golden Rule

```
If you're building:
├─ Something that DECIDES → AGENT 🤖
├─ Something that EXECUTES → PLUGIN 🔧
├─ Something that COORDINATES → AGENT 🤖
└─ Something that INTEGRATES → PLUGIN 🔧

AGENT = Thinking (decisions, strategy, logic)
PLUGIN = Doing (tools, integrations, execution)
```

---

## Summary

**You MUST understand:**
- Agents are autonomous workers that make decisions
- Plugins are tools that agents use
- Agents coordinate with other agents
- Plugins are shared utilities
- One loop orchestrator coordinates everything

**Create an AGENT when:**
- You need autonomous work running on schedule
- You need something to decide between options
- You need to coordinate other agents

**Create a PLUGIN when:**
- You need to integrate with external service
- You need to parse/read something
- Other agents will reuse the tool
- You're building a utility/library

Start with the decision tree, ask "Does this decide things autonomously?" — if YES, it's an agent. If NO, it's a plugin.
