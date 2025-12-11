# US-REVIEW-010: Xem danh sách review của công ty

## User Story

Là **Người dùng bất kỳ**
Tôi muốn **xem tất cả review của một công ty**
Tại **Trang chi tiết công ty, tab "Review"**
Để **hiểu rõ hơn về công ty thông qua đánh giá của những người khác**

---

## Acceptance Criteria

### AC-1: Hiển thị danh sách review với phân trang (Luồng chính)

- **Tại:** Trang chi tiết công ty, tab "Review"
- **Khi:** Người dùng xem tab "Review"
- **Thì:**
  - Hiển thị danh sách review của công ty
  - Mỗi review hiển thị: Avatar người review, Tên (hoặc ẩn danh), Rating, Tiêu đề (nếu có), Nội dung, Ngày đăng, Số bình luận
  - Phân trang: 10 review/trang
  - Sắp xếp mặc định: Ngày đăng giảm dần (mới nhất trước)
  - Chỉ hiển thị review có status = PUBLISHED

---

### AC-2: Hiển thị rating và categories cho mỗi review

- **Tại:** Mỗi review trong danh sách
- **Khi:** Hiển thị review
- **Thì:**
  - Hiển thị rating tổng thể dạng sao (1-5 sao)
  - Hiển thị rating theo categories (nếu có):
    - Môi trường làm việc
    - Lương thưởng
    - Văn hóa công ty
    - Cơ hội phát triển
  - Mỗi category hiển thị dạng icon + số sao

---

### AC-3: Lọc review theo rating

- **Tại:** Trang danh sách review
- **Khi:** Người dùng chọn bộ lọc rating
- **Thì:**
  - Dropdown: "Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"
  - Danh sách review được lọc theo rating đã chọn
  - Hiển thị số lượng review: "[N] review"
  - Có thể kết hợp với sắp xếp

---

### AC-4: Sắp xếp review

- **Tại:** Trang danh sách review
- **Khi:** Người dùng chọn tiêu chí sắp xếp
- **Thì:**
  - Các tùy chọn:
    - Mới nhất (ngày đăng giảm dần)
    - Cũ nhất (ngày đăng tăng dần)
    - Rating cao nhất
    - Rating thấp nhất
    - Hữu ích nhất (số like/helpful)
  - Danh sách được sắp xếp lại

---

### AC-5: Xem chi tiết review

- **Tại:** Trang danh sách review
- **Khi:** Người dùng nhấn "Xem thêm" hoặc click vào review
- **Thì:**
  - Expand review để hiển thị đầy đủ nội dung (nếu bị truncate)
  - Hiển thị tất cả bình luận của review
  - Hiển thị phản hồi từ công ty (nếu có)
  - Có nút "Thu gọn" để thu nhỏ lại

---

### AC-6: Đánh dấu review hữu ích (Helpful)

- **Tại:** Mỗi review
- **Khi:** Người dùng nhấn "Hữu ích" (nếu đã đăng nhập)
- **Thì:**
  - Tăng số lượng "Hữu ích" lên 1
  - Nút "Hữu ích" được highlight
  - Mỗi user chỉ có thể đánh dấu 1 lần
  - Có thể bỏ đánh dấu

---

### AC-7: Báo cáo review vi phạm

- **Tại:** Mỗi review
- **Khi:** Người dùng nhấn "Báo cáo vi phạm" (nếu đã đăng nhập)
- **Thì:**
  - Hiển thị modal với lý do báo cáo
  - Chọn lý do: Spam, Nội dung không phù hợp, Thông tin sai lệch, Khác
  - Nhập mô tả chi tiết (tùy chọn)
  - Gửi báo cáo, Admin sẽ xem xét

---

### AC-8: Hiển thị empty state

- **Tại:** Trang danh sách review
- **Khi:** Công ty chưa có review nào
- **Thì:**
  - Hiển thị thông báo: "Công ty này chưa có review nào. Hãy là người đầu tiên review!"
  - Nút "Viết Review" (nếu user đã đăng nhập)

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Hiển thị review | BR_REVIEW_031 | Chỉ hiển thị review PUBLISHED | Review DRAFT, DELETED không hiển thị |
| Sắp xếp mặc định | BR_REVIEW_032 | Ngày đăng giảm dần | Mới nhất trước |
| Helpful | BR_REVIEW_033 | Mỗi user chỉ đánh dấu 1 lần | Có thể bỏ đánh dấu |

---

## System Rules

- Chỉ hiển thị review PUBLISHED cho user thông thường
- Review DELETED không hiển thị
- API phải hỗ trợ pagination, filter, sort

---

## Business Value & Success Metrics

Story này cung cấp **khả năng xem danh sách review, giúp người dùng hiểu rõ hơn về công ty**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Thời gian tải danh sách review < 1 giây
- Tỷ lệ người dùng xem review >= 80% số lượt xem công ty

---

## Dependencies

- Database: Bảng review, rating, rating_category
- Service: review-company-service
- Auth: Để xác định user đã đăng nhập (cho tính năng Helpful)

---

## Impact Analysis

- **Giao diện người dùng**: Component danh sách review với pagination, filter, sort
- **Hệ thống backend**: API lấy danh sách review với filter, sort, pagination

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Bình luận trên review (thuộc US-REVIEW-014)
- Chỉnh sửa review (thuộc US-REVIEW-011)
- Share review - sẽ bổ sung sau

