import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { knowledgeBase } from "./knowledge-base";
import { createConversation, getConversation, respond } from "./support-service";

export const app = express();
app.use(helmet());
app.use(express.json({ limit: "32kb" }));
app.use(express.static("public"));

const chatLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false });
const chatSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(2).max(2000)
});
const escalationSchema = z.object({
  conversationId: z.string().uuid(),
  email: z.string().email().max(254),
  summary: z.string().trim().min(10).max(2000)
});

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "northstar-support-agent" }));
app.get("/api/knowledge-base", (_req, res) => res.json(knowledgeBase.map(({ id, title, category }) => ({ id, title, category }))));

app.post("/api/chat", chatLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid chat request.", details: parsed.error.flatten() });
    const conversation = parsed.data.conversationId
      ? getConversation(parsed.data.conversationId)
      : createConversation();
    if (!conversation) return res.status(404).json({ error: "Conversation not found. Start a new conversation." });
    const result = await respond(conversation, parsed.data.message);
    return res.json({ ...result, history: conversation.messages });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/conversations/:id", (req, res) => {
  const conversation = getConversation(req.params.id);
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });
  return res.json(conversation);
});

app.post("/api/escalations", (req, res) => {
  const parsed = escalationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid escalation request.", details: parsed.error.flatten() });
  const conversation = getConversation(parsed.data.conversationId);
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });
  // Demo queue only: no email or ticket is transmitted to an external support system.
  const ticket = { id: `NS-${Date.now().toString(36).toUpperCase()}`, status: "queued-demo", email: parsed.data.email, summary: parsed.data.summary, conversationId: conversation.id, createdAt: new Date().toISOString() };
  return res.status(201).json({ message: "Your demo escalation has been recorded.", ticket });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Unexpected server error.";
  res.status(500).json({ error: "Internal server error.", detail: process.env.NODE_ENV === "development" ? message : undefined });
});
