# COMPONENT VIEW - Review Company System

## Tổng quan hệ thống

Hệ thống Review Company được thiết kế theo kiến trúc modern với các thành phần chính bao gồm:
- Web Application cho người dùng
- Backend Services xử lý logic nghiệp vụ
- External Services hỗ trợ

---

## WEB APPLICATION COMPONENTS

### review-company-web
**Technology:** Next.js/React

Đây là ứng dụng web duy nhất phục vụ tất cả người dùng của hệ thống:
- **Admin**: Quản lý công ty, duyệt công ty, xóa review/bình luận vi phạm
- **Manager**: Tạo và quản lý công ty được assign
- **Regular User**: Tìm kiếm công ty, xem chi tiết, tạo review, bình luận
- **Company Owner**: Quản lý thông tin công ty, phản hồi review

**Các tính năng chính:**
- Trang chủ với danh sách công ty
- Trang tìm kiếm và filter công ty
- Trang chi tiết công ty với reviews
- Trang tạo/chỉnh sửa review
- Hệ thống bình luận và trả lời bình luận
- Dashboard quản trị cho Admin/Manager
- Dashboard Company Owner

---

## BACKEND SERVICES

### review-company-service
**Technology:** Next.js API Routes hoặc Java/SpringBoot  
**Database:** PostgreSQL

Đây là backend service chính quản lý toàn bộ logic nghiệp vụ của hệ thống, bao gồm:

#### Company Management
Quản lý thông tin công ty:
- Company CRUD operations
- Company status management (PENDING, APPROVED, ACTIVE, INACTIVE, DELETED)
- Company approval workflow
- Company categories management
- Company owner assignment

#### Review Management
Quản lý review và đánh giá:
- Review CRUD operations
- Review status management (DRAFT, PUBLISHED, EDITED, DELETED)
- Edit limit enforcement (tối đa 3 lần)
- Anonymous review option
- Review moderation

#### Rating Management
Quản lý hệ thống rating:
- Rating categories (WORK_ENVIRONMENT, SALARY_BENEFITS, COMPANY_CULTURE, GROWTH_OPPORTUNITIES)
- Rating calculation per review
- Company average rating aggregation
- Rating analytics

#### Comment Management
Quản lý bình luận:
- Comment CRUD operations
- Nested comments (reply to comments)
- Comment likes
- Comment moderation

#### Company Response
Quản lý phản hồi từ công ty:
- One response per review
- Company response CRUD
- Response notifications

---

### auth-service
**Technology:** Node.js/Express hoặc Java/SpringBoot  
**Database:** PostgreSQL

Service xác thực và phân quyền người dùng:

#### User Authentication
- User registration
- User login/logout
- Password reset
- Session management

#### Authorization
- Role-based access control (ADMIN, MANAGER, USER, COMPANY_OWNER)
- Permission management
- Token management (JWT)

---

## EXTERNAL SERVICES

### PostgreSQL Database
**Vai trò:** Primary Database

Lưu trữ toàn bộ dữ liệu của hệ thống:
- Company data
- Review data
- Rating data
- Comment data
- User data
- Company Response data

### Redis Cache
**Vai trò:** Caching Layer

- Session caching
- Frequently accessed data caching
- Rate limiting

### Storage Service (S3 hoặc tương đương)
**Vai trò:** File Storage

- Company logo storage
- User avatar storage

### Notification Service
**Vai trò:** Email/SMS Notifications

- Email notifications cho Company Owner khi có review mới
- Email notifications cho User khi có phản hồi từ công ty
- Email notifications cho User khi có reply bình luận

---

## DATA MODEL

### Các bảng chính

#### company
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Tên công ty |
| address | VARCHAR(500) | Địa chỉ |
| description | TEXT | Mô tả công ty |
| email | VARCHAR(255) | Email liên hệ |
| phone | VARCHAR(20) | Số điện thoại |
| website | VARCHAR(255) | Website |
| logo_url | VARCHAR(500) | URL logo |
| status | ENUM | Trạng thái: PENDING, APPROVED, ACTIVE, INACTIVE, DELETED |
| avg_rating | DECIMAL(3,2) | Rating trung bình |
| total_reviews | INT | Tổng số review |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |
| version | INT | Version cho optimistic locking |

#### review
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| company_id | UUID | FK to company |
| user_id | UUID | FK to user |
| title | VARCHAR(200) | Tiêu đề review |
| content | TEXT | Nội dung review |
| overall_rating | INT | Rating tổng thể (1-5) |
| status | ENUM | Trạng thái: DRAFT, PUBLISHED, EDITED, DELETED |
| is_anonymous | BOOLEAN | Ẩn danh |
| edit_count | INT | Số lần chỉnh sửa |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

#### rating_category
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Tên category |
| description | VARCHAR(255) | Mô tả |

**Default categories:**
- WORK_ENVIRONMENT (Môi trường làm việc)
- SALARY_BENEFITS (Lương thưởng và phúc lợi)
- COMPANY_CULTURE (Văn hóa công ty)
- GROWTH_OPPORTUNITIES (Cơ hội phát triển)

#### rating
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| review_id | UUID | FK to review |
| category_id | UUID | FK to rating_category |
| rating_value | INT | Rating (1-5) |

#### comment
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| review_id | UUID | FK to review |
| user_id | UUID | FK to user |
| parent_comment_id | UUID | FK to comment (nested) |
| content | VARCHAR(500) | Nội dung bình luận |
| likes_count | INT | Số lượt like |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

#### company_response
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| review_id | UUID | FK to review (UNIQUE) |
| company_id | UUID | FK to company |
| content | TEXT | Nội dung phản hồi |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

#### company_owner
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| company_id | UUID | FK to company |
| user_id | UUID | FK to user |
| created_at | TIMESTAMP | Ngày tạo |

#### company_category
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Primary key |
| company_id | UUID | FK to company |
| category_name | VARCHAR(100) | Tên danh mục ngành nghề |
| created_at | TIMESTAMP | Ngày tạo |

---

## STATE MACHINES

### Company State Machine

```
[*] → PENDING: Admin/Manager tạo
PENDING → APPROVED: Admin duyệt
PENDING → REJECTED: Admin từ chối
APPROVED → ACTIVE: Kích hoạt
ACTIVE → INACTIVE: Tạm dừng
INACTIVE → ACTIVE: Tiếp tục
ACTIVE → DELETED: Admin xóa
REJECTED → DELETED: Admin xóa
DELETED → [*]
```

### Review State Machine

```
[*] → DRAFT: User tạo và lưu nháp
[*] → PUBLISHED: User tạo và đăng ngay
DRAFT → PUBLISHED: Publish
PUBLISHED → EDITED: User chỉnh sửa
EDITED → EDITED: User chỉnh sửa tiếp (tối đa 3 lần)
PUBLISHED → DELETED: User/Admin xóa
EDITED → DELETED: User/Admin xóa
DRAFT → DELETED: User xóa
DELETED → [*]
```

---

## EVENT ARCHITECTURE

### Danh sách sự kiện

| Event Name | Trigger | Producer | Consumer | Mô tả |
|-----------|---------|----------|----------|-------|
| CompanyCreated | Tạo công ty mới | review-company-service | notification-service | Thông báo cho Company Owner |
| CompanyApproved | Duyệt công ty | review-company-service | notification-service | Thông báo cho Company Owner |
| CompanyRejected | Từ chối công ty | review-company-service | notification-service | Thông báo cho Company Owner với lý do |
| ReviewCreated | Tạo review mới | review-company-service | notification-service | Thông báo cho Company Owner |
| ReviewUpdated | Cập nhật review | review-company-service | - | Tính lại rating công ty |
| CommentAdded | Thêm bình luận | review-company-service | notification-service | Thông báo cho người tạo review |
| CompanyResponseAdded | Phản hồi từ công ty | review-company-service | notification-service | Thông báo cho người tạo review |

---

## CONTEXT DIAGRAM

```
                    ┌─────────────────┐
                    │   Regular User  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Admin/Manager   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Company Owner   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │review-company-web│
                    │   (Next.js)     │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼─────────┐ ┌──────▼──────┐ ┌─────────▼─────────┐
│review-company-svc │ │ auth-service │ │ Storage Service   │
│  (Backend API)    │ │              │ │   (Logo Files)    │
└─────────┬─────────┘ └──────┬──────┘ └───────────────────┘
          │                  │
┌─────────▼─────────┐ ┌──────▼──────┐
│   PostgreSQL      │ │    Redis    │
│   (Database)      │ │   (Cache)   │
└───────────────────┘ └─────────────┘
          │
┌─────────▼─────────┐
│Notification Service│
│   (Email/SMS)     │
└───────────────────┘
```
