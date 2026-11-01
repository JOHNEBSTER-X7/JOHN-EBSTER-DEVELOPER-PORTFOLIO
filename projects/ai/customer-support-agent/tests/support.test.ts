import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { resetConversations } from "../src/support-service";

beforeEach(() => {
  resetConversations();
  delete process.env.OPENAI_API_KEY;
});

describe("Northstar support API", () => {
  it("returns a health response", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("lists knowledge-base articles without exposing article contents", async () => {
    const response = await request(app).get("/api/knowledge-base");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).not.toHaveProperty("content");
  });

  it("answers a question using relevant help-centre content", async () => {
    const response = await request(app).post("/api/chat").send({ message: "How do I track my order?" });
    expect(response.status).toBe(200);
    expect(response.body.answer).toContain("Account > Orders");
    expect(response.body.mode).toBe("knowledge-base-fallback");
    expect(response.body.sources[0].id).toBe("orders-tracking");
  });

  it("keeps messages in the conversation history", async () => {
    const first = await request(app).post("/api/chat").send({ message: "How do I reset my password?" });
    const second = await request(app).post("/api/chat").send({ conversationId: first.body.conversationId, message: "Where is the reset link?" });
    expect(second.status).toBe(200);
    expect(second.body.history).toHaveLength(4);
  });

  it("suggests escalation when no answer is found", async () => {
    const response = await request(app).post("/api/chat").send({ message: "Can you repair my spaceship engine?" });
    expect(response.status).toBe(200);
    expect(response.body.escalationSuggested).toBe(true);
    expect(response.body.sources).toHaveLength(0);
  });

  it("rejects malformed chat messages", async () => {
    const response = await request(app).post("/api/chat").send({ message: "x" });
    expect(response.status).toBe(400);
  });

  it("returns 404 for unknown conversation IDs", async () => {
    const response = await request(app).post("/api/chat").send({ conversationId: "b6f8f6ac-4a8e-4e6c-a75a-23f845a10eab", message: "Where is my order?" });
    expect(response.status).toBe(404);
  });

  it("records a demo human escalation request", async () => {
    const chat = await request(app).post("/api/chat").send({ message: "Where can I speak to a human?" });
    const response = await request(app).post("/api/escalations").send({
      conversationId: chat.body.conversationId,
      email: "customer@example.com",
      summary: "I need help resolving a delayed order delivery."
    });
    expect(response.status).toBe(201);
    expect(response.body.ticket.status).toBe("queued-demo");
  });

  it("rejects invalid escalation email addresses", async () => {
    const chat = await request(app).post("/api/chat").send({ message: "I need a person to help me." });
    const response = await request(app).post("/api/escalations").send({
      conversationId: chat.body.conversationId,
      email: "not-an-email",
      summary: "Please help me with my issue."
    });
    expect(response.status).toBe(400);
  });
});
