# US-REVIEW-004: Chỉnh sửa công ty

## User Story

Là **Admin, Manager hoặc Company Owner**
Tôi muốn **chỉnh sửa thông tin công ty**
Tại **Trang chi tiết công ty (chế độ chỉnh sửa)**
Để **cập nhật hoặc sửa lỗi thông tin công ty**

---

## Acceptance Criteria

### AC-1: Chỉnh sửa thông tin cơ bản công ty

- **Tại:** Màn hình chỉnh sửa công ty
- **Khi:** Admin/Manager/Owner nhấn "Chỉnh sửa" và thay đổi thông tin
- **Thì:**
  - Cho phép chỉnh sửa: Tên công ty, Địa chỉ, Ngành nghề, Mô tả
  - Tên công ty phải unique (kiểm tra khi lưu)
  - Validation giống như tạo mới
  - Cập nhật thời điểm sửa đổi và người sửa đổi
  - Hiển thị thông báo "Cập nhật công ty thành công"
  - Nếu công ty đang ACTIVE, không cần duyệt lại (trừ khi đổi tên)

---

### AC-2: Chỉnh sửa thông tin liên hệ

- **Tại:** Màn hình chỉnh sửa công ty, tab "Thông tin liên hệ"
- **Khi:** Admin/Manager/Owner chỉnh sửa thông tin liên hệ
- **Thì:**
  - Cho phép chỉnh sửa: Email, Số điện thoại, Website, Hotline
  - Validation giống như tạo mới
  - Cập nhật thành công

---

### AC-3: Thay đổi logo công ty

- **Tại:** Màn hình chỉnh sửa công ty
- **Khi:** Admin/Manager/Owner upload logo mới
- **Thì:**
  - Validation giống như tạo mới (format, size)
  - Hiển thị preview logo mới
  - Logo cũ được backup (hoặc xóa nếu không cần)
  - Cập nhật URL logo mới

---

### AC-4: Quyền chỉnh sửa theo vai trò

- **Tại:** Màn hình chỉnh sửa công ty
- **Khi:** Người dùng cố chỉnh sửa công ty
- **Thì:**
  - Admin: Có thể chỉnh sửa mọi công ty
  - Manager: Chỉ có thể chỉnh sửa công ty được assign
  - Company Owner: Chỉ có thể chỉnh sửa công ty của mình
  - Regular User: Không có quyền chỉnh sửa
  - Nếu không có quyền: Hiển thị thông báo "Bạn không có quyền chỉnh sửa công ty này"

---

### AC-5: Xung đột khi cập nhật đồng thời

- **Tại:** Màn hình chỉnh sửa công ty
- **Khi:** Người dùng lưu công ty nhưng phiên bản đã bị thay đổi bởi người khác
- **Thì:**
  - Backend trả về lỗi 409 Conflict
  - Hiển thị cửa sổ: "Công ty đã được cập nhật bởi người khác. Vui lòng làm mới và thử lại"
  - Nút "Làm mới" để reload dữ liệu mới nhất
  - Không lưu thay đổi

**Quy tắc nghiệp vụ:**
- Sử dụng optimistic locking với trường version
- Điều kiện WHERE: UPDATE ... WHERE id = ? AND version = ?

---

### AC-6: Lịch sử thay đổi

- **Tại:** Màn hình chi tiết công ty, tab "Lịch sử"
- **Khi:** Xem lịch sử thay đổi (chỉ Admin/Owner)
- **Thì:**
  - Hiển thị danh sách các lần thay đổi
  - Mỗi thay đổi hiển thị: Trường thay đổi, Giá trị cũ, Giá trị mới, Người thay đổi, Thời gian
  - Có thể xem chi tiết từng thay đổi

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền chỉnh sửa | BR_REVIEW_012 | Admin: Tất cả, Manager: Assigned, Owner: Own company | |
| Tên công ty | BR_REVIEW_013 | Phải unique khi đổi tên | Nếu trùng, yêu cầu tên mới |
| Duyệt lại | BR_REVIEW_014 | Nếu đổi tên công ty ACTIVE, cần duyệt lại | Hoặc có thể auto-approve nếu Admin chỉnh sửa |

---

## System Rules

- Sử dụng optimistic locking để tránh xung đột
- Ghi log tất cả thay đổi
- Email thông báo cho Owner khi có thay đổi (nếu không phải Owner tự chỉnh sửa)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng cập nhật thông tin công ty, đảm bảo thông tin luôn chính xác**

Trọng số của story này là **Trung bình (Medium)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ cập nhật thành công >= 98%
- Số lượng lỗi xung đột < 2% tổng số cập nhật
- Thời gian trung bình để cập nhật < 2 phút

---

## Dependencies

- Database: Bảng company, company_history (để lưu lịch sử)
- Service: review-company-service
- Storage: Để upload logo mới

---

## Impact Analysis

- **Giao diện người dùng**: Form chỉnh sửa tương tự form tạo mới
- **Hệ thống backend**: API cập nhật công ty với validation và optimistic locking
- **Audit**: Cần lưu lịch sử thay đổi

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Xóa công ty (thuộc US-REVIEW-005)
- Duyệt công ty (thuộc US-REVIEW-006)
- Rollback thay đổi - sẽ bổ sung sau

