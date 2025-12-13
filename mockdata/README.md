# Mock Data cho Hệ thống Review Công ty

> **Hệ thống:** Review Company System  
> **Ngày tạo:** 2025-01-26  
> **Mục đích:** Cung cấp mock data phong phú để phục vụ development và testing

---

## Tổng quan

Thư mục này chứa mock data đầy đủ cho tất cả các entities trong hệ thống Review Công ty, được tạo dựa trên tài liệu HLD và User Stories. Mock data được thiết kế để:

- ✅ Phục vụ development và testing
- ✅ Cover đầy đủ các trạng thái và use cases
- ✅ Đảm bảo tính đa dạng và thực tế
- ✅ Hỗ trợ test các chức năng chính của hệ thống

---

## Cấu trúc dữ liệu

### 1. `rating_categories.json`
**Mô tả:** Danh sách các hạng mục đánh giá (Rating Categories)

**Số lượng:** 4 categories

**Nội dung:**
- `WORK_ENVIRONMENT` - Môi trường làm việc
- `SALARY_BENEFITS` - Lương thưởng
- `COMPANY_CULTURE` - Văn hóa công ty
- `GROWTH_OPPORTUNITIES` - Cơ hội phát triển

---

### 2. `users.json`
**Mô tả:** Danh sách người dùng hệ thống

**Số lượng:** 15 users

**Phân loại:**
- 1 Admin
- 1 Manager
- 10 Regular Users
- 3 Company Owners

**Đặc điểm:**
- Đầy đủ thông tin: email, name, avatar_url
- Phân quyền rõ ràng theo role
- Có các users thuộc nhiều nhóm khác nhau

---

### 3. `companies.json`
**Mô tả:** Danh sách công ty trong hệ thống

**Số lượng:** 15 companies

**Trạng thái phân bổ:**
- `ACTIVE`: 12 companies (có rating và reviews)
- `PENDING`: 1 company (chờ duyệt)
- `APPROVED`: 1 company (đã duyệt, chưa kích hoạt)
- `INACTIVE`: 1 company (tạm dừng)

**Thông tin:**
- Đầy đủ thông tin: name, address, description, email, phone, website
- Rating trung bình và tổng số reviews (cho các công ty ACTIVE)
- Logo URLs (placeholder)
- Version cho optimistic locking

**Ngành nghề đa dạng:**
- Phát triển phần mềm
- Digital Marketing
- AI/ML
- FinTech
- E-Commerce
- Game Development
- Cloud Services
- Blockchain
- EdTech
- Data Analytics

---

### 4. `company_owners.json`
**Mô tả:** Liên kết giữa users và companies (Company Ownership)

**Số lượng:** 15 records

**Đặc điểm:**
- Mỗi company có 1 owner
- Liên kết với users có role COMPANY_OWNER
- Một số owners có thể sở hữu nhiều công ty

---

### 5. `company_categories.json`
**Mô tả:** Phân loại công ty theo ngành nghề

**Số lượng:** 26 records

**Đặc điểm:**
- Mỗi company có 1-2 categories
- Categories bao gồm: Phát triển phần mềm, Web Development, Digital Marketing, AI/ML, FinTech, E-Commerce, Game Development, Blockchain, EdTech, v.v.

---

### 6. `reviews.json`
**Mô tả:** Danh sách reviews của người dùng về công ty

**Số lượng:** 24 reviews

**Trạng thái phân bổ:**
- `PUBLISHED`: 20 reviews (đã công khai)
- `DRAFT`: 1 review (bản nháp)
- `EDITED`: 3 reviews (đã chỉnh sửa, có edit_count 1-2)

**Đặc điểm:**
- Overall rating từ 1-5 sao
- Nội dung review chi tiết, đa dạng
- Có cả reviews ẩn danh (`is_anonymous: true`)
- Một số reviews đã được chỉnh sửa nhiều lần
- Reviews phân bổ trên nhiều công ty khác nhau

---

### 7. `ratings.json`
**Mô tả:** Ratings chi tiết theo từng category cho mỗi review

**Số lượng:** 56 ratings

**Đặc điểm:**
- Mỗi review có ratings cho 4 categories
- Rating value từ 1-5
- Phản ánh đa dạng về mức độ hài lòng
- Một số reviews có thể thiếu ratings cho một số categories (optional)

---

### 8. `comments.json`
**Mô tả:** Bình luận trên các reviews

**Số lượng:** 20 comments

**Đặc điểm:**
- Hỗ trợ nested comments (replies)
- `parent_comment_id` null cho top-level comments
- `parent_comment_id` có giá trị cho replies
- Likes count đa dạng
- Phân bổ trên nhiều reviews khác nhau

**Ví dụ cấu trúc nested:**
```
Comment A (parent_comment_id: null)
  └─ Comment B (parent_comment_id: A.id)
      └─ Comment C (parent_comment_id: B.id)
```

---

### 9. `company_responses.json`
**Mô tả:** Phản hồi chính thức từ công ty cho các reviews

**Số lượng:** 10 responses

**Đặc điểm:**
- Mỗi review chỉ có tối đa 1 company response (unique constraint)
- Nội dung phản hồi chuyên nghiệp, tích cực
- Phản hồi từ Company Owners
- Phân bổ trên các reviews có rating khác nhau

---

## Mối quan hệ dữ liệu

### Quan hệ chính:

```
User (1) ──< (N) Review ──> (1) Company
              │
              ├─> (N) Rating ──> (1) RatingCategory
              │
              ├─> (N) Comment (có thể nested)
              │
              └─> (0..1) CompanyResponse ──> (1) Company

Company (1) ──> (1) CompanyOwner ──> (1) User
Company (1) ──< (N) CompanyCategory
```

---

## Hướng dẫn sử dụng

### 1. Import vào Database

#### PostgreSQL

Bạn có thể sử dụng các file JSON này để import vào PostgreSQL:

```sql
-- Ví dụ: Import companies
COPY companies (id, name, address, description, email, phone, website, logo_url, status, avg_rating, total_reviews, created_at, updated_at, version)
FROM '/path/to/mockdata/companies.json' WITH (FORMAT json);
```

Hoặc sử dụng script import tùy chỉnh để parse JSON và insert vào database.

#### Node.js/TypeScript

```typescript
import fs from 'fs';
import companies from './mockdata/companies.json';

// Insert vào database
for (const company of companies) {
  await db.companies.create(company);
}
```

#### Python

```python
import json

with open('mockdata/companies.json', 'r', encoding='utf-8') as f:
    companies = json.load(f)
    
# Insert vào database
for company in companies:
    db.companies.insert(company)
```

### 2. Thứ tự import (Quan trọng!)

Để đảm bảo foreign key constraints, import theo thứ tự sau:

1. **rating_categories.json** (không có dependencies)
2. **users.json** (không có dependencies)
3. **companies.json** (không có dependencies)
4. **company_owners.json** (depend on: users, companies)
5. **company_categories.json** (depend on: companies)
6. **reviews.json** (depend on: users, companies)
7. **ratings.json** (depend on: reviews, rating_categories)
8. **comments.json** (depend on: reviews, users)
9. **company_responses.json** (depend on: reviews, companies)

### 3. Sử dụng cho Testing

Mock data này có thể được sử dụng cho:

- **Unit tests:** Test các service methods với data có sẵn
- **Integration tests:** Test API endpoints với full data set
- **E2E tests:** Test user flows với realistic data
- **Performance tests:** Test với volume data phù hợp

### 4. Development

Khi development, bạn có thể:

- Sử dụng mock data để populate database local
- Test các chức năng: tìm kiếm, lọc, sắp xếp
- Test các trạng thái: PENDING, APPROVED, ACTIVE, INACTIVE
- Test các workflow: duyệt công ty, tạo review, phản hồi

---

## Thống kê dữ liệu

| Entity | Số lượng | Mô tả |
|--------|----------|-------|
| Rating Categories | 4 | Đầy đủ các categories |
| Users | 15 | Admin, Manager, Users, Owners |
| Companies | 15 | Đa dạng trạng thái và ngành nghề |
| Company Owners | 15 | 1 owner/company |
| Company Categories | 26 | 1-2 categories/company |
| Reviews | 24 | Đa dạng trạng thái và ratings |
| Ratings | 56 | ~4 ratings/review |
| Comments | 20 | Có nested comments |
| Company Responses | 10 | Phản hồi từ công ty |

---

## Lưu ý

### 1. UUID Format
Tất cả IDs sử dụng UUID format, đảm bảo tính unique và an toàn.

### 2. Timestamps
Tất cả timestamps sử dụng ISO 8601 format (UTC).

### 3. Trạng thái
- Companies có đầy đủ các trạng thái: PENDING, APPROVED, ACTIVE, INACTIVE
- Reviews có đầy đủ các trạng thái: DRAFT, PUBLISHED, EDITED

### 4. Foreign Keys
Đảm bảo tất cả foreign keys đều valid và reference đến existing records.

### 5. Constraints
- Company: name là UNIQUE
- Review: Một user chỉ có 1 PUBLISHED review/company
- Company Response: Một review chỉ có 1 company response (UNIQUE)

---

## Cập nhật dữ liệu

Khi cần thêm hoặc cập nhật mock data:

1. **Thêm records mới:** Đảm bảo UUID unique và foreign keys valid
2. **Cập nhật ratings:** Khi thêm reviews, cần tính lại avg_rating và total_reviews của company
3. **Maintain consistency:** Đảm bảo dữ liệu giữa các files nhất quán

---

## Tài liệu tham khảo

- [HLD-REVIEW-COMPANY.md](../hld/output/review-company/HLD-REVIEW-COMPANY.md)
- [DD-REVIEW-COMPANY.md](../dd/review-company/DD-REVIEW-COMPANY.md)
- [US-REVIEW-00-Tong-Quan.md](../us/input/review-company/US-REVIEW-00-Tong-Quan.md)

---

**Version:** 1.0  
**Last Updated:** 2025-01-26

