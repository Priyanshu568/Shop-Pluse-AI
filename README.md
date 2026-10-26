# ShopPulse AI

Embeddable support chatbot: Node/Express + PostgreSQL + OpenAI function calling + vanilla JS widget.

## Run
1. `npm install`
2. `cp .env.example .env` and fill in `OPENAI_API_KEY` and `DATABASE_URL`
3. `createdb shoppulse && npm run db:init` (creates tables and demo data)
4. `npm start`, then open http://localhost:3000

## Embed on any storefront
`<script src="https://YOUR-HOST/widget.js" data-api="https://YOUR-HOST" data-store="Your Store"></script>`
Add the storefront's origin to `ALLOWED_ORIGINS`.

## How it works
- `/api/chat` stores each message, then runs an LLM loop with three tools: `lookup_order` (needs order number + email), `search_products`, `escalate_to_human`.
- Policies live in `POLICIES` in `server.js`; the prompt restricts the bot to them.
- Escalation: keyword triggers bypass the LLM; the model can also call the escalate tool. This sets the conversation to `escalated`, writes a `handoffs` row with the last messages, and POSTs the full transcript to `HANDOFF_WEBHOOK_URL`. The bot stops replying after that.

## Before production
- Verify the user's identity (login session) rather than relying on email + order number alone.
- Add an agent dashboard that reads `handoffs`/`messages` and writes agent replies.
- Add auth on the webhook, log tool calls, and replace keyword triggers with a sentiment classifier if needed.
- Run behind a process manager and scale horizontally (the server is stateless; state is in Postgres).
