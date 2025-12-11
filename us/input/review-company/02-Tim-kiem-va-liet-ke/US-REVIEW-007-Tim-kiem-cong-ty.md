# US-REVIEW-007: Tìm kiếm công ty

## User Story

Là **Người dùng bất kỳ**
Tôi muốn **tìm kiếm công ty theo từ khóa**
Tại **Trang danh sách công ty hoặc trang tìm kiếm**
Để **nhanh chóng tìm được công ty mà tôi quan tâm**

---

## Acceptance Criteria

### AC-1: Tìm kiếm công ty theo tên (Luồng chính)

- **Tại:** Màn hình danh sách công ty hoặc trang tìm kiếm
- **Khi:** Người dùng nhập từ khóa vào ô tìm kiếm và nhấn Enter hoặc nút "Tìm kiếm"
- **Thì:**
  - Tìm kiếm trên trường: Tên công ty
  - Không phân biệt chữ hoa chữ thường
  - Tìm kiếm theo từ khóa (partial match)
  - Hiển thị kết quả trong danh sách công ty
  - Kết quả được đánh dấu từ khóa tìm kiếm (highlight)
  - Hiển thị số lượng kết quả: "Tìm thấy [N] công ty"

**Quy tắc nghiệp vụ:**
- Tìm kiếm real-time khi người dùng gõ (có thể debounce 300ms)
- Tối thiểu 2 ký tự mới bắt đầu tìm kiếm

---

### AC-2: Tìm kiếm theo địa chỉ

- **Tại:** Màn hình tìm kiếm
- **Khi:** Người dùng nhập địa chỉ vào ô tìm kiếm
- **Thì:**
  - Tìm kiếm trên trường: Địa chỉ
  - Không phân biệt chữ hoa chữ thường
  - Tìm kiếm theo từ khóa (partial match)
  - Hiển thị kết quả công ty có địa chỉ khớp

---

### AC-3: Tìm kiếm theo ngành nghề

- **Tại:** Màn hình tìm kiếm
- **Khi:** Người dùng chọn ngành nghề từ dropdown hoặc nhập tên ngành nghề
- **Thì:**
  - Tìm kiếm trên trường: Ngành nghề
  - Hiển thị tất cả công ty thuộc ngành nghề đó
  - Có thể kết hợp với tìm kiếm theo tên

---

### AC-4: Tìm kiếm nâng cao

- **Tại:** Màn hình tìm kiếm, mở "Tìm kiếm nâng cao"
- **Khi:** Người dùng sử dụng tìm kiếm nâng cao
- **Thì:**
  - Có thể tìm kiếm kết hợp nhiều tiêu chí:
    - Tên công ty
    - Địa chỉ
    - Ngành nghề
    - Rating tối thiểu
    - Số review tối thiểu
  - Có nút "Xóa bộ lọc" để reset
  - Hiển thị kết quả theo tiêu chí đã chọn

---

### AC-5: Hiển thị kết quả tìm kiếm

- **Tại:** Màn hình kết quả tìm kiếm
- **Khi:** Có kết quả tìm kiếm
- **Thì:**
  - Hiển thị danh sách công ty khớp với từ khóa
  - Mỗi công ty hiển thị: Logo, Tên (highlight từ khóa), Địa chỉ, Rating, Số review
  - Sắp xếp: Relevance trước, sau đó theo rating
  - Phân trang kết quả
  - Hiển thị từ khóa tìm kiếm: "Kết quả tìm kiếm cho: [từ khóa]"

---

### AC-6: Không tìm thấy kết quả

- **Tại:** Màn hình kết quả tìm kiếm
- **Khi:** Không có công ty nào khớp với từ khóa
- **Thì:**
  - Hiển thị thông báo: "Không tìm thấy công ty nào với từ khóa '[từ khóa]'"
  - Hiển thị gợi ý:
    - "Kiểm tra chính tả"
    - "Thử tìm kiếm với từ khóa khác"
    - "Xem danh sách tất cả công ty"
  - Có nút "Xóa bộ lọc" hoặc "Tìm kiếm lại"

---

### AC-7: Lịch sử tìm kiếm

- **Tại:** Màn hình tìm kiếm
- **Khi:** Người dùng đã đăng nhập và có lịch sử tìm kiếm
- **Thì:**
  - Hiển thị dropdown "Lịch sử tìm kiếm" khi focus vào ô tìm kiếm
  - Hiển thị 5-10 từ khóa tìm kiếm gần đây nhất
  - Có thể click để tìm kiếm lại
  - Có thể xóa từng lịch sử tìm kiếm

---

### AC-8: Gợi ý tìm kiếm (Autocomplete)

- **Tại:** Ô tìm kiếm
- **Khi:** Người dùng gõ từ khóa (>= 2 ký tự)
- **Thì:**
  - Hiển thị dropdown với các gợi ý:
    - Tên công ty khớp (tối đa 5 gợi ý)
    - Ngành nghề khớp
  - Có thể dùng phím mũi tên để chọn gợi ý
  - Enter để chọn gợi ý đầu tiên
  - Click để chọn gợi ý

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Từ khóa tối thiểu | BR_REVIEW_021 | Tối thiểu 2 ký tự mới tìm kiếm | |
| Tìm kiếm | BR_REVIEW_022 | Không phân biệt chữ hoa chữ thường, partial match | |
| Sắp xếp kết quả | BR_REVIEW_023 | Relevance trước, sau đó theo rating | |

---

## System Rules

- API tìm kiếm phải có timeout (ví dụ: 5 giây)
- Kết quả tìm kiếm được cache trong thời gian ngắn (ví dụ: 5 phút)
- Hỗ trợ full-text search nếu có thể

---

## Business Value & Success Metrics

Story này cung cấp **khả năng tìm kiếm công ty nhanh chóng, giúp người dùng dễ dàng tìm được công ty quan tâm**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Thời gian tìm kiếm < 300ms
- Tỷ lệ người dùng sử dụng tìm kiếm >= 60%
- Tỷ lệ tìm thấy công ty mong muốn >= 80%

---

## Dependencies

- Database: Bảng company với index trên tên, địa chỉ, ngành nghề
- Service: review-company-service với API tìm kiếm
- Cache: Redis (để cache kết quả tìm kiếm)

---

## Impact Analysis

- **Giao diện người dùng**: Component tìm kiếm với autocomplete, kết quả tìm kiếm
- **Hệ thống backend**: API tìm kiếm với full-text search hoặc LIKE query
- **Performance**: Cần index database và cache

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Tìm kiếm theo tiếng nói - sẽ bổ sung sau
- Tìm kiếm theo hình ảnh - sẽ bổ sung sau
- Tìm kiếm fuzzy (tìm kiếm mờ) - sẽ xem xét sau

