# API Task List - Admin Panel Module

> **Module**: ADMIN
> **HLD Reference**: HLD-MS-ADMIN.md
> **User Stories**: US-ADMIN-01 đến US-ADMIN-11

---

## API Summary

| Category | Count | Description |
|----------|-------|-------------|
| Dashboard | 3 | Statistics & Charts |
| Movies | 4 | Movie management |
| Episodes | 4 | Episode management |
| Videos | 2 | Video upload |
| Users | 3 | User management |
| Subscriptions | 2 | Subscription management |
| **Total** | 18 | (including 3 from MOVIE module) |

---

## Dashboard APIs (3)

### 1. Get Dashboard
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-04 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/dashboard` |
| **Operation ID** | `getDashboard` |
| **Auth** | Admin |
| **Description** | Xem Dashboard thống kê tổng quan |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 5420,
      "newUsersToday": 45,
      "newUsersThisMonth": 890,
      "activeSubscribers": 1250,
      "subscriberGrowth": 12.5
    },
    "revenue": {
      "today": 2500000,
      "thisWeek": 15000000,
      "thisMonth": 58000000,
      "growth": 8.3
    },
    "content": {
      "totalMovies": 156,
      "publishedMovies": 142,
      "totalEpisodes": 2450,
      "pendingUploads": 5
    },
    "engagement": {
      "totalViews": 1250000,
      "viewsToday": 8500,
      "avgWatchTime": 45,
      "topMovies": [
        { "id": "mov1", "title": "Phim A", "views": 15000 },
        { "id": "mov2", "title": "Phim B", "views": 12000 }
      ]
    },
    "cachedAt": "2026-01-27T10:00:00Z"
  }
}
```

**Notes**:
- Cached 5 minutes
- growth values là % so với kỳ trước

---

### 2. Get Revenue Chart
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-05 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/dashboard/revenue` |
| **Operation ID** | `getRevenueChart` |
| **Auth** | Admin |
| **Description** | Xem biểu đồ doanh thu theo thời gian |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| period | string | 30d | 7d, 30d, 90d, 1y |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "total": 58000000,
    "dataPoints": [
      { "date": "2026-01-01", "revenue": 1800000 },
      { "date": "2026-01-02", "revenue": 2100000 }
    ]
  }
}
```

---

### 3. Get User Growth Chart
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-06 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/dashboard/users` |
| **Operation ID** | `getUserGrowthChart` |
| **Auth** | Admin |
| **Description** | Xem biểu đồ tăng trưởng users |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| period | string | 30d | 7d, 30d, 90d, 1y |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "totalNew": 890,
    "dataPoints": [
      { "date": "2026-01-01", "newUsers": 28, "totalUsers": 5100 },
      { "date": "2026-01-02", "newUsers": 35, "totalUsers": 5135 }
    ]
  }
}
```

---

## Movie Management APIs (1 + 3 from MOVIE module)

### 4. List All Movies (Admin)
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-02 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/movies` |
| **Operation ID** | `listAllMovies` |
| **Auth** | Admin |
| **Description** | Quản lý danh sách phim (xem cả DRAFT) |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |
| status | string | - | DRAFT, PUBLISHED, ARCHIVED |
| search | string | - | Search by title |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "slug": "string",
        "status": "DRAFT | PUBLISHED | ARCHIVED",
        "isPremium": false,
        "totalEpisodes": 20,
        "currentEpisodes": 15,
        "viewCount": 10500,
        "rating": 4.5,
        "createdAt": "ISO datetime",
        "updatedAt": "ISO datetime"
      }
    ],
    "pagination": { ... }
  }
}
```

**Notes**:
- Include tất cả status (DRAFT, PUBLISHED, ARCHIVED)
- CREATE, UPDATE, DELETE, STATUS CHANGE: See API-TASK-LIST-MOVIE.md

---

## Episode Management APIs (4)

### 5. List Movie Episodes (Admin)
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-03 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/movies/:movieId/episodes` |
| **Operation ID** | `listMovieEpisodes` |
| **Auth** | Admin |
| **Description** | Quản lý danh sách tập phim |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "episodeNum": 1,
      "videoId": "bunny-video-guid | null",
      "duration": 2700,
      "isPremium": false,
      "isReady": true,
      "createdAt": "ISO datetime"
    }
  ]
}
```

---

### 6. Create Episode
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-03 |
| **Method** | POST |
| **Endpoint** | `/api/v1/admin/movies/:movieId/episodes` |
| **Operation ID** | `createEpisode` |
| **Auth** | Admin |
| **Description** | Thêm tập mới |

**Request Body**:
```json
{
  "title": "string (optional)",
  "episodeNum": "integer (required, > 0)",
  "isPremium": "boolean (optional, default false)"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "episodeNum": 1,
    "videoId": null,
    "isReady": false
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| EPISODE_NUM_EXISTS | 409 | Số tập đã tồn tại |
| MOVIE_NOT_FOUND | 404 | Phim không tồn tại |

---

### 7. Update Episode
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-03 |
| **Method** | PUT |
| **Endpoint** | `/api/v1/admin/episodes/:id` |
| **Operation ID** | `updateEpisode` |
| **Auth** | Admin |
| **Description** | Cập nhật thông tin tập |

**Request Body**:
```json
{
  "title": "string (optional)",
  "episodeNum": "integer (optional)",
  "isPremium": "boolean (optional)"
}
```

---

### 8. Delete Episode
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-03 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/admin/episodes/:id` |
| **Operation ID** | `deleteEpisode` |
| **Auth** | Admin |
| **Description** | Xóa tập phim |

**Notes**:
- Also deletes video from Bunny.net if exists

---

## Video Upload APIs (2)

### 9. Create Video Entry
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-01 |
| **Method** | POST |
| **Endpoint** | `/api/v1/admin/videos/create` |
| **Operation ID** | `createVideoEntry` |
| **Auth** | Admin |
| **Description** | Tạo video entry để upload lên Bunny.net |

**Request Body**:
```json
{
  "title": "string (required)",
  "episodeId": "string (required)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "videoId": "bunny-video-guid",
    "uploadUrl": "https://video.bunnycdn.com/tusupload",
    "uploadHeaders": {
      "AuthorizationSignature": "xxx",
      "AuthorizationExpire": "1706400000",
      "VideoId": "bunny-video-guid",
      "LibraryId": "12345"
    }
  }
}
```

**Business Logic**:
1. Call Bunny.net API to create video entry
2. Get video GUID
3. Update episode.video_id
4. Generate TUS upload headers
5. Return upload info for frontend

**Notes**:
- TUS protocol: resumable upload
- Max file size: 10 GB
- Supported formats: MP4, MKV, MOV, AVI

---

### 10. Bunny Webhook
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-01 |
| **Method** | POST |
| **Endpoint** | `/api/v1/webhook/bunny` |
| **Operation ID** | `bunnyWebhook` |
| **Auth** | No (signature verification) |
| **Description** | Bunny.net webhook khi encoding xong |

**Request Body (from Bunny)**:
```json
{
  "VideoLibraryId": 12345,
  "VideoGuid": "bunny-video-guid",
  "Status": 4,
  "Length": 2700
}
```

**Status Codes**:
| Status | Meaning |
|--------|---------|
| 0 | Created |
| 1 | Uploaded |
| 2 | Processing |
| 3 | Transcoding |
| 4 | Finished |
| 5 | Error |

**Response 200**:
```json
{
  "success": true
}
```

**Business Logic**:
1. Verify webhook signature (optional)
2. Find episode by video_id
3. If Status = 4: set episode.is_ready = true, episode.duration = Length
4. If Status = 5: log error, set episode.is_ready = false

---

## User Management APIs (3)

### 11. List Users
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-07 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/users` |
| **Operation ID** | `listUsers` |
| **Auth** | Admin |
| **Description** | Quản lý danh sách users |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |
| search | string | - | Search by email/name |
| status | string | - | active, inactive |
| hasSubscription | boolean | - | Filter by subscription |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "email": "string",
        "name": "string",
        "avatar": "string | null",
        "role": "USER | ADMIN",
        "isActive": true,
        "subscription": {
          "status": "ACTIVE | EXPIRED | null",
          "plan": "string | null",
          "expiresAt": "ISO datetime | null"
        },
        "createdAt": "ISO datetime",
        "lastLoginAt": "ISO datetime"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 12. Get User Detail
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-08 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/users/:id` |
| **Operation ID** | `getUserDetail` |
| **Auth** | Admin |
| **Description** | Xem chi tiết user và subscription history |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "avatar": "string | null",
    "role": "USER | ADMIN",
    "isActive": true,
    "createdAt": "ISO datetime",
    "lastLoginAt": "ISO datetime",
    "subscription": {
      "id": "string",
      "plan": { ... },
      "status": "ACTIVE",
      "startDate": "ISO datetime",
      "endDate": "ISO datetime"
    },
    "paymentHistory": [
      {
        "id": "string",
        "plan": { "name": "Premium" },
        "amount": 79000,
        "method": "VNPAY",
        "status": "SUCCESS",
        "createdAt": "ISO datetime"
      }
    ],
    "stats": {
      "moviesWatched": 25,
      "totalWatchTime": 4500,
      "favoriteCount": 12,
      "reviewCount": 5
    }
  }
}
```

---

### 13. Toggle User Status
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-09 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/admin/users/:id/status` |
| **Operation ID** | `toggleUserStatus` |
| **Auth** | Admin |
| **Description** | Kích hoạt/vô hiệu hóa tài khoản user |

**Request Body**:
```json
{
  "isActive": "boolean (required)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "isActive": false,
    "updatedAt": "ISO datetime"
  }
}
```

**Notes**:
- Khi deactivate: invalidate all sessions

---

## Subscription Management APIs (2)

### 14. List Payments
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-10 |
| **Method** | GET |
| **Endpoint** | `/api/v1/admin/payments` |
| **Operation ID** | `listPayments` |
| **Auth** | Admin |
| **Description** | Xem lịch sử thanh toán của hệ thống |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |
| status | string | - | PENDING, SUCCESS, FAILED |
| method | string | - | VNPAY, MOMO |
| from | date | - | From date |
| to | date | - | To date |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAmount": 58000000,
      "successCount": 720,
      "failedCount": 15
    },
    "items": [
      {
        "id": "string",
        "user": {
          "id": "string",
          "email": "string",
          "name": "string"
        },
        "plan": { "id": "string", "name": "Premium" },
        "amount": 79000,
        "method": "VNPAY",
        "status": "SUCCESS",
        "transactionId": "14123456",
        "createdAt": "ISO datetime",
        "processedAt": "ISO datetime"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 15. Manual Extend Subscription
| Field | Value |
|-------|-------|
| **US** | US-ADMIN-11 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/admin/subscriptions/:id/extend` |
| **Operation ID** | `manualExtendSubscription` |
| **Auth** | Admin |
| **Description** | Gia hạn subscription cho user (manual support case) |

**Request Body**:
```json
{
  "days": "integer (required, 1-365)",
  "reason": "string (required)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "previousEndDate": "ISO datetime",
    "newEndDate": "ISO datetime",
    "extendedBy": "admin@example.com",
    "reason": "Support ticket #123"
  }
}
```

**Notes**:
- Dùng cho customer support
- Log audit trail (Phase 2 full implementation)

---

## Admin UI Structure

```
/admin
├── /dashboard              # Overview stats
├── /movies                 # Movie list
│   ├── /new               # Create movie
│   └── /:id/edit          # Edit movie
├── /episodes              # Episode management
│   └── /:id/upload        # Upload video
├── /users                 # User list
│   └── /:id               # User detail
├── /subscriptions         # Subscription list
├── /payments              # Payment history
└── /settings              # Admin settings
```

---

## Error Codes

| Code | HTTP | Message |
|------|------|---------|
| ADMIN_ACCESS_DENIED | 403 | Không có quyền admin |
| ADMIN_MOVIE_NOT_FOUND | 404 | Phim không tồn tại |
| ADMIN_EPISODE_NOT_FOUND | 404 | Tập không tồn tại |
| ADMIN_USER_NOT_FOUND | 404 | User không tồn tại |
| ADMIN_UPLOAD_FAILED | 500 | Upload video thất bại |
| ADMIN_WEBHOOK_INVALID | 400 | Webhook không hợp lệ |

---

## Bunny.net Configuration

```env
BUNNY_API_KEY=your-api-key
BUNNY_LIBRARY_ID=12345
BUNNY_PULL_ZONE=vz-abc123
BUNNY_STREAM_TOKEN_KEY=random-32-char-key
BUNNY_WEBHOOK_SECRET=webhook-secret
```

---

## Upload Limits

| Limit | Value |
|-------|-------|
| Max file size | 10 GB |
| Supported formats | MP4, MKV, MOV, AVI |
| Concurrent uploads | 3 |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Dashboard load (P95) | < 500ms |
| List queries (P95) | < 200ms |
| Video upload (10GB) | TUS handles |

---

*Document Version: 1.0*
*Created: January 2026*
