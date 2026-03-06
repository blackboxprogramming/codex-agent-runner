# Codex Agent Runner

[![Build Status](https://img.shields.io/github/actions/workflow/status/blackboxprogramming/codex-agent-runner/deploy.yml?branch=main)](https://github.com/blackboxprogramming/codex-agent-runner/actions)
[![npm version](https://img.shields.io/npm/v/codex-agent-runner)](https://www.npmjs.com/package/codex-agent-runner)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey.svg)](LICENSE)
[![Brand Compliant](https://img.shields.io/badge/Brand-Compliant-success)](https://brand.blackroad.io)
[![Live](https://img.shields.io/badge/Live-codex--agent--runner.pages.dev-brightgreen)](https://codex-agent-runner.pages.dev)

> **Production-grade GitHub Actions runner for Codex AI agents** — deploy, monitor, and bill autonomous AI workloads at scale with built-in Stripe payments and end-to-end health checks.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Technology Stack](#️-technology-stack)
4. [Quick Start](#-quick-start)
5. [npm Installation](#-npm-installation)
6. [Configuration](#️-configuration)
7. [Stripe Integration](#-stripe-integration)
8. [Deployment](#-deployment)
9. [End-to-End Testing](#-end-to-end-testing)
10. [Project Structure](#-project-structure)
11. [Brand Compliance](#-brand-compliance)
12. [Contributing](#-contributing)
13. [Support](#-support)
14. [License](#-license)

---

## 🌐 Overview

**Codex Agent Runner** is a production-ready platform built on the [BlackRoad OS](https://blackroad.io) ecosystem that orchestrates, deploys, and monetises autonomous AI agents at enterprise scale.

- **30,000 AI Agents** managed concurrently
- **30,000 Human Employees** supported in hybrid workflows
- **One Operator model** — centralised control with distributed execution
- Billing and metering powered by **Stripe**
- Zero-downtime deploys via **Cloudflare Pages** and **Railway**
- Continuous security scanning with **CodeQL** and **npm audit**

**Live URL:** <https://codex-agent-runner.pages.dev>

---

## 🌟 Features

- ✨ **Autonomous agent orchestration** — spawn, monitor, and terminate Codex agents via GitHub Actions
- 💳 **Stripe billing** — usage-based metering, subscription management, and webhook handling
- 🚀 **Auto-deploy** — detects Next.js, Docker, Node, Python, or static projects and routes to the correct cloud target
- 🔒 **Security scanning** — CodeQL (JavaScript, TypeScript, Python) + dependency review on every PR
- 🔧 **Self-healing** — automated health checks every 30 minutes with auto-rollback on failure
- 🌍 **Cloudflare Pages CDN** — global edge delivery with preview URLs per PR
- 📊 **Observability** — structured health endpoints and deployment status webhooks
- 🎨 **BlackRoad Brand System** — golden ratio spacing, brand-compliant colour palette

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 LTS |
| Frontend | Next.js (React) |
| Styling | CSS Custom Properties, BlackRoad Brand System |
| Payments | Stripe (Billing, Webhooks, Metering) |
| Hosting | Cloudflare Pages (static/Next.js), Railway (Node/Docker) |
| CI/CD | GitHub Actions |
| Security | CodeQL, npm audit, Dependency Review |
| Auth | Clerk |
| Version Control | Git & GitHub |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/blackboxprogramming/codex-agent-runner.git
cd codex-agent-runner

# 2. Install dependencies
npm install

# 3. Create your environment variables file
#    (see the Environment Variables section below for required keys)
touch .env.local

# 4. Start the development server
npm run dev
```

Open <http://localhost:3000> in your browser.

---

## 📦 npm Installation

### Install as a package

```bash
npm install codex-agent-runner
```

### Peer dependencies

```bash
npm install stripe @stripe/stripe-js next react react-dom
```

### Usage

```js
import { AgentRunner } from 'codex-agent-runner';

const runner = new AgentRunner({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  maxAgents: 30000,
});

await runner.start();
```

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Lint source files |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

---

## ⚙️ Configuration

Create a `.env.local` file in the project root and populate all required variables, for example:

```env
# ── Stripe ────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# ── Clerk Auth ────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# ── Deployment ────────────────────────────────────────────────
DEPLOY_URL=https://codex-agent-runner.pages.dev

# ── Cloudflare ────────────────────────────────────────────────
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

> ⚠️ Never commit `.env.local` or any file containing real secrets. All secrets are stored as [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

---

## 💳 Stripe Integration

Codex Agent Runner uses Stripe for subscription billing and per-agent usage metering.

### Plans

| Plan | Price | Agents | Features |
|------|-------|--------|----------|
| Starter | $49 / mo | Up to 100 | Core runner, basic monitoring |
| Pro | $299 / mo | Up to 1,000 | Advanced scheduling, webhooks |
| Enterprise | Custom | Up to 30,000 | SLA, dedicated support, SAML SSO |

### Webhook setup

1. In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks), create a webhook pointing to:
   ```
   https://<your-domain>/api/webhooks/stripe
   ```
2. Enable the following events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
3. Copy the **Signing Secret** and set it as `STRIPE_WEBHOOK_SECRET` in your environment.

### Usage metering

Agent execution time is reported to Stripe using [usage records](https://stripe.com/docs/billing/subscriptions/usage-based):

```js
await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
  quantity: agentMinutesUsed,
  timestamp: Math.floor(Date.now() / 1000),
  action: 'increment',
});
```

### Test mode

Set `STRIPE_SECRET_KEY=sk_test_...` and `STRIPE_PUBLISHABLE_KEY=pk_test_...` for local development. Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📦 Deployment

### Cloudflare Pages (Next.js / static)

Automatic deployment is triggered on every push to `main`:

```
Push to main
  └─▶ GitHub Actions: auto-deploy.yml
        ├─▶ Detect service type (next.config.mjs → cloudflare)
        ├─▶ npm ci && npm run build
        └─▶ wrangler pages deploy .next
```

**Live URL:** <https://codex-agent-runner.pages.dev>

Preview URLs are posted as PR comments automatically.

### Railway (Node / Docker)

For server-rendered or containerised workloads, the same workflow auto-deploys to Railway:

```bash
# Manual deploy via Railway CLI
npm i -g @railway/cli
railway up --service codex-agent-runner
```

### Environment secrets required

| Secret | Where to set |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | GitHub → Settings → Secrets |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub → Settings → Secrets |
| `RAILWAY_TOKEN` | GitHub → Settings → Secrets |
| `STRIPE_SECRET_KEY` | GitHub → Settings → Secrets |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | GitHub → Settings → Secrets |
| `DEPLOY_URL` | GitHub → Settings → Secrets |

---

## 🧪 End-to-End Testing

### Run E2E tests locally

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run in headed mode for debugging
npx playwright test --headed

# Run a specific test file
npx playwright test tests/e2e/billing.spec.ts
```

### E2E test coverage

| Area | Test file |
|------|-----------|
| Authentication (Clerk) | `tests/e2e/auth.spec.ts` |
| Stripe checkout flow | `tests/e2e/billing.spec.ts` |
| Agent creation & execution | `tests/e2e/agent-runner.spec.ts` |
| Webhook handling | `tests/e2e/webhooks.spec.ts` |
| Health endpoints | `tests/e2e/health.spec.ts` |
| Brand compliance | `tests/e2e/brand.spec.ts` |

### CI E2E pipeline

E2E tests run automatically on every PR via GitHub Actions. The pipeline:

1. Deploys a preview environment to Cloudflare Pages
2. Waits for the deployment to become healthy (`/api/health`)
3. Runs the full Playwright E2E suite against the preview URL
4. Posts results as a PR comment

---

## 📂 Project Structure

```
codex-agent-runner/
├── .github/
│   ├── dependabot.yml          # Automated dependency updates
│   └── workflows/
│       ├── auto-deploy.yml     # Multi-target deployment pipeline
│       ├── deploy.yml          # Cloudflare Pages deploy + brand check
│       ├── security-scan.yml   # CodeQL + dependency review
│       └── self-healing.yml    # Health monitoring + auto-rollback
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Shared React components
│   ├── lib/
│   │   ├── stripe.ts           # Stripe client & helpers
│   │   ├── agents.ts           # Agent orchestration logic
│   │   └── db.ts               # Database client
│   └── api/
│       ├── health/             # GET /api/health
│       └── webhooks/
│           └── stripe/         # POST /api/webhooks/stripe
├── tests/
│   ├── unit/                   # Jest unit tests
│   └── e2e/                    # Playwright E2E tests
├── .env.example                # Environment variable template
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── README.md                   # This file
```

---

## 🎨 Brand Compliance

This project follows the official [BlackRoad Brand System](https://brand.blackroad.io):

| Token | Value | Usage |
|-------|-------|-------|
| `--amber` | `#F5A623` | Accent, CTA |
| `--hot-pink` | `#FF1D6C` | Primary brand colour |
| `--electric-blue` | `#2979FF` | Links, focus rings |
| `--violet` | `#9C27B0` | Secondary accent |

- **Spacing:** Golden Ratio (φ = 1.618) — see [CONTRIBUTING.md](CONTRIBUTING.md) for token reference
- **Typography:** SF Pro Display, `line-height: 1.618`
- **Gradients:** 135° linear with stops at 38.2% & 61.8%

### Brand compliance check

```bash
# Verify approved colours are present
grep -r "#F5A623\|#FF1D6C\|#2979FF\|#9C27B0" . --include="*.{html,css,tsx}"

# Verify no forbidden colours
grep -r "#FF9D00\|#FF6B00\|#FF0066" . --include="*.{html,css,tsx}" && echo "⚠️ Forbidden colours found!"
```

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

**Quick guide:**

```bash
# 1. Fork & clone
git clone https://github.com/<your-fork>/codex-agent-runner.git

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make changes, then lint & test
npm run lint && npm test

# 4. Commit using conventional format
git commit -m '✨ feat: add amazing feature'

# 5. Push and open a Pull Request
git push origin feature/amazing-feature
```

---

## 📞 Support

| Channel | Link |
|---------|------|
| Documentation | <https://docs.blackroad.io> |
| GitHub Issues | <https://github.com/blackboxprogramming/codex-agent-runner/issues> |
| Email | blackroad.systems@gmail.com |
| Live app | <https://codex-agent-runner.pages.dev> |

---

## 📄 License

Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.  
**CEO:** Alexa Amundson

This software is the proprietary property of BlackRoad OS, Inc.

- ✅ **Permitted:** Testing, evaluation, and educational purposes
- ❌ **Prohibited:** Commercial use, resale, or redistribution without written permission

For commercial licensing: **blackroad.systems@gmail.com**

See [LICENSE](LICENSE) for complete terms.

---

**Status:** 🟢 Active &nbsp;|&nbsp; **Maintained by:** BlackRoad OS Team &nbsp;|&nbsp; **Last Updated:** 2026-03-01
