# Socialflyn API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
All endpoints (except `/auth/*`) require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Create a new account
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "isAgency": true,
  "companyName": "My Agency"
}
```
Response:
```json
{
  "user": { "id", "email", "name", "role", "tenant" },
  "access_token": "jwt_token"
}
```

#### POST /auth/login
Login and get token
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

---

### Clients

#### POST /clients
Create a new client
```json
{
  "name": "Client Name",
  "industry": "E-commerce",
  "platforms": ["instagram", "facebook", "linkedin"],
  "monthlyBudget": 5000,
  "packageType": "SOCIAL_MEDIA_MANAGEMENT"
}
```

#### GET /clients
List all clients (for your tenant)

#### GET /clients/:id
Get client details

---

### Content Management

#### GET /content/posts/:clientId
Get all posts for a client

**Query params:**
- `status`: DRAFT, QUEUED, APPROVED, PUBLISHED

#### POST /content/post/:id/approve
Approve a post for publishing

#### POST /content/post/:id/publish
Publish a post (immediately or scheduled)
```json
{
  "scheduledAt": "2024-02-15T10:00:00Z"  // optional
}
```

#### GET /content/stats/:clientId
Get content performance statistics

---

### AI Features

#### POST /ai/generate-posts/:clientId
Generate 22 monthly posts
```json
{
  "industry": "E-commerce",
  "platforms": ["instagram", "facebook"]
}
```

#### POST /ai/growth-plan/:clientId
Generate 30/60/90 day growth plan
```json
{
  "industry": "E-commerce",
  "monthlyBudget": 5000
}
```

#### POST /ai/outreach-template
Generate cold outreach templates
```json
{
  "clientName": "John's Store",
  "industry": "E-commerce",
  "package": "SOCIAL_MEDIA_MANAGEMENT"
}
```

#### POST /ai/analyze-performance
Get AI recommendations based on metrics
```json
{
  "metrics": { "ctr": 2.5, "cpc": 0.75, "roas": 3.2 },
  "industry": "E-commerce"
}
```

---

### Automation & Outreach

#### POST /automation/upload-leads/:clientId
Upload CSV file with leads

**Form data:**
- `file`: CSV file (columns: email, name, phone, company, industry)

#### POST /automation/send-email
Send email to contact
```json
{
  "to": "contact@example.com",
  "subject": "Grow with Socialflyn",
  "html": "<h1>Hello</h1>",
  "from": "socialflyn02@gmail.com"
}
```

#### POST /automation/send-whatsapp
Send WhatsApp message
```json
{
  "phone": "+919021877385",
  "message": "Hi, interested in growing your business?"
}
```

#### POST /automation/start-sequence/:clientId/:leadId
Start Day 1, 3, 7 outreach sequence
```json
{
  "email": {
    "day1": "Hi {{name}}, I noticed your {{industry}} business...",
    "day3": "Following up on my previous email...",
    "day7": "Last chance to improve your {{metric}}..."
  },
  "whatsapp": {
    "day1": "Hi {{name}}! We help {{industry}} businesses grow 3x faster.",
    "day3": "Still interested in scaling?",
    "day7": "Let's chat!"
  }
}
```

#### GET /automation/leads/:clientId
Get all leads for a client

#### GET /automation/sequences/:tenantId
Get all active outreach sequences

---

### Ads Integration

#### POST /ads/connect-meta/:clientId
Connect Meta (Facebook/Instagram) ad account
```json
{
  "accessToken": "fb_access_token_here"
}
```

#### POST /ads/sync-meta/:adAccountId
Fetch latest campaigns & metrics from Meta

#### GET /ads/campaigns/:clientId
Get all ad campaigns for a client

#### GET /ads/performance/:clientId
Get performance summary (CTR, CPC, spend, etc.)

#### DELETE /ads/disconnect/:adAccountId
Disconnect an ad account

---

### Dashboard

#### GET /dashboard/client/:clientId
Get client dashboard summary
```json
{
  "posts": { "total", "approved", "published", "remaining" },
  "engagement": { "totalEngagement", "avgEngagementPerPost", "likes", "comments", "shares" },
  "ads": { "connectedAccounts", "totalSpend", "campaignCount" },
  "plan": { "id", "type", "status" },
  "leads": { "total", "new", "contacted", "converted" }
}
```

#### GET /dashboard/admin/:tenantId
Get admin dashboard (all clients overview)

#### GET /dashboard/report/:clientId
Generate monthly performance report

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting
- 100 requests per minute per IP
- 10 requests per second per endpoint

## Webhooks (Future)
- `lead.created` - When new lead is added
- `post.published` - When content goes live
- `campaign.performance` - Daily campaign performance update
