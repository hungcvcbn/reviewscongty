# US-REVIEW-002: Xem danh sách công ty

## User Story

Là **Người dùng bất kỳ**
Tôi muốn **xem danh sách tất cả các công ty trong hệ thống**
Tại **Trang chủ hoặc trang danh sách công ty**
Để **tìm kiếm và khám phá các công ty để review hoặc tìm hiểu thông tin**

---

## Acceptance Criteria

### AC-1: Hiển thị danh sách công ty với phân trang (Luồng chính)

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng truy cập trang danh sách công ty
- **Thì:**
  - Hiển thị danh sách công ty dạng card hoặc list
  - Mỗi công ty hiển thị: Logo, Tên công ty, Địa chỉ, Ngành nghề, Rating trung bình, Số review
  - Phân trang: 20 công ty/trang
  - Sắp xếp mặc định: Rating giảm dần, sau đó theo số review
  - Chỉ hiển thị công ty có status = ACTIVE

**Quy tắc nghiệp vụ:**
- Chỉ hiển thị công ty ACTIVE cho người dùng thông thường
- Admin/Manager có thể xem thêm công ty PENDING, APPROVED, INACTIVE (có filter)

---

### AC-2: Hiển thị rating và số review

- **Tại:** Màn hình danh sách công ty
- **Khi:** Hiển thị thông tin công ty
- **Thì:**
  - Hiển thị rating trung bình dạng sao (1-5 sao)
  - Hiển thị số lượng review
  - Nếu chưa có review: Hiển thị "Chưa có đánh giá"
  - Rating được làm tròn 1 chữ số thập phân

**Quy tắc nghiệp vụ:**
- Rating trung bình = (Tổng rating tổng thể) / Số review
- Làm tròn đến 1 chữ số thập phân

---

### AC-3: Phân trang

- **Tại:** Màn hình danh sách công ty
- **Khi:** Danh sách có nhiều hơn 20 công ty
- **Thì:**
  - Hiển thị phân trang ở cuối danh sách
  - Hiển thị tổng số trang
  - Cho phép chuyển trang: Trước, Sau, Trang đầu, Trang cuối
  - Hiển thị số công ty đang xem (ví dụ: "Đang hiển thị 1-20 / 150 công ty")

---

### AC-4: Hiển thị empty state

- **Tại:** Màn hình danh sách công ty
- **Khi:** Không có công ty nào thỏa điều kiện tìm kiếm/lọc
- **Thì:**
  - Hiển thị thông báo: "Không tìm thấy công ty nào"
  - Hiển thị nút "Xóa bộ lọc" hoặc "Xem tất cả"
  - Có thể hiển thị gợi ý tìm kiếm

---

### AC-5: Xử lý lỗi khi tải danh sách

- **Tại:** Màn hình danh sách công ty
- **Khi:** Gọi API thất bại do lỗi máy chủ hoặc mạng
- **Thì:**
  - Hiển thị trạng thái lỗi với thông báo: "Không thể tải danh sách công ty. Vui lòng thử lại"
  - Hiển thị nút "Thử lại"
  - Ghi nhật ký lỗi

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Hiển thị công ty | BR_REVIEW_007 | Chỉ hiển thị công ty ACTIVE cho user thông thường | Admin/Manager có thể xem thêm trạng thái khác |
| Phân trang | BR_REVIEW_008 | 20 công ty/trang | Có thể cấu hình sau |
| Sắp xếp mặc định | BR_REVIEW_009 | Rating giảm dần, sau đó số review | |

---

## System Rules

- API phải hỗ trợ pagination với page và limit
- API phải hỗ trợ filtering và sorting
- Dữ liệu công ty được cache để tăng tốc độ tải

---

## Business Value & Success Metrics

Story này cung cấp **khả năng xem danh sách công ty, tạo cái nhìn tổng quan về các công ty trong hệ thống**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Thời gian tải trang danh sách < 2 giây (với 100 công ty)
- Thời gian phản hồi API < 500ms
- Tỷ lệ thành công API >= 99%

---

## Dependencies

- Database: Bảng company, review (để tính rating và số review)
- Service: review-company-service
- Cache: Redis (để cache danh sách công ty)

---

## Impact Analysis

- **Giao diện người dùng (review-company-web)**: Cần xây dựng component danh sách công ty với pagination
- **Hệ thống backend (review-company-service)**: API lấy danh sách công ty với pagination, filter, sort
- **Performance**: Cần cache để tăng tốc độ

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Tìm kiếm công ty (thuộc US-REVIEW-007)
- Lọc và sắp xếp (thuộc US-REVIEW-008)
- Xem chi tiết công ty (thuộc US-REVIEW-003)

