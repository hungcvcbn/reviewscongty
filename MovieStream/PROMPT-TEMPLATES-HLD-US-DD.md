# Prompt Templates: HLD → US → DD Workflow (MovieStream)

> **Mục đích**: Các prompt mẫu để làm việc với HLD và US của MovieStream, tạo ra DD (Detailed Design) và API Task List.
>
> **Workflow tổng quan**:
> 1. Đọc và hiểu HLD + US
> 2. Phát hiện điểm lệch HLD vs US
> 3. Tạo file ghi nhận điểm lệch
> 4. Tạo API Task List
> 5. Phân chia luồng độc lập cho dev

---

## Phase 1: Đọc và Nạp Context

### Prompt 1.1: Đọc HLD và US files

```
Đọc HLD @{path-to-hld-file} và US Checklist @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.
```

**Ví dụ theo module:**

```
# Authentication
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-AUTH.md và các US-AUTH trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.

# Movie & Episode
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-MOVIE.md và các US-MOVIE trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.

# Streaming
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-STREAMING.md và các US-STREAM trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.

# Subscription & Payment
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-SUBSCRIPTION.md và các US-SUB trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.

# User Profile
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-USER.md và các US-USER trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.

# Review & Rating
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-REVIEW.md và các US-REVIEW trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.

# Admin Panel
Đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-ADMIN.md và các US-ADMIN trong @MovieStream/US-Checklist.md sau đó tôi sẽ đưa ra yêu cầu.
```

### Prompt 1.2: Đọc toàn bộ HLD cùng lúc

```
Đọc tất cả HLD trong @MovieStream/HLD/MVP.1/ và US Checklist @MovieStream/US-Checklist.md để có cái nhìn tổng quan về hệ thống.
```

---

## Phase 2: So sánh HLD vs US

### Prompt 2.1: Phát hiện điểm lệch

```
Giờ đọc từng phần đi:
- HLD là thiết kế rộng, bao quát cho tương lai
- US là MVP1, scope hẹp hơn, chi tiết hơn

Bạn cần phát hiện những điểm lệch nhau giữa HLD và US:
1. Những gì US có mà HLD chưa có/chưa chi tiết
2. Những gì HLD có nhưng US không cover (out of scope MVP1)
3. Những thông số nghiệp vụ cụ thể trong US mà HLD chưa định nghĩa

Nếu có thắc mắc thì hỏi.
```

### Prompt 2.2: So sánh HLD module cụ thể với US

```
Phần {module-name} đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-{MODULE}.md và xem có cần bổ sung hoặc có sai lệch gì so với các US-{MODULE} trong checklist không.
```

**Ví dụ:**
```
Phần Streaming đọc HLD @MovieStream/HLD/MVP.1/HLD-MS-STREAMING.md và xem có cần bổ sung hoặc có sai lệch gì so với các US-STREAM trong checklist không.
```

### Prompt 2.3: So sánh với Design documents

```
Đọc thêm Design document @MovieStream/Design/MovieStream-{topic}.md và kiểm tra tính nhất quán với HLD và US.
```

**Ví dụ:**
```
Đọc thêm @MovieStream/Design/MovieStream-PaymentIntegration.md và kiểm tra tính nhất quán với HLD-MS-SUBSCRIPTION và các US-SUB.
```

---

## Phase 3: Tạo File Discrepancies

### Prompt 3.1: Tạo file ghi nhận điểm lệch

```
Bạn hãy note các điểm lệch ra một file trong MovieStream/DD/ để phục vụ gen DD sau này.

File cần bao gồm:
1. Bảng so sánh HLD vs US cho từng điểm lệch
2. Quyết định giữ theo HLD hay US
3. Action Required cho từng điểm
4. Các thông số nghiệp vụ đã confirm
5. Summary: Items cần implement trong MVP1
```

### Prompt 3.2: Bổ sung chi tiết so sánh

```
Bổ sung vào file, thêm section chi tiết so sánh HLD-MS-{MODULE} vs US-{MODULE}:
- Các điểm KHỚP (Confirmed Match)
- Các điểm LỆCH cần xử lý (với Impact level)
- PENDING items cần clarify
```

---

## Phase 4: Tạo API Task List

### Prompt 4.1: Break danh sách API theo US

```
Giờ thì, dựa vào danh sách US trong @MovieStream/US-Checklist.md, hãy break danh sách task BE (đầu API, không cần request, response) theo từng US.

Yêu cầu:
1. Liệt kê từng API endpoint
2. Ghi chú Method (GET/POST/PUT/DELETE)
3. Operation ID (tên function)
4. Mô tả ngắn
5. Notes về business rules
6. Cross-service dependencies
```

### Prompt 4.2: Áp dụng API URL Convention (MovieStream)

```
Các API tuân theo convention:
- Base URL: /api/v1/
- Create và Get by ID: không cần action suffix
- Các API còn lại đều phải có action ở cuối

Ví dụ MovieStream:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/movies/:slug
- POST /api/v1/movies/:movieId/reviews
- POST /api/v1/stream/:episodeId/url
- POST /api/v1/payment/vnpay/create
```

### Prompt 4.3: Phân biệt Simple vs Advance Search

```
Advance Search thì sẽ phải là POST vì request được truyền trong body.
Simple Search (ít filter) có thể dùng GET với query params.

Ví dụ MovieStream:
- GET /api/v1/movies?category=action&page=1 (Simple)
- POST /api/v1/movies/search (Advance với nhiều filters)
```

---

## Phase 5: Phân chia luồng độc lập

### Prompt 5.1: Tạo parallel development streams

```
Thêm một phần nữa: danh sách màn hình theo luồng độc lập.

Nghĩa là 1 dev BE sẽ code full 1 luồng độc lập mà không ảnh hưởng đến dev khác, hoặc 2 dev trên 1 luồng có thể chạy song song và khi hoàn thành thì ghép với nhau.

Yêu cầu:
1. Diagram tổng quan các streams
2. Bảng phân công chi tiết (Stream, Service, APIs, Dependencies)
3. Điểm nối (Integration Points)
4. Gợi ý phân công nhân sự (1, 2, 3 devs options - solo dev project)
5. Timeline đề xuất
```

### Prompt 5.2: Phân chia theo module MovieStream

```
Đề xuất phân chia development streams cho MovieStream:

Stream 1: Core Content (Foundation)
- HLD-MS-AUTH: Authentication
- HLD-MS-USER: User Profile
- HLD-MS-MOVIE: Movie & Episode

Stream 2: Monetization
- HLD-MS-SUBSCRIPTION: Subscription & Payment

Stream 3: Engagement
- HLD-MS-STREAMING: Video Streaming
- HLD-MS-REVIEW: Review & Rating

Stream 4: Administration
- HLD-MS-ADMIN: Admin Panel
```

---

## Phase 6: Clarify Questions

### Prompt 6.1: Hỏi về scope MVP1

```
{Feature-name} có cần implement trong MVP1 không?
- Nếu có: cần define chi tiết (format, rules, etc.)
- Nếu không: đánh dấu out of scope, move to Phase 2
```

**Ví dụ MovieStream:**
```
MoMo Payment có cần implement trong MVP1 không?
- Nếu có: cần define chi tiết integration
- Nếu không: đánh dấu out of scope, move to Phase 2 (chỉ VNPay trong MVP1)
```

### Prompt 6.2: Hỏi về business rules

```
{Aspect} trong US là {value-in-us}, trong HLD là {value-in-hld}.
Giữ theo bên nào? Hay cần confirm lại với business?
```

**Ví dụ MovieStream:**
```
Concurrent stream limit trong US là 2 devices, trong HLD là "max 2 devices/user".
Confirm giữ nguyên 2 devices cho tất cả subscription plans?
```

### Prompt 6.3: Hỏi về Video Protection

```
US có đề cập đến video protection với các layers:
1. HLS Encryption
2. Signed URLs (TTL?)
3. Domain Restriction
4. Dynamic Watermark
5. Concurrent Limit
6. Rate Limiting

Cần confirm:
- Signed URL TTL: 4 giờ như trong HLD?
- Watermark: User ID only hay cần thêm timestamp?
- Rate limiting: bao nhiêu requests/minute?
```

---

## Quick Reference: Câu trả lời mẫu

### Khi được hỏi về điểm lệch:

```
Giữ nguyên theo US. Note điểm lệch vào file discrepancies.
```

```
Giữ theo HLD. US cần được update để align.
```

```
Cái này là UI only, chưa có tính năng BE trong MVP1.
```

```
Out of scope cho MVP1. Move to Phase 2.
```

### Khi được hỏi về API convention:

```
Các API trừ Create và Get by ID sẽ chỉ cần /{id}.
Các API còn lại đều phải có action ở cuối.
```

```
Advance Search dùng POST với request body.
Simple Search dùng GET với query params.
```

### Khi được hỏi về subscription:

```
MVP1 chỉ implement VNPay. MoMo để Phase 2.
```

```
3 gói subscription: Basic (49K), Premium (79K), VIP Year (699K).
```

---

## Output Files Structure (MovieStream)

```
MovieStream/
├── Design/                              # Design Documents
├── HLD/MVP.1/                           # High-Level Design
├── DD/                                  # Detailed Design (output)
│   ├── HLD-US-DISCREPANCIES.md         # Điểm lệch HLD vs US
│   ├── API-TASK-LIST.md                # Danh sách API theo US
│   ├── API-TASK-LIST-AUTH.md           # APIs cho Authentication
│   ├── API-TASK-LIST-MOVIE.md          # APIs cho Movie/Episode
│   ├── API-TASK-LIST-STREAMING.md      # APIs cho Streaming
│   ├── API-TASK-LIST-SUBSCRIPTION.md   # APIs cho Subscription
│   ├── API-TASK-LIST-USER.md           # APIs cho User Profile
│   ├── API-TASK-LIST-REVIEW.md         # APIs cho Review
│   ├── API-TASK-LIST-ADMIN.md          # APIs cho Admin
│   └── DEV-STREAMS.md                  # Phân chia luồng dev
├── US-Checklist.md                      # User Stories
├── README.md                            # Project overview
└── PROMPT-TEMPLATES-HLD-US-DD.md       # File này
```

---

## Checklist: Workflow hoàn chỉnh

- [ ] **Phase 1**: Đọc HLD và US Checklist
- [ ] **Phase 2**: So sánh, phát hiện điểm lệch
- [ ] **Phase 3**: Tạo file HLD-US-DISCREPANCIES.md
- [ ] **Phase 4**: Tạo API-TASK-LIST.md với convention chuẩn
- [ ] **Phase 5**: Phân chia luồng độc lập cho dev team
- [ ] **Phase 6**: Clarify các PENDING items với business

---

## API URL Pattern Quick Reference (MovieStream)

| Operation | Pattern | Example |
|-----------|---------|---------|
| **Register** | `POST /api/v1/auth/register` | User registration |
| **Login** | `POST /api/v1/auth/login` | User authentication |
| **Logout** | `POST /api/v1/auth/logout` | End session |
| **Refresh Token** | `POST /api/v1/auth/refresh` | Refresh JWT |
| **Get Profile** | `GET /api/v1/user/profile` | Current user profile |
| **Update Profile** | `PUT /api/v1/user/profile` | Update user info |
| **List Movies** | `GET /api/v1/movies` | Movie listing with pagination |
| **Get Movie** | `GET /api/v1/movies/:slug` | Movie detail by slug |
| **Search Movies** | `POST /api/v1/movies/search` | Advanced search |
| **Get Episodes** | `GET /api/v1/movies/:movieId/episodes` | List episodes |
| **Get Stream URL** | `POST /api/v1/stream/:episodeId/url` | Signed streaming URL |
| **Save Progress** | `POST /api/v1/stream/:episodeId/progress` | Save watch progress |
| **List Plans** | `GET /api/v1/subscription/plans` | Available plans |
| **Create Payment** | `POST /api/v1/payment/vnpay/create` | VNPay checkout |
| **Payment Callback** | `GET /api/v1/payment/vnpay/callback` | VNPay return URL |
| **Payment IPN** | `POST /api/v1/webhook/vnpay` | VNPay webhook |
| **Get Reviews** | `GET /api/v1/movies/:movieId/reviews` | Movie reviews |
| **Create Review** | `POST /api/v1/movies/:movieId/reviews` | Submit review |
| **Vote Review** | `POST /api/v1/reviews/:id/vote` | Vote helpful |
| **Admin Dashboard** | `GET /api/v1/admin/dashboard` | Admin stats |
| **Upload Video** | `POST /api/v1/admin/videos/create` | Create video entry |
| **Bunny Webhook** | `POST /api/v1/webhook/bunny` | Video encoding webhook |

---

## MovieStream-Specific Business Rules

### Subscription Tiers
| Plan | Price | Features |
|------|-------|----------|
| Basic | 49,000 VNĐ/tháng | 720p, 1 device |
| Premium | 79,000 VNĐ/tháng | 1080p, 2 devices |
| VIP Year | 699,000 VNĐ/năm | 1080p, 2 devices, ưu đãi |

### Video Protection Layers
1. **HLS Encryption**: AES-128 (Bunny.net built-in)
2. **Signed URLs**: Token với TTL 4 giờ
3. **Domain Restriction**: Referrer whitelist
4. **Dynamic Watermark**: User ID overlay
5. **Concurrent Limit**: Max 2 devices/user
6. **Rate Limiting**: Request throttling

### Review Rules
- Mỗi user chỉ được 1 review per movie
- Chỉ subscriber mới được viết review
- Rating từ 1-5 sao
- Review content tối thiểu 10 ký tự, tối đa 2000 ký tự

---

*Template created: January 2026*
*Based on: MovieStream MVP1 HLD/US analysis workflow*
