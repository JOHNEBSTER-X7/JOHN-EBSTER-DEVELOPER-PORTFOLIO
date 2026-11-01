export type AgentName = "research" | "analyst" | "writer" | "reviewer";
export type WorkflowStatus = "completed" | "needs_approval" | "rejected";
export type AgentResult = {
  agent: AgentName;
  status: "completed";
  summary: string;
  output: Record<string, unknown>;
  completedAt: string;
};
export type Workflow = {
  id: string;
  goal: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  steps: AgentResult[];
  deliverable: string;
  approval: { id: string; status: "pending" | "approved" | "rejected"; action: string; rationale: string } | null;
};
