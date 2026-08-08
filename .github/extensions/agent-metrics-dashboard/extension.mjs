import { createServer } from "node:http";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const servers = new Map();
const metricsStore = new Map();

// Load or create metrics file
async function getMetricsPath() {
    const home = os.homedir();
    const metricsDir = path.join(home, ".copilot", "metrics");
    await fs.mkdir(metricsDir, { recursive: true });
    return path.join(metricsDir, "agent-metrics.json");
}

async function loadMetrics() {
    try {
        const metricsPath = await getMetricsPath();
        const data = await fs.readFile(metricsPath, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveMetrics(metrics) {
    const metricsPath = await getMetricsPath();
    await fs.writeFile(metricsPath, JSON.stringify(metrics, null, 2));
}

function renderHtml(instanceId) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Agent Metrics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
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
        margin: 0 0 0.5rem 0;
        font-size: 22px;
        font-weight: 600;
      }
      .subtitle {
        color: var(--text-color-muted, #656d76);
        margin-bottom: 1.5rem;
        font-size: 13px;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .metric-card {
        padding: 1rem;
        border-radius: 6px;
        background: var(--background-color-inset, #f6f8fa);
        border: 1px solid var(--border-color-default, #d0d7de);
      }
      .metric-label {
        font-size: 12px;
        color: var(--text-color-muted, #656d76);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }
      .metric-value {
        font-size: 28px;
        font-weight: 600;
        color: var(--true-color-blue, #0969da);
      }
      .metric-trend {
        font-size: 12px;
        color: var(--text-color-muted, #656d76);
        margin-top: 0.5rem;
      }
      .trend-up {
        color: var(--true-color-green, #1a7f37);
      }
      .trend-down {
        color: var(--true-color-red, #cf222e);
      }
      .chart-section {
        margin-bottom: 2rem;
        padding: 1rem;
        border-radius: 6px;
        background: var(--background-color-inset, #f6f8fa);
      }
      .chart-section h2 {
        margin: 0 0 1rem 0;
        font-size: 16px;
        font-weight: 600;
      }
      .chart-container {
        position: relative;
        height: 250px;
        margin-bottom: 1rem;
      }
      .table-section {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      th {
        text-align: left;
        padding: 0.75rem;
        border-bottom: 2px solid var(--border-color-default, #d0d7de);
        background: var(--background-color-default, #ffffff);
        font-weight: 600;
      }
      td {
        padding: 0.75rem;
        border-bottom: 1px solid var(--border-color-default, #d0d7de);
      }
      tr:hover {
        background: var(--background-color-inset, #f6f8fa);
      }
      .verdict-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 600;
      }
      .verdict-pass {
        background: rgba(26, 127, 55, 0.1);
        color: var(--true-color-green, #1a7f37);
      }
      .verdict-fail {
        background: rgba(207, 34, 46, 0.1);
        color: var(--true-color-red, #cf222e);
      }
      .verdict-review {
        background: rgba(9, 105, 218, 0.1);
        color: var(--true-color-blue, #0969da);
      }
      .no-data {
        text-align: center;
        padding: 2rem;
        color: var(--text-color-muted, #656d76);
      }
    </style>
  </head>
  <body>
    <h1>📊 Agent Metrics Dashboard</h1>
    <p class="subtitle">Track agent performance, costs, and efficiency over time</p>
    <div id="app"></div>
    <script>
      let chartsInstance = {};

      async function fetchMetrics() {
        try {
          const res = await fetch('/${instanceId}');
          const data = await res.json();
          renderDashboard(data);
        } catch (e) {
          document.getElementById('app').innerHTML = '<p style="color: red;">Failed to load metrics</p>';
        }
      }

      function renderDashboard(data) {
        const app = document.getElementById('app');
        if (!data || data.length === 0) {
          app.innerHTML = '<div class="no-data"><p>No metrics collected yet. Run some agent tasks to see data!</p></div>';
          return;
        }

        const stats = calculateStats(data);
        const recentData = data.slice(-30);

        app.innerHTML = \`
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Avg Turns</div>
              <div class="metric-value">\${stats.avgTurns.toFixed(1)}</div>
              <div class="metric-trend \${stats.turnsTrend >= 0 ? 'trend-down' : 'trend-up'}">\${stats.turnsTrend >= 0 ? '↑' : '↓'} \${Math.abs(stats.turnsTrend).toFixed(1)}% from baseline</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Pass Rate</div>
              <div class="metric-value">\${stats.passRate.toFixed(0)}%</div>
              <div class="metric-trend">\${data.filter(m => m.verdict === 'pass').length}/\${data.length} tasks passed</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Avg Score</div>
              <div class="metric-value">\${stats.avgScore.toFixed(1)}/10</div>
              <div class="metric-trend">Quality rating</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Est. Monthly Cost</div>
              <div class="metric-value">\$\${stats.estimatedMonthlyCost.toFixed(0)}</div>
              <div class="metric-trend">1000 tasks @ \$0.05/turn</div>
            </div>
          </div>

          <div class="chart-section">
            <h2>Turn Count Trend (Last 30 runs)</h2>
            <div class="chart-container">
              <canvas id="turnsChart"></canvas>
            </div>
          </div>

          <div class="chart-section">
            <h2>Verdict Distribution</h2>
            <div class="chart-container">
              <canvas id="verdictChart"></canvas>
            </div>
          </div>

          <div class="chart-section">
            <h2>Score Distribution</h2>
            <div class="chart-container">
              <canvas id="scoreChart"></canvas>
            </div>
          </div>

          <div class="chart-section">
            <h2>Recent Agent Runs</h2>
            <div class="table-section">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Turns</th>
                    <th>Score</th>
                    <th>Verdict</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  \${recentData.reverse().map(m => \`
                    <tr>
                      <td>\${m.task || 'Unnamed'}</td>
                      <td>\${m.turns || '-'}</td>
                      <td>\${m.score || '-'}/10</td>
                      <td><span class="verdict-badge verdict-\${m.verdict || 'review'}">\${(m.verdict || 'review').toUpperCase()}</span></td>
                      <td>\${new Date(m.timestamp).toLocaleDateString()}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;

        // Render charts after DOM is ready
        setTimeout(() => renderCharts(recentData, stats), 100);
      }

      function calculateStats(data) {
        const passCount = data.filter(m => m.verdict === 'pass').length;
        const avgTurns = data.reduce((sum, m) => sum + (m.turns || 0), 0) / data.length || 0;
        const avgScore = data.reduce((sum, m) => sum + (m.score || 0), 0) / data.length || 0;
        const passRate = (passCount / data.length) * 100;
        const turnsTrend = ((data.slice(-5).reduce((s, m) => s + (m.turns || 0), 0) / 5 - avgTurns) / avgTurns) * 100;
        const estimatedMonthlyCost = (avgTurns * 0.05) * 1000;

        return { passRate, avgTurns, avgScore, turnsTrend, estimatedMonthlyCost };
      }

      function renderCharts(recentData, stats) {
        const ctx1 = document.getElementById('turnsChart');
        if (ctx1 && !chartsInstance.turnsChart) {
          chartsInstance.turnsChart = new Chart(ctx1, {
            type: 'line',
            data: {
              labels: recentData.map((_, i) => i + 1),
              datasets: [{
                label: 'Turns Used',
                data: recentData.map(m => m.turns || 0),
                borderColor: '#0969da',
                backgroundColor: 'rgba(9, 105, 218, 0.1)',
                tension: 0.3,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }
          });
        }

        const ctx2 = document.getElementById('verdictChart');
        if (ctx2 && !chartsInstance.verdictChart) {
          const verdicts = { pass: 0, fail: 0, review: 0 };
          recentData.forEach(m => verdicts[m.verdict || 'review']++);
          chartsInstance.verdictChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
              labels: ['PASS', 'FAIL', 'REVIEW'],
              datasets: [{
                data: [verdicts.pass, verdicts.fail, verdicts.review],
                backgroundColor: ['#1a7f37', '#cf222e', '#0969da']
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }

        const ctx3 = document.getElementById('scoreChart');
        if (ctx3 && !chartsInstance.scoreChart) {
          chartsInstance.scoreChart = new Chart(ctx3, {
            type: 'bar',
            data: {
              labels: recentData.map((_, i) => i + 1),
              datasets: [{
                label: 'Score (0-10)',
                data: recentData.map(m => m.score || 0),
                backgroundColor: '#0969da'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, max: 10 } }
            }
          });
        }
      }

      fetchMetrics();
      setInterval(fetchMetrics, 5000);
    </script>
  </body>
</html>`;
}

async function startServer(instanceId) {
    const server = createServer(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        
        if (req.url === "/" || req.url === "") {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(renderHtml(instanceId));
            return;
        }
        
        if (req.url === `/${instanceId}`) {
            res.setHeader("Content-Type", "application/json");
            const metrics = await loadMetrics();
            res.end(JSON.stringify(metrics, null, 2));
            return;
        }

        if (req.method === "POST" && req.url === `/api/${instanceId}/record`) {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                try {
                    const metric = JSON.parse(body);
                    const metrics = await loadMetrics();
                    metrics.push({
                        ...metric,
                        timestamp: new Date().toISOString()
                    });
                    await saveMetrics(metrics);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: true }));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: e.message }));
                }
            });
            return;
        }
        
        res.statusCode = 404;
        res.end("Not found");
    });
    
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    return { server, url: `http://127.0.0.1:${port}/` };
}

const session = await joinSession({
    canvases: [
        createCanvas({
            id: "agent-metrics-dashboard",
            displayName: "Agent Metrics Dashboard",
            description: "Track agent performance metrics over time: turn counts, pass rates, scores, and estimated costs",
            open: async (ctx) => {
                let entry = servers.get(ctx.instanceId);
                if (!entry) {
                    entry = await startServer(ctx.instanceId);
                    servers.set(ctx.instanceId, entry);
                }
                return {
                    title: "Agent Metrics Dashboard",
                    url: entry.url,
                };
            },
            onClose: async (ctx) => {
                const entry = servers.get(ctx.instanceId);
                if (entry) {
                    servers.delete(ctx.instanceId);
                    await new Promise((resolve) => entry.server.close(() => resolve()));
                }
            },
        }),
    ],
});

// Track metrics from session events
session.on("session.idle", (event) => {
    // This is called when a task completes
    // Metrics recording happens via API POST from the loop evaluator or manually
});
