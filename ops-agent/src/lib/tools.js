
// first tool: cheack_service_health
// second tool: get_recent_logs
// third tool: get_production_info

import { tool } from "@openai/agents";
import { z } from "zod";
import { callDemoService } from "./demo-service";

export const check_service_health = tool({
    name: "check_service_health",
    description: "Checks the api service health and status.",
    parameters: z.object({}),

    async execute() {
        console.log("Checking service health...");
        const health = await callDemoService("/health");
        const orders = await callDemoService("/api/orders");
        return { health, orders };
    },
});
export const get_recent_logs = tool({
    name: "get_recent_logs",
    description: "Returns the last 20 lines.",
    parameters: z.object({}),

    async execute() {
        console.log("get-recent-logs running");
        const result = await callDemoService("/logs");
        // log retrieval logic
        if (!result.body) return result;
        return result.body.map((line) => ({...line, message: line.message.slice(0, 200)}));
    },
});
export const get_production_info = tool({
    name: "get_production_info",
    description: "Returns which version of....",
    parameters: z.object({}),

    async execute() {
        console.log("get-production-info running");
        const result = await callDemoService("/version");
        return result;
    },
});
