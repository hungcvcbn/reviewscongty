# US-REVIEW-012: Xóa review

## User Story

Là **Người tạo review hoặc Admin**
Tôi muốn **xóa review đã đăng**
Tại **Trang chi tiết review**
Để **xóa review không còn phù hợp hoặc vi phạm quy định**

---

## Acceptance Criteria

### AC-1: Xóa review của chính mình (Luồng chính)

- **Tại:** Trang chi tiết review
- **Khi:** User nhấn "Xóa" trên review của chính mình
- **Thì:**
  - Hiển thị cửa sổ xác nhận: "Bạn có chắc muốn xóa review này? Hành động này không thể hoàn tác"
  - Sau khi xác nhận:
    - Cập nhật status = DELETED (soft delete)
    - Ẩn review khỏi danh sách (không hiển thị cho user thông thường)
    - Tính lại rating trung bình của công ty
    - Hiển thị thông báo "Xóa review thành công"
    - Chuyển về trang chi tiết công ty

---

### AC-2: Admin xóa review vi phạm

- **Tại:** Trang chi tiết review
- **Khi:** Admin nhấn "Xóa" trên review vi phạm
- **Thì:**
  - Hiển thị cửa sổ với ô nhập lý do xóa (bắt buộc)
  - Sau khi xác nhận:
    - Cập nhật status = DELETED
    - Ghi log: Người xóa (Admin), thời gian, lý do
    - Gửi email thông báo cho người tạo review: "Review của bạn đã bị xóa. Lý do: [lý do]"
    - Tính lại rating trung bình của công ty
    - Hiển thị thông báo "Xóa review thành công"

---

### AC-3: Quyền xóa

- **Tại:** Trang review
- **Khi:** User cố xóa review
- **Thì:**
  - Người tạo review: Có nút "Xóa"
  - Admin: Có nút "Xóa" trên mọi review
  - User khác: Không có nút "Xóa"
  - Nếu user khác cố xóa: Hiển thị "Bạn không có quyền xóa review này"

---

### AC-4: Ẩn review sau khi xóa

- **Tại:** Hệ thống
- **Khi:** Review được xóa (status = DELETED)
- **Thì:**
  - Không hiển thị trong danh sách review cho user thông thường
  - Không tính vào rating trung bình của công ty
  - Admin vẫn có thể xem (với filter "Đã xóa")
  - Người tạo review có thể xem review đã xóa của mình (với nhãn "Đã xóa")

---

### AC-5: Restore review đã xóa (Admin)

- **Tại:** Trang quản lý review (Admin)
- **Khi:** Admin nhấn "Khôi phục" trên review đã xóa
- **Thì:**
  - Hiển thị cửa sổ xác nhận
  - Cập nhật status = PUBLISHED
  - Tính lại rating trung bình của công ty
  - Gửi email thông báo cho người tạo review
  - Hiển thị thông báo "Khôi phục review thành công"

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền xóa | BR_REVIEW_037 | Người tạo review hoặc Admin | |
| Soft delete | BR_REVIEW_038 | Xóa là soft delete, không xóa khỏi database | |
| Rating | BR_REVIEW_039 | Tính lại rating trung bình sau khi xóa | Review DELETED không tính vào rating |

---

## System Rules

- Xóa là soft delete (cập nhật status = DELETED)
- Rating trung bình được tính lại sau khi xóa
- Ghi log đầy đủ khi Admin xóa review

---

## Business Value & Success Metrics

Story này cung cấp **khả năng xóa review không phù hợp, duy trì chất lượng nội dung**

Trọng số của story này là **Trung bình (Medium)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ xóa thành công = 100%
- Rating trung bình được tính lại chính xác sau khi xóa = 100%

---

## Dependencies

- Database: Bảng review
- Service: review-company-service
- Notification: Để gửi email thông báo (khi Admin xóa)

---

## Impact Analysis

- **Giao diện người dùng**: Modal xác nhận xóa
- **Hệ thống backend**: API xóa review (soft delete), tính lại rating

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Hard delete (xóa vĩnh viễn) - sẽ bổ sung sau
- Tự động xóa review spam - sẽ bổ sung sau

