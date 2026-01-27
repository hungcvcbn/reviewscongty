# MovieStream - Documentation

Tài liệu thiết kế cho nền tảng xem phim trực tuyến **MovieStream**.

## Tổng quan dự án

**MovieStream** là nền tảng VOD (Video on Demand) phát phim bộ/phim tập, tập trung vào nội dung tự sản xuất với các tính năng:

- Xem phim online với chất lượng 1080p
- Hệ thống subscription (Basic, Premium, VIP)
- Bảo vệ video chống piracy (6 lớp bảo mật)
- Thanh toán qua VNPay, MoMo
- Admin panel quản lý nội dung

## Thông tin dự án

| Attribute | Value |
|-----------|-------|
| **Thị trường** | Việt Nam |
| **Platform** | Web responsive |
| **Quy mô** | 100-500 videos, 1,000-10,000 users |
| **Tech Stack** | Next.js + Node.js + PostgreSQL |
| **Video CDN** | Bunny.net Stream |
| **Timeline MVP** | 1-2 tháng |

## Cấu trúc tài liệu

```
MovieStream/
├── Design/                              # Design Documents
│   ├── MovieStream-BusinessContext.md   # Business context, vision, compliance
│   ├── MovieStream-ComponentView.md     # System architecture, API overview
│   ├── MovieStream-TechStack.md         # Technology choices & costs
│   ├── MovieStream-Challenges.md        # Technical challenges & solutions
│   └── MovieStream-PaymentIntegration.md # Payment gateway integration
│
├── HLD/                                 # High-Level Design Documents
│   └── MVP.1/
│       ├── HLD-MS-AUTH.md               # Authentication & Authorization
│       ├── HLD-MS-USER.md               # User Profile & Preferences
│       ├── HLD-MS-MOVIE.md              # Movie & Episode Management
│       ├── HLD-MS-STREAMING.md          # Video Streaming & Protection
│       ├── HLD-MS-SUBSCRIPTION.md       # Subscription & Payment
│       ├── HLD-MS-REVIEW.md             # Review & Rating System
│       └── HLD-MS-ADMIN.md              # Admin Panel
│
├── DD/                                  # Detailed Design (output folder)
│   └── (generated files)
│
├── US-Checklist.md                      # User Stories Checklist (50 stories)
├── PROMPT-TEMPLATES-HLD-US-DD.md        # Workflow prompts for DD generation
└── README.md                            # This file
```

## Quick Links

### Design Documents

| Document | Description |
|----------|-------------|
| [Business Context](Design/MovieStream-BusinessContext.md) | Bối cảnh thị trường, vision, mission, compliance |
| [Component View](Design/MovieStream-ComponentView.md) | Kiến trúc hệ thống, database schema, API overview |
| [Tech Stack](Design/MovieStream-TechStack.md) | Chi tiết tech stack, chi phí ước tính |
| [Challenges](Design/MovieStream-Challenges.md) | Thách thức kỹ thuật và giải pháp (video protection) |
| [Payment Integration](Design/MovieStream-PaymentIntegration.md) | Tích hợp VNPay, MoMo chi tiết |

### HLD Documents

| Document | Scope |
|----------|-------|
| [HLD-MS-AUTH](HLD/MVP.1/HLD-MS-AUTH.md) | Đăng ký, đăng nhập, JWT, session management |
| [HLD-MS-USER](HLD/MVP.1/HLD-MS-USER.md) | Profile, watch history, favorites |
| [HLD-MS-MOVIE](HLD/MVP.1/HLD-MS-MOVIE.md) | Movies, episodes, categories, tags |
| [HLD-MS-STREAMING](HLD/MVP.1/HLD-MS-STREAMING.md) | Video playback, DRM, watermark, concurrent limits |
| [HLD-MS-SUBSCRIPTION](HLD/MVP.1/HLD-MS-SUBSCRIPTION.md) | Plans, subscriptions, payments, webhooks |
| [HLD-MS-REVIEW](HLD/MVP.1/HLD-MS-REVIEW.md) | Reviews, ratings, voting |
| [HLD-MS-ADMIN](HLD/MVP.1/HLD-MS-ADMIN.md) | Content management, video upload, analytics |

### Project Management

| Document                                              | Description                                          |
|-------------------------------------------------------|------------------------------------------------------|
| [US-Checklist](US-Checklist.md)                       | 50 User Stories phân loại theo module và actor       |
| [Prompt Templates](PROMPT-TEMPLATES-HLD-US-DD.md)     | Workflow prompts để tạo DD và API Task List          |

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + Shadcn/ui
- **State**: TanStack Query + Zustand
- **Video Player**: HLS.js

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL 15

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: Supabase (Free tier)
- **Video CDN**: Bunny.net Stream
- **DNS/Security**: Cloudflare

### External Services
- **Payment**: VNPay, MoMo
- **Email**: SendGrid/Nodemailer

## Chi phí ước tính

| Phase | Timeline | Monthly Cost |
|-------|----------|--------------|
| MVP | Month 1-2 | ~$18-26 |
| Growth | Month 3-6 | ~$70-100 |
| Scale | Month 6-12 | ~$200-300 |

*Chi phí phụ thuộc vào số lượng video và lượt xem*

## Video Protection (6 Layers)

1. **HLS Encryption** - AES-128 (Bunny.net built-in)
2. **Signed URLs** - Token với TTL 4 giờ
3. **Domain Restriction** - Referrer whitelist
4. **Dynamic Watermark** - User ID overlay
5. **Concurrent Limit** - Max 2 devices/user
6. **Rate Limiting** - Request throttling

## Development Phases

### Phase 1: MVP (Month 1-2)
- [x] Authentication (register, login)
- [x] Movie listing & detail
- [x] Video streaming with protection
- [x] Subscription & payment (VNPay)
- [x] Basic admin panel

### Phase 2: Enhancement (Month 3-4)
- [ ] MoMo payment integration
- [ ] Review & rating system
- [ ] Watch history & continue watching
- [ ] Dynamic watermark
- [ ] Email notifications

### Phase 3: Growth (Month 5-6)
- [ ] Advanced analytics
- [ ] Push notifications
- [ ] Referral program
- [ ] Social login (Google, Facebook)
- [ ] Download for offline (if feasible)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Bunny.net account
- VNPay merchant account

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Bunny.net
BUNNY_API_KEY=your-api-key
BUNNY_LIBRARY_ID=12345
BUNNY_PULL_ZONE=vz-abc123
BUNNY_STREAM_TOKEN_KEY=random-32-chars

# VNPay
VNPAY_TMN_CODE=your-merchant-code
VNPAY_HASH_SECRET=your-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# MoMo
MOMO_PARTNER_CODE=your-partner-code
MOMO_ACCESS_KEY=your-access-key
MOMO_SECRET_KEY=your-secret-key
```

## Contributing

1. Đọc Design documents trước
2. Review HLD của module liên quan
3. Follow coding standards
4. Write tests cho features mới
5. Update documentation khi cần

## License

Proprietary - All rights reserved

---

*Last Updated: January 2026*
