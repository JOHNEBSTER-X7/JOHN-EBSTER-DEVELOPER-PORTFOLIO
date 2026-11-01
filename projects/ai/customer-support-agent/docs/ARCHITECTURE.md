# Architecture

## Components

- **Browser client:** static HTML, CSS and vanilla JavaScript; renders untrusted content with `textContent`.
- **Express API:** HTTP routes, Helmet headers, bounded JSON body, chat rate limiter and Zod request schemas.
- **Knowledge base:** small curated article collection with keyword metadata.
- **Retrieval:** transparent lexical token matching returns the top matching articles.
- **Answer provider:** optional OpenAI Chat Completions call constrained to retrieved snippets; deterministic fallback if disabled or unavailable.
- **Conversation store:** process-local Map keyed by UUID.
- **Escalation endpoint:** validates and acknowledges a demo ticket without transmitting data externally.

## Chat flow

1. Browser sends a message and optional conversation ID.
2. API validates payload and resolves or creates a conversation.
3. Retrieval ranks knowledge-base articles.
4. If configured and relevant context exists, the optional model receives only the selected article content and question.
5. If the provider is unavailable, deterministic fallback returns the closest matching article or a no-match response.
6. API returns answer mode, article references, escalation suggestion and conversation history.

## Security and production gaps

Helmet and rate limiting are useful baseline controls, not a complete security design. The prototype has no authentication, durable storage, tenant separation, staff authorisation, data retention controls or provider-side data governance review. The escalation endpoint does not send an email or create a real support ticket. Production use requires a privacy impact review, secret management, persistent store, identity/access controls, monitoring and human queue integration.
