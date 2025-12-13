# Review Company Backend API

Backend API cho hệ thống Review Công ty sử dụng Node.js, Express, và PostgreSQL.

## Tính năng

- 🔐 **Authentication**: Đăng ký, đăng nhập với JWT
- 🏢 **Company Management**: CRUD công ty, quy trình duyệt
- ⭐ **Reviews & Ratings**: Tạo review, đánh giá theo hạng mục
- 💬 **Comments**: Bình luận và trả lời bình luận (nested comments)
- 📝 **Company Response**: Phản hồi từ công ty
- 🔍 **Search & Filter**: Tìm kiếm, lọc, sắp xếp công ty
- 📤 **File Upload**: Upload logo công ty

## Cài đặt

### Yêu cầu

- Node.js >= 18
- PostgreSQL >= 14
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

### Khởi tạo Database

```bash
# Tạo database
createdb review_company

# Chạy migrations
npm run db:migrate

# Seed dữ liệu mẫu
npm run db:seed
```

### Chạy server

```bash
# Development
npm run dev

# Production
npm start
```

Server chạy tại: http://localhost:3001

## API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký tài khoản |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/auth/me | Lấy thông tin user hiện tại |
| PUT | /api/auth/profile | Cập nhật profile |
| PUT | /api/auth/change-password | Đổi mật khẩu |

### Companies

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/companies | Danh sách công ty |
| GET | /api/companies/:id | Chi tiết công ty |
| POST | /api/companies | Tạo công ty (Admin/Manager) |
| PUT | /api/companies/:id | Cập nhật công ty |
| DELETE | /api/companies/:id | Xóa công ty (Admin) |
| PUT | /api/companies/:id/approve | Duyệt công ty (Admin) |
| PUT | /api/companies/:id/reject | Từ chối công ty (Admin) |
| PUT | /api/companies/:id/activate | Kích hoạt công ty |
| PUT | /api/companies/:id/deactivate | Tạm dừng công ty |
| GET | /api/companies/pending | Danh sách công ty chờ duyệt |
| GET | /api/companies/my-companies | Công ty của tôi (Owner) |

### Reviews

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/reviews | Danh sách review |
| GET | /api/reviews/:id | Chi tiết review |
| POST | /api/reviews | Tạo review |
| PUT | /api/reviews/:id | Cập nhật review |
| DELETE | /api/reviews/:id | Xóa review |
| GET | /api/companies/:companyId/reviews | Reviews của công ty |

### Comments

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/reviews/:reviewId/comments | Danh sách comments |
| POST | /api/reviews/:reviewId/comments | Tạo comment |
| PUT | /api/comments/:id | Cập nhật comment |
| DELETE | /api/comments/:id | Xóa comment |
| POST | /api/comments/:id/like | Like comment |

### Company Response

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/reviews/:reviewId/response | Tạo phản hồi (Owner) |
| PUT | /api/company-responses/:id | Cập nhật phản hồi |
| DELETE | /api/company-responses/:id | Xóa phản hồi |

### Rating Categories

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/rating-categories | Danh sách hạng mục đánh giá |

### Statistics

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/statistics | Thống kê tổng quan |

## Cấu trúc thư mục

```
review-company-be/
├── src/
│   ├── config/         # Cấu hình (database, constants)
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validators/     # Request validators
│   └── app.js          # Entry point
├── migrations/         # Database migrations
├── seeders/           # Database seeders
├── uploads/           # Uploaded files
├── .env.example       # Environment template
├── package.json
└── README.md
```

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| ADMIN | Toàn quyền: CRUD công ty, duyệt, xóa review/comment vi phạm |
| MANAGER | Tạo công ty, quản lý công ty được assign |
| COMPANY_OWNER | Quản lý công ty của mình, phản hồi review |
| USER | Xem công ty, tạo review, bình luận |

## License

MIT
