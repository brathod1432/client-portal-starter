# AI Readiness

> Phase 20 deliverable. How to evolve the portal to support AI features safely:
> a support agent, knowledge search, document Q&A, a client assistant, ticket
> summarization and document analysis.

## Why the starter is AI-ready

- **Typed domain model** (`src/lib/types.ts`) gives clean, structured inputs.
- **Clear data seam** (`src/lib/mock/*` → API) makes it easy to expose tools/
  retrieval endpoints.
- **RBAC + audit trail** provide the authorization and traceability AI features
  require.

## Recommended architecture

```
Client (assistant UI)
   │  (authenticated, RBAC-checked)
   ▼
AI Gateway (server)                ← auth, rate limiting, prompt/response logging
   ├─ Retrieval service            ← vector DB (pgvector/Pinecone) over docs/KB
   ├─ Tool/function layer          ← typed actions: getTickets, getInvoice…(RBAC)
   ├─ LLM provider adapter         ← OpenAI/Anthropic/Bedrock/Azure OpenAI
   └─ Guardrails                   ← PII redaction, output filtering, citations
```

Keep all AI calls **server-side**; never expose provider keys to the browser.

## Feature designs

| Feature                  | Data flow                                                                        | Notes                                                    |
| ------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **AI support agent**     | User query → retrieval over KB/tickets → LLM with tools → answer + cited sources | Tools are RBAC-scoped; can draft (not auto-send) replies |
| **Knowledge search**     | Query → embed → vector search → ranked snippets                                  | Semantic search over help-center content                 |
| **Document Q&A**         | Select doc → chunk+embed on upload → retrieve → answer with page citations       | Respect document `accessRoles` at retrieval time         |
| **Client assistant**     | "What changed this week?" → aggregate projects/tickets/invoices → summarize      | Read-only; scoped to the user's own data                 |
| **Ticket summarization** | Ticket timeline → LLM summary + suggested next step                              | Cache per ticket version                                 |
| **Document analysis**    | Contract/report → extraction (dates, amounts, obligations)                       | Human-in-the-loop review                                 |

## Data flow & indexing

1. On document upload, extract text, **chunk**, embed, and store vectors with
   metadata: `docId`, `accessRoles`, `category`, `version`.
2. At query time, filter the vector search by the caller's role/tenant **before**
   ranking, so retrieval itself enforces authorization.
3. Compose a grounded prompt with retrieved chunks; require the model to cite
   sources; return citations to the UI.

## Security considerations

- **Authorization at retrieval** — never retrieve chunks the user can't access;
  enforce tenant isolation.
- **Prompt-injection defense** — treat document/content as untrusted; instruct
  the model to ignore embedded instructions; strip/escape tool-trigger patterns.
- **PII handling** — redact before sending to third-party providers where
  possible; prefer providers with no-training/data-retention guarantees.
- **Least privilege tools** — AI "tools" call the same RBAC-checked services as
  the UI; no privileged backdoors.
- **Auditability** — log prompts, tool calls and responses (with redaction) to
  the audit trail; make AI actions attributable.
- **Human-in-the-loop** — AI drafts; humans approve state-changing actions
  (sending messages, resolving tickets, financial actions).
- **Cost/abuse controls** — rate limit and budget per user/tenant.

## Incremental rollout

1. Read-only summarization (tickets, weekly digest) — low risk.
2. Knowledge search + document Q&A with citations.
3. Assistant with **read** tools (scoped queries).
4. Assistant with **write** tools behind explicit human approval.
