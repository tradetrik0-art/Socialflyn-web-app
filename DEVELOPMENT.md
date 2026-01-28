# Socialflyn Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Setup Environment

```bash
# Clone repo
git clone <repo-url> socialflyn
cd socialflyn

# Install dependencies
npm install

# Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Configure your .env files with:
# - DATABASE_URL (PostgreSQL connection)
# - OPENAI_API_KEY
# - SENDGRID_API_KEY
# - TWILIO credentials
```

### 2. Initialize Database

```bash
cd apps/backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed sample data
npm run db:seed

# (Optional) View database
npm run db:studio
```

### 3. Start Development

```bash
# From root directory, start both backend and frontend
npm run dev

# Or separately:
# Terminal 1
cd apps/backend && npm run dev

# Terminal 2
cd apps/frontend && npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs (future)

---

## 📁 Project Structure

```
socialflyn/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/           # JWT + authentication
│   │   │   ├── tenants/        # Multi-tenancy logic
│   │   │   ├── clients/        # Client management
│   │   │   ├── ai/             # OpenAI integration
│   │   │   ├── content/        # Posts & content queue
│   │   │   ├── automation/     # Email & WhatsApp
│   │   │   ├── ads/            # Meta & Google Ads APIs
│   │   │   ├── dashboard/      # Analytics endpoints
│   │   │   ├── prisma/         # Database service
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # DB migration history
│   │   ├── docs/
│   │   │   └── API.md          # Full API docs
│   │   └── package.json
│   │
│   └── frontend/         # Next.js App
│       ├── app/
│       │   ├── auth/          # Login & signup pages
│       │   ├── dashboard/      # Main dashboard
│       │   ├── content/        # Content management
│       │   ├── automation/     # Outreach management
│       │   ├── page.tsx        # Landing page
│       │   └── layout.tsx      # Root layout
│       ├── components/
│       │   ├── ui/             # Reusable UI components
│       │   └── forms/          # Form components
│       ├── lib/
│       │   ├── api.ts          # API client
│       │   └── auth.ts         # Auth utilities
│       └── package.json
│
└── packages/
    ├── shared/          # Shared types
    └── ui/              # Shared components
```

---

## 🔧 Common Development Tasks

### Adding a New Endpoint

1. **Create service** in `apps/backend/src/module/module.service.ts`
2. **Create controller** in `apps/backend/src/module/module.controller.ts`
3. **Export module** in `apps/backend/src/app.module.ts`
4. **Document** in `apps/backend/docs/API.md`

### Adding a Database Model

1. **Update Prisma schema** in `apps/backend/prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate -- --name add_feature`
3. **Regenerate client**: `npm run db:generate`
4. **Create service** to interact with new model

### Working with AI Features

The `AiService` in `apps/backend/src/ai/ai.service.ts` handles:
- Post generation
- Growth planning
- Template personalization
- Performance analysis

Example:
```typescript
const posts = await aiService.generateMonthlyPosts(
  clientId,
  'e-commerce',
  ['instagram', 'facebook']
);
```

### Integration with External APIs

- **OpenAI**: `apps/backend/src/ai/ai.service.ts`
- **SendGrid**: `apps/backend/src/automation/automation.service.ts`
- **Twilio**: `apps/backend/src/automation/automation.service.ts`
- **Meta Ads**: `apps/backend/src/ads/ads.service.ts`

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

### Frontend Tests

```bash
cd apps/frontend

# Run tests (placeholder)
npm run test
```

---

## 📊 Database Schema

Key tables:
- `users` - Auth & roles
- `tenants` - Multi-tenancy
- `clients` - Client profiles
- `posts` - Social media content
- `ai_plans` - Growth roadmaps
- `automation_leads` - Lead tracking
- `outreach_sequences` - Email/WhatsApp templates
- `ad_accounts` - Connected ad accounts
- `ad_campaigns` - Ad performance data
- `billing_invoices` - Billing records

---

## 🔒 Security Checklist

- [ ] Validate all inputs (whitelist validation in DTOs)
- [ ] Encrypt sensitive fields (API keys, tokens)
- [ ] Implement row-level tenant isolation
- [ ] Use parameterized queries (Prisma ORM handles this)
- [ ] Rate limit endpoints
- [ ] Log audit trails
- [ ] Use HTTPS in production
- [ ] Rotate secrets regularly

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd apps/frontend
vercel deploy
```

### Backend (AWS ECS / Render)

```bash
# Build Docker image
docker build -t socialflyn-api:latest .

# Push to registry
docker push your-registry/socialflyn-api:latest

# Deploy to ECS / Kubernetes
# (See DevOps team for specifics)
```

### Database

```bash
# Production migrations
npm run db:migrate -- --environment production

# Backup
pg_dump <production_db> > backup.sql
```

---

## 📝 Code Style

- **Language**: TypeScript
- **Formatting**: Prettier (auto-format on save)
- **Linting**: ESLint
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: JSDoc for public APIs

Run:
```bash
npm run lint
npm run format
```

---

## 🐛 Debugging

### Backend
```bash
# Debug mode
npm run debug

# Attach VSCode debugger to port 9229
```

### Frontend
- Use React DevTools browser extension
- Network tab for API debugging
- `localStorage` for auth token inspection

### Database
```bash
# Open Prisma Studio
npm run db:studio
```

---

## 📚 Useful Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ❓ FAQ

**Q: How do I add a new package/workspace?**
A: Create folder in `packages/`, add `package.json`, update root `package.json` workspaces array.

**Q: How do I test OpenAI integration locally?**
A: Add `OPENAI_API_KEY` to `.env`, call endpoints via Postman or curl.

**Q: How do I reset the database?**
A: `npm run db:migrate reset` (careful in production!)

**Q: Where are environment variables stored?**
A: Backend: `apps/backend/.env`, Frontend: `apps/frontend/.env` (prefix with `NEXT_PUBLIC_` for client-side)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/xyz`
2. Make changes & test locally
3. Push & create PR
4. Await CI/CD checks + review
5. Merge when approved

---

For help, reach out to: **dev@socialflyn.com**
