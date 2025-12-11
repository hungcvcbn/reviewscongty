# Review Company Documentation

## Tổng quan

Tài liệu này chứa tất cả các user stories và technical specifications liên quan đến hệ thống **Review Công ty** - một hệ thống cho phép người dùng tìm kiếm, liệt kê, tạo công ty, review, đánh giá và bình luận về các công ty.

## Cấu trúc thư mục

```
us/input/review-company/
├── README.md                                    # File này
├── US-REVIEW-00-Tong-Quan.md                   # Tổng quan hệ thống
├── User-Stories-REVIEW.md                      # Tổng hợp tất cả US
├── 01-Quan-ly-cong-ty/                         # Quản lý công ty
│   ├── US-REVIEW-001-Tao-cong-ty.md
│   ├── US-REVIEW-002-Xem-danh-sach-cong-ty.md
│   ├── US-REVIEW-003-Xem-chi-tiet-cong-ty.md
│   ├── US-REVIEW-004-Chinh-sua-cong-ty.md
│   ├── US-REVIEW-005-Xoa-cong-ty.md
│   └── US-REVIEW-006-Duyet-cong-ty.md
├── 02-Tim-kiem-va-liet-ke/                     # Tìm kiếm và liệt kê
│   ├── US-REVIEW-007-Tim-kiem-cong-ty.md
│   └── US-REVIEW-008-Loc-va-sap-xep-cong-ty.md
├── 03-Review-va-danh-gia/                      # Review và đánh giá
│   ├── US-REVIEW-009-Tao-review.md
│   ├── US-REVIEW-010-Xem-danh-sach-review.md
│   ├── US-REVIEW-011-Chinh-sua-review.md
│   ├── US-REVIEW-012-Xoa-review.md
│   └── US-REVIEW-013-Danh-gia-theo-hang-muc.md
└── 04-Binh-luan/                               # Bình luận
    ├── US-REVIEW-014-Binh-luan-tren-review.md
    ├── US-REVIEW-015-Chinh-sua-binh-luan.md
    └── US-REVIEW-016-Phan-hoi-tu-cong-ty.md
```

## Danh sách các module chính

### 1. Quản lý công ty
- **Thư mục**: `01-Quan-ly-cong-ty/`
- **Các user stories**:
  - US-REVIEW-001: Tạo công ty mới
  - US-REVIEW-002: Xem danh sách công ty
  - US-REVIEW-003: Xem chi tiết công ty
  - US-REVIEW-004: Chỉnh sửa công ty
  - US-REVIEW-005: Xóa công ty
  - US-REVIEW-006: Duyệt công ty
- **Chức năng chính**:
  - Admin/Manager có thể tạo và quản lý công ty
  - Company Owner có thể quản lý thông tin công ty của mình
  - Quy trình approval công ty (PENDING → APPROVED → ACTIVE)
  - Quản lý thông tin cơ bản: tên, địa chỉ, ngành nghề, mô tả

### 2. Tìm kiếm và liệt kê
- **Thư mục**: `02-Tim-kiem-va-liet-ke/`
- **Các user stories**:
  - US-REVIEW-007: Tìm kiếm công ty
  - US-REVIEW-008: Lọc và sắp xếp công ty
- **Chức năng chính**:
  - Tìm kiếm công ty theo tên, địa chỉ, ngành nghề
  - Lọc công ty theo rating, ngành nghề, địa điểm
  - Sắp xếp theo rating, số review, ngày tạo

### 3. Review và đánh giá
- **Thư mục**: `03-Review-va-danh-gia/`
- **Các user stories**:
  - US-REVIEW-009: Tạo review mới
  - US-REVIEW-010: Xem danh sách review của công ty
  - US-REVIEW-011: Chỉnh sửa review
  - US-REVIEW-012: Xóa review
  - US-REVIEW-013: Đánh giá theo hạng mục
- **Chức năng chính**:
  - Người dùng đã xác thực có thể tạo review
  - Đánh giá tổng thể: 1-5 sao
  - Đánh giá theo categories: Môi trường làm việc, Lương thưởng, Văn hóa công ty, Cơ hội phát triển
  - Người dùng chỉ có thể chỉnh sửa/xóa review của chính mình

### 4. Bình luận
- **Thư mục**: `04-Binh-luan/`
- **Các user stories**:
  - US-REVIEW-014: Bình luận trên review
  - US-REVIEW-015: Chỉnh sửa bình luận
  - US-REVIEW-016: Phản hồi từ công ty
- **Chức năng chính**:
  - Người dùng có thể bình luận trên review
  - Company Owner có thể phản hồi review
  - Quản lý bình luận (chỉnh sửa, xóa)

## Tổng kết tài liệu

### Tổng số User Stories: 16

**Nhóm 01: Quản lý công ty (6 US)**
- US-REVIEW-001 đến US-REVIEW-006

**Nhóm 02: Tìm kiếm và liệt kê (2 US)**
- US-REVIEW-007, US-REVIEW-008

**Nhóm 03: Review và đánh giá (5 US)**
- US-REVIEW-009 đến US-REVIEW-013

**Nhóm 04: Bình luận (3 US)**
- US-REVIEW-014 đến US-REVIEW-016

## Vai trò người dùng

### Admin
- Toàn quyền quản lý hệ thống
- Tạo, sửa, xóa công ty
- Duyệt công ty
- Xóa review/bình luận vi phạm

### Manager
- Tạo và quản lý công ty được assign
- Duyệt công ty (nếu được phân quyền)

### Regular User
- Xem danh sách công ty
- Tìm kiếm và lọc công ty
- Xem chi tiết công ty
- Tạo review với rating
- Bình luận trên review

### Company Owner
- Quản lý thông tin công ty của mình
- Phản hồi review
- Xem thống kê review và rating

## Hệ thống rating

### Rating tổng thể
- Thang điểm: 1-5 sao
- Tính toán: Trung bình cộng của tất cả review

### Rating theo categories
- **Môi trường làm việc (Work Environment)**: 1-5 sao
- **Lương thưởng (Salary & Benefits)**: 1-5 sao
- **Văn hóa công ty (Company Culture)**: 1-5 sao
- **Cơ hội phát triển (Growth Opportunities)**: 1-5 sao

## Trạng thái công ty

| Trạng thái | Mã trạng thái | Mô tả |
|-----------|---------------|-------|
| Chờ duyệt | PENDING | Công ty mới tạo, chờ admin duyệt |
| Đã duyệt | APPROVED | Công ty đã được duyệt, chưa kích hoạt |
| Đang hoạt động | ACTIVE | Công ty đang hiển thị công khai |
| Tạm dừng | INACTIVE | Công ty tạm dừng hoạt động |
| Đã xóa | DELETED | Công ty đã bị xóa (soft delete) |

## Trạng thái review

| Trạng thái | Mã trạng thái | Mô tả |
|-----------|---------------|-------|
| Bản nháp | DRAFT | Review đang được soạn, chưa publish |
| Đã công bố | PUBLISHED | Review đã được công bố |
| Đã chỉnh sửa | EDITED | Review đã được chỉnh sửa sau khi publish |
| Đã xóa | DELETED | Review đã bị xóa (soft delete) |

## Tài liệu tham khảo

- [HLD Review Company](../../hld/output/review-company/HLD-REVIEW-COMPANY.md)
- [DD Review Company](../../dd/review-company/DD-REVIEW-COMPANY.md)
- [Template User Story](../pim/US-PIM-001-Tao-san-pham-giao-duc-moi.md)

## Ngôn ngữ và định dạng

- **Ngôn ngữ**: Tiếng Việt
- **Định dạng**: Markdown
- **Template**: Tuân thủ template User Story chuẩn của dự án

---

**Ghi chú:**
- Tất cả User Stories tuân thủ template quy định
- Thuật ngữ được chuẩn hóa và sử dụng nhất quán
- Mỗi US có đầy đủ Acceptance Criteria, Business Rules, Dependencies, và Impact Analysis

