module: review-company

Dựa vào:
1. **System Overview**: @hld/overview/edu-ecosystem-overview.md (nếu có)
2. **HLD Document**: @hld/output/review-company/HLD-REVIEW-COMPANY.md (high-level design)
3. **User Stories**: @us/input/review-company/*.md
4. **DD Templates**: @dd/overview/template/

Viết **Detailed Design (DD) cho Review Company System** vào `dd/review-company/DD-REVIEW-COMPANY.md`.

---

## Yêu cầu DD phải có:

### 1. Section 3.1 - API Endpoints (CRITICAL)

**Backend Services APIs** - Liệt kê ĐẦY ĐỦ APIs theo từng Entity/Service

**API Details** cho mỗi endpoint quan trọng:
- Request body (key fields only)
- Response (key fields only)
- Business logic steps (numbered list)
- Error cases
- Events raised

### 2. Section 3.2 - Source Code Structure

**Service Structure** với DDD layers:
- api/ (controllers/routes)
- application/ (services)
- domain/ (entities, value objects, aggregates)
- infrastructure/ (repositories, database, cache)

### 3. Section 3.3 - Aggregates

**Aggregates Overview Table** với:
- Root Entity
- Child Entities
- Business Rules (inline)
- Key Operations

**KHÔNG** include full code implementation - chỉ overview và business rules.

### 4. Section 4 - Workflows

**Sequence Diagrams** (Mermaid) cho các workflows chính:
- Company creation and approval
- Review creation
- Comment and company response

### 5. Section 5 - Events

**Event Catalog Table** với:
- Event Name
- Producer
- Consumer
- Purpose

**Cache Strategy Table** với:
- Cache Key Pattern
- TTL
- Invalidation rules

---

## Lưu ý quan trọng:

1. **Business Contexts**: Mô tả theo business context, KHÔNG theo folder structure
2. **No Code**: Chỉ mô tả structure và business rules, không include full code
3. **Cross-Reference**: Sử dụng cross-reference thay vì duplicate nội dung
4. **Focus**: Control logic → Task breakdown → Dev implementation
5. **Consistent Terminology**: Sử dụng thuật ngữ nhất quán với User Stories và HLD

---

## References:

- User Stories: `us/input/review-company/`
- HLD: `hld/output/review-company/HLD-REVIEW-COMPANY.md`
- DD Templates: `dd/overview/template/`
- Example DD: `dd/pim/DD-PIM.md`

