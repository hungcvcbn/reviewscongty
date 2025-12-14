---
name: Review Company Web Frontend
overview: "Triển khai frontend cho hệ thống Review Company với các trang public: Homepage, Danh sách công ty (với tìm kiếm/lọc/sắp xếp), Chi tiết công ty (với reviews và comments). Sử dụng shadcn/ui và TailwindCSS, dữ liệu từ mockdata."
todos:
  - id: setup-shadcn
    content: Cài đặt shadcn/ui và các components cần thiết
    status: completed
  - id: setup-types-data
    content: Tạo types TypeScript và copy mockdata vào project
    status: completed
  - id: layout-components
    content: Tạo Header, Footer và cập nhật layout.tsx
    status: completed
  - id: homepage
    content: Triển khai trang Homepage với hero, search, top companies
    status: completed
  - id: company-list
    content: Triển khai trang Danh sách công ty với tìm kiếm, lọc, sắp xếp
    status: completed
  - id: company-detail
    content: Triển khai trang Chi tiết công ty với reviews và comments
    status: completed
---

# Kế hoạch triển khai Review Company Web Frontend

## 1. Cài đặt và cấu hình

**Cài đặt shadcn/ui:**

- Khởi tạo shadcn/ui với `npx shadcn@latest init`
- Cài đặt các components cần thiết: Button, Card, Input, Badge, Avatar, Select, Tabs, Separator, Skeleton

**Copy mockdata vào project:**

- Copy các file JSON từ `/mockdata` vào `/review-company-web/lib/data/`
- Tạo types TypeScript cho các entity: Company, Review, User, Comment, Rating, RatingCategory

## 2. Cấu trúc thư mục

```
review-company-web/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── companies/
│   │   ├── page.tsx                # Danh sách công ty
│   │   └── [id]/
│   │       └── page.tsx            # Chi tiết công ty
│   └── layout.tsx                  # Root layout
├── components/
│   ├── layout/
│   │   ├── header.tsx              # Header với navigation
│   │   └── footer.tsx              # Footer
│   ├── company/
│   │   ├── company-card.tsx        # Card hiển thị công ty
│   │   ├── company-list.tsx        # Danh sách company cards
│   │   ├── company-filters.tsx     # Bộ lọc và sắp xếp
│   │   └── company-search.tsx      # Ô tìm kiếm
│   ├── review/
│   │   ├── review-card.tsx         # Card hiển thị review
│   │   ├── review-list.tsx         # Danh sách reviews
│   │   ├── rating-display.tsx      # Hiển thị rating (stars)
│   │   └── rating-breakdown.tsx    # Breakdown rating theo category
│   └── ui/                         # shadcn components
├── lib/
│   ├── data/                       # Mockdata JSON files
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Utility functions
```

## 3. Các trang cần triển khai

### 3.1 Homepage (`/`)

- Hero section với tiêu đề và mô tả hệ thống
- Ô tìm kiếm nổi bật
- Hiển thị top 6 công ty được đánh giá cao nhất
- Thống kê: Tổng số công ty, tổng reviews, rating trung bình

### 3.2 Danh sách công ty (`/companies`)

Dựa trên **US-REVIEW-002, US-REVIEW-007, US-REVIEW-008**:

- Tìm kiếm theo tên công ty
- Lọc theo rating (tất cả, 4+, 3+, 2+)
- Sắp xếp theo: Rating cao nhất, Mới nhất, Nhiều reviews nhất
- Hiển thị dạng grid với phân trang
- Mỗi card hiển thị: Logo, Tên, Địa chỉ, Rating, Số reviews

### 3.3 Chi tiết công ty (`/companies/[id]`)

Dựa trên **US-REVIEW-003, US-REVIEW-010**:

- Thông tin công ty: Logo, Tên, Địa chỉ, Mô tả, Website, Email, Phone
- Rating tổng hợp và breakdown theo 4 categories:
  - Môi trường làm việc (WORK_ENVIRONMENT)
  - Lương thưởng (SALARY_BENEFITS)
  - Văn hóa công ty (COMPANY_CULTURE)
  - Cơ hội phát triển (GROWTH_OPPORTUNITIES)
- Danh sách reviews với:
  - Thông tin người review (hoặc "Ẩn danh")
  - Rating, Tiêu đề, Nội dung
  - Ngày đăng
  - Comments (bao gồm nested comments)

## 4. Components chính

| Component | Mô tả | Props chính |

|-----------|-------|-------------|

| `Header` | Navigation bar | - |

| `CompanyCard` | Card công ty trong danh sách | company: Company |

| `CompanyFilters` | Bộ lọc rating và sắp xếp | onFilterChange, onSortChange |

| `CompanySearch` | Ô tìm kiếm | onSearch |

| `RatingDisplay` | Hiển thị sao rating | rating: number, size?: 'sm' \| 'md' \| 'lg' |

| `RatingBreakdown` | Breakdown 4 categories | ratings: CategoryRating[] |

| `ReviewCard` | Card hiển thị review | review: Review, user: User |

| `CommentList` | Danh sách comments với nested | comments: Comment[] |

## 5. Giao diện

- **Theme**: Light mode, clean, professional
- **Colors**: Primary blue (#2563eb), secondary gray tones
- **Typography**: Font Geist Sans (đã có)
- **Layout**: Responsive, mobile-first
- **Components**: Sử dụng shadcn/ui với customization minimal