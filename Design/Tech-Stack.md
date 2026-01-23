# Technology Stacks - Review Company System

Đây là các stacks được sử dụng trong hệ thống Review Company, từ frontend → backend services → infrastructure.

---

# All the Technology Stacks

## Frontend

Các stack chính sử dụng để phát triển Web application:

| Technology | Version | Mô tả |
|------------|---------|-------|
| Next.js | Latest | Framework React cho review-company-web |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling framework |

---

## Backend Development

### Option 1: Next.js API Routes
- Next.js API Routes cho review-company-service
- Sử dụng cùng codebase với frontend

### Option 2: Java Spring Boot

| Technology | Version | Mô tả |
|------------|---------|-------|
| Java | 21 LTS | Programming language |
| Spring Boot | 3.x | Backend framework |
| Spring Data JPA | - | Database access |
| Spring Security | - | Authentication & Authorization |

### NodeJS

| Technology | Version | Mô tả |
|------------|---------|-------|
| Node.js | 20.x LTS | Runtime cho auth-service |
| Express.js | 4.x | Web framework |

---

## Database

| Technology | Mô tả |
|------------|-------|
| PostgreSQL | Primary database - lưu trữ dữ liệu công ty, review, rating, bình luận |
| Redis | Cache layer - session, frequently accessed data |

---

## External Services

| Service | Mô tả |
|---------|-------|
| Storage Service (S3 hoặc tương đương) | Lưu trữ logo công ty |
| Notification Service | Gửi email thông báo |

---

## API & Communication

| Technology | Mô tả |
|------------|-------|
| REST API | API chính cho communication |
| JWT | Token-based authentication |

---

## DevOps & Deployment

| Technology | Mô tả |
|------------|-------|
| Docker | Containerization |
| Docker Compose | Local development |
| GitHub / GitLab | Source code management |
| CI/CD Pipeline | Automated deployment |

---

## Cloud Infrastructure (Optional)

### AWS

| Service | Mô tả |
|---------|-------|
| RDS PostgreSQL | Managed database |
| ElastiCache Redis | Managed cache |
| S3 | File storage |
| SES | Email service |
| ECS / EKS | Container orchestration |

### Hoặc sử dụng các dịch vụ tương đương:
- Vercel (cho Next.js deployment)
- PlanetScale / Supabase (cho PostgreSQL)
- Upstash (cho Redis)
- Cloudflare R2 (cho storage)

---

## Development Tools

| Tool | Mô tả |
|------|-------|
| VS Code | IDE |
| Postman / Insomnia | API testing |
| pgAdmin | Database management |
| Git | Version control |

---

## Testing

| Technology | Mô tả |
|------------|-------|
| Jest | Unit testing (Frontend) |
| React Testing Library | Component testing |
| JUnit 5 | Unit testing (Java) |
| Playwright / Cypress | E2E testing |

---

## Monitoring & Logging (Optional)

| Technology | Mô tả |
|------------|-------|
| Application logs | Logging |
| Health checks | Monitoring |

---

# Tech Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js + React + TypeScript + Tailwind CSS                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND SERVICES                         │
│  Next.js API Routes / Java Spring Boot / Node.js Express    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │     Redis       │ │  Storage (S3)   │
│   (Database)    │ │    (Cache)      │ │   (Files)       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```
