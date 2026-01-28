# Socialflyn — AI-Powered Agency Platform

A complete full-stack web application for scaling social media clients using AI automation.

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- OpenAI API key
- SendGrid API key
- Twilio account for WhatsApp

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Configure your env files with API keys and DB connection

# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed

# Start dev environment
npm run dev
```

## 📦 Project Structure

```
socialflyn/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/          # Authentication & JWT
│   │   │   ├── tenants/        # Multi-tenancy
│   │   │   ├── clients/        # Client management
│   │   │   ├── ai/             # AI integrations (OpenAI, etc.)
│   │   │   ├── content/        # Posts & content queue
│   │   │   ├── automation/     # Email, WhatsApp, outreach
│   │   │   ├── ads/            # Meta & Google Ads APIs
│   │   │   ├── dashboard/      # Analytics & metrics
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── frontend/         # Next.js App
│       ├── app/
│       │   ├── auth/          # Login, signup
│       │   ├── dashboard/      # Client & Admin dashboards
│       │   ├── content/        # Content creation & queue
│       │   ├── automation/     # Outreach management
│       │   ├── analytics/      # Metrics & reports
│       │   └── layout.tsx
│       ├── components/
│       │   ├── ui/             # Reusable components
│       │   ├── forms/
│       │   └── modals/
│       ├── lib/
│       │   ├── api.ts          # API client
│       │   ├── auth.ts
│       │   └── utils.ts
│       ├── package.json
│       └── .env.example
│
└── packages/
    ├── shared/          # Shared types & constants
    │   ├── types.ts
    │   ├── constants.ts
    │   └── package.json
    └── ui/              # Shared UI components
        ├── package.json
        └── components/
```

## 🏗️ Architecture

- **Frontend:** Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend:** NestJS + TypeScript + Prisma ORM
- **Database:** PostgreSQL
- **Cache/Queue:** Redis + BullMQ
- **AI:** OpenAI (GPT-4) for content & planning
- **Email:** SendGrid
- **WhatsApp:** Twilio
- **Ads APIs:** Meta Marketing API, Google Ads API
- **Auth:** NextAuth.js (JWT)
- **Hosting:** Vercel (frontend), AWS/Render (backend)

## 📋 MVP Features

1. **Multi-tenant Authentication** — Role-based (admin, client, reviewer)
2. **Client Onboarding Assistant** — AI-powered questionnaire → package recommendation
3. **AI Content Generator** — Captions, hashtags, ad copy from OpenAI
4. **Content Approval Workflow** — Admin reviews & approves posts
5. **Dashboard** — Posts delivered, engagement metrics, AI suggestions
6. **Cold Outreach Automation** — Email + WhatsApp sequences (Day 1, 3, 7)
7. **Ad Account Integration** — Connect Meta & Google accounts (read-only for MVP)
8. **PDF Reports** — Monthly performance summaries

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd apps/frontend
vercel deploy
```

### Backend (AWS ECS / Render)
```bash
cd apps/backend
npm run build
# Deploy via Docker / CI-CD
```

### Database Migrations
```bash
npm run db:migrate -- --environment production
```

## 📚 API Documentation

See `apps/backend/docs/API.md` for full endpoint reference.

## 🔐 Security

- JWT-based authentication
- Row-level tenant isolation
- Encrypted credential storage (AWS Secrets Manager)
- Rate limiting & CORS configured
- Audit logs for all changes
- GDPR compliance (data export/deletion)

## 📊 Monitoring

- Error tracking: Sentry
- Metrics: Prometheus/Grafana
- Logs: CloudWatch / ELK stack

## 📝 License

Proprietary — Socialflyn Ltd.
