# US-REVIEW-009: Tạo review mới

## User Story

Là **Người dùng đã đăng nhập**
Tôi muốn **tạo review mới cho một công ty**
Tại **Trang chi tiết công ty hoặc trang tạo review**
Để **chia sẻ kinh nghiệm và đánh giá của tôi về công ty đó**

---

## Acceptance Criteria

### AC-1: Nhập thông tin review cơ bản (Luồng chính)

- **Tại:** Màn hình tạo review
- **Khi:** User đã đăng nhập nhấn "Viết Review" trên trang chi tiết công ty
- **Thì:**
  - Hiển thị form tạo review
  - Nhập tiêu đề review (tùy chọn, tối đa 200 ký tự)
  - Nhập nội dung review (bắt buộc, tối đa 2000 ký tự)
  - Chọn rating tổng thể: 1-5 sao (bắt buộc)
  - Hiển thị công ty đang review
  - Nút "Đăng review" và "Lưu nháp"

---

### AC-2: Đánh giá theo categories

- **Tại:** Màn hình tạo review, phần "Đánh giá chi tiết"
- **Khi:** User tạo review
- **Thì:**
  - Đánh giá theo 4 categories (tùy chọn, nhưng nên có):
    - Môi trường làm việc (Work Environment): 1-5 sao
    - Lương thưởng (Salary & Benefits): 1-5 sao
    - Văn hóa công ty (Company Culture): 1-5 sao
    - Cơ hội phát triển (Growth Opportunities): 1-5 sao
  - Mỗi category hiển thị dạng star rating
  - Có thể bỏ qua một số categories (không bắt buộc tất cả)

**Quy tắc nghiệp vụ:**
- Rating tổng thể là bắt buộc
- Rating theo categories là tùy chọn nhưng được khuyến khích

---

### AC-3: Kiểm tra người dùng đã review công ty này chưa

- **Tại:** Hệ thống backend
- **Khi:** User cố tạo review cho một công ty
- **Thì:**
  - Kiểm tra xem user đã có review cho công ty này chưa
  - Nếu đã có review PUBLISHED: Hiển thị thông báo "Bạn đã review công ty này rồi. Bạn có muốn chỉnh sửa review cũ không?"
  - Nếu có review DRAFT: Hiển thị "Bạn có một review đang lưu nháp. Bạn có muốn tiếp tục chỉnh sửa không?"
  - Cho phép tạo review mới hoặc chỉnh sửa review cũ

---

### AC-4: Đăng review thành công

- **Tại:** Màn hình tạo review
- **Khi:** User điền đầy đủ thông tin (rating tổng thể và nội dung) và nhấn "Đăng review"
- **Thì:**
  - Validate dữ liệu
  - Lưu review với status = PUBLISHED
  - Cập nhật rating trung bình của công ty
  - Cập nhật rating theo categories của công ty
  - Gửi email thông báo cho Company Owner (nếu có)
  - Hiển thị thông báo "Đăng review thành công"
  - Chuyển đến trang chi tiết công ty để xem review vừa đăng

---

### AC-5: Lưu nháp review

- **Tại:** Màn hình tạo review
- **Khi:** User nhấn "Lưu nháp"
- **Thì:**
  - Lưu tất cả thông tin đã nhập (kể cả thiếu trường bắt buộc)
  - Status = DRAFT
  - Hiển thị thông báo "Đã lưu nháp thành công"
  - User có thể tiếp tục chỉnh sửa sau

---

### AC-6: Ẩn danh review (tùy chọn)

- **Tại:** Màn hình tạo review
- **Khi:** User tạo review
- **Thì:**
  - Có checkbox "Đăng ẩn danh"
  - Nếu chọn: Tên user sẽ được hiển thị là "Người dùng ẩn danh" hoặc tương tự
  - Avatar vẫn hiển thị (avatar mặc định nếu ẩn danh)
  - Admin vẫn có thể xem thông tin người review

---

### AC-7: Validation và kiểm tra lỗi

- **Tại:** Màn hình tạo review
- **Khi:** User nhập dữ liệu không hợp lệ
- **Thì:**
  - Rating tổng thể chưa chọn: "Vui lòng chọn rating"
  - Nội dung review trống: "Vui lòng nhập nội dung review"
  - Nội dung quá dài (> 2000 ký tự): "Nội dung không được vượt quá 2000 ký tự"
  - Hiển thị lỗi tại từng trường tương ứng
  - Không cho phép đăng review

---

## Inline Business Rules

| Trường thông tin | Mã BR | Quy tắc nghiệp vụ | Ghi chú |
|------------------|-------|-------------------|---------|
| Rating tổng thể | BR_REVIEW_027 | Bắt buộc, 1-5 sao | |
| Nội dung review | BR_REVIEW_028 | Bắt buộc, tối đa 2000 ký tự | |
| Một user một review | BR_REVIEW_029 | Một user chỉ có thể có 1 review PUBLISHED cho mỗi công ty | Có thể chỉnh sửa review cũ |
| Rating categories | BR_REVIEW_030 | Tùy chọn, khuyến khích nhập | |

---

## System Rules

- Một user chỉ có thể có 1 review PUBLISHED cho mỗi công ty
- Khi đăng review mới, rating trung bình của công ty được tính lại
- Email thông báo cho Company Owner khi có review mới (có thể tắt trong settings)

---

## Business Value & Success Metrics

Story này cung cấp **khả năng tạo review, tạo nội dung người dùng và đánh giá công ty**

Trọng số của story này là **Cao (High)**

Story được coi là thành công khi đảm bảo được:
- Tỷ lệ tạo review thành công >= 95%
- Thời gian tạo review < 5 phút
- Tỷ lệ review có đầy đủ categories >= 70%

---

## Dependencies

- Database: Bảng review, rating, rating_category
- Service: review-company-service
- Auth: Để lấy thông tin user đã đăng nhập
- Notification: Để gửi email cho Company Owner

---

## Impact Analysis

- **Giao diện người dùng**: Form tạo review với star rating, textarea, validation
- **Hệ thống backend**: API tạo review, tính toán rating trung bình
- **Database**: Cần tính lại rating mỗi khi có review mới

---

## Out of Scope Items

### Phạm vi nghiệp vụ ngoài
- Upload ảnh trong review - sẽ bổ sung sau
- Tag công ty trong review - sẽ bổ sung sau
- Review phải được duyệt trước khi hiển thị - sẽ xem xét sau

