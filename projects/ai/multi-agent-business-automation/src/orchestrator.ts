import { randomUUID } from "node:crypto";
import { runAnalystAgent, runResearchAgent, runReviewerAgent, runWriterAgent } from "./agents";
import type { AgentResult, Workflow } from "./types";

const workflows = new Map<string, Workflow>();

export function resetWorkflows() {
  workflows.clear();
}

export function getWorkflow(id: string) {
  return workflows.get(id);
}

export function listWorkflows() {
  return [...workflows.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function runWorkflow(goal: string): Workflow {
  const id = randomUUID();
  const now = new Date().toISOString();
  const steps: AgentResult[] = [];
  steps.push(runResearchAgent({ goal, previous: steps }));
  steps.push(runAnalystAgent({ goal, previous: steps }));
  steps.push(runWriterAgent({ goal, previous: steps }));
  steps.push(runReviewerAgent({ goal, previous: steps }));

  const review = steps.find(step => step.agent === "reviewer");
  const writer = steps.find(step => step.agent === "writer");
  const approvalId = randomUUID();
  const workflow: Workflow = {
    id,
    goal,
    status: "needs_approval",
    createdAt: now,
    updatedAt: now,
    steps,
    deliverable: String(writer?.output.deliverable ?? ""),
    approval: {
      id: approvalId,
      status: "pending",
      action: "Release this generated business brief to an external recipient or connected business system.",
      rationale: "The agents have drafted and structurally reviewed the deliverable. A human must review the content and explicitly authorise any external release."
    }
  };
  if (review?.output.passed !== true) workflow.status = "rejected";
  workflows.set(id, workflow);
  return workflow;
}

export function decideApproval(workflowId: string, approvalId: string, decision: "approve" | "reject") {
  const workflow = workflows.get(workflowId);
  if (!workflow || !workflow.approval || workflow.approval.id !== approvalId) return null;
  if (workflow.approval.status !== "pending") return { error: "This approval has already been decided." as const, workflow };
  workflow.approval.status = decision === "approve" ? "approved" : "rejected";
  workflow.status = decision === "approve" ? "completed" : "rejected";
  workflow.updatedAt = new Date().toISOString();
  // Approval changes the workflow state only. No external action is executed by this demo.
  return { workflow };
}
