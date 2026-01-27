# MovieStream - HLD vs US Discrepancies Analysis

> **Document Purpose**: Ghi nhận các điểm lệch giữa High-Level Design (HLD) và User Stories (US) để phục vụ việc tạo Detailed Design.
>
> **Nguyên tắc**:
> - HLD: Thiết kế rộng, bao quát cho tương lai
> - US: Scope MVP1, chi tiết hơn, ưu tiên cao hơn cho MVP

---

## Tổng quan

| Module | HLD File | US IDs | Discrepancies | Status |
|--------|----------|--------|---------------|--------|
| Authentication | HLD-MS-AUTH | US-AUTH-01 đến 05 | 4 items | Resolved |
| Movie | HLD-MS-MOVIE | US-MOVIE-01 đến 10 | 2 items | Resolved |
| Streaming | HLD-MS-STREAMING | US-STREAM-01 đến 05 | 3 items | Resolved |
| Subscription | HLD-MS-SUBSCRIPTION | US-SUB-01 đến 07 | 3 items | Resolved |
| User Profile | HLD-MS-USER | US-USER-01 đến 05 | 2 items | Resolved |
| Review | HLD-MS-REVIEW | US-REVIEW-01 đến 07 | 1 item | Resolved |
| Admin | HLD-MS-ADMIN | US-ADMIN-01 đến 11 | 2 items | Resolved |

---

## 1. Authentication Module (HLD-MS-AUTH vs US-AUTH)

### 1.1 Confirmed Matches (Khớp)

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| Đăng ký email/password | Section 3.1 Registration Flow | US-AUTH-01 | ALIGNED |
| Đăng nhập email/password | Section 3.2 Login Flow | US-AUTH-02 | ALIGNED |
| Đăng xuất | Section 3.5 Logout Flow | US-AUTH-03 | ALIGNED |
| JWT Access + Refresh Token | Section 3.3 Token Refresh | Implicit | ALIGNED |
| Password min 8 chars | Business Rules | US-AUTH-01 notes | ALIGNED |

### 1.2 Discrepancies (Lệch)

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **Forgot Password** | Included (Section 3.4) | US-AUTH-04: Phase 2 | **Follow US - Phase 2** | Low |
| 2 | **Social Login** | Phase 2 (Out of Scope) | US-AUTH-05: Phase 2 | **ALIGNED - Phase 2** | None |
| 3 | **Rate Limiting** | 5 attempts/15 min, block 30 min | Not mentioned in US | **Follow HLD** | Security |
| 4 | **Max Devices** | 5 devices concurrent | Not mentioned in US | **Follow HLD** | Business rule |

### 1.3 HLD Details to Implement (MVP)

| Parameter | Value | Source |
|-----------|-------|--------|
| Access Token Expiry | 15 minutes | HLD Section 7.2 |
| Refresh Token Expiry | 7 days | HLD Section 7.2 |
| Password Hash | bcrypt, 12 rounds | HLD Section 7.2 |
| Session Storage | Redis | HLD Section 1.2 |
| Cookie Security | httpOnly, secure, sameSite=strict | HLD Section 7.2 |

### 1.4 Action Items

- [x] Forgot password: Move to Phase 2
- [x] Social login: Move to Phase 2
- [x] Implement rate limiting per HLD specs
- [x] Implement max 5 devices per HLD specs

---

## 2. Movie & Episode Module (HLD-MS-MOVIE vs US-MOVIE)

### 2.1 Confirmed Matches

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| List movies with pagination | Section 3.1 | US-MOVIE-01 | ALIGNED |
| Search by name | Section 3.2 | US-MOVIE-02 | ALIGNED |
| Filter by category | API Spec | US-MOVIE-03 | ALIGNED |
| Filter by tag | API Spec | US-MOVIE-04 | ALIGNED |
| Movie detail page | Section 3.3 | US-MOVIE-05 | ALIGNED |
| Episode list | API Spec | US-MOVIE-06 | ALIGNED |
| Admin CRUD movies | Admin APIs | US-MOVIE-07,08,09 | ALIGNED |
| Movie status change | Section 3.4 State Machine | US-MOVIE-10 | ALIGNED |

### 2.2 Discrepancies

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **Full-text Search** | PostgreSQL GIN index (Section 4.2) | Basic ILIKE search in US | **Follow HLD** | Performance |
| 2 | **View Count Increment** | Auto increment on detail view | Not mentioned in US | **Follow HLD** | Analytics |

### 2.3 HLD Details to Implement

| Parameter | Value | Source |
|-----------|-------|--------|
| Slug | Auto-generated, unique | HLD Section 4.2 |
| Movie Status | DRAFT, PUBLISHED, ARCHIVED | HLD Section 3.4 |
| Pagination Default | limit=20, max=50 | HLD API Spec |
| Cache TTL (List) | 5 minutes | HLD Section 7.2 |
| Cache TTL (Detail) | 10 minutes | HLD Section 7.2 |

### 2.4 Action Items

- [x] Implement full-text search with GIN index
- [x] Auto-increment view_count on movie detail access

---

## 3. Streaming Module (HLD-MS-STREAMING vs US-STREAM)

### 3.1 Confirmed Matches

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| Video streaming 1080p | Section 3.1 | US-STREAM-01 | ALIGNED |
| Continue watching | Resume logic | US-STREAM-02 | ALIGNED |
| Mobile responsive | Player UI | US-STREAM-03 | ALIGNED (FE) |
| Quality selection | 720p/1080p | US-STREAM-04 | ALIGNED |
| Speed control | 0.5x-2x | US-STREAM-05 | ALIGNED (FE) |

### 3.2 Discrepancies

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **Concurrent Streams** | Max 2 devices/user | Not explicit in US | **Follow HLD - 2 devices** | Business rule |
| 2 | **Signed URL TTL** | 4 hours | Not specified in US | **Follow HLD - 4 hours** | Security |
| 3 | **Progress Save Interval** | Every 30 seconds | US-STREAM-02: "auto-save 30s" | **ALIGNED** | None |

### 3.3 HLD Details to Implement

| Parameter | Value | Source |
|-----------|-------|--------|
| Signed URL Algorithm | SHA256 HMAC | HLD Section 8.2 |
| Signed URL TTL | 4 hours | HLD Section 1.1 |
| Concurrent Limit | 2 devices | HLD Section 1.1 |
| Session Heartbeat | 60 seconds TTL in Redis | HLD Section 4.1 |
| Resume Threshold | 5% < progress < 95% | HLD Section 3.1 |

### 3.4 Video Protection Layers (from HLD)

| Layer | Implementation | Status |
|-------|----------------|--------|
| 1. HLS Encryption | AES-128 (Bunny default) | MVP |
| 2. Token Auth | HMAC SHA256 signed URLs | MVP |
| 3. Domain Lock | Referrer whitelist | MVP |
| 4. Watermark | Dynamic canvas overlay (FE) | MVP |
| 5. Concurrent Limit | Redis session tracking | MVP |
| 6. Rate Limit | 100 requests/min/user | MVP |

### 3.5 Action Items

- [x] Implement concurrent stream check (max 2)
- [x] Implement signed URL with 4-hour TTL
- [x] Implement session heartbeat with Redis

---

## 4. Subscription & Payment Module (HLD-MS-SUBSCRIPTION vs US-SUB)

### 4.1 Confirmed Matches

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| List subscription plans | Section 5.1 | US-SUB-01 | ALIGNED |
| VNPay payment | Section 3.1 | US-SUB-02 | ALIGNED |
| Current subscription info | API Spec | US-SUB-04 | ALIGNED |
| Renew subscription | Section 3.2 | US-SUB-05 | ALIGNED |
| Payment history | API Spec | US-SUB-06 | ALIGNED |
| Upgrade subscription | Mentioned | US-SUB-07 | ALIGNED |

### 4.2 Discrepancies

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **MoMo Payment** | Included in HLD | US-SUB-03: Phase 2 | **Follow US - Phase 2** | Medium |
| 2 | **Refund Processing** | Out of Scope (manual) | Not in US | **ALIGNED** | None |
| 3 | **Recurring Payment** | Not supported (VN gateways) | Not in US | **ALIGNED** | None |

### 4.3 Subscription Plans (Confirmed)

| Plan | ID | Price | Duration | Features |
|------|----|-------|----------|----------|
| Cơ bản | plan_basic | 49,000 VNĐ | 30 days | 720p, phim thường |
| Premium | plan_premium | 79,000 VNĐ | 30 days | 1080p, phim premium, no ads |
| VIP Năm | plan_vip_year | 699,000 VNĐ | 365 days | Premium + giảm 26% |

### 4.4 HLD Details to Implement

| Parameter | Value | Source |
|-----------|-------|--------|
| Webhook Idempotency | Check payment status before processing | HLD Section 3.4 |
| Renewal Logic | Stack time if renewed before expiry | HLD Section 3.2 |
| Expiry Check | Cron job hourly | HLD Section 8.2 |
| Reminder Email | 3 days before expiry | HLD Section 1.1 |

### 4.5 Action Items

- [x] MoMo payment: Move to Phase 2
- [x] Implement VNPay with idempotent webhook
- [x] Implement subscription stacking logic

---

## 5. User Profile Module (HLD-MS-USER vs US-USER)

### 5.1 Confirmed Matches

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| Update profile | Section 3.1 | US-USER-01 | ALIGNED |
| Watch history | Section 3.2, 3.3 | US-USER-02 | ALIGNED |
| Add to favorites | Section 3.4 | US-USER-03 | ALIGNED |
| Delete history | API Spec | US-USER-04 | ALIGNED |
| Quality settings | API Spec | US-USER-05 | ALIGNED (FE preference) |

### 5.2 Discrepancies

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **History Retention** | 1 year (Section 7.2) | Not specified in US | **Follow HLD - 1 year** | Storage |
| 2 | **Continue Watching** | 5% < progress < 95% | Implicit in US-USER-02 | **Follow HLD logic** | UX |

### 5.3 HLD Details to Implement

| Parameter | Value | Source |
|-----------|-------|--------|
| Continue Watch Threshold | Show if 5% < progress < 95% | HLD Section 3.3 |
| History Limit | 1 year retention | HLD Section 7.2 |
| Favorites Limit | Unlimited | HLD Section 1.1 |
| Progress Save | Upsert on (user_id, episode_id) | HLD Section 3.2 |

### 5.4 Action Items

- [x] Implement 1-year history retention cleanup job
- [x] Implement continue watching logic with threshold

---

## 6. Review & Rating Module (HLD-MS-REVIEW vs US-REVIEW)

### 6.1 Confirmed Matches

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| View reviews | API Spec | US-REVIEW-01 | ALIGNED |
| Rating distribution | API Spec | US-REVIEW-02 | ALIGNED |
| Write review | Section 3.1 | US-REVIEW-03 | ALIGNED |
| Edit review | API Spec | US-REVIEW-04 | ALIGNED |
| Delete review | API Spec | US-REVIEW-05 | ALIGNED |
| Vote helpful | Section 3.2 | US-REVIEW-06 | ALIGNED |
| Admin moderation | API Spec | US-REVIEW-07 | ALIGNED |

### 6.2 Discrepancies

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **Subscriber-only Write** | Yes (Section 1.1) | US-REVIEW-03: "Yêu cầu subscription" | **ALIGNED** | None |

### 6.3 HLD Details to Implement

| Parameter | Value | Source |
|-----------|-------|--------|
| Rating Range | 1-5 stars | HLD Section 1.1 |
| Content Min Length | 10 characters | HLD Section 8.2 |
| Content Max Length | 2000 characters | HLD Section 8.2 |
| One Review Per Movie | Unique constraint (user_id, movie_id) | HLD Section 4.2 |

### 6.4 Action Items

- [x] All features aligned, no discrepancies to resolve

---

## 7. Admin Panel Module (HLD-MS-ADMIN vs US-ADMIN)

### 7.1 Confirmed Matches

| Feature | HLD | US | Status |
|---------|-----|-----|--------|
| Video upload | Section 3.1 | US-ADMIN-01 | ALIGNED |
| Movie management | API Spec | US-ADMIN-02 | ALIGNED |
| Episode management | API Spec | US-ADMIN-03 | ALIGNED |
| Dashboard overview | Section 3.2 | US-ADMIN-04 | ALIGNED |
| Revenue chart | API Spec | US-ADMIN-05 | ALIGNED |
| User growth chart | API Spec | US-ADMIN-06 | ALIGNED |
| User management | API Spec | US-ADMIN-07 | ALIGNED |
| User detail | API Spec | US-ADMIN-08 | ALIGNED |
| Toggle user status | API Spec | US-ADMIN-09 | ALIGNED |
| Payment history | API Spec | US-ADMIN-10 | ALIGNED |
| Manual extend | API Spec | US-ADMIN-11 | ALIGNED |

### 7.2 Discrepancies

| # | Item | HLD Value | US Value | Decision | Impact |
|---|------|-----------|----------|----------|--------|
| 1 | **Audit Logs** | Phase 2 (Out of Scope) | Not in US | **ALIGNED - Phase 2** | None |
| 2 | **Role-based Permissions** | Phase 2 (Out of Scope) | Not in US | **ALIGNED - Phase 2** | None |

### 7.3 HLD Details to Implement

| Parameter | Value | Source |
|-----------|-------|--------|
| TUS Protocol | Resumable upload | HLD Section 3.1 |
| Max File Size | 10 GB | HLD Section 7.3 |
| Supported Formats | MP4, MKV, MOV, AVI | HLD Section 7.3 |
| Concurrent Uploads | 3 | HLD Section 7.3 |
| Dashboard Cache | 5 minutes | HLD Section 3.2 |
| Bunny Webhook Status | 4 = Finished | HLD Section 5.2 |

### 7.4 Action Items

- [x] Audit logs: Move to Phase 2
- [x] Role-based permissions: Move to Phase 2

---

## Summary: MVP1 vs Phase 2

### MVP1 Implementation

| Module | Features | API Count |
|--------|----------|-----------|
| AUTH | Register, Login, Logout, Refresh, Me | 5 |
| MOVIE | List, Search, Filter, Detail, Episodes, Admin CRUD | 12 |
| STREAMING | Get URL, Heartbeat, End, Progress | 4 |
| SUBSCRIPTION | Plans, Current, Purchase (VNPay), History, Upgrade | 8 |
| USER | Profile, History, Favorites, Continue | 10 |
| REVIEW | List, Create, Update, Delete, Vote | 6 |
| ADMIN | Dashboard, Movies, Episodes, Videos, Users, Payments | 15 |
| **Total** | | **~60 APIs** |

### Phase 2 Deferred

| Feature | Module | Reason |
|---------|--------|--------|
| Forgot Password | AUTH | US-AUTH-04 |
| Social Login | AUTH | US-AUTH-05 |
| MoMo Payment | SUBSCRIPTION | US-SUB-03 |
| Audit Logs | ADMIN | Out of Scope |
| Role-based Permissions | ADMIN | Out of Scope |
| Advanced Analytics | ADMIN | Out of Scope |
| Report Review | REVIEW | Out of Scope |
| Comments on Review | REVIEW | Out of Scope |

---

## Appendix: Business Rules Confirmed

### A. Authentication
- Email unique trong hệ thống
- Password: min 8 ký tự, bao gồm chữ và số
- Session timeout: 7 ngày không active
- Rate limit: 5 lần sai/15 phút → block 30 phút
- Max 5 thiết bị đăng nhập đồng thời

### B. Streaming
- Max 2 streams đồng thời per user
- Signed URL TTL: 4 giờ
- Auto-save progress: mỗi 30 giây
- Continue watching: 5% < progress < 95%

### C. Subscription
- 1 active subscription per user
- Gia hạn trước hết hạn: cộng dồn thời gian
- Không hoàn tiền
- Webhook idempotent
- Email nhắc gia hạn: 3 ngày trước hết hạn

### D. Review
- 1 review per user per movie
- Chỉ subscriber được viết review
- Rating: 1-5 sao
- Content: 10-2000 ký tự

---

*Document Version: 1.0*
*Created: January 2026*
*Based on: MovieStream MVP.1 HLD and US-Checklist analysis*
