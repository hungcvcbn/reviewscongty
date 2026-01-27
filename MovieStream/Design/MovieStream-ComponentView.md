# MovieStream - Component View & System Architecture

## Giới thiệu

Tài liệu này mô tả kiến trúc hệ thống và các thành phần của nền tảng **MovieStream** - website xem phim trực tuyến. Hệ thống được thiết kế theo kiến trúc **Monolithic Modular** phù hợp với quy mô team nhỏ (1 developer) và timeline ngắn (1-2 tháng MVP).

---

## 1. Kiến trúc tổng quan

### 1.1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                          │
│                    (Web Browser / Mobile Browser)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE                                        │
│                    (DNS + DDoS Protection + Cache)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────────────┐
│         VERCEL                │   │           BUNNY.NET                    │
│    (Frontend Hosting)         │   │      (Video CDN + Storage)             │
│                               │   │                                        │
│  ┌─────────────────────────┐  │   │  ┌─────────────────────────────────┐  │
│  │     Next.js App         │  │   │  │    Bunny Stream                  │  │
│  │  - SSR/SSG Pages        │  │   │  │  - HLS Streaming                 │  │
│  │  - React Components     │  │   │  │  - Adaptive Bitrate              │  │
│  │  - API Routes           │  │   │  │  - Token Authentication          │  │
│  └─────────────────────────┘  │   │  │  - AES-128 Encryption            │  │
└───────────────────────────────┘   │  └─────────────────────────────────┘  │
                    │               └───────────────────────────────────────┘
                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        RAILWAY / RENDER                                    │
│                       (Backend Hosting)                                    │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      Node.js Backend                                 │  │
│  │                                                                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ Auth Module  │  │ Movie Module │  │Payment Module│               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ User Module  │  │Subscript Mod │  │ Admin Module │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE / NEON                                     │
│                      (PostgreSQL Database)                                 │
│                                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │  users  │ │ movies  │ │episodes │ │ subs    │ │payments │             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1.2. Deployment Model

| Component | Service | Tier | Chi phí ước tính |
|-----------|---------|------|------------------|
| Frontend | Vercel | Hobby/Pro | Free - $20/tháng |
| Backend | Railway | Starter | $5/tháng |
| Database | Supabase | Free | Free (500MB) |
| Video CDN | Bunny.net | Pay-as-you-go | $5-15/tháng |
| DNS/Security | Cloudflare | Free | Free |
| **Tổng** | | | **$10-40/tháng** |

---

## 2. Frontend Components (Next.js)

### 2.1. Cấu trúc thư mục

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Trang chủ
│   │   ├── movies/
│   │   │   ├── page.tsx          # Danh sách phim
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Chi tiết phim
│   │   │       └── watch/
│   │   │           └── [episode]/page.tsx  # Xem phim
│   │   ├── category/
│   │   │   └── [slug]/page.tsx   # Phim theo thể loại
│   │   └── tag/
│   │       └── [slug]/page.tsx   # Phim theo tag
│   ├── (auth)/                   # Auth routes
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (user)/                   # Protected user routes
│   │   ├── profile/page.tsx
│   │   ├── subscription/page.tsx
│   │   ├── history/page.tsx
│   │   └── favorites/page.tsx
│   ├── (admin)/                  # Admin routes
│   │   ├── dashboard/page.tsx
│   │   ├── movies/
│   │   │   ├── page.tsx          # Quản lý phim
│   │   │   ├── new/page.tsx      # Thêm phim mới
│   │   │   └── [id]/edit/page.tsx
│   │   ├── episodes/page.tsx
│   │   ├── users/page.tsx
│   │   └── payments/page.tsx
│   ├── api/                      # API Routes (Next.js)
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── webhook/
│   │       ├── vnpay/route.ts
│   │       └── momo/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── movie/
│   │   ├── MovieCard.tsx
│   │   ├── MovieGrid.tsx
│   │   ├── MovieDetail.tsx
│   │   ├── EpisodeList.tsx
│   │   └── VideoPlayer.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   └── payment/
│       ├── PricingCard.tsx
│       ├── PaymentForm.tsx
│       └── SubscriptionStatus.tsx
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # NextAuth config
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useMovie.ts
│   └── useSubscription.ts
└── types/
    └── index.ts
```

### 2.2. Mô tả các Pages chính

#### 2.2.1. Trang chủ (Home Page)
**Route**: `/`

**Chức năng**:
- Hero banner với phim nổi bật
- Section "Phim mới cập nhật"
- Section "Phim xem nhiều"
- Section theo thể loại
- Footer với links

**Components sử dụng**:
- `HeroBanner` - Banner lớn
- `MovieGrid` - Grid hiển thị phim
- `MovieCard` - Card từng phim

#### 2.2.2. Trang danh sách phim (Movie Listing)
**Route**: `/movies`

**Chức năng**:
- Hiển thị tất cả phim với pagination
- Filter theo: Thể loại, Năm, Trạng thái (đang chiếu/hoàn thành)
- Sort theo: Mới nhất, Xem nhiều, Đánh giá cao
- Search box

**API Endpoint**: `GET /api/movies?page=1&limit=20&category=&sort=`

#### 2.2.3. Trang chi tiết phim (Movie Detail)
**Route**: `/movies/[slug]`

**Chức năng**:
- Thông tin phim: Tên, mô tả, poster, trailer
- Metadata: Thể loại, số tập, năm, đánh giá
- Danh sách tập phim
- Phần review & đánh giá
- Phim liên quan

**API Endpoint**: `GET /api/movies/[slug]`

#### 2.2.4. Trang xem phim (Video Player)
**Route**: `/movies/[slug]/watch/[episode]`

**Chức năng**:
- Video player với HLS.js
- Controls: Play/Pause, Volume, Fullscreen, Quality
- Danh sách tập (sidebar)
- Nút tập trước/sau
- Watermark động (username + timestamp)
- Kiểm tra subscription trước khi cho xem

**Logic bảo vệ**:
```typescript
// Pseudocode
async function getVideoUrl(episodeId: string, userId: string) {
  // 1. Kiểm tra user đã đăng nhập
  // 2. Kiểm tra subscription còn hiệu lực
  // 3. Kiểm tra episode có yêu cầu premium không
  // 4. Generate signed URL từ Bunny.net
  // 5. Return URL với token có TTL 4 giờ
}
```

#### 2.2.5. Trang thanh toán (Subscription)
**Route**: `/subscription`

**Chức năng**:
- Hiển thị các gói subscription
- So sánh tính năng
- Nút thanh toán (redirect to VNPay/MoMo)
- Hiển thị subscription hiện tại (nếu có)

---

## 3. Backend Services (Node.js)

### 3.1. Cấu trúc thư mục

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.routes.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   ├── movie/
│   │   │   ├── movie.controller.ts
│   │   │   ├── movie.service.ts
│   │   │   └── movie.routes.ts
│   │   ├── episode/
│   │   │   ├── episode.controller.ts
│   │   │   ├── episode.service.ts
│   │   │   └── episode.routes.ts
│   │   ├── subscription/
│   │   │   ├── subscription.controller.ts
│   │   │   ├── subscription.service.ts
│   │   │   └── subscription.routes.ts
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── vnpay.service.ts
│   │   │   ├── momo.service.ts
│   │   │   └── payment.routes.ts
│   │   ├── review/
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   └── review.routes.ts
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       └── admin.routes.ts
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── admin.middleware.ts
│   │   │   └── rateLimit.middleware.ts
│   │   ├── utils/
│   │   │   ├── bunny.ts           # Bunny.net API wrapper
│   │   │   ├── hash.ts
│   │   │   └── token.ts
│   │   └── validators/
│   ├── config/
│   │   ├── database.ts
│   │   ├── bunny.ts
│   │   └── payment.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.ts
├── package.json
└── tsconfig.json
```

### 3.2. API Endpoints

#### 3.2.1. Authentication APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | No |
| POST | `/api/auth/login` | Đăng nhập | No |
| POST | `/api/auth/logout` | Đăng xuất | Yes |
| POST | `/api/auth/refresh` | Refresh token | Yes |
| POST | `/api/auth/forgot-password` | Quên mật khẩu | No |
| POST | `/api/auth/reset-password` | Reset mật khẩu | No |

#### 3.2.2. Movie APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/movies` | Lấy danh sách phim | No |
| GET | `/api/movies/:slug` | Lấy chi tiết phim | No |
| GET | `/api/movies/:slug/episodes` | Lấy danh sách tập | No |
| GET | `/api/movies/category/:slug` | Phim theo thể loại | No |
| GET | `/api/movies/tag/:slug` | Phim theo tag | No |
| GET | `/api/movies/search` | Tìm kiếm phim | No |

#### 3.2.3. Episode & Video APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/episodes/:id` | Lấy thông tin tập | No |
| GET | `/api/episodes/:id/stream` | Lấy video URL (signed) | Yes |
| POST | `/api/episodes/:id/progress` | Lưu tiến độ xem | Yes |

#### 3.2.4. User APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/user/profile` | Lấy thông tin user | Yes |
| PUT | `/api/user/profile` | Cập nhật profile | Yes |
| GET | `/api/user/history` | Lịch sử xem | Yes |
| GET | `/api/user/favorites` | Phim yêu thích | Yes |
| POST | `/api/user/favorites/:movieId` | Thêm yêu thích | Yes |
| DELETE | `/api/user/favorites/:movieId` | Xóa yêu thích | Yes |

#### 3.2.5. Subscription & Payment APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/subscription/plans` | Lấy các gói subscription | No |
| GET | `/api/subscription/current` | Subscription hiện tại | Yes |
| POST | `/api/payment/vnpay/create` | Tạo thanh toán VNPay | Yes |
| GET | `/api/payment/vnpay/return` | VNPay return URL | No |
| POST | `/api/payment/vnpay/ipn` | VNPay IPN webhook | No |
| POST | `/api/payment/momo/create` | Tạo thanh toán MoMo | Yes |
| POST | `/api/payment/momo/notify` | MoMo notify webhook | No |

#### 3.2.6. Review APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/movies/:id/reviews` | Lấy reviews của phim | No |
| POST | `/api/movies/:id/reviews` | Tạo review mới | Yes |
| PUT | `/api/reviews/:id` | Cập nhật review | Yes |
| DELETE | `/api/reviews/:id` | Xóa review | Yes |
| POST | `/api/reviews/:id/vote` | Vote helpful/not | Yes |

#### 3.2.7. Admin APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/admin/dashboard` | Dashboard stats | Admin |
| GET | `/api/admin/movies` | Quản lý phim | Admin |
| POST | `/api/admin/movies` | Thêm phim mới | Admin |
| PUT | `/api/admin/movies/:id` | Sửa phim | Admin |
| DELETE | `/api/admin/movies/:id` | Xóa phim | Admin |
| POST | `/api/admin/episodes` | Thêm tập mới | Admin |
| POST | `/api/admin/episodes/:id/upload` | Upload video | Admin |
| GET | `/api/admin/users` | Quản lý users | Admin |
| GET | `/api/admin/subscriptions` | Quản lý subscriptions | Admin |
| GET | `/api/admin/payments` | Lịch sử thanh toán | Admin |

---

## 4. Database Schema

### 4.1. Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   movies    │       │  episodes   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ title       │       │ movie_id    │──┐
│ password    │       │ slug        │       │ title       │  │
│ name        │       │ description │       │ episode_num │  │
│ avatar      │       │ poster      │       │ video_id    │  │
│ role        │       │ trailer     │       │ duration    │  │
│ created_at  │       │ year        │       │ is_premium  │  │
│ updated_at  │       │ status      │       │ created_at  │  │
└──────┬──────┘       │ is_premium  │       └─────────────┘  │
       │              │ total_eps   │              │         │
       │              │ view_count  │◄─────────────┘         │
       │              │ rating      │                        │
       │              │ created_at  │                        │
       │              └──────┬──────┘                        │
       │                     │                               │
       │    ┌────────────────┼────────────────┐              │
       │    │                │                │              │
       ▼    ▼                ▼                ▼              │
┌─────────────┐       ┌─────────────┐  ┌─────────────┐      │
│subscriptions│       │movie_category│  │ movie_tags  │      │
├─────────────┤       ├─────────────┤  ├─────────────┤      │
│ id          │       │ movie_id    │  │ movie_id    │      │
│ user_id     │──┐    │ category_id │  │ tag_id      │      │
│ plan_id     │  │    └─────────────┘  └─────────────┘      │
│ status      │  │           │                │              │
│ start_date  │  │           ▼                ▼              │
│ end_date    │  │    ┌─────────────┐  ┌─────────────┐      │
│ created_at  │  │    │ categories  │  │    tags     │      │
└─────────────┘  │    ├─────────────┤  ├─────────────┤      │
                 │    │ id          │  │ id          │      │
┌─────────────┐  │    │ name        │  │ name        │      │
│  payments   │  │    │ slug        │  │ slug        │      │
├─────────────┤  │    └─────────────┘  └─────────────┘      │
│ id          │  │                                          │
│ user_id     │──┤    ┌─────────────┐  ┌─────────────┐      │
│ subscrip_id │  │    │  reviews    │  │watch_history│      │
│ amount      │  │    ├─────────────┤  ├─────────────┤      │
│ method      │  │    │ id          │  │ id          │      │
│ status      │  │    │ user_id     │──│ user_id     │──────┤
│ provider_id │  │    │ movie_id    │  │ episode_id  │──────┘
│ created_at  │  │    │ rating      │  │ progress    │
└─────────────┘  │    │ content     │  │ watched_at  │
                 │    │ created_at  │  └─────────────┘
┌─────────────┐  │    └─────────────┘
│   plans     │  │
├─────────────┤  │    ┌─────────────┐
│ id          │◄─┘    │  favorites  │
│ name        │       ├─────────────┤
│ price       │       │ user_id     │
│ duration    │       │ movie_id    │
│ features    │       │ created_at  │
└─────────────┘       └─────────────┘
```

### 4.2. Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum MovieStatus {
  ONGOING
  COMPLETED
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

enum PaymentMethod {
  VNPAY
  MOMO
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  avatar        String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  subscriptions Subscription[]
  payments      Payment[]
  reviews       Review[]
  watchHistory  WatchHistory[]
  favorites     Favorite[]
}

model Movie {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  description String      @db.Text
  poster      String
  trailer     String?
  year        Int
  status      MovieStatus @default(ONGOING)
  isPremium   Boolean     @default(false)
  totalEps    Int         @default(0)
  viewCount   Int         @default(0)
  rating      Float       @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  episodes    Episode[]
  categories  MovieCategory[]
  tags        MovieTag[]
  reviews     Review[]
  favorites   Favorite[]
}

model Episode {
  id          String   @id @default(cuid())
  movieId     String
  title       String
  episodeNum  Int
  videoId     String   // Bunny.net video ID
  duration    Int      // seconds
  isPremium   Boolean  @default(false)
  createdAt   DateTime @default(now())

  movie       Movie    @relation(fields: [movieId], references: [id])
  watchHistory WatchHistory[]

  @@unique([movieId, episodeNum])
}

model Category {
  id     String @id @default(cuid())
  name   String
  slug   String @unique

  movies MovieCategory[]
}

model Tag {
  id     String @id @default(cuid())
  name   String
  slug   String @unique

  movies MovieTag[]
}

model MovieCategory {
  movieId    String
  categoryId String

  movie    Movie    @relation(fields: [movieId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])

  @@id([movieId, categoryId])
}

model MovieTag {
  movieId String
  tagId   String

  movie Movie @relation(fields: [movieId], references: [id])
  tag   Tag   @relation(fields: [tagId], references: [id])

  @@id([movieId, tagId])
}

model Plan {
  id          String @id @default(cuid())
  name        String
  price       Int    // VND
  duration    Int    // days
  features    Json
  isActive    Boolean @default(true)

  subscriptions Subscription[]
}

model Subscription {
  id        String             @id @default(cuid())
  userId    String
  planId    String
  status    SubscriptionStatus @default(ACTIVE)
  startDate DateTime           @default(now())
  endDate   DateTime
  createdAt DateTime           @default(now())

  user     User      @relation(fields: [userId], references: [id])
  plan     Plan      @relation(fields: [planId], references: [id])
  payments Payment[]
}

model Payment {
  id             String        @id @default(cuid())
  userId         String
  subscriptionId String?
  amount         Int           // VND
  method         PaymentMethod
  status         PaymentStatus @default(PENDING)
  providerId     String?       // Transaction ID from VNPay/MoMo
  metadata       Json?
  createdAt      DateTime      @default(now())

  user         User          @relation(fields: [userId], references: [id])
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  movieId   String
  rating    Int      // 1-5
  content   String   @db.Text
  helpful   Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User  @relation(fields: [userId], references: [id])
  movie Movie @relation(fields: [movieId], references: [id])

  @@unique([userId, movieId])
}

model WatchHistory {
  id        String   @id @default(cuid())
  userId    String
  episodeId String
  progress  Int      // seconds watched
  watchedAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  episode Episode @relation(fields: [episodeId], references: [id])

  @@unique([userId, episodeId])
}

model Favorite {
  userId    String
  movieId   String
  createdAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  movie Movie @relation(fields: [movieId], references: [id])

  @@id([userId, movieId])
}
```

---

## 5. External Services Integration

### 5.1. Bunny.net Stream

**Mục đích**: Lưu trữ và phát video với bảo mật cao

**Tính năng sử dụng**:
- HLS Streaming với Adaptive Bitrate
- Token Authentication (signed URLs)
- AES-128 Encryption
- Global CDN

**Integration Flow**:
```
Admin Upload Video
       │
       ▼
┌─────────────────┐
│  Backend API    │
│  /admin/upload  │
└────────┬────────┘
         │ Upload to Bunny
         ▼
┌─────────────────┐
│  Bunny Stream   │
│  - Transcode    │
│  - Generate HLS │
│  - Store        │
└────────┬────────┘
         │ Return video_id
         ▼
┌─────────────────┐
│    Database     │
│  Save video_id  │
└─────────────────┘

User Watch Video
       │
       ▼
┌─────────────────┐
│  Backend API    │
│  /stream/:id    │
│  - Check auth   │
│  - Check sub    │
└────────┬────────┘
         │ Generate signed URL
         ▼
┌─────────────────┐
│  Bunny Stream   │
│  - Verify token │
│  - Serve HLS    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Video Player   │
│  (HLS.js)       │
└─────────────────┘
```

### 5.2. VNPay Integration

**Luồng thanh toán**:

```
User chọn gói
       │
       ▼
POST /payment/vnpay/create
       │
       ▼
┌─────────────────────┐
│ Generate VNPay URL  │
│ - Merchant ID       │
│ - Amount            │
│ - Return URL        │
│ - Checksum          │
└──────────┬──────────┘
           │ Redirect
           ▼
┌─────────────────────┐
│    VNPay Gateway    │
│  - User pays       │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
Return URL    IPN Webhook
(Frontend)    (Backend)
     │           │
     │           ▼
     │    Verify & Update
     │    Subscription
     │           │
     └─────┬─────┘
           ▼
   Show Success Page
```

### 5.3. MoMo Integration

**Luồng tương tự VNPay** với API endpoints khác:
- Create payment: MoMo Collection API
- Verify: MoMo IPN Webhook
- Query: MoMo Query API

---

## 6. Security Measures

### 6.1. Authentication

- **JWT Tokens**: Access token (15 phút) + Refresh token (7 ngày)
- **Password Hashing**: bcrypt với salt rounds = 12
- **Rate Limiting**: 5 login attempts / 15 phút

### 6.2. Video Protection

| Layer | Technique | Implementation |
|-------|-----------|----------------|
| 1 | Token Authentication | Bunny.net signed URLs với TTL 4h |
| 2 | HLS Encryption | AES-128 với key rotation |
| 3 | Domain Restriction | Chỉ cho phép domain của mình |
| 4 | Referer Check | Block requests không có referer hợp lệ |
| 5 | Dynamic Watermark | Canvas overlay username + timestamp |
| 6 | Rate Limiting | Max 3 concurrent streams / user |

### 6.3. API Security

- **CORS**: Chỉ allow frontend domain
- **Helmet.js**: Security headers
- **Input Validation**: Joi/Zod schema validation
- **SQL Injection**: Prisma ORM với parameterized queries
- **XSS**: Sanitize HTML input

---

## 7. Admin Panel Features

### 7.1. Dashboard
- Tổng số users, subscribers, revenue
- Chart lượt xem theo ngày/tuần/tháng
- Top phim được xem nhiều
- Subscription expiring soon

### 7.2. Movie Management
- CRUD operations cho movies
- Upload/edit thumbnail, poster
- Quản lý categories, tags
- Set premium status

### 7.3. Episode Management
- Upload video lên Bunny.net
- Progress bar khi upload
- Set episode order
- Set premium per episode

### 7.4. User Management
- Danh sách users với search/filter
- View user details, subscription history
- Manual extend/cancel subscription
- Block/unblock user

### 7.5. Payment Management
- Lịch sử tất cả transactions
- Filter theo status, method, date
- Refund handling (manual)
- Export báo cáo

---

*Tài liệu này được cập nhật lần cuối: Tháng 1/2026*
