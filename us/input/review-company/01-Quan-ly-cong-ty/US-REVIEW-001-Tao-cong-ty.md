# US-REVIEW-001: Tạo công ty mới

## User Story

Là **Admin hoặc Manager**
Tôi muốn **tạo mới một công ty trong hệ thống**
Tại **Trang quản lý công ty (review-company-web)**
Để **thêm thông tin công ty mới để người dùng có thể tìm kiếm và review**

---

## Acceptance Criteria

### AC-1: Nhập thông tin cơ bản công ty (Luồng chính)

- **Tại:** Màn hình tạo công ty mới
- **Khi:** Admin/Manager nhập đầy đủ thông tin bắt buộc: Tên công ty, Địa chỉ, Ngành nghề, Mô tả
- **Thì:**
  - Hệ thống validate các trường bắt buộc
  - Tên công ty phải unique trong hệ thống
  - Công ty được tạo với status = PENDING
  - Hiển thị thông báo "Tạo công ty thành công. Vui lòng chờ admin duyệt"
  - Chuyển đến màn hình chi tiết công ty

**Quy tắc nghiệp vụ:**
- Tên công ty: Tối đa 255 ký tự, bắt buộc
- Địa chỉ: Tối đa 500 ký tự, bắt buộc
- Ngành nghề: Chọn từ danh sách có sẵn hoặc nhập mới (nếu Admin)
- Mô tả: Tối đa 2000 ký tự, tùy chọn

---

### AC-2: Nhập thông tin liên hệ

- **Tại:** Màn hình tạo công ty, tab "Thông tin liên hệ"
- **Khi:** Admin/Manager nhập thông tin liên hệ
- **Thì:**
  - Email: Phải đúng định dạng email
  - Số điện thoại: Format chuẩn (10-11 số)
  - Website: URL hợp lệ (tùy chọn)
  - Hotline: Format chuẩn (tùy chọn)
  - Dữ liệu được lưu vào hệ thống

**Quy tắc nghiệp vụ:**
- Email: Format chuẩn, bắt buộc
- Số điện thoại: 10-11 chữ số, bắt buộc
- Website: URL hợp lệ, bắt đầu với http:// hoặc https://
- Hotline: 10-11 chữ số, tùy chọn

---

### AC-3: Gán Company Owner

- **Tại:** Màn hình tạo công ty, tab "Người quản lý"
- **Khi:** Admin/Manager chọn người dùng làm Company Owner
- **Thì:**
  - Tìm kiếm người dùng theo email hoặc tên
  - Hiển thị danh sách người dùng khớp
  - Chọn người dùng làm Company Owner
  - Nếu người dùng chưa tồn tại, có thể tạo mới (chỉ Admin)
  - Company Owner sẽ nhận thông báo khi công ty được duyệt

**Quy tắc nghiệp vụ:**
- Company Owner: Một người dùng trong hệ thống
- Company Owner phải có tài khoản đã kích hoạt
- Nếu không gán, Admin/Manager tạo công ty sẽ là Owner mặc định

---

### AC-4: Upload logo công ty

- **Tại:** Màn hình tạo công ty, tab "Thông tin cơ bản"
- **Khi:** Admin/Manager upload file logo
- **Thì:**
  - Chỉ chấp nhận file ảnh (jpg, png, gif)
  - Kích thước tối đa: 5MB
  - Tự động resize về kích thước chuẩn (300x300px)
  - Hiển thị preview logo
  - Lưu logo lên storage và lưu URL vào database

**Quy tắc nghiệp vụ:**
- Format ảnh: jpg, png, gif
- Kích thước tối đa: 5MB
- Kích thước hiển thị: 300x300px

---

### AC-5: Kiểm tra lỗi nhập liệu

- **Tại:** Màn hình tạo công ty
- **Khi:** Admin/Manager nhập dữ liệu không hợp lệ
- **Thì:**
  - Hiển thị thông báo lỗi rõ ràng tại từng trường
  - Tên công ty trùng: "Tên công ty đã tồn tại trong hệ thống"
  - Email không đúng định dạng: "Email không đúng định dạng"
  - Số điện thoại không hợp lệ: "Số điện thoại không hợp lệ"
  - Không cho phép lưu công ty

---

### AC-6: Lưu nháp công ty

- **Tại:** Màn hình tạo công ty
- **Khi:** Admin/Manager nhấn nút "Lưu nháp"
- **Thì:**
  - Lưu tất cả thông tin đã nhập (kể cả thiếu trường bắt buộc)
  - Status = PENDING
  - Hiển thị thông báo "Đã lưu nháp thành công"
  - Có thể tiếp tục chỉnh sửa sau

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Tên công ty | BR_REVIEW_001 | Bắt buộc nhập, tối đa 255 ký tự, unique | Kiểm tra ở cả giao diện và backend |
| Địa chỉ | BR_REVIEW_002 | Bắt buộc nhập, tối đa 500 ký tự | |
| Ngành nghề | BR_REVIEW_003 | Bắt buộc chọn, từ danh sách có sẵn | Có thể thêm ngành nghề mới nếu là Admin |
| Email | BR_REVIEW_004 | Bắt buộc, đúng định dạng email | Kiểm tra format chuẩn |
| Số điện thoại | BR_REVIEW_005 | Bắt buộc, 10-11 chữ số | Format chuẩn |
| Status | BR_REVIEW_006 | Mặc định = PENDING khi tạo mới | Phải được Admin duyệt mới chuyển sang APPROVED |

---

## System Rules

- Công ty mới tạo luôn có status = PENDING
- Chỉ Admin mới có thể duyệt công ty (chuyển PENDING → APPROVED → ACTIVE)
- Company Owner sẽ nhận email thông báo khi công ty được tạo
- Tất cả các thay đổi công ty phải được ghi log

---

## Business Value & Success Metrics

Story này cung cấp **khả năng tạo và quản lý thông tin công ty, tạo nền tảng cho hệ thống review**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ tạo công ty thành công >= 95%
- Thời gian tạo công ty < 5 phút
- Tỷ lệ công ty có đầy đủ thông tin (logo, liên hệ) >= 80%
- Không có công ty trùng lặp (tên giống nhau)

---

## Dependencies

- Hệ thống xác thực (auth-service) để lấy thông tin Admin/Manager
- Hệ thống lưu trữ file (storage) để lưu logo
- Dịch vụ thông báo (notification-service) để gửi email cho Company Owner
- Database: Bảng company, company_owner, company_category
- Service: review-company-service

---

## Impact Analysis

- **Giao diện người dùng (review-company-web)**: Cần xây dựng form tạo công ty với nhiều tab, upload file, validation
- **Hệ thống backend (review-company-service)**: Xây dựng API tạo công ty, validation, upload file
- **Cơ sở dữ liệu**: Cần tạo cấu trúc bảng mới và các chỉ mục
- **Storage**: Cần cấu hình storage cho logo
- **Notification**: Cần tích hợp gửi email thông báo

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Duyệt công ty (thuộc US-REVIEW-006)
- Chỉnh sửa công ty (thuộc US-REVIEW-004)
- Xóa công ty (thuộc US-REVIEW-005)

### Phạm vi kỹ thuật ngoài
- Upload nhiều ảnh cho công ty - sẽ bổ sung sau
- Tự động verify thông tin công ty - sẽ bổ sung sau
- Tích hợp với Google Maps để chọn địa chỉ - sẽ xem xét sau

