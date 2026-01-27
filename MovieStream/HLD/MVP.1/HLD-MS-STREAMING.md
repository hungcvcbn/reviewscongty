# HLD - MS-STREAMING (Video Streaming & Protection)

## 1. Context (Bối cảnh)

### 1.1 Business Context (Bối cảnh kinh doanh)

Module Streaming xử lý việc phát video an toàn:
- Tạo signed URL cho video playback
- Bảo vệ video khỏi piracy (6 lớp bảo vệ)
- Quản lý concurrent streaming
- Lưu tiến độ xem

**Vấn đề cần giải quyết:**
- Video piracy là vấn đề nghiêm trọng tại Việt Nam
- Cần bảo vệ nội dung nhưng không ảnh hưởng UX
- Chi phí streaming cần tối ưu

**User Stories:**

| ID | As a | I want to | So that |
|----|------|-----------|---------|
| US-01 | Subscriber | xem video mượt mà | tôi có trải nghiệm tốt |
| US-02 | Subscriber | tiếp tục xem từ chỗ dừng | không phải tua lại |
| US-03 | User | xem video trên mobile | tôi xem mọi lúc mọi nơi |
| US-04 | System | bảo vệ video | ngăn chặn piracy |
| US-05 | System | giới hạn concurrent streams | ngăn chia sẻ tài khoản |

**Business Rules:**
- Chỉ subscriber active mới xem được video premium
- Tối đa 2 streams đồng thời per user
- Signed URL có thời hạn 4 giờ
- Auto-save progress mỗi 30 giây
- Watermark hiển thị user ID trên video

### 1.2 System Context (Bối cảnh hệ thống)

**Services tham gia:**

| Service | Tech Stack | Vai trò |
|---------|------------|---------|
| ms-streaming | Node.js + Express | Generate signed URLs, manage streams |
| Bunny.net Stream | CDN | Video hosting, HLS streaming, encryption |
| Redis | Redis 7 | Stream session tracking |

**Video Delivery Flow:**
```
User Request → ms-streaming → Generate Signed URL → Bunny.net CDN → HLS Video
```

### 1.3 Out Of Scope (Phạm vi ngoài)

- Video upload & encoding (xem HLD-MS-ADMIN)
- Movie/Episode metadata (xem HLD-MS-MOVIE)
- Subscription verification logic (xem HLD-MS-SUBSCRIPTION)
- DRM Level 1 (Widevine/FairPlay) - Phase 2

### 1.4 Actors (Các vai trò)

| Actor | Mô tả | Quyền hạn |
|-------|-------|-----------|
| **Guest** | Chưa đăng nhập | Không xem video |
| **User** | Đăng nhập, không subscribe | Xem free content + 2 tập đầu |
| **Subscriber** | Có subscription active | Xem tất cả content |
| **System** | Backend services | Generate tokens, track streams |

---

## 2. Context Diagram

```mermaid
C4Context
    title System Context - Streaming Service

    Person(subscriber, "Subscriber", "Người dùng trả phí")

    System_Boundary(platform, "MovieStream Platform") {
        System(streamService, "Streaming Service", "URL signing, stream management")
        System(authService, "Auth Service", "JWT validation")
        System(subService, "Subscription Service", "Check active subscription")
    }

    System_Ext(bunny, "Bunny.net Stream", "Video CDN with HLS + Encryption")
    SystemDb(redis, "Redis", "Stream session tracking")

    Rel(subscriber, streamService, "Request video stream")
    Rel(streamService, authService, "Validate JWT")
    Rel(streamService, subService, "Check subscription")
    Rel(streamService, bunny, "Generate signed URL")
    Rel(streamService, redis, "Track active streams")
    Rel(subscriber, bunny, "Stream video (HLS)")
```

---

## 3. Core Business Workflow

### 3.1 Request Stream Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant VP as Video Player
    participant API as Streaming API
    participant Auth as Auth Service
    participant Sub as Subscription Service
    participant Redis as Redis
    participant Bunny as Bunny.net

    U->>VP: Click Play on Episode
    VP->>API: GET /api/stream/:episodeId
    Note over VP,API: Authorization: Bearer {token}<br/>X-Device-ID: {deviceId}

    API->>Auth: Validate JWT
    Auth-->>API: User info

    API->>API: Get episode info
    Note over API: Check if episode is premium

    alt Episode is Premium
        API->>Sub: Check subscription status
        Sub-->>API: Subscription info

        alt No active subscription
            API-->>VP: 403 Forbidden
            VP-->>U: "Vui lòng đăng ký để xem"
        end
    end

    API->>Redis: Check concurrent streams
    Note over API,Redis: Key: streams:{userId}

    alt Exceeded limit (>2)
        API-->>VP: 429 Too Many Streams
        VP-->>U: "Bạn đang xem trên quá nhiều thiết bị"
    else Within limit
        API->>Redis: Register stream session
        Note over Redis: HSET streams:{userId} {deviceId} {timestamp}<br/>EXPIRE 60s

        API->>API: Generate signed URL
        Note over API: Token includes: videoId, userId, expiry<br/>SHA256 HMAC signature

        API->>Bunny: Construct HLS URL with token

        API-->>VP: 200 OK + streamUrl + metadata
    end

    VP->>Bunny: GET playlist.m3u8?token=xxx
    Bunny->>Bunny: Verify token signature
    Bunny-->>VP: HLS manifest

    VP->>Bunny: GET segment_001.ts
    Bunny-->>VP: Encrypted video segment

    VP->>VP: Decrypt & play

    loop Every 30 seconds
        VP->>API: POST /api/stream/heartbeat
        API->>Redis: Update session timestamp
        VP->>API: POST /api/user/history
        Note over VP,API: Save watch progress
    end
```

### 3.2 Signed URL Generation

```mermaid
sequenceDiagram
    autonumber
    participant API as Streaming API
    participant Crypto as Crypto Module

    API->>API: Prepare URL parameters
    Note over API: videoId = "abc123"<br/>expiry = now + 4 hours<br/>userId = "user456"

    API->>Crypto: Create HMAC signature
    Note over Crypto: data = tokenKey + videoId + expiry<br/>signature = SHA256(data)

    Crypto-->>API: Base64 encoded signature

    API->>API: Construct final URL
    Note over API: https://{pullzone}.b-cdn.net/{videoId}/playlist.m3u8<br/>?token={signature}&expires={expiry}

    API-->>API: Return signed URL
```

### 3.3 Video Protection Layers

```mermaid
flowchart TD
    subgraph Layer1["Layer 1: HLS Encryption"]
        A[AES-128 Encryption] --> B[Key delivered over HTTPS]
    end

    subgraph Layer2["Layer 2: Token Authentication"]
        C[Signed URL] --> D[4-hour expiry]
        D --> E[User-specific token]
    end

    subgraph Layer3["Layer 3: Domain Restriction"]
        F[Allowed Referrers] --> G[Block empty referrer]
    end

    subgraph Layer4["Layer 4: Dynamic Watermark"]
        H[Canvas overlay] --> I[User ID + Timestamp]
    end

    subgraph Layer5["Layer 5: Concurrent Limit"]
        J[Max 2 devices] --> K[Redis session tracking]
    end

    subgraph Layer6["Layer 6: Rate Limiting"]
        L[Request throttling] --> M[Block suspicious IPs]
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer3 --> Layer4
    Layer4 --> Layer5
    Layer5 --> Layer6
```

### 3.4 Concurrent Stream Management

```mermaid
sequenceDiagram
    autonumber
    participant VP1 as Device 1
    participant VP2 as Device 2
    participant VP3 as Device 3
    participant API as Streaming API
    participant Redis as Redis

    Note over Redis: streams:user123 = {}<br/>Max allowed: 2

    VP1->>API: Request stream (device1)
    API->>Redis: HSET streams:user123 device1 timestamp
    Redis-->>API: OK (count: 1)
    API-->>VP1: Stream URL

    VP2->>API: Request stream (device2)
    API->>Redis: HSET streams:user123 device2 timestamp
    Redis-->>API: OK (count: 2)
    API-->>VP2: Stream URL

    VP3->>API: Request stream (device3)
    API->>Redis: HGETALL streams:user123
    Redis-->>API: {device1, device2} (count: 2)
    API-->>VP3: 429 Too Many Streams

    Note over VP1: User stops watching
    VP1->>API: POST /stream/end
    API->>Redis: HDEL streams:user123 device1
    Redis-->>API: OK (count: 1)

    VP3->>API: Request stream (device3)
    API->>Redis: HSET streams:user123 device3 timestamp
    Redis-->>API: OK (count: 2)
    API-->>VP3: Stream URL
```

---

## 4. Data Model

### 4.1 Redis Data Structures

**Stream Sessions:**
```
Key: streams:{userId}
Type: Hash
Fields:
  {deviceId}: {timestamp}
TTL: 60 seconds (auto-cleanup inactive sessions)

Example:
  streams:user123 = {
    "device_abc": "1706356800000",
    "device_xyz": "1706356790000"
  }
```

**Rate Limiting:**
```
Key: ratelimit:stream:{userId}
Type: String (counter)
TTL: 60 seconds

Key: ratelimit:stream:ip:{ipAddress}
Type: String (counter)
TTL: 60 seconds
```

### 4.2 Stream Session Table (Optional - for analytics)

```sql
CREATE TABLE stream_sessions (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id),
    episode_id VARCHAR(30) NOT NULL REFERENCES episodes(id),
    device_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_watched INT DEFAULT 0,

    INDEX idx_stream_sessions_user (user_id),
    INDEX idx_stream_sessions_episode (episode_id),
    INDEX idx_stream_sessions_started (started_at)
);
```

---

## 5. API Specification

### 5.1 REST Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/stream/:episodeId | Yes | Lấy signed stream URL |
| POST | /api/stream/heartbeat | Yes | Keep session alive |
| POST | /api/stream/end | Yes | End stream session |

### 5.2 Request/Response Examples

#### GET /api/stream/:episodeId

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Device-ID: device_abc123
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "streamUrl": "https://vz-abc123.b-cdn.net/video-guid/playlist.m3u8?token=xxx&expires=1706360400",
    "episode": {
      "id": "ep123",
      "title": "Tập 5",
      "episodeNum": 5,
      "duration": 2700,
      "movie": {
        "id": "mov123",
        "title": "Phim ABC"
      }
    },
    "resumeAt": 1500,
    "watermark": {
      "text": "user@example.com | u123",
      "position": "random"
    },
    "nextEpisode": {
      "id": "ep124",
      "title": "Tập 6",
      "episodeNum": 6
    },
    "expiresAt": "2026-01-27T14:00:00Z"
  }
}
```

**Response (403 Forbidden - No subscription):**
```json
{
  "success": false,
  "error": {
    "code": "STREAM_SUBSCRIPTION_REQUIRED",
    "message": "Vui lòng đăng ký gói Premium để xem nội dung này"
  }
}
```

**Response (429 Too Many Streams):**
```json
{
  "success": false,
  "error": {
    "code": "STREAM_CONCURRENT_LIMIT",
    "message": "Bạn đang xem trên quá nhiều thiết bị. Vui lòng dừng xem trên thiết bị khác."
  }
}
```

#### POST /api/stream/heartbeat

**Request:**
```json
{
  "episodeId": "ep123",
  "deviceId": "device_abc123",
  "progress": 1500
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Session renewed"
}
```

#### POST /api/stream/end

**Request:**
```json
{
  "episodeId": "ep123",
  "deviceId": "device_abc123",
  "finalProgress": 2500
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream session ended"
}
```

---

## 6. Integration Points

### 6.1 Bunny.net Stream Configuration

**Pull Zone Settings:**
```yaml
Token Authentication: Enabled
Token Authentication Key: [32-char random string]
Allowed Referrers:
  - moviestream.vn
  - "*.moviestream.vn"
  - localhost:3000  # dev only
Block Root Path Access: Yes
Blocked Empty Referrer: Yes
```

**Video Library Settings:**
```yaml
Encoding Quality: 720p, 1080p
Direct Play: Disabled (force HLS)
Player Key Security: Enabled
Watermark: Disabled (handled by frontend)
```

### 6.2 Upstream Dependencies

| Service | Data | Purpose |
|---------|------|---------|
| ms-auth | JWT validation | Identify user |
| ms-subscription | Subscription status | Check premium access |
| ms-movie | Episode info | Get video_id |

### 6.3 Downstream Consumers

| Service | Integration | Purpose |
|---------|-------------|---------|
| ms-user | Watch progress | Save to history |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target |
|--------|--------|
| Stream URL generation (P95) | < 100ms |
| Heartbeat latency (P95) | < 50ms |
| Video start time (P95) | < 3 seconds |
| Buffering ratio | < 1% |

### 7.2 Security Measures

| Layer | Implementation | Effectiveness |
|-------|----------------|---------------|
| HLS Encryption | AES-128 (Bunny default) | High |
| Token Auth | HMAC SHA256 signed URLs | High |
| Domain Lock | Referrer whitelist | Medium |
| Watermark | Dynamic canvas overlay | Medium (deterrent) |
| Concurrent Limit | Redis session tracking | High |
| Rate Limit | 100 requests/min/user | Medium |

### 7.3 Availability

- Bunny.net CDN: 99.9% SLA
- Stream API: Target 99.5% uptime
- Graceful degradation nếu Redis down → Allow streaming without concurrent check

---

## 8. Appendix

### 8.1 Error Codes

| Code | HTTP Status | Message |
|------|-------------|---------|
| STREAM_EPISODE_NOT_FOUND | 404 | Tập phim không tồn tại |
| STREAM_NOT_READY | 400 | Video đang được xử lý |
| STREAM_SUBSCRIPTION_REQUIRED | 403 | Cần đăng ký Premium |
| STREAM_CONCURRENT_LIMIT | 429 | Quá nhiều thiết bị đang xem |
| STREAM_RATE_LIMITED | 429 | Quá nhiều request |
| STREAM_TOKEN_EXPIRED | 401 | Token đã hết hạn |

### 8.2 Signed URL Algorithm

```typescript
function generateSignedUrl(videoId: string, userId: string): string {
  const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
  const pullZone = process.env.BUNNY_PULL_ZONE;
  const expiry = Math.floor(Date.now() / 1000) + (4 * 3600); // 4 hours

  // Create signature
  const hashableBase = `${tokenKey}${videoId}${expiry}`;
  const token = crypto
    .createHash('sha256')
    .update(hashableBase)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8?token=${token}&expires=${expiry}`;
}
```

### 8.3 Frontend Watermark Implementation

```typescript
// VideoWatermark.tsx
function VideoWatermark({ userId, email }: WatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWatermark = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random position (changes every 30s)
      const x = Math.random() * (canvas.width - 200);
      const y = Math.random() * (canvas.height - 50);

      ctx.globalAlpha = 0.3;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(email, x, y);
      ctx.fillText(`ID: ${userId.slice(0, 8)}`, x, y + 20);
    };

    drawWatermark();
    const interval = setInterval(drawWatermark, 30000);

    return () => clearInterval(interval);
  }, [userId, email]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'difference' }}
    />
  );
}
```

### 8.4 Device ID Generation

```typescript
// Lưu trong localStorage, generate nếu chưa có
function getOrCreateDeviceId(): string {
  const key = 'ms_device_id';
  let deviceId = localStorage.getItem(key);

  if (!deviceId) {
    deviceId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, deviceId);
  }

  return deviceId;
}
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
