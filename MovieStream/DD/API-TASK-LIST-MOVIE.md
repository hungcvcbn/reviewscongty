# API Task List - Movie & Episode Module

> **Module**: MOVIE
> **HLD Reference**: HLD-MS-MOVIE.md
> **User Stories**: US-MOVIE-01 đến US-MOVIE-10

---

## API Summary

| Category | Count | Auth |
|----------|-------|------|
| Public APIs | 8 | No |
| Admin APIs | 4 | Admin |
| **Total** | 12 | |

---

## Public APIs (8)

### 1. List Movies
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-01 |
| **Method** | GET |
| **Endpoint** | `/api/v1/movies` |
| **Operation ID** | `listMovies` |
| **Auth** | No |
| **Description** | Xem danh sách phim trên trang chủ với phân trang |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 50) |
| category | string | - | Category slug filter |
| tag | string | - | Tag slug filter |
| year | integer | - | Year filter |
| sort | string | newest | newest, popular, rating |

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
        "poster": "string (URL)",
        "year": 2026,
        "status": "PUBLISHED",
        "isPremium": false,
        "totalEpisodes": 20,
        "currentEpisodes": 15,
        "viewCount": 10500,
        "rating": 4.5,
        "categories": [
          { "id": "string", "name": "string", "slug": "string" }
        ],
        "tags": [
          { "id": "string", "name": "string", "slug": "string", "color": "#EF4444" }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

**Notes**:
- Cache với TTL 5 phút
- Chỉ return phim có status = PUBLISHED
- Grid layout, lazy loading (FE)

---

### 2. Search Movies
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-02 |
| **Method** | GET |
| **Endpoint** | `/api/v1/movies/search` |
| **Operation ID** | `searchMovies` |
| **Auth** | No |
| **Description** | Tìm kiếm phim theo tên |

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| q | string | Yes | Search query (min 2 chars) |
| limit | integer | No | Max results (default 10) |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "poster": "string",
      "year": 2026,
      "rating": 4.5
    }
  ]
}
```

**Notes**:
- Full-text search với PostgreSQL GIN index
- Frontend: debounce 300ms
- Match on title và description

---

### 3. Get Movie Detail
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-05 |
| **Method** | GET |
| **Endpoint** | `/api/v1/movies/:slug` |
| **Operation ID** | `getMovieDetail` |
| **Auth** | No |
| **Description** | Xem trang chi tiết phim với thông tin đầy đủ |

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| slug | string | Movie slug |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "slug": "string",
    "description": "string",
    "poster": "string (URL)",
    "trailer": "string (YouTube URL)",
    "year": 2026,
    "status": "PUBLISHED",
    "isPremium": false,
    "totalEpisodes": 20,
    "viewCount": 10500,
    "rating": 4.5,
    "reviewCount": 120,
    "categories": [...],
    "tags": [...],
    "episodes": [
      {
        "id": "string",
        "title": "Tập 1: Khởi đầu",
        "episodeNum": 1,
        "duration": 2700,
        "isPremium": false,
        "isReady": true
      }
    ],
    "relatedMovies": [
      {
        "id": "string",
        "title": "string",
        "slug": "string",
        "poster": "string"
      }
    ],
    "createdAt": "ISO datetime",
    "updatedAt": "ISO datetime"
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| MOVIE_NOT_FOUND | 404 | Phim không tồn tại |

**Notes**:
- Cache với TTL 10 phút
- Auto-increment view_count
- Include related movies (same category)

---

### 4. List Episodes
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-06 |
| **Method** | GET |
| **Endpoint** | `/api/v1/movies/:movieId/episodes` |
| **Operation ID** | `listEpisodes` |
| **Auth** | No |
| **Description** | Xem danh sách tập của phim bộ |

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| movieId | string | Movie ID |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "episodeNum": 1,
      "duration": 2700,
      "isPremium": false,
      "isReady": true,
      "createdAt": "ISO datetime"
    }
  ]
}
```

**Notes**:
- Sorted by episodeNum ASC
- Hiển thị số tập, duration, status

---

### 5. List Categories
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-03 |
| **Method** | GET |
| **Endpoint** | `/api/v1/categories` |
| **Operation ID** | `listCategories` |
| **Auth** | No |
| **Description** | Lấy danh sách categories để filter |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "Hành động",
      "slug": "hanh-dong",
      "sortOrder": 1
    }
  ]
}
```

**Notes**:
- Cache với TTL 1 giờ
- Sorted by sortOrder ASC

---

### 6. Get Movies By Category
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-03 |
| **Method** | GET |
| **Endpoint** | `/api/v1/categories/:slug/movies` |
| **Operation ID** | `getMoviesByCategory` |
| **Auth** | No |
| **Description** | Lọc phim theo thể loại |

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| slug | string | Category slug |

**Query Parameters**:
| Param | Type | Default |
|-------|------|---------|
| page | integer | 1 |
| limit | integer | 20 |

**Response 200**: Same as listMovies

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| CATEGORY_NOT_FOUND | 404 | Category không tồn tại |

---

### 7. List Tags
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-04 |
| **Method** | GET |
| **Endpoint** | `/api/v1/tags` |
| **Operation ID** | `listTags` |
| **Auth** | No |
| **Description** | Lấy danh sách tags |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "Hot",
      "slug": "hot",
      "color": "#EF4444"
    }
  ]
}
```

**Notes**:
- Cache với TTL 1 giờ

---

### 8. Get Movies By Tag
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-04 |
| **Method** | GET |
| **Endpoint** | `/api/v1/tags/:slug/movies` |
| **Operation ID** | `getMoviesByTag` |
| **Auth** | No |
| **Description** | Lọc phim theo tag |

**Response 200**: Same as listMovies

---

## Admin APIs (4)

### 9. Create Movie
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-07 |
| **Method** | POST |
| **Endpoint** | `/api/v1/admin/movies` |
| **Operation ID** | `createMovie` |
| **Auth** | Admin |
| **Description** | Tạo phim mới với thông tin cơ bản |

**Request Body**:
```json
{
  "title": "string (required, max 255)",
  "description": "string (optional, max 10000)",
  "poster": "string (optional, valid URL)",
  "trailer": "string (optional, YouTube URL)",
  "year": "integer (1900 - current year + 1)",
  "isPremium": "boolean (default false)",
  "categoryIds": ["string"] (required, min 1)",
  "tagIds": ["string"] (optional)"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "slug": "string (auto-generated)",
    "status": "DRAFT",
    "createdAt": "ISO datetime"
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| MOVIE_SLUG_EXISTS | 409 | Slug đã tồn tại |
| CATEGORY_NOT_FOUND | 404 | Category không tồn tại |

**Notes**:
- Slug auto-generated từ title
- Default status = DRAFT
- Clear movie list caches

---

### 10. Update Movie
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-08 |
| **Method** | PUT |
| **Endpoint** | `/api/v1/admin/movies/:id` |
| **Operation ID** | `updateMovie` |
| **Auth** | Admin |
| **Description** | Cập nhật thông tin phim |

**Request Body**: Same as Create (all optional)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "slug": "string",
    "updatedAt": "ISO datetime"
  }
}
```

**Notes**:
- Clear movie caches (list + detail)
- Cannot update ARCHIVED movies

---

### 11. Delete Movie
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-09 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/admin/movies/:id` |
| **Operation ID** | `deleteMovie` |
| **Auth** | Admin |
| **Description** | Xóa phim khỏi hệ thống (soft delete) |

**Response 200**:
```json
{
  "success": true,
  "message": "Phim đã được xóa"
}
```

**Notes**:
- Soft delete (set status = ARCHIVED hoặc is_deleted flag)
- Cascade delete episodes
- Clear all related caches

---

### 12. Change Movie Status
| Field | Value |
|-------|-------|
| **US** | US-MOVIE-10 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/admin/movies/:id/status` |
| **Operation ID** | `changeMovieStatus` |
| **Auth** | Admin |
| **Description** | Thay đổi trạng thái phim |

**Request Body**:
```json
{
  "status": "DRAFT | PUBLISHED | ARCHIVED"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "PUBLISHED",
    "updatedAt": "ISO datetime"
  }
}
```

**Notes**:
- State machine: DRAFT ↔ PUBLISHED, PUBLISHED → ARCHIVED
- Clear movie list caches when status changes

---

## Movie State Machine

```
                 ┌────────────┐
                 │   [*]      │
                 └─────┬──────┘
                       │ Admin tạo mới
                       ▼
                 ┌────────────┐
           ┌─────│   DRAFT    │─────┐
           │     └────────────┘     │
           │ unpublish    publish │
           │                       ▼
           │     ┌────────────┐
           └─────│ PUBLISHED  │
                 └─────┬──────┘
                       │ archive
                       ▼
                 ┌────────────┐
                 │  ARCHIVED  │
                 └────────────┘
```

---

## Caching Strategy

| Data | Cache Key | TTL |
|------|-----------|-----|
| Movies list | `movies:list:{filters}` | 5 min |
| Movie detail | `movies:detail:{slug}` | 10 min |
| Categories | `categories:all` | 1 hour |
| Tags | `tags:all` | 1 hour |

**Invalidation**:
- Create/Update/Delete movie → Clear list + detail caches
- Status change → Clear list caches

---

## Validation Rules

| Field | Rules |
|-------|-------|
| title | Required, max 255 chars |
| slug | Auto-generated, unique |
| description | Max 10000 chars |
| poster | Valid URL |
| year | 1900 - current year + 1 |
| episode_num | Integer > 0, unique per movie |
| duration | Integer >= 0 |

---

*Document Version: 1.0*
*Created: January 2026*
