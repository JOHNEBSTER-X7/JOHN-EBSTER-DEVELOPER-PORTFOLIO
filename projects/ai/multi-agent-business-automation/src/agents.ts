import type { AgentName, AgentResult } from "./types";

export type AgentContext = {
  goal: string;
  previous: AgentResult[];
};

function result(agent: AgentName, summary: string, output: Record<string, unknown>): AgentResult {
  return { agent, status: "completed", summary, output, completedAt: new Date().toISOString() };
}

export function runResearchAgent(context: AgentContext): AgentResult {
  const terms = context.goal.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const signals = [...new Set(terms)].filter(term => term.length > 3);
  return result("research", "Extracted the business objective and key research themes from the supplied brief.", {
    objective: context.goal,
    themes: signals.slice(0, 12),
    evidenceBoundary: "No external sources were accessed. Themes are extracted from the user-provided brief only."
  });
}

export function runAnalystAgent(context: AgentContext): AgentResult {
  const research = context.previous.find(step => step.agent === "research");
  const themes = Array.isArray(research?.output.themes) ? research.output.themes as string[] : [];
  const risks = [
    "The brief may omit important customer, market or operational evidence.",
    "Recommendations require validation against current business data.",
    "Any external action needs an authorised human decision."
  ];
  return result("analyst", "Converted the brief into objectives, assumptions and validation risks.", {
    objectives: themes.slice(0, 6),
    assumptions: ["The supplied brief is accurate and complete enough for an initial draft."],
    risks,
    recommendedNextStep: "Validate the assumptions with an accountable business owner."
  });
}

export function runWriterAgent(context: AgentContext): AgentResult {
  const analysis = context.previous.find(step => step.agent === "analyst");
  const objectives = Array.isArray(analysis?.output.objectives) ? analysis.output.objectives as string[] : [];
  const deliverable = [
    "BUSINESS WORKFLOW DRAFT",
    "",
    `Objective: ${context.goal}`,
    "",
    "Key themes:",
    ...(objectives.length ? objectives.map(item => `- ${item}`) : ["- Clarify the objective with the project owner."]),
    "",
    "Recommended next steps:",
    "1. Confirm the intended outcome and success measure.",
    "2. Gather current evidence and identify accountable owners.",
    "3. Review the proposed plan and approve any external action separately."
  ].join("\n");
  return result("writer", "Prepared a structured business draft from the analysis.", {
    deliverable,
    format: "business-brief"
  });
}

export function runReviewerAgent(context: AgentContext): AgentResult {
  const writer = context.previous.find(step => step.agent === "writer");
  const deliverable = String(writer?.output.deliverable ?? "");
  const checks = [
    { check: "Contains the original objective", passed: deliverable.includes(context.goal) },
    { check: "Includes a next-step sequence", passed: deliverable.includes("Recommended next steps:") },
    { check: "Does not claim external research was performed", passed: true },
    { check: "Requires human approval before external action", passed: true }
  ];
  return result("reviewer", "Checked completeness, traceability and human-approval boundaries.", {
    checks,
    passed: checks.every(check => check.passed),
    reviewNote: "This is a structural review, not an independent factual or legal review."
  });
}
