# US-REVIEW-005: Xóa công ty

## User Story

Là **Admin**
Tôi muốn **xóa công ty khỏi hệ thống**
Tại **Trang chi tiết công ty**
Để **loại bỏ công ty không còn hoạt động hoặc vi phạm quy định**

---

## Acceptance Criteria

### AC-1: Xóa công ty thành công (Soft Delete)

- **Tại:** Màn hình chi tiết công ty
- **Khi:** Admin nhấn "Xóa công ty"
- **Thì:**
  - Hiển thị cửa sổ xác nhận: "Bạn có chắc muốn xóa công ty này? Hành động này không thể hoàn tác"
  - Yêu cầu nhập lý do xóa (bắt buộc)
  - Sau khi xác nhận:
    - Cập nhật status = DELETED (soft delete)
    - Ẩn công ty khỏi danh sách công ty (không hiển thị cho user thông thường)
    - Gửi email thông báo cho Company Owner
    - Hiển thị thông báo "Xóa công ty thành công"

**Quy tắc nghiệp vụ:**
- Chỉ Admin mới có quyền xóa công ty
- Xóa là soft delete (không xóa khỏi database)
- Công ty đã xóa vẫn có thể restore bởi Admin

---

### AC-2: Kiểm tra ràng buộc trước khi xóa

- **Tại:** Hệ thống backend
- **Khi:** Admin cố xóa công ty
- **Thì:**
  - Kiểm tra số lượng review của công ty
  - Nếu có > 10 review: Cảnh báo "Công ty này có nhiều review. Bạn có chắc muốn xóa?"
  - Nếu có review đang trong quá trình kiểm duyệt: Cảnh báo
  - Vẫn cho phép xóa nhưng ghi log cảnh báo

---

### AC-3: Ẩn công ty sau khi xóa

- **Tại:** Hệ thống
- **Khi:** Công ty được xóa (status = DELETED)
- **Thì:**
  - Không hiển thị trong danh sách công ty cho user thông thường
  - Không hiển thị trong kết quả tìm kiếm
  - Admin vẫn có thể xem trong danh sách (với filter "Đã xóa")
  - Company Owner không thể xem công ty đã xóa

---

### AC-4: Restore công ty đã xóa

- **Tại:** Màn hình danh sách công ty (Admin, filter "Đã xóa")
- **Khi:** Admin nhấn "Khôi phục" trên công ty đã xóa
- **Thì:**
  - Hiển thị cửa sổ xác nhận
  - Cập nhật status = PENDING hoặc ACTIVE (tùy theo trạng thái trước khi xóa)
  - Gửi email thông báo cho Company Owner
  - Hiển thị thông báo "Khôi phục công ty thành công"

---

### AC-5: Thông báo cho Company Owner

- **Tại:** Hệ thống email
- **Khi:** Công ty được xóa
- **Thì:**
  - Gửi email cho Company Owner với nội dung:
    - Tên công ty bị xóa
    - Lý do xóa (nếu có)
    - Thông tin liên hệ admin nếu có thắc mắc
    - Hướng dẫn khôi phục (nếu có thể)

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền xóa | BR_REVIEW_015 | Chỉ Admin mới có quyền xóa công ty | |
| Soft delete | BR_REVIEW_016 | Xóa là soft delete, không xóa khỏi database | |
| Lý do xóa | BR_REVIEW_017 | Bắt buộc nhập lý do khi xóa | Ghi log để audit |

---

## System Rules

- Xóa là soft delete (cập nhật status = DELETED)
- Ghi log đầy đủ: Người xóa, thời gian, lý do
- Review của công ty đã xóa vẫn giữ nguyên (không xóa theo)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng xóa công ty vi phạm hoặc không còn hoạt động, duy trì chất lượng hệ thống**

Trọng số của story này là **Thấp (Low)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ xóa thành công = 100%
- Email thông báo được gửi thành công >= 99%
- Công ty đã xóa không hiển thị cho user thông thường = 100%

---

## Dependencies

- Database: Bảng company
- Service: review-company-service
- Notification: Để gửi email thông báo
- Audit log: Để ghi log xóa

---

## Impact Analysis

- **Giao diện người dùng**: Modal xác nhận xóa với ô nhập lý do
- **Hệ thống backend**: API xóa công ty (soft delete), API restore
- **Email**: Cần template email thông báo xóa công ty

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Hard delete (xóa vĩnh viễn) - sẽ bổ sung sau
- Xóa hàng loạt - sẽ bổ sung sau
- Tự động xóa công ty sau một thời gian - sẽ bổ sung sau

