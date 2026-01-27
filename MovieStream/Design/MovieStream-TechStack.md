# MovieStream - Technology Stack

## Giới thiệu

Tài liệu này liệt kê các công nghệ được sử dụng trong dự án **MovieStream** cùng với lý do lựa chọn.

---

## 1. Frontend Stack

### 1.1. Core Framework

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **Next.js** | 14.x | React Framework | SSR/SSG, App Router, API Routes, Image Optimization |
| **React** | 18.x | UI Library | Component-based, hooks, large ecosystem |
| **TypeScript** | 5.x | Type-safe JavaScript | Type safety, better DX, catch bugs early |

### 1.2. Styling

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **TailwindCSS** | 3.x | Utility-first CSS | Fast development, responsive, small bundle |
| **Shadcn/ui** | latest | UI Components | Accessible, customizable, copy-paste |
| **Lucide React** | latest | Icon library | Consistent, lightweight, tree-shakeable |

### 1.3. State & Data

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **TanStack Query** | 5.x | Data fetching | Caching, background refresh, optimistic updates |
| **Zustand** | 4.x | State management | Simple, lightweight, TypeScript support |
| **React Hook Form** | 7.x | Form handling | Performance, validation integration |
| **Zod** | 3.x | Schema validation | TypeScript-first, composable schemas |

### 1.4. Video Player

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **HLS.js** | 1.x | HLS streaming | Industry standard, wide browser support |
| **Plyr** | 3.x (optional) | Player UI | Beautiful UI, customizable controls |

### 1.5. Authentication

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **NextAuth.js** | 5.x (Auth.js) | Authentication | Built for Next.js, multiple providers, session management |

### 1.6. Utilities

| Technology | Mô tả |
|------------|-------|
| **date-fns** | Date manipulation |
| **clsx** | Conditional classNames |
| **slugify** | URL slug generation |
| **lodash** | Utility functions (only import needed) |

---

## 2. Backend Stack

### 2.1. Runtime & Framework

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **Node.js** | 20.x LTS | JavaScript Runtime | Non-blocking I/O, large ecosystem |
| **Express** | 4.x | Web Framework | Simple, mature, extensive middleware |
| **TypeScript** | 5.x | Type-safe | Consistent with frontend, better DX |

**Alternative**: Fastify (nếu cần performance cao hơn)

### 2.2. Database & ORM

| Technology | Version | Mô tả | Lý do chọn |
|------------|---------|-------|------------|
| **PostgreSQL** | 15.x | Database | Reliable, feature-rich, free |
| **Prisma** | 5.x | ORM | Type-safe queries, migrations, studio |

### 2.3. Authentication & Security

| Technology | Mô tả |
|------------|-------|
| **jsonwebtoken** | JWT generation/verification |
| **bcrypt** | Password hashing |
| **helmet** | Security headers |
| **cors** | CORS middleware |
| **express-rate-limit** | Rate limiting |

### 2.4. Validation & Utilities

| Technology | Mô tả |
|------------|-------|
| **Zod** | Schema validation |
| **uuid** | UUID generation |
| **crypto** | Signing, hashing |
| **multer** | File upload handling |

---

## 3. Database

### 3.1. Primary Database

| Service | Tier | Mô tả | Chi phí |
|---------|------|-------|---------|
| **Supabase** | Free | PostgreSQL hosting | Free (500MB, 2 projects) |
| **Neon** (alternative) | Free | Serverless PostgreSQL | Free (0.5GB) |

### 3.2. Caching (Optional - Phase 2)

| Service | Mô tả | Chi phí |
|---------|-------|---------|
| **Upstash Redis** | Serverless Redis | Free tier available |

---

## 4. Video Infrastructure

### 4.1. Video Hosting & CDN

| Service | Mô tả | Chi phí |
|---------|-------|---------|
| **Bunny.net Stream** | Video hosting, transcoding, CDN | $0.005/GB storage, $0.01/GB bandwidth |

**Tính năng Bunny.net Stream**:
- Automatic transcoding to HLS
- Adaptive bitrate streaming (240p - 1080p)
- Token authentication
- AES-128 encryption
- Global CDN (112+ PoPs)
- Direct upload API
- Webhook notifications

### 4.2. Chi phí ước tính Bunny.net

| Metric | Estimated | Cost |
|--------|-----------|------|
| Storage (300 videos x 2GB avg) | 600 GB | $3/tháng |
| Bandwidth (5000 views x 1GB avg) | 5 TB | $50/tháng |
| **Total** | | **~$53/tháng** |

*Lưu ý: Chi phí sẽ tăng theo lượng users*

---

## 5. Payment Gateways

### 5.1. VNPay

| Item | Value |
|------|-------|
| Type | Payment Gateway |
| Integration | Server-to-Server API |
| Fee | ~1.5% per transaction |
| Documentation | https://sandbox.vnpayment.vn/apis |

### 5.2. MoMo

| Item | Value |
|------|-------|
| Type | E-wallet + Payment Gateway |
| Integration | Collection API |
| Fee | ~1.5% per transaction |
| Documentation | https://developers.momo.vn |

---

## 6. Deployment & Hosting

### 6.1. Frontend Hosting

| Service | Tier | Mô tả | Chi phí |
|---------|------|-------|---------|
| **Vercel** | Hobby/Pro | Next.js hosting | Free / $20/tháng |

**Tại sao Vercel**:
- Built for Next.js
- Automatic deployments from Git
- Edge functions
- Analytics built-in
- SSL included

### 6.2. Backend Hosting

| Service | Tier | Mô tả | Chi phí |
|---------|------|-------|---------|
| **Railway** | Starter | Node.js hosting | $5/tháng |
| **Render** (alternative) | Free/Starter | Node.js hosting | Free / $7/tháng |

**Tại sao Railway**:
- Simple deployment
- Auto-scaling
- PostgreSQL addon
- Reasonable pricing

### 6.3. DNS & Security

| Service | Tier | Mô tả | Chi phí |
|---------|------|-------|---------|
| **Cloudflare** | Free | DNS, DDoS protection, CDN | Free |

---

## 7. DevOps & Tooling

### 7.1. Version Control

| Tool | Mô tả |
|------|-------|
| **Git** | Version control |
| **GitHub** | Repository hosting |
| **GitHub Actions** | CI/CD pipelines |

### 7.2. Development Tools

| Tool | Mô tả |
|------|-------|
| **VS Code** | Code editor |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **lint-staged** | Pre-commit linting |

### 7.3. Testing (Phase 2)

| Tool | Mô tả |
|------|-------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **MSW** | API mocking |

### 7.4. Monitoring (Phase 2)

| Service | Mô tả | Chi phí |
|---------|-------|---------|
| **Sentry** | Error tracking | Free tier |
| **Vercel Analytics** | Web analytics | Included |
| **Better Stack** | Uptime monitoring | Free tier |

---

## 8. Development Environment

### 8.1. Package Managers

| Tool | Frontend | Backend |
|------|----------|---------|
| **pnpm** | Recommended | Recommended |
| **npm** | Alternative | Alternative |

### 8.2. Environment Variables

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BUNNY_PULL_ZONE=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

**Backend (.env)**:
```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
BUNNY_API_KEY=
BUNNY_LIBRARY_ID=
BUNNY_STREAM_TOKEN_KEY=
VNPAY_MERCHANT_ID=
VNPAY_HASH_SECRET=
VNPAY_URL=
MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=
```

---

## 9. Tổng chi phí ước tính

### 9.1. MVP Phase (Tháng 1-2)

| Item | Chi phí/tháng |
|------|---------------|
| Vercel (Hobby) | $0 |
| Railway (Starter) | $5 |
| Supabase (Free) | $0 |
| Bunny.net Stream | ~$10-20 |
| Cloudflare (Free) | $0 |
| Domain | ~$1 (amortized) |
| **Total** | **~$16-26/tháng** |

### 9.2. Growth Phase (Tháng 3-6)

| Item | Chi phí/tháng |
|------|---------------|
| Vercel (Pro) | $20 |
| Railway (Team) | $20 |
| Supabase (Pro) | $25 |
| Bunny.net Stream | ~$50-100 |
| Cloudflare (Free) | $0 |
| Sentry (Free) | $0 |
| **Total** | **~$115-165/tháng** |

---

## 10. Technology Decision Matrix

| Criteria | Weight | Next.js | React SPA | Vue.js |
|----------|--------|---------|-----------|--------|
| SEO Support | 20% | 5 | 2 | 4 |
| Developer Experience | 20% | 5 | 4 | 4 |
| Performance | 15% | 5 | 3 | 4 |
| Ecosystem | 15% | 5 | 5 | 3 |
| Deployment Ease | 15% | 5 | 4 | 4 |
| Team Familiarity | 15% | 5 | 5 | 2 |
| **Total** | 100% | **5.0** | 3.8 | 3.5 |

**Kết luận**: Next.js là lựa chọn tối ưu cho dự án này.

---

*Tài liệu này được cập nhật lần cuối: Tháng 1/2026*
