# MovieStream - Development Streams

> **Purpose**: Phân chia công việc thành các luồng độc lập để dev team có thể làm việc song song mà không conflict.
>
> **Nguyên tắc**: Mỗi stream có thể develop độc lập, chỉ integrate tại các điểm nối được định nghĩa rõ.

---

## Development Streams Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MovieStream Development Streams                           │
│                                                                              │
│                          ┌──────────────────┐                               │
│                          │  STREAM 1: CORE  │                               │
│                          │   (Foundation)   │                               │
│                          │  AUTH + USER     │                               │
│                          └────────┬─────────┘                               │
│                                   │                                          │
│            ┌──────────────────────┼──────────────────────┐                  │
│            │                      │                      │                  │
│            ▼                      ▼                      ▼                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  STREAM 2:       │  │  STREAM 3:       │  │  STREAM 4:       │         │
│  │  CONTENT         │  │  MONETIZATION    │  │  ENGAGEMENT      │         │
│  │  MOVIE + ADMIN   │  │  SUBSCRIPTION    │  │  STREAMING +     │         │
│  │  Content         │  │  + Payment       │  │  REVIEW          │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stream Details

### Stream 1: Core Foundation (MUST COMPLETE FIRST)

**Modules**: AUTH, USER (base)

**APIs**: 15 endpoints
| Module | APIs | Description |
|--------|------|-------------|
| AUTH | 5 | Register, Login, Logout, Refresh, Me |
| USER | 10 | Profile, History, Favorites |

**Dependencies**: None (foundation)

**Output**:
- JWT authentication middleware
- User context và session management
- Base user profile CRUD
- Watch history và favorites

**Blocking**: Tất cả stream khác depend on AUTH middleware

---

### Stream 2: Content Management

**Modules**: MOVIE, ADMIN (content management)

**APIs**: 22 endpoints
| Module | APIs | Description |
|--------|------|-------------|
| MOVIE | 12 | List, Search, Detail, Categories, Tags, CRUD |
| ADMIN-Content | 10 | Movies management, Episodes, Video upload |

**Dependencies**: AUTH (middleware)

**Output**:
- Movie catalog với CRUD
- Episode management
- Video upload (Bunny.net integration)
- Categories/Tags management
- Search functionality

**Integration Points**:
- Video upload → Bunny.net
- Movie rating → Updated by REVIEW module

---

### Stream 3: Monetization

**Modules**: SUBSCRIPTION, ADMIN (payments)

**APIs**: 10 endpoints
| Module | APIs | Description |
|--------|------|-------------|
| SUBSCRIPTION | 8 | Plans, Purchase, History, VNPay |
| ADMIN-Payments | 2 | Payment list, Manual extend |

**Dependencies**: AUTH (middleware)

**Output**:
- Subscription plans listing
- VNPay payment integration
- Payment webhook handling
- Subscription status check API (for STREAMING)
- Admin payment management

**Integration Points**:
- VNPay webhook → Payment processing
- Subscription status → STREAMING module

---

### Stream 4: Engagement

**Modules**: STREAMING, REVIEW, ADMIN (dashboard)

**APIs**: 15 endpoints
| Module | APIs | Description |
|--------|------|-------------|
| STREAMING | 4 | Stream URL, Heartbeat, Progress |
| REVIEW | 6 | Reviews, Votes |
| ADMIN-Dashboard | 5 | Dashboard, Charts |

**Dependencies**: AUTH, MOVIE, SUBSCRIPTION

**Output**:
- Video streaming với signed URLs
- Concurrent stream management
- Review và rating system
- Admin dashboard

**Integration Points**:
- SUBSCRIPTION → Premium access check
- MOVIE → Episode video lookup
- USER → Watch history save

---

## Detailed API Distribution

### Stream 1: Core Foundation (15 APIs)
```
AUTH (5 APIs)
├── POST /api/v1/auth/register
├── POST /api/v1/auth/login
├── POST /api/v1/auth/logout
├── POST /api/v1/auth/refresh
└── GET  /api/v1/auth/me

USER (10 APIs)
├── GET    /api/v1/user/profile
├── PUT    /api/v1/user/profile
├── GET    /api/v1/user/history
├── POST   /api/v1/user/history
├── DELETE /api/v1/user/history
├── DELETE /api/v1/user/history/:episodeId
├── GET    /api/v1/user/favorites
├── POST   /api/v1/user/favorites/:movieId
├── DELETE /api/v1/user/favorites/:movieId
└── GET    /api/v1/user/continue-watching
```

### Stream 2: Content Management (22 APIs)
```
MOVIE (12 APIs)
├── GET    /api/v1/movies
├── GET    /api/v1/movies/search
├── GET    /api/v1/movies/:slug
├── GET    /api/v1/movies/:movieId/episodes
├── GET    /api/v1/categories
├── GET    /api/v1/categories/:slug/movies
├── GET    /api/v1/tags
├── GET    /api/v1/tags/:slug/movies
├── POST   /api/v1/admin/movies
├── PUT    /api/v1/admin/movies/:id
├── DELETE /api/v1/admin/movies/:id
└── PATCH  /api/v1/admin/movies/:id/status

ADMIN-Content (10 APIs)
├── GET    /api/v1/admin/movies
├── GET    /api/v1/admin/movies/:movieId/episodes
├── POST   /api/v1/admin/movies/:movieId/episodes
├── PUT    /api/v1/admin/episodes/:id
├── DELETE /api/v1/admin/episodes/:id
├── POST   /api/v1/admin/videos/create
├── POST   /api/v1/webhook/bunny
├── GET    /api/v1/admin/users
├── GET    /api/v1/admin/users/:id
└── PATCH  /api/v1/admin/users/:id/status
```

### Stream 3: Monetization (10 APIs)
```
SUBSCRIPTION (8 APIs)
├── GET  /api/v1/subscription/plans
├── GET  /api/v1/subscription/current
├── POST /api/v1/subscription/purchase
├── GET  /api/v1/subscription/status/:userId
├── GET  /api/v1/subscription/history
├── POST /api/v1/subscription/upgrade
├── GET  /api/v1/payment/vnpay/return
└── POST /api/v1/payment/vnpay/ipn

ADMIN-Payments (2 APIs)
├── GET   /api/v1/admin/payments
└── PATCH /api/v1/admin/subscriptions/:id/extend
```

### Stream 4: Engagement (15 APIs)
```
STREAMING (4 APIs)
├── GET  /api/v1/stream/:episodeId
├── POST /api/v1/stream/heartbeat
├── POST /api/v1/stream/end
└── [reuse] POST /api/v1/user/history

REVIEW (6 APIs)
├── GET    /api/v1/movies/:movieId/reviews
├── POST   /api/v1/movies/:movieId/reviews
├── PUT    /api/v1/reviews/:id
├── DELETE /api/v1/reviews/:id
├── POST   /api/v1/reviews/:id/vote
└── DELETE /api/v1/reviews/:id/vote

ADMIN-Dashboard (5 APIs)
├── GET /api/v1/admin/dashboard
├── GET /api/v1/admin/dashboard/revenue
└── GET /api/v1/admin/dashboard/users
```

---

## Team Assignment Options

### Option A: Solo Developer

**Timeline**: ~8 weeks

| Week | Stream | Focus |
|------|--------|-------|
| 1-2 | Stream 1 | AUTH + USER base |
| 3-4 | Stream 2 | MOVIE + Content Admin |
| 5-6 | Stream 3 | SUBSCRIPTION + VNPay |
| 7-8 | Stream 4 | STREAMING + REVIEW + Dashboard |

**Pros**: Full context, consistent code style
**Cons**: Longest timeline

---

### Option B: 2 Developers

**Timeline**: ~4-5 weeks

| Dev | Streams | APIs | Focus |
|-----|---------|------|-------|
| Dev 1 | 1 → 3 | 25 | Core + Monetization |
| Dev 2 | 2 → 4 | 37 | Content + Engagement |

**Week-by-week**:
| Week | Dev 1 | Dev 2 |
|------|-------|-------|
| 1 | AUTH + USER | (wait for AUTH) |
| 2 | SUBSCRIPTION | MOVIE public APIs |
| 3 | VNPay integration | MOVIE admin + Episodes |
| 4 | Admin payments | Video upload (Bunny) |
| 5 | Integration | STREAMING + REVIEW |
| 6 | - | Dashboard |

**Sync Points**:
- End of Week 1: AUTH middleware ready
- End of Week 3: Subscription status API ready for STREAMING
- End of Week 5: Final integration

---

### Option C: 3 Developers

**Timeline**: ~3-4 weeks

| Dev | Focus | APIs |
|-----|-------|------|
| Dev 1 | Foundation + Dashboard | AUTH, USER, Admin Dashboard |
| Dev 2 | Content | MOVIE, Admin Content, Video Upload |
| Dev 3 | Business Logic | SUBSCRIPTION, STREAMING, REVIEW |

**Week-by-week**:
| Week | Dev 1 | Dev 2 | Dev 3 |
|------|-------|-------|-------|
| 1 | AUTH | DB Schema | Plan payment flow |
| 2 | USER | MOVIE public | SUBSCRIPTION |
| 3 | Dashboard | MOVIE admin + Video | VNPay + STREAMING |
| 4 | Integration | Episodes | REVIEW |

**Sync Points**:
- Day 3: AUTH middleware PR review
- End of Week 1: All DB migrations merged
- End of Week 2: Core APIs ready for testing
- End of Week 3: Integration testing begins

---

## Integration Points Detail

### Auth Middleware (from Stream 1)
```typescript
// middleware/auth.ts
export const authMiddleware = async (req, res, next) => {
  // Verify JWT
  // Set req.user
  // Called by ALL protected routes
};

export const adminMiddleware = async (req, res, next) => {
  // Check req.user.role === 'ADMIN'
};

export const subscriberMiddleware = async (req, res, next) => {
  // Check active subscription
};
```

### Subscription Check (Stream 3 → Stream 4)
```typescript
// Used by STREAMING module
const checkPremiumAccess = async (userId: string, episodeId: string) => {
  const episode = await getEpisode(episodeId);
  if (!episode.isPremium) return true;

  const subscription = await fetch(`/api/v1/subscription/status/${userId}`);
  return subscription.data.canWatchPremium;
};
```

### Movie Rating Update (Stream 4 → Stream 2)
```typescript
// Called when review created/updated/deleted
const updateMovieRating = async (movieId: string) => {
  const avg = await prisma.review.aggregate({
    where: { movieId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      rating: avg._avg.rating,
      reviewCount: avg._count,
    },
  });
};
```

---

## Git Workflow Recommendation

### Branch Strategy
```
main
├── develop
│   ├── feature/stream-1-auth
│   ├── feature/stream-1-user
│   ├── feature/stream-2-movie
│   ├── feature/stream-2-admin-content
│   ├── feature/stream-3-subscription
│   ├── feature/stream-3-vnpay
│   ├── feature/stream-4-streaming
│   ├── feature/stream-4-review
│   └── feature/stream-4-dashboard
└── release/v1.0.0
```

### PR Merge Order
1. `stream-1-auth` → develop (first, others depend on it)
2. `stream-1-user` → develop
3. `stream-2-movie`, `stream-3-subscription` (parallel)
4. `stream-2-admin-content`, `stream-3-vnpay`
5. `stream-4-streaming`, `stream-4-review`
6. `stream-4-dashboard`

---

## Testing Strategy

### Unit Tests (per stream)
- Each API should have unit tests
- Mock external services (Bunny, VNPay)

### Integration Tests (at sync points)
- AUTH → protected route access
- SUBSCRIPTION → STREAMING premium check
- REVIEW → MOVIE rating update

### E2E Tests (final)
- User registration → subscription → watch video flow
- Admin content management flow

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| AUTH delay | Blocks all streams | Prioritize, early PR review |
| VNPay sandbox issues | Blocks payment testing | Have mock fallback |
| Bunny.net integration | Blocks video upload | Test early with sample videos |
| Concurrent stream logic | Complex, prone to bugs | Extensive Redis testing |

---

## Checklist: Stream Completion

### Stream 1: Core Foundation
- [ ] AUTH: Register, Login, Logout
- [ ] AUTH: JWT middleware working
- [ ] AUTH: Refresh token flow
- [ ] USER: Profile CRUD
- [ ] USER: Watch history
- [ ] USER: Favorites

### Stream 2: Content Management
- [ ] MOVIE: Public APIs (list, search, detail)
- [ ] MOVIE: Admin CRUD
- [ ] MOVIE: Categories/Tags
- [ ] ADMIN: Episode management
- [ ] ADMIN: Video upload to Bunny
- [ ] ADMIN: Bunny webhook

### Stream 3: Monetization
- [ ] SUBSCRIPTION: Plans listing
- [ ] SUBSCRIPTION: Purchase flow
- [ ] SUBSCRIPTION: VNPay integration
- [ ] SUBSCRIPTION: Webhook handling
- [ ] SUBSCRIPTION: Status check API
- [ ] ADMIN: Payment history

### Stream 4: Engagement
- [ ] STREAMING: Signed URL generation
- [ ] STREAMING: Concurrent limit
- [ ] STREAMING: Heartbeat
- [ ] REVIEW: CRUD + votes
- [ ] ADMIN: Dashboard
- [ ] ADMIN: Charts

---

## Summary

| Stream | APIs | Dependencies | Priority |
|--------|------|--------------|----------|
| 1. Core | 15 | None | P0 (first) |
| 2. Content | 22 | AUTH | P1 |
| 3. Monetization | 10 | AUTH | P1 |
| 4. Engagement | 15 | AUTH, MOVIE, SUB | P2 |
| **Total** | **62** | | |

---

*Document Version: 1.0*
*Created: January 2026*
