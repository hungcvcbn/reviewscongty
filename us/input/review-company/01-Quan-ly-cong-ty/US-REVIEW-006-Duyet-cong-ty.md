# US-REVIEW-006: Duyệt công ty

## User Story

Là **Admin**
Tôi muốn **duyệt công ty mới được tạo hoặc đã chỉnh sửa**
Tại **Trang quản lý công ty (danh sách chờ duyệt)**
Để **xác nhận và cho phép công ty hiển thị công khai trên hệ thống**

---

## Acceptance Criteria

### AC-1: Xem danh sách công ty chờ duyệt (Luồng chính)

- **Tại:** Màn hình quản lý công ty (Admin)
- **Khi:** Admin truy cập trang "Công ty chờ duyệt"
- **Thì:**
  - Hiển thị danh sách công ty có status = PENDING
  - Mỗi công ty hiển thị: Logo, Tên, Địa chỉ, Người tạo, Ngày tạo, Thông tin liên hệ
  - Phân trang: 20 công ty/trang
  - Sắp xếp: Ngày tạo tăng dần (cũ nhất trước)
  - Có nút "Duyệt" và "Từ chối" cho mỗi công ty

---

### AC-2: Duyệt công ty thành công

- **Tại:** Màn hình quản lý công ty
- **Khi:** Admin nhấn "Duyệt" trên công ty PENDING
- **Thì:**
  - Hiển thị cửa sổ xác nhận: "Bạn có chắc muốn duyệt công ty này?"
  - Sau khi xác nhận:
    - Cập nhật status: PENDING → APPROVED → ACTIVE (hoặc chỉ APPROVED, tùy config)
    - Ghi log: Người duyệt, thời gian duyệt
    - Gửi email thông báo cho Company Owner: "Công ty của bạn đã được duyệt"
    - Gửi email thông báo cho người tạo công ty (nếu khác Owner)
    - Hiển thị thông báo "Duyệt công ty thành công"
    - Công ty sẽ hiển thị công khai trên hệ thống

**Quy tắc nghiệp vụ:**
- Công ty được duyệt sẽ chuyển sang ACTIVE ngay hoặc APPROVED (tùy config)
- Công ty ACTIVE sẽ hiển thị trong danh sách công ty cho user thông thường

---

### AC-3: Từ chối công ty

- **Tại:** Màn hình quản lý công ty
- **Khi:** Admin nhấn "Từ chối" trên công ty PENDING
- **Thì:**
  - Hiển thị cửa sổ với ô nhập lý do từ chối (bắt buộc)
  - Sau khi xác nhận:
    - Cập nhật status = REJECTED (hoặc giữ PENDING với flag rejected)
    - Ghi log: Người từ chối, thời gian, lý do
    - Gửi email thông báo cho Company Owner: "Công ty của bạn đã bị từ chối. Lý do: [lý do]"
    - Hiển thị thông báo "Từ chối công ty thành công"
    - Công ty không hiển thị công khai

---

### AC-4: Xem chi tiết công ty trước khi duyệt

- **Tại:** Màn hình quản lý công ty
- **Khi:** Admin nhấn vào tên công ty hoặc "Xem chi tiết"
- **Thì:**
  - Chuyển đến màn hình chi tiết công ty (preview mode)
  - Hiển thị đầy đủ thông tin: Cơ bản, Liên hệ, Mô tả, Logo
  - Có nút "Duyệt" và "Từ chối" ở trang chi tiết
  - Có thể chỉnh sửa thông tin trực tiếp nếu cần

---

### AC-5: Duyệt hàng loạt

- **Tại:** Màn hình quản lý công ty
- **Khi:** Admin chọn nhiều công ty (checkbox) và nhấn "Duyệt hàng loạt"
- **Thì:**
  - Hiển thị cửa sổ xác nhận: "Bạn có chắc muốn duyệt [N] công ty đã chọn?"
  - Sau khi xác nhận:
    - Duyệt tất cả công ty đã chọn
    - Gửi email thông báo cho từng Company Owner
    - Hiển thị thông báo "Đã duyệt [N] công ty thành công"
    - Hiển thị danh sách công ty đã duyệt (nếu có lỗi, hiển thị riêng)

---

### AC-6: Lọc và tìm kiếm công ty chờ duyệt

- **Tại:** Màn hình quản lý công ty
- **Khi:** Admin sử dụng bộ lọc hoặc tìm kiếm
- **Thì:**
  - Lọc theo: Ngày tạo, Người tạo, Ngành nghề
  - Tìm kiếm theo: Tên công ty, Email, Số điện thoại
  - Kết quả được cập nhật theo bộ lọc

---

### AC-7: Thống kê công ty chờ duyệt

- **Tại:** Màn hình quản lý công ty (Admin dashboard)
- **Khi:** Admin xem dashboard
- **Thì:**
  - Hiển thị số lượng công ty chờ duyệt
  - Hiển thị số công ty đã duyệt hôm nay
  - Hiển thị số công ty bị từ chối hôm nay
  - Có thể click để xem danh sách chi tiết

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Quyền duyệt | BR_REVIEW_018 | Chỉ Admin mới có quyền duyệt công ty | |
| Status flow | BR_REVIEW_019 | PENDING → APPROVED → ACTIVE hoặc PENDING → ACTIVE | Tùy config |
| Email thông báo | BR_REVIEW_020 | Gửi email cho Owner và người tạo khi duyệt/từ chối | Bắt buộc |

---

## System Rules

- Ghi log đầy đủ mọi thao tác duyệt/từ chối
- Email thông báo là bắt buộc
- Công ty ACTIVE sẽ hiển thị công khai ngay lập tức

---

## Business Value & Success Metrics

Story này cung cấp **khả năng kiểm duyệt công ty, đảm bảo chất lượng thông tin trên hệ thống**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Thời gian duyệt công ty trung bình < 24 giờ
- Tỷ lệ công ty được duyệt >= 90%
- Email thông báo được gửi thành công >= 99%

---

## Dependencies

- Database: Bảng company
- Service: review-company-service
- Notification: Để gửi email thông báo
- Audit log: Để ghi log duyệt/từ chối

---

## Impact Analysis

- **Giao diện người dùng**: Trang quản lý công ty với danh sách chờ duyệt, modal xác nhận
- **Hệ thống backend**: API duyệt/từ chối công ty, API lấy danh sách chờ duyệt
- **Email**: Template email thông báo duyệt/từ chối

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Tự động duyệt công ty - sẽ bổ sung sau
- Duyệt theo quy tắc tự động - sẽ bổ sung sau
- Phân quyền duyệt cho Manager - sẽ xem xét sau

