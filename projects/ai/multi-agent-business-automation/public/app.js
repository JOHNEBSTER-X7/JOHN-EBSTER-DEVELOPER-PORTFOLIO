let activeWorkflow = null;
const form = document.querySelector("#workflow-form");
const goal = document.querySelector("#goal");
const runButton = document.querySelector("#run");
const resultPanel = document.querySelector("#result");

const agentDescriptions = {
  research: "Extracts the objective and themes",
  analyst: "Identifies assumptions and risks",
  writer: "Prepares a business deliverable",
  reviewer: "Checks quality and safeguards"
};

function renderWorkflow(workflow) {
  activeWorkflow = workflow;
  resultPanel.classList.remove("hidden");
  document.querySelector("#workflow-title").textContent = `Workflow ${workflow.id.slice(0, 8)}`;
  document.querySelector("#workflow-status").textContent = workflow.status.replaceAll("_", " ").toUpperCase();
  const agents = document.querySelector("#agents");
  agents.replaceChildren();
  workflow.steps.forEach((step, index) => {
    const card = document.createElement("div");
    card.className = "agent";
    const number = document.createElement("span");
    number.className = "number";
    number.textContent = `AGENT 0${index + 1}`;
    const title = document.createElement("strong");
    title.textContent = step.agent.charAt(0).toUpperCase() + step.agent.slice(1);
    const status = document.createElement("small");
    status.textContent = "✓ Completed";
    card.append(number, title, status);
    agents.append(card);
  });
  document.querySelector("#deliverable").textContent = workflow.deliverable;
  const approval = document.querySelector("#approval");
  if (workflow.approval?.status === "pending") {
    approval.classList.remove("hidden");
    document.querySelector("#approval-note").textContent = workflow.approval.rationale;
  } else {
    approval.classList.add("hidden");
  }
  refreshHistory();
}

async function refreshHistory() {
  const list = document.querySelector("#workflow-list");
  try {
    const response = await fetch("/api/workflows");
    const workflows = await response.json();
    list.replaceChildren();
    if (!workflows.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Your workflows will appear here.";
      list.append(empty);
      return;
    }
    workflows.slice(0, 8).forEach(workflow => {
      const row = document.createElement("div");
      row.className = "workflow-row";
      const title = document.createElement("span");
      title.textContent = workflow.goal.length > 65 ? workflow.goal.slice(0, 65) + "…" : workflow.goal;
      const status = document.createElement("span");
      status.textContent = workflow.status.replaceAll("_", " ");
      row.append(title, status);
      list.append(row);
    });
  } catch {
    list.textContent = "Unable to load workflows.";
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  runButton.disabled = true;
  runButton.textContent = "Running agents…";
  try {
    const response = await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: goal.value.trim() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Workflow failed.");
    renderWorkflow(data);
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Unable to run workflow.");
  } finally {
    runButton.disabled = false;
    runButton.innerHTML = 'Run agents <b>→</b>';
  }
});

async function decide(decision) {
  if (!activeWorkflow?.approval) return;
  const response = await fetch(`/api/workflows/${activeWorkflow.id}/approval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approvalId: activeWorkflow.approval.id, decision })
  });
  const data = await response.json();
  if (!response.ok) {
    window.alert(data.error || "Approval update failed.");
    return;
  }
  renderWorkflow(data);
}

document.querySelector("#approve").addEventListener("click", () => decide("approve"));
document.querySelector("#reject").addEventListener("click", () => decide("reject"));
document.querySelector("#refresh").addEventListener("click", refreshHistory);
document.querySelector("#copy").addEventListener("click", async () => {
  if (!activeWorkflow) return;
  await navigator.clipboard.writeText(activeWorkflow.deliverable);
  document.querySelector("#copy").textContent = "Copied";
});
refreshHistory();
