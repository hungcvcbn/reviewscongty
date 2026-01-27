# API Task List - Review & Rating Module

> **Module**: REVIEW
> **HLD Reference**: HLD-MS-REVIEW.md
> **User Stories**: US-REVIEW-01 đến US-REVIEW-07

---

## API Summary

| Category | Count | Auth Level |
|----------|-------|------------|
| Public | 1 | No |
| User | 3 | Subscriber/Owner |
| Vote | 2 | User |
| **Total** | 6 | |

---

## Public APIs (1)

### 1. Get Movie Reviews
| Field | Value |
|-------|-------|
| **US** | US-REVIEW-01, US-REVIEW-02 |
| **Method** | GET |
| **Endpoint** | `/api/v1/movies/:movieId/reviews` |
| **Operation ID** | `getMovieReviews` |
| **Auth** | No (but returns userVote if authenticated) |
| **Description** | Xem danh sách reviews và rating của phim |

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| movieId | string | Movie ID |

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page |
| sort | string | helpful | helpful, newest |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "averageRating": 4.2,
      "totalReviews": 156,
      "ratingDistribution": {
        "5": 80,
        "4": 45,
        "3": 20,
        "2": 8,
        "1": 3
      }
    },
    "items": [
      {
        "id": "rev123",
        "user": {
          "id": "user456",
          "name": "Nguyễn Văn A",
          "avatar": "https://..."
        },
        "rating": 5,
        "content": "Phim rất hay, diễn xuất tuyệt vời!",
        "helpfulCount": 25,
        "userVote": "HELPFUL | NOT_HELPFUL | null",
        "createdAt": "2026-01-20T10:00:00Z",
        "updatedAt": "2026-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156,
      "totalPages": 16
    }
  }
}
```

**Notes**:
- summary.ratingDistribution: số lượng review cho mỗi mức sao
- userVote: vote của current user (nếu authenticated)
- sort=helpful: sorted by helpfulCount DESC
- sort=newest: sorted by createdAt DESC

---

## Review Management APIs (3)

### 2. Create Review
| Field | Value |
|-------|-------|
| **US** | US-REVIEW-03 |
| **Method** | POST |
| **Endpoint** | `/api/v1/movies/:movieId/reviews` |
| **Operation ID** | `createReview` |
| **Auth** | Subscriber (active subscription required) |
| **Description** | Viết review và đánh giá sao cho phim đã xem |

**Request Body**:
```json
{
  "rating": "integer (required, 1-5)",
  "content": "string (required, 10-2000 chars)"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "rev123",
    "rating": 5,
    "content": "Phim rất hay...",
    "createdAt": "2026-01-27T10:00:00Z"
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| REVIEW_SUBSCRIPTION_REQUIRED | 403 | Cần subscription để viết review |
| REVIEW_ALREADY_EXISTS | 409 | Bạn đã review phim này |
| REVIEW_CONTENT_TOO_SHORT | 400 | Review phải có ít nhất 10 ký tự |
| MOVIE_NOT_FOUND | 404 | Phim không tồn tại |

**Business Logic**:
1. Check user has active subscription
2. Check user hasn't reviewed this movie
3. Create review
4. Recalculate movie.rating
5. Update movie.review_count

---

### 3. Update Review
| Field | Value |
|-------|-------|
| **US** | US-REVIEW-04 |
| **Method** | PUT |
| **Endpoint** | `/api/v1/reviews/:id` |
| **Operation ID** | `updateReview` |
| **Auth** | Owner (review owner only) |
| **Description** | Chỉnh sửa review đã viết |

**Request Body**:
```json
{
  "rating": "integer (optional, 1-5)",
  "content": "string (optional, 10-2000 chars)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "rev123",
    "rating": 4,
    "content": "Updated content...",
    "updatedAt": "2026-01-27T11:00:00Z"
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| REVIEW_NOT_FOUND | 404 | Review không tồn tại |
| REVIEW_NOT_OWNER | 403 | Không có quyền sửa review này |

**Notes**:
- Recalculate movie.rating if rating changed

---

### 4. Delete Review
| Field | Value |
|-------|-------|
| **US** | US-REVIEW-05, US-REVIEW-07 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/reviews/:id` |
| **Operation ID** | `deleteReview` |
| **Auth** | Owner or Admin |
| **Description** | Xóa review (owner hoặc admin moderation) |

**Response 200**:
```json
{
  "success": true,
  "message": "Review đã được xóa"
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| REVIEW_NOT_FOUND | 404 | Review không tồn tại |
| REVIEW_NOT_OWNER | 403 | Không có quyền xóa review này |

**Notes**:
- Owner có thể xóa review của mình
- Admin có thể xóa review vi phạm (US-REVIEW-07)
- Recalculate movie.rating after deletion

---

## Vote APIs (2)

### 5. Vote Review
| Field | Value |
|-------|-------|
| **US** | US-REVIEW-06 |
| **Method** | POST |
| **Endpoint** | `/api/v1/reviews/:id/vote` |
| **Operation ID** | `voteReview` |
| **Auth** | User (authenticated) |
| **Description** | Vote review "Helpful" hoặc "Not Helpful" |

**Request Body**:
```json
{
  "type": "HELPFUL | NOT_HELPFUL"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "reviewId": "rev123",
    "voteType": "HELPFUL",
    "helpfulCount": 26
  }
}
```

**Business Logic**:
1. Check if user already voted
2. If already voted with same type → do nothing (or toggle off?)
3. If already voted with different type → update vote
4. If new vote → insert
5. Update review.helpful_count

**Notes**:
- Toggle vote: gọi lại với cùng type sẽ xóa vote

---

### 6. Remove Vote
| Field | Value |
|-------|-------|
| **US** | US-REVIEW-06 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/reviews/:id/vote` |
| **Operation ID** | `removeVote` |
| **Auth** | User (authenticated) |
| **Description** | Xóa vote khỏi review |

**Response 200**:
```json
{
  "success": true,
  "message": "Đã xóa vote"
}
```

---

## Database Tables

### reviews
```sql
CREATE TABLE reviews (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id VARCHAR(30) NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    helpful_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, movie_id)
);

CREATE INDEX idx_reviews_movie ON reviews(movie_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_helpful ON reviews(helpful_count DESC);
```

### review_votes
```sql
CREATE TABLE review_votes (
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    review_id VARCHAR(30) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('HELPFUL', 'NOT_HELPFUL')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, review_id)
);
```

---

## Rating Calculation

```sql
-- Trigger hoặc scheduled job khi review thay đổi
UPDATE movies m
SET rating = (
    SELECT COALESCE(AVG(rating)::DECIMAL(2,1), 0)
    FROM reviews r
    WHERE r.movie_id = m.id
),
review_count = (
    SELECT COUNT(*)
    FROM reviews r
    WHERE r.movie_id = m.id
)
WHERE m.id = :movieId;
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| rating | Required, integer 1-5 |
| content | Required, min 10 chars, max 2000 chars |
| vote_type | HELPFUL or NOT_HELPFUL |

---

## Business Rules

- Mỗi user chỉ được 1 review per movie
- Chỉ subscriber active mới được viết review
- Rating từ 1-5 sao
- Review content tối thiểu 10 ký tự, tối đa 2000 ký tự
- Average rating tính từ tất cả reviews
- Admin có thể xóa review vi phạm

---

## Error Codes

| Code | HTTP | Message |
|------|------|---------|
| REVIEW_NOT_FOUND | 404 | Review không tồn tại |
| REVIEW_ALREADY_EXISTS | 409 | Bạn đã review phim này |
| REVIEW_SUBSCRIPTION_REQUIRED | 403 | Cần subscription để viết review |
| REVIEW_NOT_OWNER | 403 | Không có quyền sửa/xóa review này |
| REVIEW_CONTENT_TOO_SHORT | 400 | Review phải có ít nhất 10 ký tự |

---

## Cross-Service Integration

| Service | Integration |
|---------|-------------|
| ms-subscription | Check active subscription for create |
| ms-movie | Update movie.rating and review_count |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Get reviews (P95) | < 100ms |
| Create review (P95) | < 200ms |
| Vote (P95) | < 50ms |

---

*Document Version: 1.0*
*Created: January 2026*
