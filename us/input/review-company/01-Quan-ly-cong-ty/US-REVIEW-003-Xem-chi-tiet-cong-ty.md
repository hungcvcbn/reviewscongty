# US-REVIEW-003: Xem chi tiết công ty

## User Story

Là **Người dùng bất kỳ**
Tôi muốn **xem thông tin chi tiết của một công ty**
Tại **Trang chi tiết công ty**
Để **hiểu rõ hơn về công ty trước khi review hoặc đưa ra quyết định**

---

## Acceptance Criteria

### AC-1: Hiển thị thông tin cơ bản công ty (Luồng chính)

- **Tại:** Màn hình chi tiết công ty
- **Khi:** Người dùng truy cập trang chi tiết công ty
- **Thì:**
  - Hiển thị logo công ty (kích thước lớn)
  - Hiển thị tên công ty
  - Hiển thị địa chỉ đầy đủ
  - Hiển thị ngành nghề
  - Hiển thị mô tả công ty
  - Hiển thị rating trung bình và số review
  - Chỉ hiển thị nếu công ty có status = ACTIVE (hoặc user là Admin/Manager/Owner)

---

### AC-2: Hiển thị thông tin liên hệ

- **Tại:** Màn hình chi tiết công ty, tab "Liên hệ"
- **Khi:** Người dùng xem tab "Liên hệ"
- **Thì:**
  - Hiển thị email
  - Hiển thị số điện thoại
  - Hiển thị website (có thể click để mở)
  - Hiển thị hotline (nếu có)
  - Có nút "Sao chép" cho email và số điện thoại

---

### AC-3: Hiển thị rating chi tiết theo categories

- **Tại:** Màn hình chi tiết công ty, phần "Đánh giá"
- **Khi:** Người dùng xem phần đánh giá
- **Thì:**
  - Hiển thị rating tổng thể (Overall Rating)
  - Hiển thị rating theo từng category:
    - Môi trường làm việc (Work Environment)
    - Lương thưởng (Salary & Benefits)
    - Văn hóa công ty (Company Culture)
    - Cơ hội phát triển (Growth Opportunities)
  - Mỗi category hiển thị: Số sao, số review, biểu đồ phân bố
  - Nếu chưa có review cho category nào: Hiển thị "Chưa có đánh giá"

---

### AC-4: Hiển thị danh sách review gần đây

- **Tại:** Màn hình chi tiết công ty, phần "Review"
- **Khi:** Người dùng cuộn xuống phần review
- **Thì:**
  - Hiển thị 5-10 review gần đây nhất
  - Mỗi review hiển thị: Avatar người review, Tên (ẩn danh nếu cần), Rating, Nội dung review, Ngày đăng, Bình luận (nếu có)
  - Có nút "Xem tất cả review" để chuyển đến trang danh sách review đầy đủ
  - Có phân trang nếu có nhiều review

---

### AC-5: Hiển thị thống kê review

- **Tại:** Màn hình chi tiết công ty, phần "Thống kê"
- **Khi:** Có ít nhất 1 review
- **Thì:**
  - Tổng số review
  - Phân bố rating: Số lượng review theo từng mức sao (1, 2, 3, 4, 5)
  - Biểu đồ cột hoặc tròn thể hiện phân bố
  - Rating trung bình theo từng category

---

### AC-6: Hiển thị nút hành động

- **Tại:** Màn hình chi tiết công ty
- **Khi:** Người dùng xem chi tiết công ty
- **Thì:**
  - Nếu user đã đăng nhập: Hiển thị nút "Viết Review"
  - Nếu user là Company Owner: Hiển thị nút "Chỉnh sửa công ty"
  - Nếu user là Admin: Hiển thị thêm nút "Duyệt công ty", "Xóa công ty"
  - Nút "Chia sẻ" để share công ty

---

### AC-7: Xử lý khi công ty không tồn tại hoặc không công khai

- **Tại:** Màn hình chi tiết công ty
- **Khi:** Công ty không tồn tại hoặc không ở trạng thái ACTIVE (và user không phải Admin/Manager/Owner)
- **Thì:**
  - Hiển thị thông báo: "Công ty không tồn tại hoặc chưa được duyệt"
  - Nút "Quay lại danh sách công ty"
  - Redirect về trang danh sách sau 3 giây

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Hiển thị công ty | BR_REVIEW_010 | Chỉ hiển thị công ty ACTIVE cho user thông thường | Admin/Manager/Owner có thể xem công ty ở mọi trạng thái |
| Rating | BR_REVIEW_011 | Tính trung bình từ tất cả review PUBLISHED | Không tính review DELETED |

---

## System Rules

- Dữ liệu chi tiết công ty được cache để tăng tốc độ
- API phải trả về đầy đủ thông tin trong một request (hoặc có thể lazy load phần review)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng xem thông tin chi tiết công ty, giúp người dùng có cái nhìn toàn diện trước khi review**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Thời gian tải trang chi tiết < 2 giây
- Thời gian phản hồi API < 500ms
- Tỷ lệ người dùng click "Viết Review" >= 20% số lượt xem

---

## Dependencies

- Database: Bảng company, review, rating, rating_category
- Service: review-company-service
- Cache: Redis

---

## Impact Analysis

- **Giao diện người dùng (review-company-web)**: Cần xây dựng trang chi tiết với nhiều sections
- **Hệ thống backend (review-company-service)**: API lấy chi tiết công ty kèm rating và review
- **Performance**: Cần cache để tăng tốc độ

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Tạo review (thuộc US-REVIEW-009)
- Chỉnh sửa công ty (thuộc US-REVIEW-004)
- Xem tất cả review (thuộc US-REVIEW-010)

