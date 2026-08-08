import { createServer } from "node:http";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";
import fs from "node:fs/promises";
import path from "node:path";

const servers = new Map();
const loopData = new Map();

// Load configuration
let config = { budgetLimit: 15, autoRefreshInterval: 2000 };
async function loadConfig() {
    try {
        const configPath = new URL("./config.json", import.meta.url);
        const data = await fs.readFile(configPath, "utf-8");
        const parsed = JSON.parse(data);
        config = {
            budgetLimit: parsed.budgetLimit || parsed.settings?.turnBudget?.value || 15,
            autoRefreshInterval: parsed.settings?.autoRefreshInterval || 2000,
        };
    } catch (e) {
        // Use defaults if config not found
    }
}

await loadConfig();

function renderHtml(instanceId, budgetLimit = 15) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Agent Loop Evaluator</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 1.5rem;
        background: var(--background-color-default, #ffffff);
        color: var(--text-color-default, #1f2328);
        font-family: var(--font-sans, system-ui, sans-serif);
        font-size: 14px;
        line-height: 1.5;
      }
      h1 {
        margin: 0 0 1rem 0;
        font-size: 20px;
        font-weight: 600;
      }
      .config-badge {
        display: inline-block;
        background: var(--true-color-blue, #0969da);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 0.5rem;
      }
      .section {
        margin-bottom: 2rem;
      }
      .status {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-radius: 6px;
        background: var(--color-focus-outline, #f0f1f6);
      }
      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-weight: 600;
        font-size: 12px;
      }
      .status-badge.running {
        background: var(--true-color-blue, #0969da);
        color: white;
      }
      .status-badge.idle {
        background: var(--true-color-green, #1a7f37);
        color: white;
      }
      .status-badge.error {
        background: var(--true-color-red, #cf222e);
        color: white;
      }
      .timeline {
        border-left: 2px solid var(--border-color-default, #d0d7de);
        padding-left: 1.5rem;
        margin-left: 0.5rem;
      }
      .turn {
        margin-bottom: 1.5rem;
        padding: 1rem;
        border-radius: 6px;
        background: var(--background-color-inset, #f6f8fa);
      }
      .turn-header {
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .turn-tools {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background: var(--background-color-default, #ffffff);
        border-radius: 4px;
        font-size: 12px;
        font-family: var(--font-mono, monospace);
      }
      .eval-verdict {
        padding: 1.5rem;
        border-radius: 6px;
        border: 2px solid;
      }
      .eval-verdict.pass {
        border-color: var(--true-color-green, #1a7f37);
        background: rgba(26, 127, 55, 0.05);
      }
      .eval-verdict.fail {
        border-color: var(--true-color-red, #cf222e);
        background: rgba(207, 34, 46, 0.05);
      }
      .eval-verdict.review {
        border-color: var(--true-color-blue, #0969da);
        background: rgba(9, 105, 218, 0.05);
      }
      .eval-verdict-title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 0.75rem;
      }
      .eval-checks {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .eval-checks li {
        padding: 0.5rem 0;
        display: flex;
        gap: 0.5rem;
      }
      .check-mark {
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .check-mark.pass::before { content: "✓"; color: var(--true-color-green, #1a7f37); font-weight: bold; }
      .check-mark.fail::before { content: "✗"; color: var(--true-color-red, #cf222e); font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Agent Loop Evaluator <span class="config-badge">Budget: ${budgetLimit}</span></h1>
    <div id="app"></div>
    <script>
      async function fetchLoop() {
        try {
          const res = await fetch('${instanceId}');
          const data = await res.json();
          renderLoop(data);
        } catch (e) {
          document.getElementById('app').innerHTML = '<p style="color: red;">Failed to load loop data</p>';
        }
      }
      function renderLoop(data) {
        const app = document.getElementById('app');
        const statusClass = data.status === 'running' ? 'running' : data.status === 'idle' ? 'idle' : 'error';
        const hasTaskComplete = data.events.some(e => e.type === 'session.task_complete');
        
        app.innerHTML = \`
          <div class="section">
            <div class="status">
              <span class="status-badge \${statusClass}">\${data.status.toUpperCase()}</span>
              <span>Turns: \${data.turns} | Task Complete: \${hasTaskComplete ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div class="section">
            <h2>Loop Timeline</h2>
            <div class="timeline">
              \${data.turns > 0 ? renderTurns(data.turns, data.events) : '<p style="color: var(--text-color-muted, #656d76);">No turns yet</p>'}
            </div>
          </div>
          <div class="section">
            \${data.verdict ? renderVerdict(data.verdict) : '<p>Waiting for idle state...</p>'}
          </div>
        \`;
      }
      function renderTurns(turnCount, events) {
        let html = '';
        for (let i = 1; i <= turnCount; i++) {
          const tools = events.filter(e => e.type === 'tool.execution_complete' && e.turn === i);
          const toolList = tools.map(t => t.tool_name).join(', ');
          html += \`
            <div class="turn">
              <div class="turn-header">Turn \${i}</div>
              <div>Tools: \${toolList || 'None (final response)'}</div>
              \${toolList ? '<div class="turn-tools">' + toolList + '</div>' : ''}
            </div>
          \`;
        }
        return html;
      }
      function renderVerdict(verdict) {
        const className = verdict.status === 'pass' ? 'pass' : verdict.status === 'fail' ? 'fail' : 'review';
        return \`
          <div class="eval-verdict \${className}">
            <div class="eval-verdict-title">Evaluation: \${verdict.status.toUpperCase()}</div>
            <ul class="eval-checks">
              \${verdict.checks.map(check => \`
                <li>
                  <span class="check-mark \${check.pass ? 'pass' : 'fail'}"></span>
                  <span>\${check.message}</span>
                </li>
              \`).join('')}
            </ul>
            \${verdict.score ? '<p style="margin-top: 1rem; font-size: 12px;">Score: ' + verdict.score + '/10</p>' : ''}
          </div>
        \`;
      }
      fetchLoop();
      setInterval(fetchLoop, 2000);
    </script>
  </body>
</html>`;
}

async function startServer(instanceId, session, budgetLimit = config.budgetLimit) {
    const server = createServer(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        
        if (req.url === "/" || req.url === "") {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(renderHtml(instanceId, budgetLimit));
            return;
        }
        
        if (req.url === `/${instanceId}`) {
            res.setHeader("Content-Type", "application/json");
            const data = loopData.get(instanceId) || { status: "idle", turns: 0, events: [], verdict: null };
            res.end(JSON.stringify(data, null, 2));
            return;
        }
        
        res.statusCode = 404;
        res.end("Not found");
    });
    
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    return { server, url: `http://127.0.0.1:${port}/`, budgetLimit };
}

const session = await joinSession({
    canvases: [
        createCanvas({
            id: "agent-loop-eval",
            displayName: "Agent Loop Evaluator",
            description: "Visual debugger showing turns, tool calls, completion state, and eval verdict",
            inputSchema: {
                type: "object",
                properties: {
                    budgetLimit: {
                        type: "number",
                        description: "Maximum turns allowed before failing budget check (default: 15)",
                        minimum: 1,
                        maximum: 100,
                    }
                }
            },
            open: async (ctx) => {
                const budgetLimit = ctx.input?.budgetLimit || config.budgetLimit;
                let entry = servers.get(ctx.instanceId);
                if (!entry) {
                    entry = await startServer(ctx.instanceId, session, budgetLimit);
                    servers.set(ctx.instanceId, entry);
                    loopData.set(ctx.instanceId, {
                        status: "running",
                        turns: 0,
                        events: [],
                        verdict: null,
                        budgetLimit,
                    });
                }
                return {
                    title: "Agent Loop Evaluator",
                    url: entry.url,
                };
            },
            onClose: async (ctx) => {
                const entry = servers.get(ctx.instanceId);
                if (entry) {
                    servers.delete(ctx.instanceId);
                    loopData.delete(ctx.instanceId);
                    await new Promise((resolve) => entry.server.close(() => resolve()));
                }
            },
        }),
    ],
});

session.on("assistant.turn_start", (event) => {
    for (const [instanceId, data] of loopData.entries()) {
        data.turns = Math.max(data.turns, event.data.turn_index + 1);
        data.status = "running";
    }
});

session.on("assistant.turn_end", (event) => {
    for (const [instanceId, data] of loopData.entries()) {
        data.events.push({
            type: "assistant.turn_end",
            turn: event.data.turn_index,
        });
    }
});

session.on("tool.execution_complete", (event) => {
    for (const [instanceId, data] of loopData.entries()) {
        data.events.push({
            type: "tool.execution_complete",
            tool_name: event.data.tool_call?.name || "unknown",
            turn: event.data.turn_index,
        });
    }
});

session.on("session.task_complete", (event) => {
    for (const [instanceId, data] of loopData.entries()) {
        data.events.push({
            type: "session.task_complete",
            summary: event.data.summary,
        });
    }
});

session.on("session.idle", (event) => {
    for (const [instanceId, data] of loopData.entries()) {
        data.status = "idle";
        const turnCount = data.turns;
        const budgetLimit = data.budgetLimit || config.budgetLimit;
        const hasTaskComplete = data.events.some(e => e.type === "session.task_complete");
        const toolErrors = data.events.filter(e => e.type === "tool.execution_complete" && !e.success);
        
        data.verdict = {
            status: hasTaskComplete ? "pass" : "review",
            score: 0,
            checks: [
                {
                    pass: hasTaskComplete,
                    message: "Task marked complete with task_complete tool"
                },
                {
                    pass: toolErrors.length === 0,
                    message: `No tool errors (${toolErrors.length} found)`
                },
                {
                    pass: turnCount <= budgetLimit,
                    message: `Turn budget under ${budgetLimit} (${turnCount} turns used)`
                },
            ]
        };
        
        if (data.verdict.checks.every(c => c.pass)) {
            data.verdict.status = "pass";
            data.verdict.score = 10;
        } else if (data.verdict.checks.some(c => !c.pass)) {
            data.verdict.status = "fail";
            data.verdict.score = data.verdict.checks.filter(c => c.pass).length * 3;
        }
    }
});
