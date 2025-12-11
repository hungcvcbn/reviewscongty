# US-REVIEW-013: Đánh giá theo hạng mục

## User Story

Là **Người dùng đã đăng nhập**
Tôi muốn **đánh giá công ty theo các hạng mục cụ thể khi tạo review**
Tại **Form tạo review, phần "Đánh giá chi tiết"**
Để **cung cấp đánh giá chi tiết và toàn diện hơn về công ty**

---

## Acceptance Criteria

### AC-1: Đánh giá theo 4 categories (Luồng chính)

- **Tại:** Form tạo review, phần "Đánh giá chi tiết"
- **Khi:** User tạo review mới hoặc chỉnh sửa review
- **Thì:**
  - Hiển thị 4 categories để đánh giá:
    1. **Môi trường làm việc (Work Environment)**: 1-5 sao
    2. **Lương thưởng (Salary & Benefits)**: 1-5 sao
    3. **Văn hóa công ty (Company Culture)**: 1-5 sao
    4. **Cơ hội phát triển (Growth Opportunities)**: 1-5 sao
  - Mỗi category có mô tả ngắn gọn
  - User có thể chọn rating cho từng category (tùy chọn)
  - Hiển thị dạng star rating cho mỗi category

---

### AC-2: Tính toán rating trung bình theo category

- **Tại:** Trang chi tiết công ty
- **Khi:** Hiển thị thống kê rating
- **Thì:**
  - Tính rating trung bình cho mỗi category:
    - Rating trung bình = (Tổng rating của category) / (Số review có rating category đó)
  - Hiển thị rating trung bình mỗi category dạng sao
  - Hiển thị số lượng review có rating cho category đó
  - Ví dụ: "Môi trường làm việc: 4.2 sao (15 review)"

---

### AC-3: Hiển thị phân bố rating theo category

- **Tại:** Trang chi tiết công ty, phần "Đánh giá"
- **Khi:** Xem thống kê rating
- **Thì:**
  - Hiển thị biểu đồ phân bố rating cho mỗi category
  - Biểu đồ cột hoặc tròn thể hiện số lượng review theo từng mức sao (1, 2, 3, 4, 5)
  - Có thể click vào biểu đồ để xem chi tiết

---

### AC-4: Validation rating categories

- **Tại:** Form tạo review
- **Khi:** User chọn rating cho categories
- **Thì:**
  - Mỗi category có thể chọn 1-5 sao
  - Có thể bỏ qua một số categories (không bắt buộc tất cả)
  - Khuyến khích nhập đầy đủ 4 categories
  - Hiển thị thông báo: "Đánh giá đầy đủ các hạng mục sẽ giúp người khác hiểu rõ hơn về công ty"

---

### AC-5: So sánh rating categories

- **Tại:** Trang chi tiết công ty
- **Khi:** Hiển thị rating theo categories
- **Thì:**
  - Hiển thị bảng so sánh rating các categories
  - Sắp xếp theo rating từ cao đến thấp
  - Highlight category có rating cao nhất và thấp nhất
  - Có thể xem xu hướng thay đổi rating theo thời gian (nếu có dữ liệu)

---

### AC-6: Gợi ý cải thiện dựa trên rating categories

- **Tại:** Trang quản lý công ty (Company Owner)
- **Khi:** Company Owner xem thống kê rating
- **Thì:**
  - Hiển thị gợi ý cải thiện dựa trên category có rating thấp nhất
  - Ví dụ: "Rating 'Lương thưởng' của bạn thấp hơn trung bình. Cân nhắc cải thiện..."
  - Cung cấp insights và recommendations

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Rating categories | BR_REVIEW_040 | Tùy chọn, khuyến khích nhập đầy đủ | Không bắt buộc tất cả |
| Tính toán rating | BR_REVIEW_041 | Chỉ tính từ review có rating cho category đó | Nếu review không có rating category, không tính vào |

---

## System Rules

- Rating trung bình mỗi category được tính lại mỗi khi có review mới có rating category đó
- Có thể thêm categories mới trong tương lai (configurable)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng đánh giá chi tiết theo từng khía cạnh, cung cấp thông tin toàn diện hơn**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ review có đầy đủ 4 categories >= 70%
- Rating trung bình được tính chính xác = 100%

---

## Dependencies

- Database: Bảng rating_category
- Service: review-company-service
- Frontend: Component star rating cho từng category

---

## Impact Analysis

- **Giao diện người dùng**: Component rating cho từng category, biểu đồ thống kê
- **Hệ thống backend**: Lưu và tính toán rating theo categories
- **Database**: Bảng rating_category để lưu rating từng category

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Thêm categories mới động - sẽ bổ sung sau
- Custom categories - sẽ bổ sung sau
- Rating categories khác nhau cho từng ngành nghề - sẽ xem xét sau

