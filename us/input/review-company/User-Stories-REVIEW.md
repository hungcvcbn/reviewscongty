# USER STORIES - REVIEW COMPANY SYSTEM

> **Hệ thống:** Review Company System
> **Phiên bản:** 1.0
> **Ngày tạo:** 2025-01-26

---

## Tổng quan

Tài liệu này tổng hợp tất cả 16 User Stories cho hệ thống Review Công ty. Chi tiết đầy đủ của mỗi User Story xem tại các file tương ứng trong thư mục.

---

# A. QUẢN LÝ CÔNG TY

Xem chi tiết tại: `01-Quan-ly-cong-ty/`

## US-REVIEW-001: Tạo công ty mới

**Vai trò:** Admin/Manager  
**Mô tả:** Tạo công ty mới với thông tin cơ bản, liên hệ, logo, gán Company Owner  
**Trạng thái:** PENDING sau khi tạo  
**File:** [US-REVIEW-001-Tao-cong-ty.md](01-Quan-ly-cong-ty/US-REVIEW-001-Tao-cong-ty.md)

## US-REVIEW-002: Xem danh sách công ty

**Vai trò:** Tất cả users  
**Mô tả:** Hiển thị danh sách công ty với phân trang, rating, số review  
**File:** [US-REVIEW-002-Xem-danh-sach-cong-ty.md](01-Quan-ly-cong-ty/US-REVIEW-002-Xem-danh-sach-cong-ty.md)

## US-REVIEW-003: Xem chi tiết công ty

**Vai trò:** Tất cả users  
**Mô tả:** Xem thông tin chi tiết công ty, rating, review gần đây  
**File:** [US-REVIEW-003-Xem-chi-tiet-cong-ty.md](01-Quan-ly-cong-ty/US-REVIEW-003-Xem-chi-tiet-cong-ty.md)

## US-REVIEW-004: Chỉnh sửa công ty

**Vai trò:** Admin/Manager/Company Owner  
**Mô tả:** Chỉnh sửa thông tin công ty với optimistic locking  
**File:** [US-REVIEW-004-Chinh-sua-cong-ty.md](01-Quan-ly-cong-ty/US-REVIEW-004-Chinh-sua-cong-ty.md)

## US-REVIEW-005: Xóa công ty

**Vai trò:** Admin  
**Mô tả:** Xóa công ty (soft delete) với lý do  
**File:** [US-REVIEW-005-Xoa-cong-ty.md](01-Quan-ly-cong-ty/US-REVIEW-005-Xoa-cong-ty.md)

## US-REVIEW-006: Duyệt công ty

**Vai trò:** Admin  
**Mô tả:** Duyệt công ty PENDING, chuyển sang APPROVED/ACTIVE  
**File:** [US-REVIEW-006-Duyet-cong-ty.md](01-Quan-ly-cong-ty/US-REVIEW-006-Duyet-cong-ty.md)

---

# B. TÌM KIẾM VÀ LIỆT KÊ

Xem chi tiết tại: `02-Tim-kiem-va-liet-ke/`

## US-REVIEW-007: Tìm kiếm công ty

**Vai trò:** Tất cả users  
**Mô tả:** Tìm kiếm công ty theo tên, địa chỉ, ngành nghề với autocomplete  
**File:** [US-REVIEW-007-Tim-kiem-cong-ty.md](02-Tim-kiem-va-liet-ke/US-REVIEW-007-Tim-kiem-cong-ty.md)

## US-REVIEW-008: Lọc và sắp xếp công ty

**Vai trò:** Tất cả users  
**Mô tả:** Lọc theo ngành nghề, rating, địa điểm, số review; Sắp xếp theo nhiều tiêu chí  
**File:** [US-REVIEW-008-Loc-va-sap-xep-cong-ty.md](02-Tim-kiem-va-liet-ke/US-REVIEW-008-Loc-va-sap-xep-cong-ty.md)

---

# C. REVIEW VÀ ĐÁNH GIÁ

Xem chi tiết tại: `03-Review-va-danh-gia/`

## US-REVIEW-009: Tạo review mới

**Vai trò:** Authenticated User  
**Mô tả:** Tạo review với rating tổng thể, rating theo categories, nội dung  
**File:** [US-REVIEW-009-Tao-review.md](03-Review-va-danh-gia/US-REVIEW-009-Tao-review.md)

## US-REVIEW-010: Xem danh sách review của công ty

**Vai trò:** Tất cả users  
**Mô tả:** Xem danh sách review với phân trang, lọc, sắp xếp, đánh dấu hữu ích  
**File:** [US-REVIEW-010-Xem-danh-sach-review.md](03-Review-va-danh-gia/US-REVIEW-010-Xem-danh-sach-review.md)

## US-REVIEW-011: Chỉnh sửa review

**Vai trò:** Review Owner  
**Mô tả:** Chỉnh sửa review của chính mình, tối đa 3 lần  
**File:** [US-REVIEW-011-Chinh-sua-review.md](03-Review-va-danh-gia/US-REVIEW-011-Chinh-sua-review.md)

## US-REVIEW-012: Xóa review

**Vai trò:** Review Owner/Admin  
**Mô tả:** Xóa review (soft delete), tính lại rating công ty  
**File:** [US-REVIEW-012-Xoa-review.md](03-Review-va-danh-gia/US-REVIEW-012-Xoa-review.md)

## US-REVIEW-013: Đánh giá theo hạng mục

**Vai trò:** Authenticated User  
**Mô tả:** Đánh giá theo 4 categories: Môi trường làm việc, Lương thưởng, Văn hóa, Cơ hội phát triển  
**File:** [US-REVIEW-013-Danh-gia-theo-hang-muc.md](03-Review-va-danh-gia/US-REVIEW-013-Danh-gia-theo-hang-muc.md)

---

# D. BÌNH LUẬN

Xem chi tiết tại: `04-Binh-luan/`

## US-REVIEW-014: Bình luận trên review

**Vai trò:** Authenticated User  
**Mô tả:** Bình luận trên review, reply, like bình luận  
**File:** [US-REVIEW-014-Binh-luan-tren-review.md](04-Binh-luan/US-REVIEW-014-Binh-luan-tren-review.md)

## US-REVIEW-015: Chỉnh sửa bình luận

**Vai trò:** Comment Owner  
**Mô tả:** Chỉnh sửa bình luận trong vòng 24 giờ  
**File:** [US-REVIEW-015-Chinh-sua-binh-luan.md](04-Binh-luan/US-REVIEW-015-Chinh-sua-binh-luan.md)

## US-REVIEW-016: Phản hồi từ công ty

**Vai trò:** Company Owner  
**Mô tả:** Phản hồi chính thức cho review, chỉ 1 phản hồi/review  
**File:** [US-REVIEW-016-Phan-hoi-tu-cong-ty.md](04-Binh-luan/US-REVIEW-016-Phan-hoi-tu-cong-ty.md)

---

## SUMMARY

Tổng cộng **16 User Stories** đã được phân rã, bao phủ:

### Nhóm A: Quản lý công ty (6 US)
- US-REVIEW-001: Tạo công ty mới
- US-REVIEW-002: Xem danh sách công ty
- US-REVIEW-003: Xem chi tiết công ty
- US-REVIEW-004: Chỉnh sửa công ty
- US-REVIEW-005: Xóa công ty
- US-REVIEW-006: Duyệt công ty

### Nhóm B: Tìm kiếm và liệt kê (2 US)
- US-REVIEW-007: Tìm kiếm công ty
- US-REVIEW-008: Lọc và sắp xếp công ty

### Nhóm C: Review và đánh giá (5 US)
- US-REVIEW-009: Tạo review mới
- US-REVIEW-010: Xem danh sách review
- US-REVIEW-011: Chỉnh sửa review
- US-REVIEW-012: Xóa review
- US-REVIEW-013: Đánh giá theo hạng mục

### Nhóm D: Bình luận (3 US)
- US-REVIEW-014: Bình luận trên review
- US-REVIEW-015: Chỉnh sửa bình luận
- US-REVIEW-016: Phản hồi từ công ty

---

**Tất cả User Stories đã:**
- ✅ Cover Happy Paths (luồng chính)
- ✅ Cover Alternative Paths (luồng thay thế)
- ✅ Cover Edge Cases & Error Conditions (ngoại lệ)
- ✅ Tuân thủ Template quy định
- ✅ Sử dụng ngôn ngữ nghiệp vụ đồng nhất
- ✅ Có Business Value và Success Metrics rõ ràng

---

**Chi tiết đầy đủ từng User Story xem tại các file tương ứng trong thư mục con.**

