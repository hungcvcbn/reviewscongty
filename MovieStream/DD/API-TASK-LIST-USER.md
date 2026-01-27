# API Task List - User Profile Module

> **Module**: USER
> **HLD Reference**: HLD-MS-USER.md
> **User Stories**: US-USER-01 đến US-USER-05

---

## API Summary

| Category | Count | Description |
|----------|-------|-------------|
| Profile | 2 | Get/Update profile |
| History | 4 | Watch history management |
| Favorites | 3 | Favorites management |
| Continue | 1 | Continue watching |
| **Total** | 10 | |

---

## Profile APIs (2)

### 1. Get Profile
| Field | Value |
|-------|-------|
| **US** | US-USER-01 |
| **Method** | GET |
| **Endpoint** | `/api/v1/user/profile` |
| **Operation ID** | `getProfile` |
| **Auth** | Yes |
| **Description** | Lấy thông tin profile user |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "avatar": "string | null",
    "createdAt": "ISO datetime"
  }
}
```

---

### 2. Update Profile
| Field | Value |
|-------|-------|
| **US** | US-USER-01 |
| **Method** | PUT |
| **Endpoint** | `/api/v1/user/profile` |
| **Operation ID** | `updateProfile` |
| **Auth** | Yes |
| **Description** | Cập nhật thông tin cá nhân (tên, avatar) |

**Request Body**:
```json
{
  "name": "string (optional, 2-100 chars)",
  "avatar": "string (optional, valid URL, max 500 chars)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "avatar": "string | null",
    "updatedAt": "ISO datetime"
  }
}
```

**Notes**:
- Avatar URL comes from cloud storage upload (frontend handles)

---

## Watch History APIs (4)

### 3. Get Watch History
| Field | Value |
|-------|-------|
| **US** | US-USER-02 |
| **Method** | GET |
| **Endpoint** | `/api/v1/user/history` |
| **Operation ID** | `getWatchHistory` |
| **Auth** | Yes |
| **Description** | Xem lịch sử các phim đã xem và tiến độ xem |

**Query Parameters**:
| Param | Type | Default |
|-------|------|---------|
| page | integer | 1 |
| limit | integer | 20 |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "history123",
        "episode": {
          "id": "ep123",
          "title": "Tập 5",
          "episodeNum": 5,
          "movie": {
            "id": "mov123",
            "title": "Phim ABC",
            "slug": "phim-abc",
            "poster": "https://..."
          }
        },
        "progress": 1800,
        "duration": 3600,
        "progressPercent": 50,
        "watchedAt": "2026-01-27T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**Notes**:
- Sorted by watched_at DESC
- progressPercent = (progress / duration) * 100

---

### 4. Save Watch Progress
| Field | Value |
|-------|-------|
| **US** | US-USER-02 |
| **Method** | POST |
| **Endpoint** | `/api/v1/user/history` |
| **Operation ID** | `saveProgress` |
| **Auth** | Yes |
| **Description** | Lưu tiến độ xem (called from video player) |

**Request Body**:
```json
{
  "episodeId": "string (required)",
  "progress": "integer (required, seconds)",
  "duration": "integer (required, total seconds)"
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Progress saved"
}
```

**Business Logic**:
- UPSERT on (user_id, episode_id)
- Update watched_at timestamp

---

### 5. Clear All History
| Field | Value |
|-------|-------|
| **US** | US-USER-04 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/user/history` |
| **Operation ID** | `clearAllHistory` |
| **Auth** | Yes |
| **Description** | Xóa toàn bộ lịch sử xem |

**Response 200**:
```json
{
  "success": true,
  "message": "Đã xóa toàn bộ lịch sử"
}
```

---

### 6. Delete History Item
| Field | Value |
|-------|-------|
| **US** | US-USER-04 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/user/history/:episodeId` |
| **Operation ID** | `deleteHistoryItem` |
| **Auth** | Yes |
| **Description** | Xóa một mục trong lịch sử xem |

**Response 200**:
```json
{
  "success": true,
  "message": "Đã xóa khỏi lịch sử"
}
```

---

## Favorites APIs (3)

### 7. Get Favorites
| Field | Value |
|-------|-------|
| **US** | US-USER-03 |
| **Method** | GET |
| **Endpoint** | `/api/v1/user/favorites` |
| **Operation ID** | `getFavorites` |
| **Auth** | Yes |
| **Description** | Lấy danh sách phim yêu thích |

**Query Parameters**:
| Param | Type | Default |
|-------|------|---------|
| page | integer | 1 |
| limit | integer | 20 |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "movie": {
          "id": "mov123",
          "title": "Phim ABC",
          "slug": "phim-abc",
          "poster": "https://...",
          "year": 2026,
          "rating": 4.5,
          "totalEpisodes": 20,
          "status": "PUBLISHED"
        },
        "addedAt": "2026-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

**Notes**:
- Sorted by created_at DESC
- Unlimited favorites count

---

### 8. Add Favorite
| Field | Value |
|-------|-------|
| **US** | US-USER-03 |
| **Method** | POST |
| **Endpoint** | `/api/v1/user/favorites/:movieId` |
| **Operation ID** | `addFavorite` |
| **Auth** | Yes |
| **Description** | Thêm phim vào danh sách yêu thích |

**Response 201**:
```json
{
  "success": true,
  "message": "Đã thêm vào yêu thích"
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| USER_FAVORITE_EXISTS | 409 | Phim đã có trong danh sách yêu thích |
| MOVIE_NOT_FOUND | 404 | Phim không tồn tại |

---

### 9. Remove Favorite
| Field | Value |
|-------|-------|
| **US** | US-USER-03 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/user/favorites/:movieId` |
| **Operation ID** | `removeFavorite` |
| **Auth** | Yes |
| **Description** | Xóa phim khỏi danh sách yêu thích |

**Response 200**:
```json
{
  "success": true,
  "message": "Đã xóa khỏi yêu thích"
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| USER_FAVORITE_NOT_FOUND | 404 | Phim không có trong danh sách yêu thích |

---

## Continue Watching API (1)

### 10. Get Continue Watching
| Field | Value |
|-------|-------|
| **US** | US-USER-02, US-STREAM-02 |
| **Method** | GET |
| **Endpoint** | `/api/v1/user/continue-watching` |
| **Operation ID** | `getContinueWatching` |
| **Auth** | Yes |
| **Description** | Lấy danh sách phim đang xem dở |

**Query Parameters**:
| Param | Type | Default |
|-------|------|---------|
| limit | integer | 10 |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "movie": {
        "id": "mov123",
        "title": "Phim ABC",
        "slug": "phim-abc",
        "poster": "https://..."
      },
      "episode": {
        "id": "ep123",
        "title": "Tập 5",
        "episodeNum": 5
      },
      "progress": 1800,
      "duration": 3600,
      "progressPercent": 50,
      "continueUrl": "/movies/phim-abc/watch/5?t=1800"
    }
  ]
}
```

**Business Logic**:
- Filter: 5% < progressPercent < 95%
- Sorted by watched_at DESC
- Group by movie (show latest episode per movie)

---

## Database Tables

### watch_history
```sql
CREATE TABLE watch_history (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_id VARCHAR(30) NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    progress INT NOT NULL DEFAULT 0,
    duration INT NOT NULL,
    watched_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, episode_id)
);

CREATE INDEX idx_watch_history_user ON watch_history(user_id);
CREATE INDEX idx_watch_history_user_watched ON watch_history(user_id, watched_at DESC);
```

### favorites
```sql
CREATE TABLE favorites (
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id VARCHAR(30) NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, movie_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_movie ON favorites(movie_id);
```

---

## Continue Watching Logic

```typescript
async function getContinueWatching(userId: string, limit = 10) {
  const history = await prisma.watchHistory.findMany({
    where: {
      userId,
      // Filter: 5% < progress < 95%
      progress: { gt: 0 },
    },
    include: {
      episode: {
        include: { movie: true }
      }
    },
    orderBy: { watchedAt: 'desc' },
    take: limit * 2, // Get extra for filtering
  });

  // Filter by percentage and group by movie
  const movieMap = new Map();

  for (const item of history) {
    const percent = (item.progress / item.duration) * 100;

    // Skip if completed or barely started
    if (percent < 5 || percent >= 95) continue;

    // Only keep latest episode per movie
    if (!movieMap.has(item.episode.movieId)) {
      movieMap.set(item.episode.movieId, item);
    }
  }

  return Array.from(movieMap.values()).slice(0, limit);
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| name | Min 2, max 100 chars |
| avatar | Valid URL, max 500 chars |
| progress | Integer >= 0 |
| duration | Integer > 0 |

---

## Data Retention

| Data | Retention |
|------|-----------|
| Watch history | 1 year |
| Favorites | Permanent |

---

## Error Codes

| Code | HTTP | Message |
|------|------|---------|
| USER_NOT_FOUND | 404 | User không tồn tại |
| USER_PROFILE_UPDATE_FAILED | 500 | Không thể cập nhật profile |
| USER_FAVORITE_EXISTS | 409 | Phim đã có trong danh sách yêu thích |
| USER_FAVORITE_NOT_FOUND | 404 | Phim không có trong danh sách yêu thích |

---

## Cross-Service Integration

| Service | Integration |
|---------|-------------|
| ms-streaming | POST /user/history (save progress) |
| ms-movie | GET movie info for favorites/history |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Get history (P95) | < 100ms |
| Save progress (P95) | < 50ms |
| Get favorites (P95) | < 100ms |

---

*Document Version: 1.0*
*Created: January 2026*
