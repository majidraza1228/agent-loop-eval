# Deployment Guide: Agent Loop Evaluator

This guide covers how to deploy and share the Agent Loop Evaluator canvas.

---

## 📍 Current Status

Your canvas is currently **session-scoped** (exists only in this session).

To deploy it, you need to move it to a **persistent location** and share it.

---

## 🚀 Deployment Options

### **Option 1: Commit to Project (Recommended for Teams)**

Move the canvas to `.github/extensions/` so it's committed to your repo and available to all team members.

**Steps:**

```bash
# 1. Copy extension from session to project
mkdir -p .github/extensions/agent-loop-eval
cp -r ~/.copilot/session-state/*/extensions/agent-loop-eval/* .github/extensions/agent-loop-eval/

# 2. Verify it was copied
ls .github/extensions/agent-loop-eval/
# Should show: extension.mjs, config.json

# 3. Commit to repo
git add .github/extensions/agent-loop-eval/
git commit -m "Add Agent Loop Evaluator canvas extension

Shared canvas for all team members to:
- Visualize agent loops in real-time
- Track turns and tool calls
- Auto-evaluate agent quality (0-10 score)
- Optimize agent efficiency

Configurable budget limit via config.json or canvas input.

To use: open_canvas({ canvasId: 'agent-loop-eval', instanceId: 'eval-1' })"

# 4. Push to GitHub
git push origin main

# 5. All team members can now use it!
# They'll see it automatically on next copilot reload
```

**Result:** Everyone on your team can use it! ✅

---

### **Option 2: Share via Gist (Quick Sharing)**

Share the canvas with others via a private GitHub gist.

```bash
# Use the share_extension tool
share_extension({ 
  name: "agent-loop-eval", 
  scope: "session" 
})

# Returns: https://gist.github.com/your-username/abc123
```

**Recipient installs it:**
```bash
install_extension({
  url: "https://gist.github.com/your-username/abc123",
  scope: "user"  # Personal use
})
```

**Use case:** Share with colleagues, external teams, etc.

---

### **Option 3: Publish to Team (Full Setup)**

Deploy the entire evaluation framework:

1. **Commit canvas** to `.github/extensions/`
2. **Add docs** (README, DEVELOPER-GUIDE, REAL-TASKS)
3. **Create GitHub issue template** for agent testing
4. **Setup CI/CD workflows** for automated testing

**Steps:**

```bash
# 1. Move canvas to project (Option 1)

# 2. Verify all docs are committed
git log --oneline | grep -E "Agent Loop|canvas|eval"

# 3. Create team documentation
cat >> .github/AGENT-TESTING.md << 'EOF'
# Agent Testing with Loop Evaluator

All agents must score ≥8/10 before merge.

## Quick Start

1. Open canvas: 
   open_canvas({ canvasId: "agent-loop-eval", instanceId: "test-1" })

2. Send your agent task

3. Check verdict when idle

4. If PASS: you're good! If REVIEW/FAIL: optimize and retry
EOF

# 4. Commit
git add .github/extensions/ DEVELOPER-GUIDE.md README-hello-world.md
git commit -m "Deploy Agent Loop Evaluator to production

- Canvas committed to .github/extensions/
- All team members can now use it
- See DEVELOPER-GUIDE.md for usage
- Minimum score: 8/10 before production"

git push origin main
```

**Result:** Production-ready agent testing framework ✅

---

## 🔧 CI/CD Integration

### **GitHub Actions Workflow**

Create `.github/workflows/test-agents.yml`:

```yaml
name: Test Agent Loops

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Copilot CLI
        run: npm install -g @github/copilot-cli
      
      - name: Test Agent Task 1
        run: |
          result=$(copilot -i "Find all Python files in patterns/ and count decorators")
          verdict=$(echo "$result" | grep -o "PASS\|FAIL\|REVIEW")
          if [ "$verdict" != "PASS" ]; then
            echo "Agent task 1 failed: $verdict"
            exit 1
          fi
      
      - name: Test Agent Task 2
        run: |
          result=$(copilot -i "Read README.md and summarize top 3 concepts")
          verdict=$(echo "$result" | grep -o "PASS\|FAIL\|REVIEW")
          if [ "$verdict" != "PASS" ]; then
            echo "Agent task 2 failed: $verdict"
            exit 1
          fi
      
      - name: ✅ All agents passed!
        run: echo "All agent tests PASSED"
```

**Result:** Agents auto-tested on every PR ✅

---

## 📦 Setup Checklist

Before deploying to production, verify:

- [ ] Canvas committed to `.github/extensions/agent-loop-eval/`
- [ ] `config.json` includes your team's budget limits
- [ ] `DEVELOPER-GUIDE.md` shared with team
- [ ] Team members can open canvas: `extensions_reload` then `open_canvas(...)`
- [ ] CI/CD workflow created and tested
- [ ] Documentation linked in README
- [ ] All team members trained on usage

---

## 👥 Team Deployment Workflow

### **For Team Leads:**

1. **Commit canvas to `.github/extensions/`**
2. **Create `.github/AGENT-TESTING.md`** with guidelines
3. **Pin message in #engineering Slack** with quick start
4. **Announce:** "Agent Loop Evaluator is now available. See DEVELOPER-GUIDE.md"

### **For Team Members:**

1. **Pull latest code:** `git pull`
2. **Reload extensions:** `extensions_reload`
3. **Open canvas:** `open_canvas({ canvasId: "agent-loop-eval", instanceId: "mytest" })`
4. **Test your agent task**
5. **Check verdict** → If PASS, you're good!

---

## 🎯 Production Deployment Checklist

| Step | Status | Details |
|------|--------|---------|
| Move to project scope | — | `cp` to `.github/extensions/` |
| Commit to git | — | `git add && git commit && git push` |
| Team documentation | — | Create `.github/AGENT-TESTING.md` |
| CI/CD workflow | — | Add `.github/workflows/test-agents.yml` |
| Budget configuration | — | Set team defaults in `config.json` |
| Team training | — | Share DEVELOPER-GUIDE.md |
| Monitoring | — | Track verdict scores over time |

---

## 🚀 Quick Deploy (Right Now)

```bash
# 1. Move to project scope
mkdir -p .github/extensions/agent-loop-eval
cp -r ~/.copilot/session-state/0357ec81-fbf2-4ea1-8b13-5adcf09b4b3d/extensions/agent-loop-eval/* \
  .github/extensions/agent-loop-eval/

# 2. Verify
ls .github/extensions/agent-loop-eval/

# 3. Commit
git add .github/extensions/agent-loop-eval/ && \
git commit -m "Deploy Agent Loop Evaluator canvas to production" && \
git push origin main

# 4. All team members reload extensions
# (they'll get the new canvas automatically)
```

**Done!** ✅ Canvas is now deployed.

---

## 📊 Monitoring & Metrics

After deployment, track:

```bash
# Check agent verdicts over time
git log --oneline | grep -i "verdict\|score\|pass"

# Monitor turn count averages
# (Add to your dashboards/monitoring tools)
```

---

## 🆘 Troubleshooting

**Problem:** Canvas not showing after team member pulls
- **Solution:** Run `extensions_reload` to pick up new extensions

**Problem:** Budget limit not applying
- **Solution:** Verify `config.json` is in `.github/extensions/agent-loop-eval/`

**Problem:** CI/CD test fails
- **Solution:** Check if Copilot CLI is installed and authenticated

---

## 📚 Documentation

After deployment, share with team:

1. **README-hello-world.md** — Getting started guide
2. **DEVELOPER-GUIDE.md** — How to optimize agents
3. **REAL-TASKS.md** — Example tasks to try
4. `.github/AGENT-TESTING.md` — Team guidelines

---

## Next Steps

**Ready to deploy?**

1. Run the quick deploy commands above ⬆️
2. Push to GitHub
3. Announce to team
4. Everyone uses it! 🚀

**Questions?** Check DEVELOPER-GUIDE.md or open an issue.
