# US-REVIEW-014: Bình luận trên review

## User Story

Là **Người dùng đã đăng nhập**
Tôi muốn **bình luận trên một review**
Tại **Trang chi tiết review hoặc trang chi tiết công ty**
Để **chia sẻ ý kiến, hỏi thêm thông tin hoặc thảo luận về review đó**

---

## Acceptance Criteria

### AC-1: Thêm bình luận mới (Luồng chính)

- **Tại:** Trang chi tiết review hoặc danh sách review
- **Khi:** User đã đăng nhập nhấn "Bình luận" hoặc nhập vào ô "Viết bình luận"
- **Thì:**
  - Hiển thị ô nhập bình luận (textarea)
  - Nhập nội dung bình luận (bắt buộc, tối đa 500 ký tự)
  - Nút "Đăng bình luận" và "Hủy"
  - Sau khi đăng:
    - Bình luận được hiển thị ngay dưới review
    - Hiển thị: Avatar, Tên user, Nội dung, Ngày đăng
    - Gửi email thông báo cho người tạo review (nếu user có bật notification)

---

### AC-2: Hiển thị danh sách bình luận

- **Tại:** Trang chi tiết review
- **Khi:** Xem review
- **Thì:**
  - Hiển thị tất cả bình luận của review
  - Sắp xếp: Ngày đăng tăng dần (cũ nhất trước) hoặc giảm dần (tùy chọn)
  - Mỗi bình luận hiển thị: Avatar, Tên user, Nội dung, Ngày đăng, Số like (nếu có)
  - Phân trang nếu có nhiều bình luận (10 bình luận/trang)

---

### AC-3: Like bình luận

- **Tại:** Mỗi bình luận
- **Khi:** User đã đăng nhập nhấn "Like" trên bình luận
- **Thì:**
  - Tăng số lượng like lên 1
  - Nút "Like" được highlight
  - Mỗi user chỉ có thể like 1 lần
  - Có thể bỏ like

---

### AC-4: Phản hồi bình luận (Reply)

- **Tại:** Mỗi bình luận
- **Khi:** User đã đăng nhập nhấn "Phản hồi"
- **Thì:**
  - Hiển thị ô nhập phản hồi dưới bình luận gốc
  - Có thể phản hồi nhiều cấp (reply của reply)
  - Hiển thị dạng thread (thụt lề để thể hiện cấp độ)
  - Gửi email thông báo cho người tạo bình luận gốc

---

### AC-5: Xóa bình luận

- **Tại:** Mỗi bình luận
- **Khi:** User nhấn "Xóa" trên bình luận của chính mình
- **Thì:**
  - Hiển thị cửa sổ xác nhận
  - Sau khi xác nhận: Bình luận được xóa (soft delete)
  - Ẩn bình luận khỏi danh sách (hoặc hiển thị "[Bình luận đã bị xóa]")

---

### AC-6: Báo cáo bình luận vi phạm

- **Tại:** Mỗi bình luận
- **Khi:** User nhấn "Báo cáo vi phạm"
- **Thì:**
  - Hiển thị modal với lý do báo cáo
  - Chọn lý do: Spam, Nội dung không phù hợp, Quấy rối, Khác
  - Gửi báo cáo, Admin sẽ xem xét

---

### AC-7: Hiển thị số bình luận

- **Tại:** Trang danh sách review
- **Khi:** Hiển thị review
- **Thì:**
  - Hiển thị số lượng bình luận dưới mỗi review
  - Ví dụ: "5 bình luận"
  - Click vào số bình luận để xem chi tiết

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Nội dung bình luận | BR_REVIEW_042 | Bắt buộc, tối đa 500 ký tự | |
| Quyền bình luận | BR_REVIEW_043 | Chỉ user đã đăng nhập mới có thể bình luận | |
| Xóa bình luận | BR_REVIEW_044 | Chỉ người tạo bình luận hoặc Admin mới có quyền xóa | |

---

## System Rules

- Bình luận được lưu với reference đến review
- Hỗ trợ nested comments (phản hồi bình luận)
- Email thông báo khi có bình luận mới (tùy chọn)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng tương tác và thảo luận trên review, tăng engagement**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ review có bình luận >= 30%
- Thời gian tải bình luận < 500ms

---

## Dependencies

- Database: Bảng comment
- Service: review-company-service
- Auth: Để xác định user đã đăng nhập

---

## Impact Analysis

- **Giao diện người dùng**: Component bình luận với reply, like, textarea
- **Hệ thống backend**: API thêm bình luận, lấy danh sách bình luận

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Chỉnh sửa bình luận (thuộc US-REVIEW-015)
- Upload ảnh trong bình luận - sẽ bổ sung sau
- Tag user trong bình luận - sẽ bổ sung sau

