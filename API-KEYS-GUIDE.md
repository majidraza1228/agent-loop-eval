# 🔐 API Keys & Authentication Guide

## Quick Answer

| Scenario | Need OPENAI_API_KEY? | Need GitHub Token? | Notes |
|----------|:---:|:---:|---|
| **GitHub Copilot (built-in)** | ❌ No | ✅ Yes | Uses GitHub's API |
| **Copilot CLI** | ✅ Yes* | ⚠️ Optional | Can use OpenAI OR GitHub |
| **Agent running in GitHub Actions** | ✅ Yes | ✅ Yes | Both required |
| **Local development (your machine)** | ✅ Yes | ✅ Yes | Full access needed |

*Can use GitHub Copilot model instead

---

## 🎯 Scenario 1: GitHub Copilot (Built-in)

### ✅ You DON'T Need OPENAI_API_KEY

**Where:** GitHub.com → Copilot UI (integrated)

```
GitHub Copilot
    ↓ (Uses GitHub's API)
    ✅ No OPENAI_API_KEY needed
    ✅ No setup required
    ✅ Billed through GitHub
```

**What you need:**
- GitHub account (free or paid Copilot subscription)
- Internet connection
- That's it! ✅

**Example:**
```
Open GitHub → Click "Copilot" button → Start chatting
No env vars, no keys, just works
```

---

## 🚀 Scenario 2: Copilot CLI (What You're Using)

### ✅ You CAN Use GitHub Copilot Model (No OpenAI Key!)

**Copilot CLI has 3 auth options:**

#### **Option A: GitHub Copilot Model** (Recommended for Teams)
```bash
# Use GitHub's Copilot (included with GitHub subscription)
copilot -i "your task"

# ✅ No OPENAI_API_KEY needed
# ✅ Uses your GitHub Copilot subscription
# ⚠️ Requires GitHub token
```

**Setup:**
```bash
# 1. GitHub token (one time)
gh auth login
# Follow prompts, GitHub token is stored

# 2. Run agent
copilot -i "search for TODOs"

# That's it! Uses GitHub Copilot model automatically
```

---

#### **Option B: OpenAI Model** (If You Prefer)
```bash
# Use OpenAI directly
export OPENAI_API_KEY="sk-..."

copilot -i "your task"

# ✅ OPENAI_API_KEY required
# ✅ Uses OpenAI's GPT models
# ✅ Billed per API call ($0.05/1k tokens)
```

**Setup:**
```bash
# 1. Get OpenAI key from https://platform.openai.com/api/keys
# 2. Set env var
export OPENAI_API_KEY="sk-your-key-here"

# 3. Run agent
copilot -i "your task"
```

---

#### **Option C: Hybrid** (Most Flexible)
```bash
# Can use either, depending on your setup
gh auth login                              # GitHub token
export OPENAI_API_KEY="sk-..."            # OpenAI key (optional)

copilot config set model github-copilot   # Use GitHub
# OR
copilot config set model gpt-4            # Use OpenAI
```

---

## 💰 Cost Comparison

| Option | Cost | Setup | Speed |
|--------|------|-------|-------|
| **GitHub Copilot Model** | Flat subscription (~$20/mo) | Easy | Fast |
| **OpenAI API** | Per token (~$0.05/1k) | Medium | Fast |
| **Both** | Subscription + usage | Hard | Choose per task |

**Recommendation for Teams:**
- Use **GitHub Copilot Model** (simpler, predictable cost)
- Setup GitHub token once
- No OpenAI key needed

---

## 🔧 Setup for Your NEW Projects

### **For GitHub Copilot Model (Recommended)**

**Step 1: Setup GitHub token** (one time)
```bash
gh auth login
# Follow prompts, token saved to ~/.config/gh/hosts.yml
```

**Step 2: Start using Copilot CLI**
```bash
copilot -i "your agent task"
# ✅ Works! Uses GitHub Copilot

# Open canvases
open_canvas({ canvasId: "agent-loop-eval" })
```

**Step 3: No more setup needed!**
```bash
# Your Agent Loop Evaluator works with GitHub Copilot
# Metrics dashboard tracks performance
# All automatic ✅
```

---

### **For OpenAI Model** (If You Prefer)

**Step 1: Get OpenAI key**
```bash
# Go to https://platform.openai.com/api/keys
# Create new secret key
# Copy: sk-...
```

**Step 2: Set environment variable**
```bash
export OPENAI_API_KEY="sk-your-key-here"

# Permanent setup (add to ~/.zshrc or ~/.bashrc)
echo 'export OPENAI_API_KEY="sk-..."' >> ~/.zshrc
source ~/.zshrc
```

**Step 3: Start using**
```bash
copilot -i "your agent task"
# ✅ Works! Uses OpenAI GPT-4
```

---

## 📊 GitHub Actions / CI-CD

### **In GitHub Actions:** You Need Both!

```yaml
# .github/workflows/agent-test.yml
name: Test Agents
on: [pull_request]

env:
  # GitHub token (built-in)
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  
  # OpenAI key (add to repo secrets)
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test agents
        run: |
          for task in $(cat .github/agent-tasks.txt); do
            copilot -i "$task"
            # Canvas tracking + metrics work automatically
          done
```

**Setup secrets in GitHub:**
1. Go to repo → Settings → Secrets
2. Add `OPENAI_API_KEY` (if using OpenAI)
3. `GITHUB_TOKEN` is automatic

---

## 🎯 For Your NEW Projects: Recommended Setup

### **Option 1: GitHub Copilot (Easiest for Teams)** ⭐

```bash
# Setup (one time)
gh auth login
extensions_reload

# Then:
copilot -i "build my agent"
open_canvas({ canvasId: "agent-loop-eval" })

# ✅ All automatic
# ✅ No API keys needed
# ✅ Metrics dashboard works
# ✅ Team can reproduce
```

**Why this is best:**
- ✅ No API keys to manage
- ✅ Works for all team members
- ✅ Predictable cost (subscription)
- ✅ Canvas tracking works automatically
- ✅ Metrics persist and sync

---

### **Option 2: OpenAI (More Control)**

```bash
# Setup (one time)
export OPENAI_API_KEY="sk-..."

# Then:
copilot -i "build my agent"
open_canvas({ canvasId: "agent-loop-eval" })

# ✅ Canvas works
# ✅ Metrics tracked
# ⚠️ Need to manage API key
```

**Why this option:**
- ✅ More LLM model choices
- ✅ Direct control over cost
- ✅ Can limit usage per team member

---

## ❓ FAQ

**Q: Do the Agent Loop Evaluator canvases require API keys?**
A: No! The canvases themselves don't. They monitor the agent you're running. The agent needs a key (GitHub or OpenAI).

**Q: Which is cheaper: GitHub Copilot or OpenAI?**
A: Depends on usage. For 10+ users: GitHub Copilot (~$20/user/mo). For 1-2 users: OpenAI pay-per-use might be cheaper.

**Q: Can my team use different auth?**
A: Yes! Each person can have their own OpenAI key or GitHub token. Metrics still aggregate in dashboard.

**Q: What if I forget to set OPENAI_API_KEY?**
A: If using GitHub Copilot, not needed. If using OpenAI and forget, you'll get auth error. Set it and retry.

**Q: Do metrics require authentication?**
A: No. Metrics dashboard stores data locally in `~/.copilot/metrics/`. No auth needed.

**Q: For GitHub Actions, which auth do I use?**
A: Use secrets. GITHUB_TOKEN (free, built-in) + OPENAI_API_KEY (paid, optional). If using GitHub Copilot model, GITHUB_TOKEN is enough.

---

## 🚀 Quick Decision Tree

```
Do you have GitHub Copilot subscription?
  ├─ YES → Use GitHub Copilot model ✅
  │        gh auth login
  │        copilot -i "task"
  │        No OPENAI_API_KEY needed
  │
  └─ NO  → Use OpenAI ✅
           export OPENAI_API_KEY="sk-..."
           copilot -i "task"

In either case:
  ✅ Agent Loop Evaluator works
  ✅ Metrics dashboard tracks performance
  ✅ Canvases visualize loops
```

---

## 📝 Setup Checklist

### **For GitHub Copilot (Most Common)**
- [ ] GitHub account with Copilot subscription
- [ ] Run: `gh auth login`
- [ ] Verify: `gh auth status`
- [ ] Start: `copilot -i "task"`
- [ ] Open canvas: `open_canvas({ canvasId: "agent-loop-eval" })`

### **For OpenAI**
- [ ] Create OpenAI account
- [ ] Get API key from platform.openai.com
- [ ] Run: `export OPENAI_API_KEY="sk-..."`
- [ ] Verify: `echo $OPENAI_API_KEY` (shows key)
- [ ] Start: `copilot -i "task"`

### **For GitHub Actions**
- [ ] Add `OPENAI_API_KEY` to repo secrets (if using)
- [ ] GitHub token auto-available as `GITHUB_TOKEN`
- [ ] Run agents in workflow
- [ ] Metrics auto-track

---

## ✅ Bottom Line

**You asked:** "If I run from GitHub Copilot, do I need OPENAI_API_KEY?"

**Answer:** 
- ✅ NO, you don't need it
- ✅ Just use `gh auth login` for GitHub token
- ✅ Agent Loop Evaluator & metrics work automatically
- ✅ This is the recommended setup for teams

See `QUICKSTART.md` for one-time GitHub token setup!
