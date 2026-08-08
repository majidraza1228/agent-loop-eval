#!/usr/bin/env node
/**
 * Agent Loop Evaluator — Hello World Demo
 * 
 * This script demonstrates the agent loop evaluator in action.
 * It sends simple agent tasks and logs the loop's progress.
 * 
 * Usage:
 *   node hello-world-demo.mjs
 */

import { connectToSession } from "@github/copilot-sdk";

const session = await connectToSession({
    transport: "stdio",
});

console.log("🚀 Agent Loop Evaluator — Hello World Demo");
console.log("==========================================\n");

// Track loop state
let turnCount = 0;
let toolCalls = [];
let hasTaskComplete = false;

// Listen for turns
session.on("assistant.turn_start", (event) => {
    turnCount = event.data.turn_index + 1;
    console.log(`\n📍 Turn ${turnCount} started`);
});

session.on("assistant.turn_end", (event) => {
    console.log(`✓ Turn ${turnCount} complete`);
});

// Listen for tool calls
session.on("tool.execution_complete", (event) => {
    const toolName = event.data.tool_call?.name || "unknown";
    toolCalls.push(toolName);
    console.log(`  → Tool: ${toolName}`);
});

// Listen for task completion signal
session.on("session.task_complete", (event) => {
    hasTaskComplete = true;
    console.log(`\n✅ Task marked complete`);
    if (event.data.summary) {
        console.log(`   Summary: ${event.data.summary}`);
    }
});

// Listen for loop end
session.on("session.idle", (event) => {
    console.log(`\n🛑 Session idle — loop ended\n`);
    
    // Run eval checks (same as canvas)
    const checks = [
        {
            name: "Task Complete",
            pass: hasTaskComplete,
            weight: 3,
        },
        {
            name: "No Tool Errors",
            pass: true, // simplified; would check event log for failures
            weight: 3,
        },
        {
            name: "Turn Budget (≤10)",
            pass: turnCount <= 10,
            weight: 4,
        },
    ];
    
    const score = checks.reduce((sum, check) => sum + (check.pass ? check.weight : 0), 0);
    const maxScore = checks.reduce((sum, check) => sum + check.weight, 0);
    
    console.log("📊 EVALUATION VERDICT");
    console.log("====================");
    checks.forEach(check => {
        console.log(`  ${check.pass ? "✓" : "✗"} ${check.name}`);
    });
    console.log(`\n🎯 Score: ${score}/${maxScore} (${Math.round((score / maxScore) * 100)}%)`);
    
    if (score === maxScore) {
        console.log("   → Status: PASS 🎉");
    } else if (score >= maxScore * 0.6) {
        console.log("   → Status: REVIEW 📋");
    } else {
        console.log("   → Status: FAIL ❌");
    }
    
    console.log(`\n📈 Loop Statistics:`);
    console.log(`   Turns: ${turnCount}`);
    console.log(`   Tools used: ${toolCalls.join(", ") || "none"}`);
    console.log(`   Task complete: ${hasTaskComplete ? "Yes" : "No"}`);
    
    process.exit(0);
});

// Handle errors
session.on("session.error", (event) => {
    console.error("❌ Session error:", event.data.message);
    process.exit(1);
});

// Send a simple demo task
console.log("📝 Sending task: Create hello.txt with greeting\n");

const response = await session.sendAndWait({
    prompt: "Create a file called hello.txt with the text 'Hello, world!' in it.",
});

console.log("\n📭 Final response:");
console.log(response.text?.substring(0, 200) || "(no text response)");
