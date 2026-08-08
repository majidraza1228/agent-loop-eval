#!/usr/bin/env node
/**
 * Agent Loop Evaluator — Hello World Demo
 * 
 * This script demonstrates the eval logic and shows how checks work.
 * Run it standalone to see mock examples, or from within a Copilot SDK
 * context to track a real agent loop.
 * 
 * Usage:
 *   node hello-world-demo.mjs [scenario]
 * 
 * Scenarios: simple | multistep | error | inefficient
 */

// Mock evaluation checker (works standalone)
function runEvalChecks(scenario) {
    const scenarios = {
        simple: {
            turns: 2,
            tools: ["create_file"],
            hasTaskComplete: true,
            toolErrors: 0,
            description: "Simple task (best case)"
        },
        multistep: {
            turns: 3,
            tools: ["glob", "read_file", "grep"],
            hasTaskComplete: true,
            toolErrors: 0,
            description: "Multi-step task with multiple tools"
        },
        error: {
            turns: 3,
            tools: ["bash", "bash"],
            hasTaskComplete: true,
            toolErrors: 1,
            description: "Task completes but had errors"
        },
        inefficient: {
            turns: 12,
            tools: ["glob", "read_file", "read_file", "read_file"],
            hasTaskComplete: false,
            toolErrors: 0,
            description: "Loop exceeds budget, task not marked complete"
        }
    };
    
    const data = scenarios[scenario] || scenarios.simple;
    
    console.log(`\n🎯 Scenario: ${data.description}`);
    console.log("═".repeat(60));
    
    // Simulate loop progress
    console.log(`\n📍 Loop Progress:`);
    console.log(`   Turns: ${data.turns}`);
    console.log(`   Tools: ${data.tools.join(", ") || "none"}`);
    
    // Run eval checks (same as canvas)
    const checks = [
        {
            name: "Task Complete",
            pass: data.hasTaskComplete,
            weight: 3,
            message: data.hasTaskComplete 
                ? "Model called task_complete"
                : "Model did NOT call task_complete"
        },
        {
            name: "No Tool Errors",
            pass: data.toolErrors === 0,
            weight: 3,
            message: `${data.toolErrors} tool error${data.toolErrors !== 1 ? "s" : ""} found`
        },
        {
            name: "Efficient Loop",
            pass: data.turns <= 10,
            weight: 4,
            message: `${data.turns} turn${data.turns !== 1 ? "s" : ""} used (budget: 10)`
        },
    ];
    
    const score = checks.reduce((sum, check) => sum + (check.pass ? check.weight : 0), 0);
    const maxScore = checks.reduce((sum, check) => sum + check.weight, 0);
    const percent = Math.round((score / maxScore) * 100);
    
    console.log(`\n📊 EVALUATION VERDICT`);
    console.log("─".repeat(60));
    checks.forEach(check => {
        const icon = check.pass ? "✓" : "✗";
        const color = check.pass ? "✅" : "❌";
        console.log(`  ${icon} ${check.name.padEnd(20)} | ${check.message} (${check.weight} pts)`);
    });
    
    console.log(`\n🎯 SCORE: ${score}/${maxScore} (${percent}%)`);
    
    let status = "FAIL";
    let statusEmoji = "❌";
    if (score === maxScore) {
        status = "PASS";
        statusEmoji = "🎉";
    } else if (score >= maxScore * 0.6) {
        status = "REVIEW";
        statusEmoji = "📋";
    }
    
    console.log(`   → ${statusEmoji} Status: ${status}`);
    
    console.log(`\n📈 Loop Statistics:`);
    console.log(`   Turns: ${data.turns}`);
    console.log(`   Tools: ${data.tools.join(", ") || "none"}`);
    console.log(`   Task Complete: ${data.hasTaskComplete ? "Yes" : "No"}`);
    console.log(`   Tool Errors: ${data.toolErrors}`);
    
    return { score, maxScore, status };
}

// Main
console.log("🚀 Agent Loop Evaluator — Hello World Demo");
console.log("═".repeat(60));
console.log("\nThis demo shows how the eval checker works on different scenarios.");
console.log("Each scenario represents a typical agent loop pattern.\n");

const scenario = process.argv[2] || "simple";

if (scenario === "all") {
    ["simple", "multistep", "error", "inefficient"].forEach(s => {
        runEvalChecks(s);
        console.log("\n");
    });
} else {
    runEvalChecks(scenario);
    console.log("\n💡 Try other scenarios:");
    console.log("   node hello-world-demo.mjs all");
    console.log("   node hello-world-demo.mjs simple");
    console.log("   node hello-world-demo.mjs multistep");
    console.log("   node hello-world-demo.mjs error");
    console.log("   node hello-world-demo.mjs inefficient");
}
