---
name: Tích hợp API BE vào FE
overview: Tạo API client và cập nhật FE để fetch data từ BE API tại https://api.reviewscongty.com thay vì sử dụng local JSON data hiện tại.
todos:
  - id: create-api-client
    content: "Tạo file lib/api.ts với các hàm gọi API: fetchCompanies, fetchCompanyById, fetchCompanyReviews, fetchStatistics, etc."
    status: completed
  - id: update-types
    content: Cập nhật lib/types.ts thêm ApiResponse, PaginatedResponse và điều chỉnh types cho khớp BE
    status: completed
  - id: update-auth-context
    content: Cập nhật auth-context.tsx để dùng API login/register thay vì local auth, xử lý JWT token
    status: completed
  - id: update-homepage
    content: Cập nhật app/page.tsx để fetch statistics và top companies từ API
    status: completed
  - id: update-company-list
    content: Cập nhật company-list.tsx để fetch companies từ API với loading states
    status: completed
  - id: update-company-detail
    content: Cập nhật app/companies/[id]/page.tsx để fetch company detail và reviews từ API
    status: completed
  - id: test-integration
    content: "Test toàn bộ luồng: danh sách công ty, chi tiết công ty, đăng nhập, tạo review"
    status: completed
---

# Kế hoạch tích hợp API Backend vào Frontend

## Phân tích hiện trạng

### Backend API (https://api.reviewscongty.com/api/)

Response format chuẩn:

```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "data": [...],
    "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10, "hasNext": true, "hasPrev": false }
  }
}
```

### Frontend hiện tại

- Đang dùng local JSON từ [lib/data.ts](review-company-web/lib/data.ts) với các hàm như `getActiveCompanies()`, `getCompanyById()`, etc.
- Auth context tại [contexts/auth-context.tsx](review-company-web/contexts/auth-context.tsx) cũng dùng local data

## Các API Endpoints cần tích hợp

```mermaid
graph LR
    subgraph PublicAPIs [Public APIs]
        A1[GET /api/companies]
        A2[GET /api/companies/:id]
        A3[GET /api/companies/:id/reviews]
        A4[GET /api/companies/:id/category-ratings]
        A5[GET /api/statistics]
        A6[GET /api/rating-categories]
    end
    
    subgraph AuthAPIs [Auth APIs]
        B1[POST /api/auth/login]
        B2[POST /api/auth/register]
        B3[GET /api/auth/me]
    end
    
    subgraph ProtectedAPIs [Protected APIs]
        C1[POST /api/reviews]
        C2[POST /api/reviews/:id/comments]
    end
```

## Các file cần tạo/sửa

### 1. Tạo API Client mới

**File:** `review-company-web/lib/api.ts`

```typescript
const API_BASE_URL = 'https://api.reviewscongty.com/api';

// Các hàm fetch data từ API
export async function fetchCompanies(params) { ... }
export async function fetchCompanyById(id) { ... }
export async function fetchCompanyReviews(companyId) { ... }
export async function fetchStatistics() { ... }
export async function fetchCategoryRatings(companyId) { ... }
export async function login(email, password) { ... }
export async function register(data) { ... }
```

### 2. Cập nhật Types

**File:** [review-company-web/lib/types.ts](review-company-web/lib/types.ts)

Thêm các types cho API response:

- `ApiResponse<T>` - wrapper response
- `PaginatedResponse<T>` - response có pagination
- Điều chỉnh các types hiện có để khớp với BE response

### 3. Cập nhật Auth Context

**File:** [review-company-web/contexts/auth-context.tsx](review-company-web/contexts/auth-context.tsx)

- Gọi API `/api/auth/login` thay vì local auth
- Lưu JWT token vào localStorage
- Thêm token vào headers khi gọi protected APIs
- Gọi `/api/auth/me` để verify session

### 4. Cập nhật các Pages

| Page | Thay đổi |

|------|----------|

| [app/page.tsx](review-company-web/app/page.tsx) | `getTopRatedCompanies()` -> `fetchCompanies({ sort: 'rating_desc', limit: 6 })` |

| [app/companies/page.tsx](review-company-web/app/companies/page.tsx) | Dùng Server Component fetch hoặc Client Component với SWR/React Query |

| [app/companies/[id]/page.tsx](review-company-web/app/companies/[id]/page.tsx) | `getCompanyById()` -> `fetchCompanyById()` |

### 5. Cập nhật Components

| Component | Thay đổi |

|-----------|----------|

| [components/company/company-list.tsx](review-company-web/components/company/company-list.tsx) | Thay local data bằng API calls với loading states |

## Luồng data mới

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as BE API
    
    FE->>API: GET /api/companies?page=1&limit=9&search=...
    API-->>FE: { success: true, data: { data: [...], pagination: {...} } }
    
    FE->>API: GET /api/companies/:id
    API-->>FE: { success: true, data: { id, name, ... } }
    
    FE->>API: GET /api/companies/:id/reviews
    API-->>FE: { success: true, data: { data: [...reviews], pagination } }
    
    FE->>API: POST /api/auth/login
    API-->>FE: { success: true, data: { user, token } }
```

## Lưu ý quan trọng

1. **CORS**: BE cần cho phép origin từ FE domain
2. **Error handling**: Xử lý các trường hợp API fail
3. **Loading states**: Thêm skeleton/spinner khi đang fetch
4. **Caching**: Cân nhắc dùng SWR hoặc React Query để cache và revalidate
5. **Token refresh**: Xử lý khi token hết hạn