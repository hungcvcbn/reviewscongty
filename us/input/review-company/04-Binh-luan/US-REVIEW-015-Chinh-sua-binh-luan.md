# US-REVIEW-015: Chỉnh sửa bình luận

## User Story

Là **Người tạo bình luận**
Tôi muốn **chỉnh sửa bình luận đã đăng của tôi**
Tại **Trang chi tiết review, phần bình luận**
Để **sửa lỗi hoặc cập nhật nội dung bình luận**

---

## Acceptance Criteria

### AC-1: Chỉnh sửa bình luận của chính mình (Luồng chính)

- **Tại:** Trang chi tiết review, phần bình luận
- **Khi:** User nhấn "Chỉnh sửa" trên bình luận của chính mình
- **Thì:**
  - Chuyển sang chế độ chỉnh sửa
  - Cho phép chỉnh sửa nội dung bình luận
  - Validation: Tối đa 500 ký tự
  - Có nút "Lưu thay đổi" và "Hủy"
  - Sau khi lưu: Hiển thị nhãn "Đã chỉnh sửa" trên bình luận
  - Hiển thị thời gian chỉnh sửa

---

### AC-2: Quyền chỉnh sửa

- **Tại:** Trang bình luận
- **Khi:** User cố chỉnh sửa bình luận
- **Thì:**
  - Chỉ người tạo bình luận mới có nút "Chỉnh sửa"
  - Admin cũng có thể chỉnh sửa bình luận
  - Nếu user khác cố chỉnh sửa: Hiển thị "Bạn không có quyền chỉnh sửa bình luận này"

---

### AC-3: Giới hạn thời gian chỉnh sửa

- **Tại:** Hệ thống
- **Khi:** User chỉnh sửa bình luận
- **Thì:**
  - Chỉ cho phép chỉnh sửa trong vòng 24 giờ sau khi đăng
  - Sau 24 giờ: Nút "Chỉnh sửa" bị vô hiệu hóa
  - Hiển thị thông báo: "Bình luận đã quá 24 giờ, không thể chỉnh sửa. Vui lòng xóa và bình luận lại nếu cần"

---

### AC-4: Lịch sử chỉnh sửa (tùy chọn)

- **Tại:** Trang chi tiết bình luận (chỉ Admin và người tạo)
- **Khi:** Xem lịch sử chỉnh sửa
- **Thì:**
  - Hiển thị nội dung trước khi chỉnh sửa
  - Hiển thị nội dung sau khi chỉnh sửa
  - Hiển thị thời gian chỉnh sửa

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền chỉnh sửa | BR_REVIEW_045 | Chỉ người tạo bình luận mới có quyền chỉnh sửa | Admin cũng có thể |
| Thời gian chỉnh sửa | BR_REVIEW_046 | Chỉ cho phép chỉnh sửa trong 24 giờ sau khi đăng | |
| Nội dung | BR_REVIEW_047 | Tối đa 500 ký tự | Giống như tạo mới |

---

## System Rules

- Ghi log khi chỉnh sửa (nếu có thể)
- Hiển thị nhãn "Đã chỉnh sửa" trên bình luận đã chỉnh sửa

---

## Business Value & Success Metrics

Story này cung cấp **khả năng chỉnh sửa bình luận, cho phép người dùng sửa lỗi**

Trọng số của story này là **Thấp (Low)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ chỉnh sửa bình luận thành công >= 98%

---

## Dependencies

- Database: Bảng comment
- Service: review-company-service

---

## Impact Analysis

- **Giao diện người dùng**: Inline editing cho bình luận
- **Hệ thống backend**: API cập nhật bình luận

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Rollback về phiên bản cũ - sẽ bổ sung sau

