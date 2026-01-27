# API Task List - Authentication Module

> **Module**: AUTH
> **HLD Reference**: HLD-MS-AUTH.md
> **User Stories**: US-AUTH-01 đến US-AUTH-05

---

## API Summary

| Phase | Count | Status |
|-------|-------|--------|
| MVP | 5 | To implement |
| Phase 2 | 2 | Deferred |
| **Total** | 7 | |

---

## MVP APIs (5)

### 1. Register User
| Field | Value |
|-------|-------|
| **US** | US-AUTH-01 |
| **Method** | POST |
| **Endpoint** | `/api/v1/auth/register` |
| **Operation ID** | `registerUser` |
| **Auth** | No |
| **Description** | Đăng ký tài khoản mới với email và mật khẩu |

**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, letter + number)",
  "name": "string (required, 2-100 chars)"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "USER",
      "createdAt": "ISO datetime"
    },
    "accessToken": "string",
    "expiresIn": 900
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| AUTH_EMAIL_EXISTS | 409 | Email đã được sử dụng |
| AUTH_PASSWORD_WEAK | 400 | Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số |
| VALIDATION_ERROR | 400 | Invalid input |

**Notes**:
- Hash password với bcrypt (12 rounds)
- Gửi welcome email (async)
- Set refresh token trong httpOnly cookie
- Rate limit: 10 requests/minute/IP

---

### 2. Login User
| Field | Value |
|-------|-------|
| **US** | US-AUTH-02 |
| **Method** | POST |
| **Endpoint** | `/api/v1/auth/login` |
| **Operation ID** | `loginUser` |
| **Auth** | No |
| **Description** | Đăng nhập bằng email/password |

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional, default false)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "USER | ADMIN",
      "avatar": "string | null",
      "subscription": {
        "status": "ACTIVE | EXPIRED | null",
        "plan": "string | null",
        "expiresAt": "ISO datetime | null"
      }
    },
    "accessToken": "string",
    "expiresIn": 900
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| AUTH_INVALID_CREDENTIALS | 401 | Email hoặc mật khẩu không đúng |
| AUTH_ACCOUNT_DISABLED | 403 | Tài khoản đã bị vô hiệu hóa |
| AUTH_RATE_LIMITED | 429 | Quá nhiều yêu cầu, thử lại sau |

**Notes**:
- Rate limit: 5 attempts/15 min, block 30 min
- Check max 5 devices, reject nếu exceeded
- Store session in Redis
- Set refresh token trong httpOnly cookie
- Update last_login_at

---

### 3. Logout User
| Field | Value |
|-------|-------|
| **US** | US-AUTH-03 |
| **Method** | POST |
| **Endpoint** | `/api/v1/auth/logout` |
| **Operation ID** | `logoutUser` |
| **Auth** | Yes (JWT) |
| **Description** | Đăng xuất khỏi hệ thống |

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

**Notes**:
- Delete session from Redis
- Clear refresh token cookie
- Invalidate current refresh token

---

### 4. Refresh Token
| Field | Value |
|-------|-------|
| **US** | - (Infrastructure) |
| **Method** | POST |
| **Endpoint** | `/api/v1/auth/refresh` |
| **Operation ID** | `refreshToken` |
| **Auth** | No (uses cookie) |
| **Description** | Refresh access token using refresh token |

**Request**: Refresh token from httpOnly cookie

**Response 200**:
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "expiresIn": 900
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| AUTH_TOKEN_EXPIRED | 401 | Token đã hết hạn |
| AUTH_TOKEN_INVALID | 401 | Token không hợp lệ |

**Notes**:
- Verify refresh token signature
- Check session exists in Redis
- Generate new access token
- Update session expiry in Redis

---

### 5. Get Current User
| Field | Value |
|-------|-------|
| **US** | - (Infrastructure) |
| **Method** | GET |
| **Endpoint** | `/api/v1/auth/me` |
| **Operation ID** | `getCurrentUser` |
| **Auth** | Yes (JWT) |
| **Description** | Lấy thông tin user hiện tại |

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "USER | ADMIN",
    "avatar": "string | null",
    "subscription": {
      "status": "ACTIVE | EXPIRED | null",
      "plan": "string | null",
      "expiresAt": "ISO datetime | null"
    },
    "createdAt": "ISO datetime"
  }
}
```

---

## Phase 2 APIs (2)

### 6. Forgot Password (Phase 2)
| Field | Value |
|-------|-------|
| **US** | US-AUTH-04 |
| **Method** | POST |
| **Endpoint** | `/api/v1/auth/forgot-password` |
| **Operation ID** | `forgotPassword` |
| **Auth** | No |
| **Phase** | 2 |

---

### 7. Reset Password (Phase 2)
| Field | Value |
|-------|-------|
| **US** | US-AUTH-04 |
| **Method** | POST |
| **Endpoint** | `/api/v1/auth/reset-password` |
| **Operation ID** | `resetPassword` |
| **Auth** | No |
| **Phase** | 2 |

---

## JWT Token Structure

### Access Token Payload
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "USER | ADMIN",
  "iat": 1706356800,
  "exp": 1706357700
}
```

### Refresh Token Payload
```json
{
  "sub": "user_id",
  "sid": "session_id",
  "iat": 1706356800,
  "exp": 1706961600
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| email | Required, valid email format, max 255 chars |
| password | Required, min 8 chars, at least 1 letter and 1 number |
| name | Required, min 2 chars, max 100 chars |

---

## Security Configuration

| Parameter | Value |
|-----------|-------|
| Password hashing | bcrypt, 12 rounds |
| Access token expiry | 15 minutes |
| Refresh token expiry | 7 days |
| Token algorithm | HS256 (HMAC SHA-256) |
| Cookie security | httpOnly, secure, sameSite=strict |
| Rate limit (login) | 5 attempts/15 min, block 30 min |
| Max devices | 5 concurrent sessions |

---

## Cross-Service Integration

| Service | Integration |
|---------|-------------|
| Redis | Session storage |
| Email Service | Welcome email, password reset |
| All services | JWT validation middleware |

---

*Document Version: 1.0*
*Created: January 2026*
