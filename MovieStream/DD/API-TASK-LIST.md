# MovieStream - Master API Task List

> **Purpose**: Tổng hợp danh sách API Backend theo User Stories cho MVP.1
>
> **Convention**:
> - Base URL: `/api/v1/`
> - Create & Get by ID: không cần action suffix
> - Các operation khác: có action suffix
> - Advanced Search: POST với body
> - Simple Search/Filter: GET với query params

---

## API Summary

| Module | MVP APIs | Phase 2 APIs | Total |
|--------|----------|--------------|-------|
| AUTH | 5 | 2 | 7 |
| MOVIE | 12 | 0 | 12 |
| STREAMING | 4 | 0 | 4 |
| SUBSCRIPTION | 8 | 2 | 10 |
| USER | 10 | 0 | 10 |
| REVIEW | 6 | 0 | 6 |
| ADMIN | 15 | 0 | 15 |
| **Total** | **60** | **4** | **64** |

---

## Quick Reference - All Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| POST | /api/v1/auth/register | No | MVP |
| POST | /api/v1/auth/login | No | MVP |
| POST | /api/v1/auth/logout | Yes | MVP |
| POST | /api/v1/auth/refresh | No* | MVP |
| GET | /api/v1/auth/me | Yes | MVP |
| POST | /api/v1/auth/forgot-password | No | Phase 2 |
| POST | /api/v1/auth/reset-password | No | Phase 2 |

### Movies (`/api/v1/movies`, `/api/v1/categories`, `/api/v1/tags`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| GET | /api/v1/movies | No | MVP |
| GET | /api/v1/movies/search | No | MVP |
| GET | /api/v1/movies/:slug | No | MVP |
| GET | /api/v1/movies/:movieId/episodes | No | MVP |
| GET | /api/v1/categories | No | MVP |
| GET | /api/v1/categories/:slug/movies | No | MVP |
| GET | /api/v1/tags | No | MVP |
| GET | /api/v1/tags/:slug/movies | No | MVP |
| POST | /api/v1/admin/movies | Admin | MVP |
| PUT | /api/v1/admin/movies/:id | Admin | MVP |
| DELETE | /api/v1/admin/movies/:id | Admin | MVP |
| PATCH | /api/v1/admin/movies/:id/status | Admin | MVP |

### Streaming (`/api/v1/stream`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| GET | /api/v1/stream/:episodeId | Yes | MVP |
| POST | /api/v1/stream/heartbeat | Yes | MVP |
| POST | /api/v1/stream/end | Yes | MVP |

### Subscription & Payment (`/api/v1/subscription`, `/api/v1/payment`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| GET | /api/v1/subscription/plans | No | MVP |
| GET | /api/v1/subscription/current | Yes | MVP |
| POST | /api/v1/subscription/purchase | Yes | MVP |
| GET | /api/v1/subscription/status/:userId | Internal | MVP |
| GET | /api/v1/subscription/history | Yes | MVP |
| POST | /api/v1/subscription/upgrade | Yes | MVP |
| GET | /api/v1/payment/vnpay/return | No | MVP |
| POST | /api/v1/payment/vnpay/ipn | No | MVP |
| POST | /api/v1/payment/momo/create | Yes | Phase 2 |
| POST | /api/v1/payment/momo/notify | No | Phase 2 |

### User Profile (`/api/v1/user`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| GET | /api/v1/user/profile | Yes | MVP |
| PUT | /api/v1/user/profile | Yes | MVP |
| GET | /api/v1/user/history | Yes | MVP |
| POST | /api/v1/user/history | Yes | MVP |
| DELETE | /api/v1/user/history | Yes | MVP |
| DELETE | /api/v1/user/history/:episodeId | Yes | MVP |
| GET | /api/v1/user/favorites | Yes | MVP |
| POST | /api/v1/user/favorites/:movieId | Yes | MVP |
| DELETE | /api/v1/user/favorites/:movieId | Yes | MVP |
| GET | /api/v1/user/continue-watching | Yes | MVP |

### Reviews (`/api/v1/movies/:movieId/reviews`, `/api/v1/reviews`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| GET | /api/v1/movies/:movieId/reviews | No | MVP |
| POST | /api/v1/movies/:movieId/reviews | Subscriber | MVP |
| PUT | /api/v1/reviews/:id | Owner | MVP |
| DELETE | /api/v1/reviews/:id | Owner/Admin | MVP |
| POST | /api/v1/reviews/:id/vote | User | MVP |
| DELETE | /api/v1/reviews/:id/vote | User | MVP |

### Admin (`/api/v1/admin`, `/api/v1/webhook`)
| Method | Endpoint | Auth | Phase |
|--------|----------|------|-------|
| GET | /api/v1/admin/dashboard | Admin | MVP |
| GET | /api/v1/admin/dashboard/revenue | Admin | MVP |
| GET | /api/v1/admin/dashboard/users | Admin | MVP |
| GET | /api/v1/admin/movies | Admin | MVP |
| GET | /api/v1/admin/movies/:movieId/episodes | Admin | MVP |
| POST | /api/v1/admin/movies/:movieId/episodes | Admin | MVP |
| PUT | /api/v1/admin/episodes/:id | Admin | MVP |
| DELETE | /api/v1/admin/episodes/:id | Admin | MVP |
| POST | /api/v1/admin/videos/create | Admin | MVP |
| POST | /api/v1/webhook/bunny | No* | MVP |
| GET | /api/v1/admin/users | Admin | MVP |
| GET | /api/v1/admin/users/:id | Admin | MVP |
| PATCH | /api/v1/admin/users/:id/status | Admin | MVP |
| GET | /api/v1/admin/payments | Admin | MVP |
| PATCH | /api/v1/admin/subscriptions/:id/extend | Admin | MVP |

---

## Authentication Legend

| Symbol | Meaning |
|--------|---------|
| No | Public endpoint |
| No* | Requires cookie/signature verification |
| Yes | Requires JWT access token |
| User | Requires authenticated user |
| Subscriber | Requires active subscription |
| Owner | Requires resource ownership |
| Admin | Requires admin role |
| Internal | Service-to-service only |

---

## Module-Specific Task Lists

Xem chi tiết từng module:
- [API-TASK-LIST-AUTH.md](./API-TASK-LIST-AUTH.md)
- [API-TASK-LIST-MOVIE.md](./API-TASK-LIST-MOVIE.md)
- [API-TASK-LIST-STREAMING.md](./API-TASK-LIST-STREAMING.md)
- [API-TASK-LIST-SUBSCRIPTION.md](./API-TASK-LIST-SUBSCRIPTION.md)
- [API-TASK-LIST-USER.md](./API-TASK-LIST-USER.md)
- [API-TASK-LIST-REVIEW.md](./API-TASK-LIST-REVIEW.md)
- [API-TASK-LIST-ADMIN.md](./API-TASK-LIST-ADMIN.md)

---

## Cross-Module Dependencies

```
┌──────────────────────────────────────────────────────────────────┐
│                    API Dependencies Flow                          │
└──────────────────────────────────────────────────────────────────┘

                        ┌─────────┐
                        │  AUTH   │
                        │ (JWT)   │
                        └────┬────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
    ┌─────────┐        ┌─────────┐        ┌─────────┐
    │  USER   │        │  MOVIE  │        │SUBSCRIPT│
    │ Profile │        │ Content │        │ Payment │
    └────┬────┘        └────┬────┘        └────┬────┘
         │                  │                   │
         │                  │                   │
         ▼                  ▼                   ▼
    ┌─────────┐        ┌─────────┐        ┌─────────┐
    │ History │───────▶│STREAMING│◀───────│ Premium │
    │Favorites│        │  Video  │        │  Check  │
    └─────────┘        └────┬────┘        └─────────┘
                            │
                            ▼
                       ┌─────────┐
                       │ REVIEW  │
                       │ Rating  │
                       └─────────┘
```

### Dependency Details

| API | Depends On | Purpose |
|-----|------------|---------|
| `GET /stream/:episodeId` | SUBSCRIPTION | Check premium access |
| `GET /stream/:episodeId` | MOVIE | Get episode video_id |
| `POST /user/history` | STREAMING | Save watch progress |
| `POST /movies/:id/reviews` | SUBSCRIPTION | Check subscriber status |
| `POST /movies/:id/reviews` | MOVIE | Update movie.rating |
| All protected routes | AUTH | JWT validation |

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_TOKEN_EXPIRED | 401 | JWT expired |
| AUTH_TOKEN_INVALID | 401 | Invalid JWT |
| AUTH_UNAUTHORIZED | 401 | Not authenticated |
| AUTH_FORBIDDEN | 403 | No permission |
| RESOURCE_NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input |
| RATE_LIMITED | 429 | Too many requests |

---

*Document Version: 1.0*
*Created: January 2026*
