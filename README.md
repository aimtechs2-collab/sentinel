# Sentinel — AI-Powered Release Command Center

Built by release managers for release management.

Flagship demo prototype for stakeholder screen recordings. Static dummy data with real LLM-powered agent responses. **Live demo state** (Go decisions, deployments, notifications) persists in `localStorage` via the release store.

## Setup

1. Install dependencies (already done if cloned with node_modules):
   ```bash
   npm install
   ```

2. Copy environment file and add your API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Add at least one key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   # optional fallback:
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) — sign in with any credentials to reach the dashboard.

## Pages

| Route | Description |
|---|---|
| `/login` | Fake login → dashboard |
| `/dashboard` | Executive overview + AI daily summary + live activity feed |
| `/templates` | Quick Start — 22 guided demo scenarios with seeded state |
| `/executive` | C-level portfolio dashboard, risk heatmap, ML forecasts |
| `/releases` | Full release list |
| `/releases/[id]` | Release command center (core screen) |
| `/releases/[id]/dependencies` | React Flow dependency map |
| `/compare` | Side-by-side release comparison |
| `/knowledge-graph` | Org-wide knowledge graph (releases, services, people, CRs) |
| `/calendar` | Release calendar + freeze windows |
| `/environments` | **Environment Desk** — timeline, env booking, topology, version matrix, config ([docs](./docs/ENVIRONMENT-DESK.md)) |
| `/history` | Global audit trail (static + your live decisions/deployments) |
| `/connectors` | 59 enterprise integrations — errors link to release blockers |
| `/agents` | Agent control room — 13 AI agents with pause/resume |
| `/insights` | Org-wide AI risk, trends, and predictive ML |
| `/settings` | Team/role settings |

## Demo flow

1. Open **Quick Start** (`/templates`) and launch a scenario (e.g. auto-rollback, healthy green-path).
2. Record a **Go** decision on a release — it appears in **History**, **Notifications**, and **AI chat** context.
3. Use the bell icon for unread alerts; click **Audit trail** on a notification to jump to filtered history.
4. **Reset demo state** from the Templates page to clear `localStorage` and start fresh.

## Environment Desk

Portfolio view for release managers: **schedule → environment → version → impact** in one screen.

- **Route:** `/environments` (sidebar: Portfolio → Environment Desk)
- **Documentation:** [docs/ENVIRONMENT-DESK.md](./docs/ENVIRONMENT-DESK.md)

Synthetic data is derived from the release train (`releases`, `services`, deployment configs, change records). Panels cross-link: select a timeline bar or version row to sync booking and config tabs. Use the Quick Start template **Environment desk** under Planning for a guided walkthrough.

## Demo anchors

- **v2.14.0** — overdue Security approval, high file-change count
- **v2.13.5** — failed build
- **v2.15.0** — large release, build running

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · recharts · reactflow · OpenAI / Anthropic

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes.
