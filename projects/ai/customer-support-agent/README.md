# Northstar AI Customer Support Agent

A lightweight customer support application with a browser chat interface, a searchable help-centre knowledge base, conversation history and a human-support escalation workflow.

## Features

- Responsive browser chat interface with suggested questions.
- Knowledge-base retrieval with article references.
- Conversation IDs and in-memory message history.
- Optional OpenAI chat-completions integration with context-limited instructions.
- Deterministic help-centre fallback when no API key is configured or the provider is unavailable.
- Human-support escalation form with input validation.
- Express security headers, JSON size limits and chat rate limiting.
- TypeScript, Zod validation and automated API tests.

## Run locally

Requires Node.js 22 or later.

```bash
cd projects/ai/customer-support-agent
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000.

For an optional OpenAI-backed answer mode, add an API key to `.env`. The fallback mode works without an API key. Do not commit secrets.

## Commands

```bash
npm run typecheck
npm test
npm run build
npm start
```

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/knowledge-base` | List help article metadata |
| POST | `/api/chat` | Send a message and retrieve a grounded response |
| GET | `/api/conversations/{id}` | Read current in-memory conversation history |
| POST | `/api/escalations` | Record a demo escalation request |

Chat request:

```json
{"message":"How do I track my order?","conversationId":"optional-uuid"}
```

## Important implementation boundaries

- The bundled knowledge base is illustrative sample content and must be replaced with approved, current business policies before real customer use.
- The optional AI provider is instructed to answer only from retrieved help-centre context. This is a prompt-level control, not a guarantee against hallucination; production systems need output validation and monitoring.
- Conversation history is stored in process memory and is lost when the server restarts. It is not suitable for multi-instance deployment.
- Escalations are recorded as demo responses only. No email, CRM ticket or external support queue is contacted.
- No authentication, customer identity verification, persistent conversation database, staff dashboard, SLA routing or tenant isolation is implemented.
- Do not submit real payment details, passwords, authentication codes or sensitive personal data.
- Apply privacy notices, retention rules, access controls, abuse monitoring and a reviewed security process before any production use.

## Architecture

The Express API validates input with Zod, searches the local knowledge base, optionally calls an LLM with retrieved context, and returns the answer mode plus supporting article references. If no matching content exists, it declines to invent a policy and offers escalation.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/INTERVIEW_GUIDE.md](docs/INTERVIEW_GUIDE.md).

## Licence

MIT. See the repository-level licence.
