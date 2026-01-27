# MovieStream - User Story Checklist

## Tổng quan

Danh sách User Stories cho dự án MovieStream, được trích xuất từ các HLD documents.

---

## Authentication & Authorization (HLD-MS-AUTH)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-AUTH-01 | End Users | Thêm mới | Đăng ký tài khoản mới với email và mật khẩu | Cần validate email format, mật khẩu tối thiểu 8 ký tự |
| US-AUTH-02 | End Users | Thêm mới | Đăng nhập bằng email/password để truy cập hệ thống | JWT tokens với access + refresh |
| US-AUTH-03 | End Users | Thêm mới | Đăng xuất khỏi hệ thống để bảo mật tài khoản | Invalidate refresh token |
| US-AUTH-04 | End Users | Thêm mới | Quên mật khẩu - nhận link reset qua email | Phase 2 |
| US-AUTH-05 | End Users | Thêm mới | Đăng nhập bằng Google/Facebook | Phase 2 |

---

## User Profile & Preferences (HLD-MS-USER)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-USER-01 | End Users | Thêm mới | Cập nhật thông tin cá nhân (tên, avatar) | Upload avatar lên cloud storage |
| US-USER-02 | End Users | Thêm mới | Xem lịch sử các phim đã xem và tiến độ xem | Hiển thị % đã xem, sort theo thời gian |
| US-USER-03 | End Users | Thêm mới | Thêm phim yêu thích vào danh sách để xem sau | Toggle add/remove |
| US-USER-04 | End Users | Thêm mới | Xóa lịch sử xem phim | Xóa từng phim hoặc xóa tất cả |
| US-USER-05 | End Users | Thêm mới | Cài đặt chất lượng video mặc định (720p/1080p) | Lưu preference |

---

## Movie & Episode Management (HLD-MS-MOVIE)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-MOVIE-01 | End Users | Thêm mới | Xem danh sách phim trên trang chủ với phân trang | Grid layout, lazy loading |
| US-MOVIE-02 | End Users | Thêm mới | Tìm kiếm phim theo tên | Search với debounce |
| US-MOVIE-03 | End Users | Thêm mới | Lọc phim theo thể loại (category) | Dropdown filter |
| US-MOVIE-04 | End Users | Thêm mới | Lọc phim theo tag | Multiple tags selection |
| US-MOVIE-05 | End Users | Thêm mới | Xem trang chi tiết phim với thông tin đầy đủ | Poster, mô tả, rating, danh sách tập |
| US-MOVIE-06 | End Users | Thêm mới | Xem danh sách tập của phim bộ | Hiển thị số tập, duration, status |
| US-MOVIE-07 | Ecosystem Operators | Thêm mới | Tạo phim mới với thông tin cơ bản | Admin only |
| US-MOVIE-08 | Ecosystem Operators | Thêm mới | Cập nhật thông tin phim | Admin only |
| US-MOVIE-09 | Ecosystem Operators | Thêm mới | Xóa phim khỏi hệ thống | Admin only, soft delete |
| US-MOVIE-10 | Ecosystem Operators | Thêm mới | Thay đổi trạng thái phim (DRAFT/PUBLISHED/ARCHIVED) | Admin only |

---

## Video Streaming & Protection (HLD-MS-STREAMING)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-STREAM-01 | End Users | Thêm mới | Xem video streaming chất lượng 1080p mượt mà | Yêu cầu subscription active |
| US-STREAM-02 | End Users | Thêm mới | Tiếp tục xem phim từ vị trí đã dừng lần trước | Auto-save progress mỗi 30s |
| US-STREAM-03 | End Users | Thêm mới | Xem phim trên thiết bị mobile với giao diện tối ưu | Responsive player |
| US-STREAM-04 | End Users | Thêm mới | Chọn chất lượng video (720p/1080p) trong player | Quality selector trong player UI |
| US-STREAM-05 | End Users | Thêm mới | Điều chỉnh tốc độ phát video (0.5x - 2x) | Speed control |

---

## Subscription & Payment (HLD-MS-SUBSCRIPTION)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-SUB-01 | End Users | Thêm mới | Xem danh sách các gói subscription và so sánh quyền lợi | Pricing page |
| US-SUB-02 | End Users | Thêm mới | Thanh toán subscription qua VNPay | Redirect flow |
| US-SUB-03 | End Users | Thêm mới | Thanh toán subscription qua MoMo | Phase 2 |
| US-SUB-04 | End Users | Thêm mới | Xem thông tin subscription hiện tại và ngày hết hạn | Subscription page |
| US-SUB-05 | End Users | Thêm mới | Gia hạn subscription trước khi hết hạn | Renew button |
| US-SUB-06 | End Users | Thêm mới | Xem lịch sử thanh toán | Payment history list |
| US-SUB-07 | End Users | Thêm mới | Nâng cấp gói subscription lên tier cao hơn | Upgrade flow |

---

## Review & Rating System (HLD-MS-REVIEW)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-REVIEW-01 | End Users | Thêm mới | Xem danh sách reviews và rating của phim | Pagination, sort by helpful |
| US-REVIEW-02 | End Users | Thêm mới | Xem rating trung bình và phân bố sao của phim | Rating distribution chart |
| US-REVIEW-03 | End Users | Thêm mới | Viết review và đánh giá sao cho phim đã xem | Yêu cầu subscription, 1 review/user/movie |
| US-REVIEW-04 | End Users | Thêm mới | Chỉnh sửa review đã viết | Owner only |
| US-REVIEW-05 | End Users | Thêm mới | Xóa review của mình | Owner only |
| US-REVIEW-06 | End Users | Thêm mới | Vote review "Helpful" hoặc "Not Helpful" | Toggle vote |
| US-REVIEW-07 | Ecosystem Operators | Thêm mới | Xóa review vi phạm quy định | Admin moderation |

---

## Admin Panel (HLD-MS-ADMIN)

| Tên US | Nhóm | Phạm vi | Mô tả | Ghi chú |
|--------|------|---------|-------|---------|
| US-ADMIN-01 | Ecosystem Operators | Thêm mới | Upload video mới lên hệ thống | TUS protocol, resumable upload |
| US-ADMIN-02 | Ecosystem Operators | Thêm mới | Quản lý danh sách phim (xem, sửa, xóa) | CRUD với filters |
| US-ADMIN-03 | Ecosystem Operators | Thêm mới | Quản lý danh sách tập phim | Link video với episode |
| US-ADMIN-04 | Ecosystem Operators | Thêm mới | Xem Dashboard thống kê tổng quan | Users, revenue, views |
| US-ADMIN-05 | Ecosystem Operators | Thêm mới | Xem biểu đồ doanh thu theo thời gian | Revenue chart |
| US-ADMIN-06 | Ecosystem Operators | Thêm mới | Xem biểu đồ tăng trưởng users | User growth chart |
| US-ADMIN-07 | Ecosystem Operators | Thêm mới | Quản lý danh sách users | List, search, deactivate |
| US-ADMIN-08 | Ecosystem Operators | Thêm mới | Xem chi tiết user và subscription history | User detail page |
| US-ADMIN-09 | Ecosystem Operators | Thêm mới | Kích hoạt/vô hiệu hóa tài khoản user | Toggle active status |
| US-ADMIN-10 | Ecosystem Operators | Thêm mới | Xem lịch sử thanh toán của hệ thống | Payment list với filters |
| US-ADMIN-11 | Ecosystem Operators | Thêm mới | Gia hạn subscription cho user (manual) | Support case |

---

## Tổng kết

| Module | End Users | Ecosystem Operators | Tổng |
|--------|-----------|---------------------|------|
| Authentication | 5 | 0 | 5 |
| User Profile | 5 | 0 | 5 |
| Movie | 6 | 4 | 10 |
| Streaming | 5 | 0 | 5 |
| Subscription | 7 | 0 | 7 |
| Review | 6 | 1 | 7 |
| Admin | 0 | 11 | 11 |
| **Tổng cộng** | **34** | **16** | **50** |

---

## Phân loại theo Phase

### MVP (Phase 1) - Ưu tiên cao
- US-AUTH-01, 02, 03 (Đăng ký, đăng nhập, đăng xuất)
- US-MOVIE-01 đến 06 (Xem phim, chi tiết, danh sách tập)
- US-STREAM-01, 02 (Xem video, tiếp tục xem)
- US-SUB-01, 02, 04 (Xem gói, thanh toán VNPay, xem subscription)
- US-ADMIN-01 đến 04, 07 (Upload, quản lý phim, dashboard, quản lý users)

### Phase 2 - Enhancement
- US-AUTH-04, 05 (Quên mật khẩu, social login)
- US-USER-01 đến 05 (Profile, history, favorites)
- US-STREAM-03, 04, 05 (Mobile, quality, speed)
- US-SUB-03, 05, 06, 07 (MoMo, gia hạn, history, upgrade)
- US-REVIEW-01 đến 07 (Toàn bộ review system)
- US-ADMIN còn lại (Analytics chi tiết)

---

*Document Version: 1.0*
*Last Updated: January 2026*
