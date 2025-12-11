# 1.1 Bối cảnh về kinh doanh (Business Context)

> **Hướng dẫn**: Mô tả bối cảnh kinh doanh, hệ sinh thái, các plans/segments khách hàng, và mô hình hợp tác/vận hành chính.

## Tổng quan hệ sinh thái

[Mô tả hệ sinh thái kinh doanh, sản phẩm/dịch vụ chính, và vị trí của tính năng này trong hệ sinh thái]

**Ví dụ từ SPS-PIM:**
> Trong hệ sinh thái giáo dục, chúng ta có bộ giải pháp EMS (Education Management System) được triển khai phân tán dưới dạng SaaS với nhiều subscription plans.

---

## Các Plans / Customer Segments

[Mô tả các gói dịch vụ, phân khúc khách hàng, hoặc tenant types khác nhau]

| Plan / Segment | Đối tượng | Mô tả |
|----------------|-----------|-------|
| **[PLAN_1]** | [Target customer] | [Mô tả ngắn gọn về plan này] |
| **[PLAN_2]** | [Target customer] | [Mô tả ngắn gọn về plan này] |

**Ví dụ từ SPS-PIM:**

| Plan | Đối tượng | Mô tả |
|------|-----------|-------|
| **INDIVIDUAL** | Giáo viên tự do | EMS dành cho các giáo viên tự do muốn tự quản trị và kết nối với mạng lưới phụ huynh, học sinh |
| **PRIVATE_SCHOOL** | Trường tư nhân | EMS dành cho các trường tư nhân với đăng ký dạng SOCIAL - sử dụng giáo viên từ mạng lưới Social Network |

---

## Mô hình hợp tác / Vận hành

[Mô tả mô hình hợp tác giữa các actors, hoặc quy trình vận hành chính]

**Các bước chính:**

1. **[Bước 1]**: [Mô tả]
2. **[Bước 2]**: [Mô tả]
3. **[Bước 3]**: [Mô tả]

**Ví dụ từ SPS-PIM:**

1. **Trường tư nhân mua EMS PRIVATE_SCHOOL Plan (SOCIAL mode)**
   - Trường đăng ký thuê EMS với số lượng giáo viên tự do hợp tác
   - Hệ thống provision ra N+1 EMS instances (1 PRIVATE_SCHOOL EMS + N INDIVIDUAL EMS cho giáo viên)

2. **Giáo viên tự do mua EMS INDIVIDUAL Plan**
   - Giáo viên tự thuê EMS và hợp tác với một hoặc nhiều trường tư nhân

---

## Workflow vận hành tổng quan (OPTIONAL)

[Sử dụng ASCII diagram hoặc mô tả text để thể hiện workflow tổng quan]

```
┌─────────────────────────────────────────────────────────────────┐
│                     [TÊN WORKFLOW TỔNG QUAN]                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [ACTOR_1]              [ACTOR_2]              [ACTOR_3]        │
│      │                      │                      │            │
│  1. [Hành động]             │                      │            │
│      │                      │                      │            │
│      ├────────► 2. [Hành động]                     │            │
│      │                      │                      │            │
│      │                 3. [Hành động]              │            │
│      │                      │                      │            │
│      │                      ├──────────────────────┤            │
│      │                      │                      │            │
│      ◄──────────────────────┘                      │            │
│      │                                             │            │
│  5. [Hành động cuối]                               │            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Lưu ý quan trọng

- Tập trung vào **tại sao** (why) cần tính năng này, không chỉ **cái gì** (what)
- Làm rõ value proposition cho từng customer segment
- Nêu rõ pain points mà tính năng giải quyết



# 1.2 Bối cảnh về hệ thống (System Context)

> **Hướng dẫn**: Liệt kê tất cả các thành phần Web/Mobile Applications và Backend Services liên quan đến tính năng này.

## Các thành phần Web/Mobile Applications

[Liệt kê các ứng dụng frontend, BFF (Backend For Frontend), API Gateway]

| Layer | Component | Technology | Mô tả |
|-------|-----------|------------|-------|
| **[LAYER_TYPE]** | [component-name] | [Tech stack] | [Vai trò/Mô tả ngắn gọn] |

**Ví dụ từ SPS-PIM:**

| Layer | Component | Technology | Mô tả |
|-------|-----------|------------|-------|
| **WEB** | lf-web | ReactJS | Web cho học sinh và người học |
| **WEB** | sf-web | ReactJS | Web cho School Management Portal (bao gồm chức năng TeMS) |
| **GRAPHQL** | lf-graph | Apollo GraphQL | BFF cho lf-web và LMS Backend Services |
| **GRAPHQL** | tf-graph | Apollo GraphQL | BFF cho tf-web và TeMS Backend Services |
| **GRAPHQL** | sf-graph | Apollo GraphQL | BFF cho sf-web và SMS Backend Services |

---

## Các Backend Services liên quan

[Nhóm các services theo domain/bounded context]

### [SERVICE_GROUP_1] Microservices

| Service | Technology | Vai trò trong [TÊN_TÍNH_NĂNG] |
|---------|------------|--------------------------------|
| [service-name-1] | [Tech] | [Vai trò cụ thể] |
| [service-name-2] | [Tech] | **Core service** - [Vai trò chính] |
| [service-name-3] | [Tech] | [Vai trò hỗ trợ] |

**Ví dụ từ SPS-PIM - SMS Microservices:**

| Service | Technology | Vai trò trong PIM |
|---------|------------|-------------------|
| sf-auth-client | NodeJS | Xác thực users |
| sf-product | Java/SpringBoot | **Core PIM service** - PRIVATE_SCHOOL tạo PIM, INDIVIDUAL đăng ký cung ứng |
| sf-notification-client | Java/SpringBoot | Quản lý notifications qua Kafka |
| sf-worker | Java/SpringBoot | Tích hợp Temporal workflow |

---

### [SERVICE_GROUP_2] Microservices

| Service | Technology | Vai trò trong [TÊN_TÍNH_NĂNG] |
|---------|------------|--------------------------------|
| [service-name-1] | [Tech] | [Vai trò cụ thể] |
| [service-name-2] | [Tech] | [Vai trò cụ thể] |

**Ví dụ từ SPS-PIM - TeMS Microservices:**

| Service | Technology | Vai trò trong PIM |
|---------|------------|-------------------|
| tf-auth-client | NodeJS | Xác thực users |
| tf-teacher-profile | Java/SpringBoot | Quản lý hồ sơ giáo viên tự do |
| tf-teacher-calendar | Java/SpringBoot | Quản lý lịch làm việc giáo viên |

---

### [SERVICE_GROUP_3] Microservices (OPTIONAL)

[Thêm các service groups khác nếu cần]

---

## Infrastructure / Platform Services (OPTIONAL)

[Liệt kê các shared services, infrastructure components]

| Service | Type | Technology | Vai trò |
|---------|------|------------|---------|
| [service-name] | [External/Internal] | [Tech] | [Mô tả] |

**Ví dụ:**

| Service | Type | Technology | Vai trò |
|---------|------|------------|---------|
| Temporal | External | Temporal.io | Workflow Orchestration |
| Kafka (MSK) | External | Apache Kafka | Event Messaging |
| Notification Hub | Internal | Custom | Notification Delivery |

---

## Lưu ý quan trọng

- Đánh dấu **Core services** - những services chịu trách nhiệm chính
- Phân biệt rõ internal vs external services
- Ghi rõ technology stack để dễ tra cứu
- Tập trung vào vai trò của service trong **tính năng này**, không phải mô tả tổng quát


# 1.3 Phạm vi ngoài (Out Of Scope)

> **Hướng dẫn**: Liệt kê rõ ràng những gì KHÔNG thuộc phạm vi thiết kế này, để tránh hiểu lầm và scope creep.

## Danh sách Out Of Scope

| STT | Nội dung Out Of Scope | Lý do |
|-----|----------------------|-------|
| 1 | [Tính năng/Module loại trừ] | [Lý do tại sao không thuộc scope này] |
| 2 | [Tính năng/Module loại trừ] | [Lý do - ví dụ: Đây là scope riêng biệt của team khác] |
| 3 | [Tính năng/Module loại trừ] | [Lý do - ví dụ: Sẽ được xử lý ở phase sau] |

**Ví dụ từ SPS-PIM:**

| STT | Nội dung Out Of Scope | Lý do |
|-----|----------------------|-------|
| 1 | SaaS Provision / Tenant Onboarding | Đây là scope riêng biệt của SaaS Orchestration Platform |
| 2 | Quy trình hợp tác giữa giáo viên tự do và trường tư nhân | Đây là scope riêng biệt về Partnership Management |
| 3 | Thanh toán và hoá đơn cho PIM | Scope của sf-billing và Core Payment |
| 4 | Marketing và quảng bá PIM | Scope của sf-mtp và CRM |

---

## Phân loại Out Of Scope (OPTIONAL)

### Tính năng liên quan nhưng thuộc scope khác

[Những tính năng có liên quan chặt chẽ nhưng do team/module khác phụ trách]

- **[Tên tính năng]**: [Team/Module chủ quản] - [Lý do phân tách]

### Tính năng sẽ thực hiện ở phase sau

[Những tính năng sẽ được bổ sung trong tương lai]

- **[Tên tính năng]**: [Planned for phase X] - [Lý do hoãn lại]

### Tính năng không cần thiết

[Những tính năng đã xem xét nhưng quyết định không làm]

- **[Tên tính năng]**: [Lý do từ chối]

---

## Dependencies với Out Of Scope items

[Nếu có dependencies với các items out of scope, liệt kê rõ ràng]

| Out Of Scope Item | Dependency/Interface | Ghi chú |
|-------------------|---------------------|---------|
| [Item name] | [API/Event/Contract] | [Mô tả cách tương tác] |

**Ví dụ:**

| Out Of Scope Item | Dependency/Interface | Ghi chú |
|-------------------|---------------------|---------|
| Partnership Management | API: GET /partnerships/{id} | Cần check partnership status trước khi tạo PIM |
| Core Payment | Event: PaymentCompletedEvent | Listen event để activate PIM |

---

## Lưu ý quan trọng

- Càng rõ ràng về out of scope càng tốt - tránh tranh cãi sau này
- Update section này khi có change requests hoặc clarifications
- Reference đến owning team/document nếu có
- Đảm bảo stakeholders đồng ý với out of scope list


# 1.4 Các chân dung (Actors)

> **Hướng dẫn**: Liệt kê tất cả human actors (người dùng, vai trò) tương tác với hệ thống. Không bao gồm system actors.

## Danh sách Actors

| Actor | Tenant Type / Context | Mô tả | Hành động chính |
|-------|----------------------|-------|-----------------|
| **[Actor Role]** | [Tenant/Org type] | [Mô tả ngắn gọn về vai trò] | [Liệt kê 2-4 hành động chính] |

**Ví dụ từ SPS-PIM:**

| Actor | Tenant Type | Mô tả | Hành động chính |
|-------|-------------|-------|-----------------|
| **School Admin** | PRIVATE_SCHOOL | Quản trị viên trường tư nhân | Tạo PIM, phê duyệt đăng ký, xác nhận lịch |
| **Academic Manager** | PRIVATE_SCHOOL | Quản lý học vụ | Review hồ sơ giáo viên, lập lịch dạy |
| **Freelance Teacher** | INDIVIDUAL | Giáo viên tự do | Xem PIM, tạo khóa học, đăng ký PIM, xác nhận lịch |

---

## Chi tiết Actors (OPTIONAL)

[Mô tả chi tiết hơn cho từng actor nếu cần]

### [Actor Name 1]

**Vai trò**: [Mô tả chi tiết]

**Quyền hạn**:
- [Permission 1]
- [Permission 2]
- [Permission 3]

**Use cases chính**:
1. [Use case 1]
2. [Use case 2]
3. [Use case 3]

**Pain points**:
- [Pain point 1]
- [Pain point 2]

---

### [Actor Name 2]

[Tương tự như trên]

---

## Actor Relationships (OPTIONAL)

[Mô tả mối quan hệ giữa các actors nếu phức tạp]

```
[ACTOR_1] ──manages──> [ACTOR_2]
[ACTOR_1] ──collaborates with──> [ACTOR_3]
[ACTOR_2] ──reports to──> [ACTOR_1]
```

**Ví dụ:**

```
School Admin ──manages──> Academic Manager
Academic Manager ──collaborates with──> Freelance Teacher
Freelance Teacher ──registers with──> School Admin (via system)
```

---

## Actor vs Tenant Type Mapping (OPTIONAL - cho multi-tenant systems)

[Nếu là hệ thống multi-tenant, map actors với tenant types]

| Actor | Tenant Type(s) | Ghi chú |
|-------|---------------|---------|
| [Actor] | [Type 1], [Type 2] | [Có thể thuộc nhiều tenants] |

**Ví dụ từ SPS-PIM:**

| Actor | Tenant Type(s) | Ghi chú |
|-------|---------------|---------|
| School Admin | PRIVATE_SCHOOL | Chỉ có ở school tenant |
| Freelance Teacher | INDIVIDUAL | Chỉ có ở individual tenant |
| System Admin | ALL | Super admin across all tenants |

---

## Lưu ý quan trọng

- Actors là **người thật**, không phải systems
- Tập trung vào actors **trực tiếp** tương tác với tính năng này
- Mô tả hành động chính ở mức high-level, chi tiết sẽ có ở workflow
- Nếu có RBAC (Role-Based Access Control), reference đến role definition document
