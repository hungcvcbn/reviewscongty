# US-REVIEW-016: Phản hồi từ công ty

## User Story

Là **Company Owner**
Tôi muốn **phản hồi chính thức cho một review về công ty của tôi**
Tại **Trang chi tiết review, phần "Phản hồi từ công ty"**
Để **cảm ơn, giải thích hoặc giải quyết vấn đề được đề cập trong review**

---

## Acceptance Criteria

### AC-1: Thêm phản hồi công ty (Luồng chính)

- **Tại:** Trang chi tiết review
- **Khi:** Company Owner nhấn "Phản hồi từ công ty" trên review về công ty của mình
- **Thì:**
  - Hiển thị ô nhập phản hồi (textarea)
  - Nhập nội dung phản hồi (bắt buộc, tối đa 1000 ký tự)
  - Hiển thị logo và tên công ty
  - Nút "Đăng phản hồi" và "Hủy"
  - Sau khi đăng:
    - Phản hồi được hiển thị ngay dưới review
    - Hiển thị: Logo công ty, Tên công ty, Nội dung, Ngày đăng
    - Có badge "Phản hồi chính thức từ công ty"
    - Gửi email thông báo cho người tạo review

---

### AC-2: Chỉ một phản hồi công ty cho mỗi review

- **Tại:** Hệ thống
- **Khi:** Company Owner cố thêm phản hồi thứ hai cho cùng một review
- **Thì:**
  - Nếu đã có phản hồi: Hiển thị "Bạn đã phản hồi review này. Bạn có muốn chỉnh sửa phản hồi không?"
  - Cho phép chỉnh sửa phản hồi hiện tại
  - Không cho phép tạo phản hồi mới

---

### AC-3: Chỉnh sửa phản hồi công ty

- **Tại:** Trang chi tiết review
- **Khi:** Company Owner nhấn "Chỉnh sửa" trên phản hồi của công ty
- **Thì:**
  - Chuyển sang chế độ chỉnh sửa
  - Cho phép chỉnh sửa nội dung phản hồi
  - Validation giống như tạo mới
  - Có nút "Lưu thay đổi" và "Hủy"
  - Sau khi lưu: Hiển thị nhãn "Đã chỉnh sửa"

---

### AC-4: Xóa phản hồi công ty

- **Tại:** Trang chi tiết review
- **Khi:** Company Owner nhấn "Xóa" trên phản hồi của công ty
- **Thì:**
  - Hiển thị cửa sổ xác nhận
  - Sau khi xác nhận: Phản hồi được xóa
  - Có thể tạo phản hồi mới sau khi xóa

---

### AC-5: Quyền phản hồi

- **Tại:** Trang chi tiết review
- **Khi:** Xem review
- **Thì:**
  - Chỉ Company Owner của công ty được review mới thấy nút "Phản hồi từ công ty"
  - User khác không thấy nút này
  - Admin có thể xem nhưng không thể phản hồi thay công ty

---

### AC-6: Hiển thị phản hồi công ty

- **Tại:** Trang chi tiết review và danh sách review
- **Khi:** Review có phản hồi từ công ty
- **Thì:**
  - Hiển thị badge "Đã có phản hồi từ công ty" trên review
  - Phản hồi được hiển thị nổi bật (có border hoặc background khác)
  - Hiển thị logo và tên công ty
  - Hiển thị ngày đăng phản hồi

---

### AC-7: Thông báo khi có phản hồi công ty

- **Tại:** Email người tạo review
- **Khi:** Company Owner phản hồi review
- **Thì:**
  - Gửi email thông báo: "Công ty [Tên công ty] đã phản hồi review của bạn"
  - Nội dung email bao gồm:
    - Tên công ty
    - Nội dung phản hồi (truncate nếu quá dài)
    - Link đến review để xem chi tiết

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền phản hồi | BR_REVIEW_048 | Chỉ Company Owner mới có quyền phản hồi | |
| Số lượng phản hồi | BR_REVIEW_049 | Chỉ 1 phản hồi công ty cho mỗi review | Có thể chỉnh sửa phản hồi hiện tại |
| Nội dung phản hồi | BR_REVIEW_050 | Bắt buộc, tối đa 1000 ký tự | |

---

## System Rules

- Một review chỉ có thể có 1 phản hồi công ty
- Phản hồi công ty được lưu riêng biệt với bình luận thông thường
- Email thông báo cho người tạo review khi có phản hồi

---

## Business Value & Success Metrics

Story này cung cấp **khả năng phản hồi chính thức từ công ty, tăng engagement và giải quyết vấn đề**

Trọng số của story này là **Trung bình (Medium)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ review có phản hồi từ công ty >= 20%
- Email thông báo được gửi thành công >= 99%

---

## Dependencies

- Database: Bảng company_response
- Service: review-company-service
- Auth: Để xác định Company Owner
- Notification: Để gửi email thông báo

---

## Impact Analysis

- **Giao diện người dùng**: Component phản hồi công ty với textarea, hiển thị logo công ty
- **Hệ thống backend**: API thêm/chỉnh sửa phản hồi công ty
- **Email**: Template email thông báo phản hồi công ty

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Phản hồi nhiều lần - sẽ bổ sung sau
- Phản hồi riêng tư (không công khai) - sẽ xem xét sau

