# TỔNG QUAN - USER STORIES CHO HỆ THỐNG REVIEW CÔNG TY

> **Hệ thống:** Review Company System
> **Phiên bản:** 1.0
> **Ngày tạo:** 2025-01-26

---

## 1. Giới thiệu

### 1.1. Bối cảnh

Tài liệu này mô tả các User Stories cho hệ thống **Review Công ty** - một nền tảng cho phép người dùng tìm kiếm, xem thông tin, đánh giá và bình luận về các công ty. Hệ thống này hỗ trợ:

- **Admin/Manager** tạo và quản lý thông tin công ty
- **Regular Users** tìm kiếm, xem công ty, tạo review và đánh giá
- **Company Owners** quản lý thông tin công ty và phản hồi review

### 1.2. Mô hình hoạt động

```
ADMIN/MANAGER                  REGULAR USER              COMPANY OWNER
       │                            │                         │
       ├─ 1. Tạo công ty            │                         │
       ├─ 2. Duyệt công ty ─────────┤                         │
       │                            ├─ 3. Tìm kiếm công ty    │
       │                            ├─ 4. Xem chi tiết công ty│
       │                            ├─ 5. Tạo review ─────────┤
       │                            │                         ├─ 6. Phản hồi review
       │                            ├─ 7. Bình luận ──────────┤
       │                            │                         │
       └─ 8. Quản lý công ty        └─ 9. Quản lý review      └─ 10. Quản lý công ty
```

---

## 2. Quy trình nghiệp vụ tổng quan

### 2.1. Sơ đồ trạng thái công ty

```
[Admin tạo]                [Admin duyệt]
    ↓                            ↓
PENDING ───────────────> APPROVED ──[Kích hoạt]──> ACTIVE
    │                            │                          │
    └──[Từ chối]──> DELETED      │                          │
                                 │                          │
                          [Tạm dừng]◄────────────────────────┘
                                 ↓
                          INACTIVE
```

### 2.2. Sơ đồ trạng thái review

```
                    [User tạo]
                       ↓
                 DRAFT (tùy chọn)
                       ↓
              [Publish]         [Lưu nháp]
                       ↓                ↓
              PUBLISHED         DRAFT (tiếp tục chỉnh sửa)
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    [Chỉnh sửa]   [User xóa]   [Admin xóa]
         │             │             │
         ↓             ↓             ↓
      EDITED        DELETED       DELETED
```

---

## 3. Danh mục User Stories

### Nhóm A: Quản lý công ty (6 US)
📄 File: `01-Quan-ly-cong-ty/`

| Mã số | Tên User Story | Vai trò | Độ ưu tiên |
|-------|----------------|---------|------------|
| US-REVIEW-001 | Tạo công ty mới | Admin/Manager | Cao |
| US-REVIEW-002 | Xem danh sách công ty | Tất cả users | Cao |
| US-REVIEW-003 | Xem chi tiết công ty | Tất cả users | Cao |
| US-REVIEW-004 | Chỉnh sửa công ty | Admin/Manager/Company Owner | Trung bình |
| US-REVIEW-005 | Xóa công ty | Admin | Thấp |
| US-REVIEW-006 | Duyệt công ty | Admin | Cao |

### Nhóm B: Tìm kiếm và liệt kê (2 US)
📄 File: `02-Tim-kiem-va-liet-ke/`

| Mã số | Tên User Story | Vai trò | Độ ưu tiên |
|-------|----------------|---------|------------|
| US-REVIEW-007 | Tìm kiếm công ty | Tất cả users | Cao |
| US-REVIEW-008 | Lọc và sắp xếp công ty | Tất cả users | Trung bình |

### Nhóm C: Review và đánh giá (5 US)
📄 File: `03-Review-va-danh-gia/`

| Mã số | Tên User Story | Vai trò | Độ ưu tiên |
|-------|----------------|---------|------------|
| US-REVIEW-009 | Tạo review mới | Authenticated User | Cao |
| US-REVIEW-010 | Xem danh sách review của công ty | Tất cả users | Cao |
| US-REVIEW-011 | Chỉnh sửa review | Review Owner | Trung bình |
| US-REVIEW-012 | Xóa review | Review Owner/Admin | Trung bình |
| US-REVIEW-013 | Đánh giá theo hạng mục | Authenticated User | Cao |

### Nhóm D: Bình luận (3 US)
📄 File: `04-Binh-luan/`

| Mã số | Tên User Story | Vai trò | Độ ưu tiên |
|-------|----------------|---------|------------|
| US-REVIEW-014 | Bình luận trên review | Authenticated User | Cao |
| US-REVIEW-015 | Chỉnh sửa bình luận | Comment Owner | Thấp |
| US-REVIEW-016 | Phản hồi từ công ty | Company Owner | Trung bình |

---

## 4. Bảng thuật ngữ

### 4.1. Thuật ngữ nghiệp vụ

| Thuật ngữ tiếng Việt | Thuật ngữ tiếng Anh | Định nghĩa |
|---------------------|---------------------|------------|
| Công ty | Company | Tổ chức/công ty được review trên hệ thống |
| Review | Review | Bài đánh giá của người dùng về công ty |
| Đánh giá | Rating | Điểm số đánh giá (1-5 sao) |
| Đánh giá tổng thể | Overall Rating | Điểm đánh giá tổng quát về công ty (1-5 sao) |
| Đánh giá theo hạng mục | Category Rating | Điểm đánh giá theo từng tiêu chí cụ thể |
| Bình luận | Comment | Nhận xét của người dùng trên review |
| Phản hồi công ty | Company Response | Phản hồi chính thức từ công ty đối với review |
| Môi trường làm việc | Work Environment | Điều kiện và không gian làm việc |
| Lương thưởng | Salary & Benefits | Chế độ lương và phúc lợi |
| Văn hóa công ty | Company Culture | Văn hóa và giá trị của công ty |
| Cơ hội phát triển | Growth Opportunities | Cơ hội thăng tiến và phát triển nghề nghiệp |
| Duyệt công ty | Approve Company | Quá trình admin xác nhận công ty được hiển thị công khai |

### 4.2. Trạng thái công ty

| Trạng thái | Mã trạng thái | Mô tả |
|-----------|---------------|-------|
| Chờ duyệt | PENDING | Công ty mới tạo, chờ admin duyệt |
| Đã duyệt | APPROVED | Công ty đã được duyệt, chưa kích hoạt |
| Đang hoạt động | ACTIVE | Công ty đang hiển thị công khai |
| Tạm dừng | INACTIVE | Công ty tạm dừng hoạt động |
| Đã xóa | DELETED | Công ty đã bị xóa (soft delete) |

### 4.3. Trạng thái review

| Trạng thái | Mã trạng thái | Mô tả |
|-----------|---------------|-------|
| Bản nháp | DRAFT | Review đang được soạn, chưa công bố |
| Đã công bố | PUBLISHED | Review đã được công bố công khai |
| Đã chỉnh sửa | EDITED | Review đã được chỉnh sửa sau khi công bố |
| Đã xóa | DELETED | Review đã bị xóa (soft delete) |

### 4.4. Vai trò người dùng

| Vai trò tiếng Việt | Vai trò tiếng Anh | Mô tả |
|-------------------|-------------------|-------|
| Quản trị viên | Admin | Người có toàn quyền quản lý hệ thống |
| Quản lý | Manager | Người có quyền tạo và quản lý công ty được assign |
| Người dùng | Regular User | Người dùng thông thường, có thể xem và review |
| Chủ công ty | Company Owner | Người sở hữu/quản lý công ty trên hệ thống |

### 4.5. Thuật ngữ giao diện

| Thuật ngữ tiếng Việt | Thuật ngữ tiếng Anh | Mô tả |
|---------------------|---------------------|-------|
| Cửa sổ xác nhận | Popup/Modal | Hộp thoại yêu cầu xác nhận hành động |
| Danh sách chọn | Dropdown | Menu thả xuống để chọn giá trị |
| Lọc | Filter | Chức năng lọc dữ liệu theo tiêu chí |
| Tìm kiếm | Search | Chức năng tìm kiếm bằng từ khóa |
| Phân trang | Pagination | Chia dữ liệu thành nhiều trang |
| Nhãn trạng thái | Badge | Nhãn hiển thị trạng thái |
| Nút hành động | Button | Nút bấm để thực hiện hành động |
| Thông báo | Notification | Tin nhắn thông báo cho người dùng |
| Kiểm tra hợp lệ | Validation | Kiểm tra tính đúng đắn của dữ liệu |
| Xếp hạng sao | Star Rating | Hệ thống đánh giá bằng sao (1-5) |

---

## 5. Các chân dung người dùng

### 5.1. Quản trị viên (Admin)

**Bối cảnh:**
- Quản lý toàn bộ hệ thống review công ty
- Có trách nhiệm duyệt công ty và kiểm duyệt nội dung
- Cần đảm bảo chất lượng thông tin trên hệ thống

**Mục tiêu:**
- Duyệt công ty mới một cách nhanh chóng
- Quản lý và kiểm soát nội dung review/bình luận
- Xử lý các vi phạm và nội dung không phù hợp

**Thách thức:**
- Đánh giá tính hợp lệ của thông tin công ty
- Xử lý khiếu nại và tranh chấp
- Duy trì chất lượng hệ thống

### 5.2. Quản lý (Manager)

**Bối cảnh:**
- Tạo và quản lý các công ty được assign
- Hỗ trợ admin trong việc quản lý hệ thống
- Có thể duyệt công ty (nếu được phân quyền)

**Mục tiêu:**
- Tạo thông tin công ty đầy đủ và chính xác
- Quản lý nhiều công ty cùng lúc
- Hỗ trợ người dùng và công ty

**Thách thức:**
- Đảm bảo thông tin công ty chính xác
- Xử lý yêu cầu cập nhật thông tin

### 5.3. Người dùng (Regular User)

**Bối cảnh:**
- Đang tìm kiếm thông tin về công ty để quyết định
- Muốn chia sẻ kinh nghiệm làm việc tại công ty
- Cần thông tin đáng tin cậy về môi trường làm việc

**Mục tiêu:**
- Tìm kiếm công ty phù hợp một cách dễ dàng
- Đọc review và đánh giá từ người khác
- Chia sẻ kinh nghiệm và giúp đỡ người khác

**Thách thức:**
- Tìm được thông tin đáng tin cậy
- Viết review hữu ích và chính xác
- Đánh giá công ty một cách công bằng

### 5.4. Chủ công ty (Company Owner)

**Bối cảnh:**
- Quản lý thương hiệu và hình ảnh công ty trên hệ thống
- Muốn phản hồi review một cách chuyên nghiệp
- Cần theo dõi và cải thiện đánh giá của công ty

**Mục tiêu:**
- Quản lý thông tin công ty chính xác
- Phản hồi review một cách tích cực và chuyên nghiệp
- Cải thiện rating và hình ảnh công ty

**Thách thức:**
- Xử lý review tiêu cực
- Duy trì hình ảnh tích cực
- Cải thiện trải nghiệm làm việc dựa trên feedback

---

## 6. Phụ thuộc hệ thống

### 6.1. Dịch vụ backend

| Dịch vụ | Công nghệ | Vai trò |
|---------|-----------|---------|
| review-company-service | Java/SpringBoot hoặc Node.js/Next.js | Quản lý công ty, review, rating, bình luận |
| auth-service | Java/SpringBoot hoặc Node.js | Xác thực và phân quyền người dùng |
| notification-service | Java/SpringBoot hoặc Node.js | Gửi thông báo cho người dùng |

### 6.2. Ứng dụng frontend

| Ứng dụng | Công nghệ | Người dùng |
|----------|-----------|------------|
| review-company-web | Next.js/React | Tất cả người dùng (Admin, Manager, User, Company Owner) |

### 6.3. Hạ tầng kỹ thuật

| Thành phần | Công nghệ | Mục đích |
|-----------|-----------|----------|
| PostgreSQL | PostgreSQL | Lưu trữ dữ liệu công ty, review, rating, bình luận |
| Redis | Redis | Cache dữ liệu và session |
| Kafka (tùy chọn) | Apache Kafka | Truyền sự kiện nếu có microservices |

---

## 7. Chỉ số đo lường thành công

### 7.1. Chỉ số nghiệp vụ

| Chỉ số | Mục tiêu | Đo lường |
|--------|----------|----------|
| Số công ty được tạo | Tăng 10%/tháng | Đếm số công ty mới |
| Tỷ lệ công ty được duyệt | >= 90% | Số APPROVED / Tổng số PENDING |
| Số review được tạo | Tăng 20%/tháng | Đếm số review mới |
| Tỷ lệ review có đánh giá đầy đủ | >= 80% | Số review có đủ categories / Tổng review |
| Thời gian duyệt công ty trung bình | < 24 giờ | Từ submit đến approve |
| Rating trung bình của hệ thống | >= 3.5/5 | Trung bình rating của tất cả công ty |

### 7.2. Chỉ số kỹ thuật

| Chỉ số | Mục tiêu | Đo lường |
|--------|----------|----------|
| Thời gian tải trang | < 2 giây | Page load time |
| Thời gian API response | < 500ms | API latency |
| Tỷ lệ thành công API | >= 99% | Success rate |
| Thời gian tìm kiếm | < 300ms | Search query response time |

### 7.3. Chỉ số trải nghiệm người dùng

| Chỉ số | Mục tiêu | Đo lường |
|--------|----------|----------|
| Thời gian tạo review | < 3 phút | Thời gian từ bắt đầu đến submit |
| Tỷ lệ người dùng hài lòng | >= 80% | Khảo sát định kỳ |
| Số lỗi giao diện | < 5 errors/100 sessions | Error tracking |
| Tỷ lệ sử dụng tìm kiếm/lọc | >= 60% | Usage analytics |

---

## 8. Rủi ro và giới hạn

### 8.1. Rủi ro

| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| Review spam hoặc fake | Cao | Xác thực người dùng, moderation, báo cáo vi phạm |
| Thông tin công ty không chính xác | Trung bình | Quy trình duyệt, cho phép báo cáo sai sót |
| Xung đột giữa công ty và reviewer | Trung bình | Quy trình phản hồi, moderation |
| Tấn công DDoS | Thấp | Rate limiting, CDN, monitoring |

### 8.2. Giới hạn hiện tại

| Giới hạn | Mô tả | Kế hoạch khắc phục |
|----------|-------|-------------------|
| Không hỗ trợ đa ngôn ngữ | Chỉ tiếng Việt | i18n trong tương lai |
| Không có hệ thống verification công ty | Chưa xác thực công ty | Tích hợp xác thực trong tương lai |
| Không hỗ trợ upload ảnh trong review | Chỉ text và rating | Bổ sung trong phiên bản sau |
| Giới hạn số lần chỉnh sửa review | Tối đa 3 lần | Có thể điều chỉnh theo nhu cầu |

---

## 9. Tài liệu tham khảo

### 9.1. Tài liệu thiết kế

- [HLD-REVIEW-COMPANY.md](../../hld/output/review-company/HLD-REVIEW-COMPANY.md) - High Level Design cho Review Company
- [DD-REVIEW-COMPANY.md](../../dd/review-company/DD-REVIEW-COMPANY.md) - Detailed Design cho Review Company

### 9.2. Tài liệu API (dự kiến)

- review-company-service API Documentation
- auth-service API Documentation

### 9.3. Sơ đồ kiến trúc

- Context Diagram (xem HLD section 2)
- Sequence Diagram (xem HLD section 3.1)
- State Machine Diagram (xem HLD section 4)
- ERD (xem HLD section 5)

---

## 10. Lịch sử thay đổi

| Ngày | Phiên bản | Người thực hiện | Thay đổi |
|------|-----------|-----------------|----------|
| 2025-01-26 | 1.0 | BA Team | Tạo tài liệu ban đầu |

---

**Ghi chú:**
- Tài liệu này là tổng quan cho toàn bộ 16 User Stories về hệ thống Review Công ty
- Chi tiết từng User Story xem tại các file tương ứng trong danh mục
- Thuật ngữ được chuẩn hóa và sử dụng nhất quán trong tất cả các file

