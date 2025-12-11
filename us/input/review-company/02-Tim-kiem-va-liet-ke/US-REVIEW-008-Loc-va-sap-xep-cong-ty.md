# US-REVIEW-008: Lọc và sắp xếp công ty

## User Story

Là **Người dùng bất kỳ**
Tôi muốn **lọc và sắp xếp danh sách công ty theo các tiêu chí khác nhau**
Tại **Trang danh sách công ty**
Để **tìm được công ty phù hợp với nhu cầu của tôi một cách nhanh chóng**

---

## Acceptance Criteria

### AC-1: Lọc theo ngành nghề (Luồng chính)

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng chọn ngành nghề từ dropdown "Lọc theo ngành nghề"
- **Thì:**
  - Hiển thị danh sách ngành nghề có sẵn
  - Có thể chọn một hoặc nhiều ngành nghề
  - Danh sách công ty được lọc theo ngành nghề đã chọn
  - Hiển thị số lượng công ty sau khi lọc: "[N] công ty"
  - Hiển thị tag ngành nghề đã chọn, có thể xóa từng tag

---

### AC-2: Lọc theo rating

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng chọn rating tối thiểu (ví dụ: 4 sao trở lên)
- **Thì:**
  - Hiển thị dropdown: "Tất cả", "4 sao trở lên", "3 sao trở lên", "2 sao trở lên", "1 sao trở lên"
  - Danh sách công ty được lọc theo rating >= giá trị đã chọn
  - Có thể kết hợp với các bộ lọc khác

---

### AC-3: Lọc theo địa điểm

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng chọn địa điểm từ dropdown hoặc nhập địa chỉ
- **Thì:**
  - Hiển thị danh sách địa điểm phổ biến (tỉnh/thành phố)
  - Có thể chọn một hoặc nhiều địa điểm
  - Danh sách công ty được lọc theo địa điểm đã chọn
  - Có thể tìm kiếm địa điểm trong dropdown

---

### AC-4: Lọc theo số review

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng chọn số review tối thiểu
- **Thì:**
  - Hiển thị dropdown: "Tất cả", "10+ review", "50+ review", "100+ review"
  - Danh sách công ty được lọc theo số review >= giá trị đã chọn
  - Có thể kết hợp với các bộ lọc khác

---

### AC-5: Sắp xếp công ty

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng chọn tiêu chí sắp xếp từ dropdown
- **Thì:**
  - Các tùy chọn sắp xếp:
    - Mặc định (Rating giảm dần, sau đó số review)
    - Rating cao nhất
    - Rating thấp nhất
    - Số review nhiều nhất
    - Số review ít nhất
    - Tên A-Z
    - Tên Z-A
    - Mới nhất (ngày tạo)
    - Cũ nhất (ngày tạo)
  - Danh sách được sắp xếp lại theo tiêu chí đã chọn

---

### AC-6: Kết hợp nhiều bộ lọc

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng áp dụng nhiều bộ lọc cùng lúc (ngành nghề + rating + địa điểm)
- **Thì:**
  - Tất cả bộ lọc được áp dụng đồng thời (AND logic)
  - Hiển thị tất cả tags đã chọn
  - Hiển thị số lượng công ty sau khi lọc
  - Có nút "Xóa tất cả bộ lọc" để reset

---

### AC-7: Xóa bộ lọc

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng nhấn "X" trên tag bộ lọc hoặc nhấn "Xóa tất cả bộ lọc"
- **Thì:**
  - Xóa bộ lọc tương ứng
  - Danh sách được cập nhật ngay
  - Nếu xóa tất cả, trở về danh sách mặc định

---

### AC-8: Lưu bộ lọc (nếu user đã đăng nhập)

- **Tại:** Màn hình danh sách công ty
- **Khi:** User đã đăng nhập và đã áp dụng bộ lọc
- **Thì:**
  - Có thể lưu bộ lọc với tên (ví dụ: "Công ty IT ở Hà Nội")
  - Lưu vào danh sách "Bộ lọc đã lưu"
  - Có thể áp dụng lại bộ lọc đã lưu một cách nhanh chóng
  - Có thể xóa bộ lọc đã lưu

---

### AC-9: Hiển thị trạng thái bộ lọc

- **Tại:** Màn hình danh sách công ty
- **Khi:** Người dùng đã áp dụng bộ lọc
- **Thì:**
  - Hiển thị rõ ràng các bộ lọc đang áp dụng (tags)
  - Hiển thị số lượng kết quả: "Hiển thị [N] / [Tổng] công ty"
  - Có thể xem chi tiết từng bộ lọc

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Logic lọc | BR_REVIEW_024 | Kết hợp nhiều bộ lọc = AND logic | Tất cả điều kiện phải thỏa mãn |
| Sắp xếp mặc định | BR_REVIEW_025 | Rating giảm dần, sau đó số review giảm dần | |
| Lọc rating | BR_REVIEW_026 | Rating >= giá trị đã chọn | |

---

## System Rules

- API phải hỗ trợ filter parameters: category, minRating, location, minReviewCount
- API phải hỗ trợ sort parameter: rating, reviewCount, name, createdAt
- Kết quả lọc được cache trong thời gian ngắn

---

## Business Value & Success Metrics

Story này cung cấp **khả năng lọc và sắp xếp công ty, giúp người dùng tìm được công ty phù hợp một cách hiệu quả**

Trọng số của story này là **Trung bình (Medium)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ người dùng sử dụng bộ lọc >= 40%
- Thời gian áp dụng bộ lọc < 500ms
- Tỷ lệ người dùng tìm được công ty mong muốn sau khi lọc >= 70%

---

## Dependencies

- Database: Bảng company với index trên các trường lọc
- Service: review-company-service với API filter và sort
- Cache: Redis (để cache kết quả lọc)

---

## Impact Analysis

- **Giao diện người dùng**: Component filter sidebar hoặc filter bar, dropdown sắp xếp
- **Hệ thống backend**: API với filter và sort parameters
- **Performance**: Cần index database để tăng tốc độ lọc

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Lọc theo khoảng cách địa lý (location-based) - sẽ bổ sung sau
- Lọc theo thời gian hoạt động - sẽ bổ sung sau
- Lọc theo quy mô công ty - sẽ bổ sung sau

