import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { resetWorkflows } from "../src/orchestrator";

beforeEach(() => resetWorkflows());

describe("multi-agent workflow API", () => {
  it("returns service health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("lists four specialist agents", async () => {
    const response = await request(app).get("/api/agents");
    expect(response.status).toBe(200);
    expect(response.body.agents).toHaveLength(4);
  });

  it("runs the four-agent workflow and produces a deliverable", async () => {
    const response = await request(app).post("/api/workflows").send({ goal: "Prepare a customer retention strategy for an online retailer." });
    expect(response.status).toBe(201);
    expect(response.body.steps.map((step: { agent: string }) => step.agent)).toEqual(["research", "analyst", "writer", "reviewer"]);
    expect(response.body.deliverable).toContain("Recommended next steps:");
    expect(response.body.status).toBe("needs_approval");
  });

  it("requires human approval before workflow completion", async () => {
    const response = await request(app).post("/api/workflows").send({ goal: "Develop a launch plan for a new subscription service." });
    expect(response.body.approval.status).toBe("pending");
    expect(response.body.status).toBe("needs_approval");
  });

  it("allows a human to approve the proposed workflow state", async () => {
    const workflow = (await request(app).post("/api/workflows").send({ goal: "Create an onboarding improvement plan for new customers." })).body;
    const response = await request(app).post(`/api/workflows/${workflow.id}/approval`).send({ approvalId: workflow.approval.id, decision: "approve" });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("completed");
    expect(response.body.approval.status).toBe("approved");
  });

  it("allows a human to reject the proposed workflow", async () => {
    const workflow = (await request(app).post("/api/workflows").send({ goal: "Prepare a customer feedback analysis process." })).body;
    const response = await request(app).post(`/api/workflows/${workflow.id}/approval`).send({ approvalId: workflow.approval.id, decision: "reject" });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("rejected");
  });

  it("prevents changing a decided approval", async () => {
    const workflow = (await request(app).post("/api/workflows").send({ goal: "Design a new customer support operating procedure." })).body;
    await request(app).post(`/api/workflows/${workflow.id}/approval`).send({ approvalId: workflow.approval.id, decision: "reject" });
    const second = await request(app).post(`/api/workflows/${workflow.id}/approval`).send({ approvalId: workflow.approval.id, decision: "approve" });
    expect(second.status).toBe(409);
  });

  it("rejects a short or missing workflow goal", async () => {
    const response = await request(app).post("/api/workflows").send({ goal: "short" });
    expect(response.status).toBe(400);
  });

  it("returns 404 for unknown workflow IDs", async () => {
    const response = await request(app).get("/api/workflows/00000000-0000-4000-8000-000000000000");
    expect(response.status).toBe(404);
  });

  it("returns 404 for an invalid approval ID", async () => {
    const workflow = (await request(app).post("/api/workflows").send({ goal: "Create a plan to improve customer service response times." })).body;
    const response = await request(app).post(`/api/workflows/${workflow.id}/approval`).send({ approvalId: "00000000-0000-4000-8000-000000000000", decision: "approve" });
    expect(response.status).toBe(404);
  });
});
