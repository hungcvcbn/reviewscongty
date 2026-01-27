# HLD - MS-AUTH (Authentication & Authorization)

## 1. Context (Bối cảnh)

### 1.1 Business Context (Bối cảnh kinh doanh)

MovieStream cần hệ thống xác thực người dùng để:
- Quản lý đăng ký/đăng nhập người dùng
- Phân biệt các loại người dùng (Guest, User, Subscriber, Admin)
- Bảo vệ nội dung premium chỉ cho subscriber
- Hỗ trợ "Remember me" và đăng nhập trên nhiều thiết bị

**User Stories:**

| ID | As a | I want to | So that |
|----|------|-----------|---------|
| US-01 | Guest | đăng ký tài khoản | tôi có thể lưu lịch sử xem và yêu thích |
| US-02 | Guest | đăng nhập | tôi có thể truy cập tài khoản |
| US-03 | User | đăng xuất | tôi có thể bảo vệ tài khoản |
| US-04 | User | reset password | tôi có thể lấy lại quyền truy cập khi quên mật khẩu |
| US-05 | User | đăng nhập bằng Google/Facebook | tôi đăng nhập nhanh hơn |
| US-06 | Admin | quản lý users | tôi có thể block/unblock users |

**Business Rules:**
- Email phải unique trong hệ thống
- Password tối thiểu 8 ký tự, bao gồm chữ và số
- Session timeout sau 7 ngày không active
- Tối đa 5 lần đăng nhập sai trong 15 phút → block 30 phút
- Một user có thể đăng nhập trên tối đa 5 thiết bị

### 1.2 System Context (Bối cảnh hệ thống)

**Services tham gia:**

| Service | Tech Stack | Vai trò |
|---------|------------|---------|
| ms-auth | Node.js + Express | Xử lý authentication logic |
| ms-api | Node.js + Express | API Gateway, validate tokens |
| PostgreSQL | PostgreSQL 15 | Lưu trữ users, sessions |
| Redis | Redis 7 | Cache sessions, rate limiting |

**External Services:**
- Google OAuth 2.0 (optional - Phase 2)
- Facebook Login (optional - Phase 2)
- SendGrid/Nodemailer (password reset emails)

### 1.3 Out Of Scope (Phạm vi ngoài)

- OAuth social login (Phase 2)
- Two-factor authentication (Phase 2)
- Single Sign-On (SSO)
- Biometric authentication
- User roles beyond Guest/User/Subscriber/Admin

### 1.4 Actors (Các vai trò)

| Actor | Mô tả | Quyền hạn |
|-------|-------|-----------|
| **Guest** | Chưa đăng nhập | Xem trailer, 2 tập đầu miễn phí, tìm kiếm |
| **User** | Đã đăng nhập, chưa subscribe | + Profile, favorites, watch history |
| **Subscriber** | Có subscription active | + Xem tất cả nội dung premium |
| **Admin** | Quản trị viên | Full access, quản lý users/content |

---

## 2. Context Diagram

```mermaid
C4Context
    title System Context - Authentication Service

    Person(guest, "Guest", "Người dùng chưa đăng nhập")
    Person(user, "User", "Người dùng đã đăng nhập")
    Person(admin, "Admin", "Quản trị viên")

    System(moviestream, "MovieStream Platform", "Nền tảng xem phim")

    System_Ext(email, "Email Service", "SendGrid/SMTP")
    System_Ext(google, "Google OAuth", "Social login")

    Rel(guest, moviestream, "Đăng ký, Đăng nhập")
    Rel(user, moviestream, "Xem phim, Quản lý profile")
    Rel(admin, moviestream, "Quản lý users")
    Rel(moviestream, email, "Gửi email xác nhận, reset password")
    Rel(moviestream, google, "OAuth authentication")
```

### Component Diagram

```mermaid
C4Component
    title Component Diagram - Authentication

    Container_Boundary(frontend, "Frontend (Next.js)") {
        Component(loginPage, "Login Page", "React", "Form đăng nhập")
        Component(registerPage, "Register Page", "React", "Form đăng ký")
        Component(authProvider, "Auth Provider", "React Context", "Quản lý auth state")
    }

    Container_Boundary(backend, "Backend (Node.js)") {
        Component(authController, "Auth Controller", "Express", "Handle auth requests")
        Component(authService, "Auth Service", "Service", "Business logic")
        Component(jwtService, "JWT Service", "Service", "Token management")
        Component(passwordService, "Password Service", "Service", "Hashing, validation")
    }

    Container_Boundary(data, "Data Layer") {
        ComponentDb(userDb, "Users Table", "PostgreSQL", "User data")
        ComponentDb(sessionDb, "Sessions", "Redis", "Active sessions")
    }

    Rel(loginPage, authController, "POST /auth/login")
    Rel(authController, authService, "Authenticate")
    Rel(authService, jwtService, "Generate tokens")
    Rel(authService, passwordService, "Verify password")
    Rel(authService, userDb, "Query user")
    Rel(authService, sessionDb, "Store session")
```

---

## 3. Core Business Workflow

### 3.1 Registration Flow (Đăng ký)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant API as Auth API
    participant DB as PostgreSQL
    participant Email as Email Service

    U->>FE: Nhập email, password, name
    FE->>FE: Validate input (client-side)
    FE->>API: POST /auth/register

    API->>API: Validate input (server-side)
    API->>DB: Check email exists?

    alt Email đã tồn tại
        DB-->>API: Email found
        API-->>FE: 409 Conflict
        FE-->>U: "Email đã được sử dụng"
    else Email chưa tồn tại
        DB-->>API: Email not found
        API->>API: Hash password (bcrypt)
        API->>DB: INSERT user
        DB-->>API: User created
        API->>API: Generate JWT tokens
        API->>Email: Send welcome email
        API-->>FE: 201 Created + tokens
        FE->>FE: Store tokens
        FE-->>U: Redirect to home
    end
```

### 3.2 Login Flow (Đăng nhập)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant API as Auth API
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    U->>FE: Nhập email, password
    FE->>API: POST /auth/login

    API->>Redis: Check rate limit
    alt Exceeded rate limit
        Redis-->>API: Blocked
        API-->>FE: 429 Too Many Requests
        FE-->>U: "Thử lại sau 30 phút"
    else Within limit
        Redis-->>API: OK
        API->>DB: Find user by email

        alt User not found
            DB-->>API: Not found
            API->>Redis: Increment failed attempts
            API-->>FE: 401 Unauthorized
            FE-->>U: "Email hoặc mật khẩu không đúng"
        else User found
            DB-->>API: User data
            API->>API: Verify password (bcrypt)

            alt Password incorrect
                API->>Redis: Increment failed attempts
                API-->>FE: 401 Unauthorized
                FE-->>U: "Email hoặc mật khẩu không đúng"
            else Password correct
                API->>API: Generate access token (15min)
                API->>API: Generate refresh token (7 days)
                API->>Redis: Store session
                API->>DB: Update last_login_at
                API-->>FE: 200 OK + tokens + user
                FE->>FE: Store tokens (httpOnly cookie)
                FE-->>U: Redirect to home
            end
        end
    end
```

### 3.3 Token Refresh Flow

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend
    participant API as Auth API
    participant Redis as Redis

    FE->>API: POST /auth/refresh
    Note over FE,API: refresh_token in httpOnly cookie

    API->>API: Verify refresh token signature

    alt Token invalid/expired
        API-->>FE: 401 Unauthorized
        FE->>FE: Clear tokens
        FE-->>FE: Redirect to login
    else Token valid
        API->>Redis: Check session exists

        alt Session revoked
            Redis-->>API: Not found
            API-->>FE: 401 Unauthorized
        else Session valid
            Redis-->>API: Session data
            API->>API: Generate new access token
            API->>Redis: Update session expiry
            API-->>FE: 200 OK + new access token
            FE->>FE: Update stored token
        end
    end
```

### 3.4 Password Reset Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant API as Auth API
    participant DB as PostgreSQL
    participant Email as Email Service

    U->>FE: Nhập email
    FE->>API: POST /auth/forgot-password

    API->>DB: Find user by email

    Note over API: Luôn trả về success để không leak thông tin

    alt User exists
        API->>API: Generate reset token (1 hour expiry)
        API->>DB: Store reset token hash
        API->>Email: Send reset email with link
    end

    API-->>FE: 200 OK "Check your email"
    FE-->>U: "Kiểm tra email của bạn"

    U->>FE: Click link trong email
    FE->>API: POST /auth/reset-password
    Note over FE,API: token + new password

    API->>DB: Find valid reset token

    alt Token invalid/expired
        API-->>FE: 400 Bad Request
        FE-->>U: "Link đã hết hạn"
    else Token valid
        API->>API: Hash new password
        API->>DB: Update password, clear token
        API->>DB: Invalidate all sessions
        API-->>FE: 200 OK
        FE-->>U: "Mật khẩu đã được đổi"
    end
```

### 3.5 Logout Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant API as Auth API
    participant Redis as Redis

    U->>FE: Click Đăng xuất
    FE->>API: POST /auth/logout
    Note over FE,API: access_token in header

    API->>API: Extract user_id from token
    API->>Redis: Delete session
    API-->>FE: 200 OK

    FE->>FE: Clear stored tokens
    FE-->>U: Redirect to home
```

---

## 4. Data Model

### 4.1 ERD

```mermaid
erDiagram
    users ||--o{ sessions : "has"
    users ||--o{ password_reset_tokens : "has"

    users {
        string id PK "CUID"
        string email UK "NOT NULL"
        string password_hash "NOT NULL"
        string name "NOT NULL"
        string avatar "nullable"
        enum role "USER, ADMIN"
        boolean is_active "DEFAULT true"
        timestamp email_verified_at "nullable"
        timestamp last_login_at "nullable"
        timestamp created_at
        timestamp updated_at
    }

    sessions {
        string id PK "CUID"
        string user_id FK
        string refresh_token_hash UK
        string device_info "nullable"
        string ip_address "nullable"
        timestamp expires_at
        timestamp created_at
    }

    password_reset_tokens {
        string id PK "CUID"
        string user_id FK
        string token_hash UK
        timestamp expires_at
        boolean used "DEFAULT false"
        timestamp created_at
    }
```

### 4.2 Table Definitions

#### users

```sql
CREATE TABLE users (
    id VARCHAR(30) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(30) | PK | CUID generated |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| name | VARCHAR(100) | NOT NULL | Display name |
| avatar | VARCHAR(500) | nullable | Avatar URL |
| role | VARCHAR(20) | NOT NULL, CHECK | USER or ADMIN |
| is_active | BOOLEAN | DEFAULT true | Soft delete |
| email_verified_at | TIMESTAMP | nullable | Email verification time |
| last_login_at | TIMESTAMP | nullable | Last login time |
| created_at | TIMESTAMP | DEFAULT NOW() | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Updated timestamp |

#### sessions

```sql
CREATE TABLE sessions (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info VARCHAR(500),
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(30) | PK | CUID generated |
| user_id | VARCHAR(30) | FK → users(id) | Owner user |
| refresh_token_hash | VARCHAR(255) | UNIQUE | SHA256 of refresh token |
| device_info | VARCHAR(500) | nullable | User agent string |
| ip_address | VARCHAR(45) | nullable | Client IP |
| expires_at | TIMESTAMP | NOT NULL | Session expiry |
| created_at | TIMESTAMP | DEFAULT NOW() | Created timestamp |

#### password_reset_tokens

```sql
CREATE TABLE password_reset_tokens (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);
```

---

## 5. API Specification

### 5.1 REST Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Đăng ký tài khoản |
| POST | /api/auth/login | No | Đăng nhập |
| POST | /api/auth/logout | Yes | Đăng xuất |
| POST | /api/auth/refresh | No | Refresh access token |
| POST | /api/auth/forgot-password | No | Request reset password |
| POST | /api/auth/reset-password | No | Reset password với token |
| GET | /api/auth/me | Yes | Lấy thông tin user hiện tại |

### 5.2 Request/Response Examples

#### POST /api/auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "Nguyễn Văn A"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "role": "USER",
      "createdAt": "2026-01-27T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_EMAIL_EXISTS",
    "message": "Email đã được sử dụng"
  }
}
```

#### POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "role": "USER",
      "avatar": null,
      "subscription": {
        "status": "ACTIVE",
        "plan": "PREMIUM",
        "expiresAt": "2026-02-27T10:00:00Z"
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Note:** `refreshToken` được set trong httpOnly cookie, không trả về trong response body.

#### POST /api/auth/refresh

**Request:** (refresh_token từ cookie)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

#### POST /api/auth/forgot-password

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Nếu email tồn tại, bạn sẽ nhận được link reset password"
}
```

#### POST /api/auth/reset-password

**Request:**
```json
{
  "token": "abc123def456",
  "password": "NewSecurePass456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mật khẩu đã được đổi thành công"
}
```

#### GET /api/auth/me

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "role": "USER",
    "avatar": null,
    "subscription": {
      "status": "ACTIVE",
      "plan": "PREMIUM",
      "expiresAt": "2026-02-27T10:00:00Z"
    },
    "createdAt": "2026-01-27T10:00:00Z"
  }
}
```

---

## 6. Integration Points

### 6.1 Upstream Dependencies
- Không có (Auth là service foundation)

### 6.2 Downstream Services (sử dụng Auth)

| Service | Integration | Purpose |
|---------|-------------|---------|
| ms-movie | JWT validation | Authorize movie access |
| ms-streaming | JWT validation | Authorize video streaming |
| ms-subscription | User ID | Associate subscription |
| ms-review | User ID | Associate reviews |
| ms-admin | JWT + Role check | Admin authorization |

### 6.3 External Integrations

| Service | Purpose | Phase |
|---------|---------|-------|
| SendGrid/SMTP | Email notifications | MVP |
| Google OAuth | Social login | Phase 2 |
| Facebook Login | Social login | Phase 2 |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target |
|--------|--------|
| Login latency (P95) | < 200ms |
| Token validation latency | < 10ms |
| Registration latency (P95) | < 500ms |
| Concurrent users | 1,000 |

### 7.2 Security

| Measure | Implementation |
|---------|----------------|
| Password hashing | bcrypt, 12 rounds |
| Token algorithm | HS256 (HMAC SHA-256) |
| Access token expiry | 15 minutes |
| Refresh token expiry | 7 days |
| Rate limiting | 5 login attempts / 15 min |
| Brute force protection | Block 30 min after limit |
| HTTPS | Required for all endpoints |
| Cookie security | httpOnly, secure, sameSite=strict |

### 7.3 Scalability

- Stateless authentication (JWT)
- Session stored in Redis (horizontal scaling)
- Database connection pooling

---

## 8. Appendix

### 8.1 Error Codes

| Code | HTTP Status | Message |
|------|-------------|---------|
| AUTH_EMAIL_EXISTS | 409 | Email đã được sử dụng |
| AUTH_INVALID_CREDENTIALS | 401 | Email hoặc mật khẩu không đúng |
| AUTH_ACCOUNT_DISABLED | 403 | Tài khoản đã bị vô hiệu hóa |
| AUTH_TOKEN_EXPIRED | 401 | Token đã hết hạn |
| AUTH_TOKEN_INVALID | 401 | Token không hợp lệ |
| AUTH_RATE_LIMITED | 429 | Quá nhiều yêu cầu, thử lại sau |
| AUTH_RESET_TOKEN_INVALID | 400 | Link reset password không hợp lệ hoặc đã hết hạn |
| AUTH_PASSWORD_WEAK | 400 | Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số |

### 8.2 Validation Rules

| Field | Rules |
|-------|-------|
| email | Required, valid email format, max 255 chars |
| password | Required, min 8 chars, at least 1 letter and 1 number |
| name | Required, min 2 chars, max 100 chars |

### 8.3 JWT Token Structure

**Access Token Payload:**
```json
{
  "sub": "clx1234567890",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1706356800,
  "exp": 1706357700
}
```

**Refresh Token Payload:**
```json
{
  "sub": "clx1234567890",
  "sid": "session_id_here",
  "iat": 1706356800,
  "exp": 1706961600
}
```

### 8.4 Email Templates

**Welcome Email:**
```
Subject: Chào mừng đến với MovieStream!

Xin chào {name},

Cảm ơn bạn đã đăng ký tài khoản MovieStream.

Bắt đầu khám phá những bộ phim hay nhất ngay hôm nay!

Trân trọng,
Team MovieStream
```

**Password Reset Email:**
```
Subject: Reset mật khẩu MovieStream

Xin chào {name},

Bạn đã yêu cầu reset mật khẩu. Click vào link bên dưới để đặt mật khẩu mới:

{reset_link}

Link này sẽ hết hạn sau 1 giờ.

Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Team MovieStream
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
