# XiaoHaibao - Complete Handoff Document

> Generated: 2026-08-10  
> Purpose: Seamless handoff between conversations  
> Target Agents: Codex / Claude Code / Grok / Universal

---

## 1. Project Overview

| Item | Detail |
|------|--------|
| **Product Name** | XiaoHaibao (means "Little Seal Poster", icon: 🦭) |
| **Positioning** | WeChat Moments Poster H5 Agent - Input text -> AI plan -> Generate complete poster |
| **Platform** | Responsive H5 (mobile-first) |
| **Domain** | Not purchased yet, planned: xiaohaibao.pages.dev (Cloudflare free) |
| **Reference Site** | https://pyq.fengmian.xyz (account: 1191020399@qq.com / zcw5786400) |
| **Business Model** | Dual-track: User own Key (free) / Buy credits use platform Key |
| **Agent System** | Agents fill own Key, invite users to share; schema pre-embedded |
| **ICP Filing** | No filing, overseas hosting |
| **Current Stage** | MVP V1 - Frontend complete, backend code complete, pending deployment |

---

## 2. Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | React 19 + Vite 6 + Tailwind CSS 3 + React Router v7 | SPA |
| Design System | "Warm Intelligence" | Warm yellow bg #fbf9f4 / Purple #4310aa / Lime CTA #c8ff19 |
| Font | Plus Jakarta Sans | Google Fonts |
| Backend | Cloudflare Pages Functions | Workers runtime |
| Database | Cloudflare D1 | SQLite-compatible |
| Storage | Cloudflare R2 | Image/output files |
| Auth | Custom JWT | better-auth planned but not integrated yet |
| AI Services | DeepSeek (planning) + Image2 (generation) | Via openapi.yiminju.xyz |
| Deployment | Cloudflare Pages + Workers + D1 + R2 | $0 cost |
| Build Output | 269KB JS (gzip 83KB) + 17KB CSS (gzip 4KB) | Passes build |

---

## 3. Project File Structure

```
D:\大耳文\codex\朋友圈文案及封面\
├── docs/                              # 8 PRD docs + deployment guide
│   ├── README.md
│   ├── 01-项目概述.md ~ 07-计费与支付.md
│   ├── 08-部署方案.md
│   └── PRD-产品需求文档.md
├── stitch_document_to_ui_generator/    # UI design drafts (with DESIGN.md)
└── xiaohaibao/                         # MAIN CODEBASE
    ├── package.json
    ├── vite.config.js                  # Port 3000
    ├── tailwind.config.js              # Warm Intelligence tokens
    ├── wrangler.toml                   # CF deployment config
    ├── schema.sql                      # D1 7 tables
    ├── index.html
    ├── public/favicon.svg              # Seal icon
    ├── functions/api/[[route]].js      # All Workers API (14 endpoints)
    ├── dist/                           # Build output
    └── src/
        ├── main.jsx                    # Entry
        ├── App.jsx                     # Routes + AuthProvider
        ├── index.css                   # Tailwind + font
        ├── components/
        │   ├── Layout.jsx              # Bottom nav + admin subnav + logout
        │   └── AssetUpload.jsx         # Reference image upload
        ├── pages/
        │   ├── LoginPage.jsx           # Login/register (AuthContext)
        │   ├── CreatePage.jsx          # 3-step creation (core)
        │   ├── WorksPage.jsx           # Works gallery
        │   ├── SettingsPage.jsx        # API Key config
        │   └── admin/
        │       ├── AdminOverview.jsx    # Dashboard
        │       ├── AdminUsers.jsx       # User management
        │       └── AdminInviteCodes.jsx # Invite codes
        └── lib/
            ├── auth.jsx                # AuthContext + guards
            ├── schema.js               # DB schema definitions
            ├── key-resolver.js         # 3-level Key resolver
            ├── api-routes.js           # API route list
            └── config.js               # Credit pricing config
```

---

## 4. Feature Status

### Completed (frontend + backend code)

| Page | Frontend | Backend API | Notes |
|------|----------|-------------|-------|
| Login/Register | Done | Done | Email + password, localStorage persistence |
| 3-Step Creation | Done | Done | Input -> AI plan confirm -> Generate poster |
| Reference Upload | Done | Pending R2 | Person / Product cover / Logo |
| Works Gallery | Done | Done | Category filter, grid display |
| Settings | Done | Done | DeepSeek + Image2 Key per service config |
| Admin Overview | Done | Done | Today metrics, trends, admin API |
| Admin Users | Done | Done | Search, details, admin API |
| Admin Invite Codes | Done | Done | Generate/revoke/usage stats |
| Auth Guards | Done | N/A | RequireAuth + RequireAdmin |
| Logout | Done | N/A | Top right in Layout |

### Pending

| Task | Priority | Notes |
|------|----------|-------|
| Deploy to Cloudflare | HIGH | Need Dashboard manual ops |
| Create D1 database | HIGH | Execute schema.sql |
| Create R2 bucket | MED | Image uploads |
| Frontend connect real API | MED | Replace mock data |
| better-auth integration | LOW | Current custom JWT works |
| Credit top-up system | LOW | Pre-embedded, not to develop yet |
| Agent panel | LOW | Pre-embedded, not to develop yet |

---

## 5. API Endpoints (all implemented)

| Method | Path | Function | Auth |
|--------|------|----------|------|
| POST | /api/auth/sign-up | Register | None |
| POST | /api/auth/sign-in | Login | None |
| POST | /api/ai/plan | DeepSeek planning | Bearer Token |
| POST | /api/image/generations | Image2 generation | Bearer Token |
| GET | /api/works | List works | Bearer Token |
| POST | /api/works | Create work | Bearer Token |
| DELETE | /api/works?id= | Delete work | Bearer Token |
| GET | /api/settings | Get settings | Bearer Token |
| POST | /api/settings/deepseek | Set DeepSeek Key | Bearer Token |
| POST | /api/settings/image2 | Set Image2 Key | Bearer Token |
| GET | /api/admin/overview | Dashboard stats | Admin |
| GET | /api/admin/users | User list | Admin |
| GET | /api/admin/codes | Invite code list | Admin |
| POST | /api/admin/codes | Generate code | Admin |
| DELETE | /api/admin/codes?id= | Revoke code | Admin |

Key resolution priority: Self Key -> Agent Key -> Platform Key

---

## 6. Runtime Info

```bash
# Development
cd D:\大耳文\codex\朋友圈文案及封面\xiaohaibao
node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 3000

# Build
node node_modules/vite/bin/vite.js build

# Page Routes
http://localhost:3000/            -> Redirects to /create
http://localhost:3000/login       -> Login page
http://localhost:3000/create      -> 3-step creation
http://localhost:3000/works       -> My works
http://localhost:3000/settings    -> Service settings
http://localhost:3000/admin       -> Admin overview
http://localhost:3000/admin/users -> User management
http://localhost:3000/admin/codes -> Invite codes
```

**Login hint**: Use email containing "admin" (e.g. admin@seal.com) to access admin panel.

---

## 7. Cloudflare Deployment (to execute)

### Step 1: Install Wrangler
```bash
npm i -g wrangler
wrangler login
```

### Step 2: Create D1 Database
CF Dashboard -> Workers & Pages -> D1 -> Create Database
- Name: xiaohaibao
- After creation, execute schema.sql in Console
- Update database_id in wrangler.toml

### Step 3: Create R2 Bucket
CF Dashboard -> R2 -> Create Bucket
- Name: xiaohaibao-assets

### Step 4: Set Environment Variables
Pages -> Settings -> Environment Variables:
| Variable | Description |
|----------|-------------|
| JWT_SECRET | Random string for JWT signing |
| PLATFORM_DEEPSEEK_KEY | Fallback DeepSeek Key |
| PLATFORM_IMAGE2_KEY | Fallback Image2 Key |

### Step 5: Deploy
```bash
cd D:\大耳文\codex\朋友圈文案及封面\xiaohaibao
npx wrangler pages deploy dist --project-name xiaohaibao
```

---

## 8. D1 Database Tables (schema.sql)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| users | User accounts | email, password_hash, role, deepseek_key, image2_key, credit_balance, agent_id, agent_key_share |
| works | Generated posters | user_id, title, category, ratio, content, plan_data, result_url, status |
| ai_logs | AI call audit trail | user_id, provider, key_source, credit_cost, status, error_msg |
| credit_top_ups | Credit purchase history | user_id, amount, source, status |
| invite_codes | Admin-generated codes | code, created_by, max_uses, used_count, active |
| invite_code_uses | Redemption records | code_id, used_by, used_at |

Dual-track billing is embedded: users table has both deepseek_key/image2_key (own Key) AND credit_balance (platform credits)
Agent system is embedded: users table has agent_id (inviter) + agent_key_share + agent_deepseek_key + agent_image2_key

---

## 9. Key Decisions Log

| Decision | Conclusion | When |
|----------|------------|------|
| Product name | "XiaoHaibao" from 20 candidates | Early |
| Platform type | Responsive H5 (not desktop web) | Early |
| Tech stack | React + Vite + Tailwind | Early |
| Hosting | Cloudflare free tier ($0) | Early |
| Business model | Dual-track (own Key / credits) | Mid |
| Agent system | Pre-embedded, not blocking MVP | Mid |
| Key source | User fills own Key, platform bears no AI cost | Mid |
| Reference site insight | Original site free because dev built own Image2 API as revenue source | Mid |
| Dead code cleanup | Removed AdminDashboard.jsx + AdminLayout.jsx | 2026-08-10 |
| Auth guards | Added AuthContext + RequireAuth/RequireAdmin | 2026-08-10 |
| Backend creation | Workers API 14 endpoints + D1 schema 7 tables | 2026-08-10 |
| Bugs fixed | 4 bugs (dead code, missing favicon, no auth guard, login no persistence) | 2026-08-10 |

---

## 10. How to Resume in a New Conversation

**Best practice: give this file + code paths to the new agent.**

Minimal resume prompt:

```
I am developing "XiaoHaibao", a WeChat Moments poster H5 tool.
Please read D:\大耳文\codex\朋友圈文案及封面\xiaohaibao\HANDOFF.md first,
then explore the codebase and tell me what you understand about the project status.
```

---

## 11. Other Methods for Continuity (for reference)

| Method | Pros | Cons |
|--------|------|------|
| **HANDOFF.md (current)** | File-based, survives anything, any agent can read | Manual update needed |
| dbs-save skill | Saves context to local, quick restore | Only works in dbskill ecosystem |
| Codex create_goal | Token budget tracking, status persistence | Codex-specific |
| Git commit messages | Natural part of workflow | Not enough context alone |
| Agent migration (dbs-agent-migration) | Cross-agent sync | Complex setup |

**Recommendation**: HANDOFF.md as the source of truth, supplemented by git commits and docs/. It is the most universal and reliable approach.

---

*This file: D:\大耳文\codex\朋友圈文案及封面\xiaohaibao\HANDOFF.md*