# US-REVIEW-011: Chỉnh sửa review

## User Story

Là **Người tạo review**
Tôi muốn **chỉnh sửa review đã đăng của tôi**
Tại **Trang chi tiết review hoặc trang quản lý review của tôi**
Để **cập nhật hoặc sửa lỗi trong review**

---

## Acceptance Criteria

### AC-1: Chỉnh sửa review của chính mình (Luồng chính)

- **Tại:** Trang chi tiết review
- **Khi:** User nhấn "Chỉnh sửa" trên review của chính mình
- **Thì:**
  - Chuyển sang chế độ chỉnh sửa
  - Cho phép chỉnh sửa: Tiêu đề, Nội dung, Rating tổng thể, Rating theo categories
  - Validation giống như tạo mới
  - Có nút "Lưu thay đổi" và "Hủy"
  - Sau khi lưu: Cập nhật status = EDITED
  - Hiển thị nhãn "Đã chỉnh sửa" trên review

---

### AC-2: Quyền chỉnh sửa

- **Tại:** Trang review
- **Khi:** User cố chỉnh sửa review
- **Thì:**
  - Chỉ người tạo review mới có nút "Chỉnh sửa"
  - Nếu user khác cố chỉnh sửa: Hiển thị "Bạn không có quyền chỉnh sửa review này"
  - Admin cũng có thể chỉnh sửa review (với ghi chú là Admin)

---

### AC-3: Giới hạn số lần chỉnh sửa

- **Tại:** Hệ thống
- **Khi:** User chỉnh sửa review
- **Thì:**
  - Tối đa 3 lần chỉnh sửa một review
  - Sau 3 lần: Nút "Chỉnh sửa" bị vô hiệu hóa
  - Hiển thị thông báo: "Bạn đã chỉnh sửa tối đa 3 lần. Nếu cần thay đổi, vui lòng xóa và tạo review mới"

---

### AC-4: Lịch sử chỉnh sửa

- **Tại:** Trang chi tiết review (chỉ Admin và người tạo)
- **Khi:** Xem lịch sử chỉnh sửa
- **Thì:**
  - Hiển thị tab "Lịch sử chỉnh sửa"
  - Hiển thị các phiên bản trước của review
  - Mỗi phiên bản hiển thị: Nội dung, Rating, Thời gian chỉnh sửa, Thay đổi so với phiên bản trước

---

### AC-5: Thông báo khi review được chỉnh sửa

- **Tại:** Email Company Owner
- **Khi:** Review của công ty được chỉnh sửa
- **Thì:**
  - Gửi email thông báo (nếu Owner đã bật notification)
  - Nội dung: "Một review về công ty của bạn đã được chỉnh sửa"

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền chỉnh sửa | BR_REVIEW_034 | Chỉ người tạo review mới có quyền chỉnh sửa | Admin cũng có thể |
| Số lần chỉnh sửa | BR_REVIEW_035 | Tối đa 3 lần chỉnh sửa một review | |
| Status sau chỉnh sửa | BR_REVIEW_036 | Status = EDITED sau khi chỉnh sửa | |

---

## System Rules

- Sau khi chỉnh sửa, rating trung bình của công ty được tính lại
- Ghi log lịch sử chỉnh sửa (nếu có thể)
- Email thông báo cho Company Owner (tùy chọn)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng chỉnh sửa review, cho phép người dùng cập nhật thông tin**

Trọng số của story này là **Trung bình (Medium)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ chỉnh sửa review thành công >= 98%
- Số lần chỉnh sửa trung bình < 2 lần/review

---

## Dependencies

- Database: Bảng review, review_history (nếu lưu lịch sử)
- Service: review-company-service
- Notification: Để gửi email (tùy chọn)

---

## Impact Analysis

- **Giao diện người dùng**: Form chỉnh sửa tương tự form tạo mới
- **Hệ thống backend**: API cập nhật review, tính lại rating

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Rollback về phiên bản cũ - sẽ bổ sung sau
- Chỉnh sửa bởi Admin mà không thông báo - sẽ bổ sung sau

