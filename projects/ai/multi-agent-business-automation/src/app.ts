import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { decideApproval, getWorkflow, listWorkflows, runWorkflow } from "./orchestrator";

export const app = express();
app.use(helmet());
app.use(express.json({ limit: "32kb" }));

const limiter = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false });
const workflowSchema = z.object({ goal: z.string().trim().min(10).max(3000) });
const approvalSchema = z.object({ approvalId: z.string().uuid(), decision: z.enum(["approve", "reject"]) });

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "northstar-multi-agent-orchestrator" }));
app.get("/api/agents", (_req, res) => res.json({
  agents: [
    { id: "research", name: "Research Agent", responsibility: "Extract themes and clarify the supplied objective." },
    { id: "analyst", name: "Business Analyst Agent", responsibility: "Identify objectives, assumptions and risks." },
    { id: "writer", name: "Business Writer Agent", responsibility: "Create a structured business deliverable." },
    { id: "reviewer", name: "Quality Reviewer Agent", responsibility: "Check completeness and approval boundaries." }
  ]
}));
app.post("/api/workflows", limiter, (req, res) => {
  const parsed = workflowSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid workflow request.", details: parsed.error.flatten() });
  return res.status(201).json(runWorkflow(parsed.data.goal));
});
app.get("/api/workflows", (_req, res) => res.json(listWorkflows()));
app.get("/api/workflows/:id", (req, res) => {
  const workflow = getWorkflow(req.params.id);
  if (!workflow) return res.status(404).json({ error: "Workflow not found." });
  return res.json(workflow);
});
app.post("/api/workflows/:id/approval", (req, res) => {
  const parsed = approvalSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid approval decision.", details: parsed.error.flatten() });
  const result = decideApproval(req.params.id, parsed.data.approvalId, parsed.data.decision);
  if (!result) return res.status(404).json({ error: "Workflow or approval not found." });
  if ("error" in result) return res.status(409).json({ error: result.error, workflow: result.workflow });
  return res.json(result.workflow);
});
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Unexpected server error.";
  res.status(500).json({ error: "Internal server error.", detail: process.env.NODE_ENV === "development" ? message : undefined });
});
