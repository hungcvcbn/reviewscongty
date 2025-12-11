# HLD - [TÊN HỆ THỐNG/TÍNH NĂNG]

> **Hướng dẫn sử dụng template:**
> - Thay thế tất cả các placeholder có dạng [TÊN_VIẾT_HOA] bằng nội dung thực tế
> - Xóa các phần không áp dụng (đánh dấu là OPTIONAL)
> - Tham khảo file `HLD-SPS-PIM.md` để xem ví dụ cụ thể
> - Giữ nguyên cấu trúc heading và thứ tự các phần

---

## Mục lục

1. [Bối cảnh (Context)](#1-bối-cảnh-context)
   - 1.1 [Bối cảnh về kinh doanh](#11-bối-cảnh-về-kinh-doanh-business-context)
   - 1.2 [Bối cảnh về hệ thống](#12-bối-cảnh-về-hệ-thống-system-context)
   - 1.3 [Phạm vi ngoài](#13-phạm-vi-ngoài-out-of-scope)
   - 1.4 [Các chân dung](#14-các-chân-dung-actors)

2. [Context Diagram](#2-context-diagram-mermaid)

3. [Core Business Workflow](#3-core-business-workflow)
   - 3.1 [Sequence Diagram](#31-sequence-diagram-mermaid)
   - 3.2 [Activity Diagram](#32-activity-diagram-optional)
   - 3.3 [Workflow Description](#33-workflow-description-table)

4. [State Machine](#4-state-machine)
   - 4.1 [Mermaid State Diagram](#41-mermaid-state-diagram)
   - 4.2 [State Transition Table](#42-state-transition-table)

5. [Mô hình dữ liệu (Data Model - ERD)](#5-mô-hình-dữ-liệu-data-model---erd)
   - 5.1 [Mô hình dữ liệu vật lý](#51-mô-hình-dữ-liệu-vật-lý)
   - 5.2 [Định nghĩa chi tiết theo từng bảng](#52-định-nghĩa-chi-tiết-theo-từng-bảng)

6. [Kiến trúc sự kiện (Event Architecture)](#6-kiến-trúc-sự-kiện-event-architecture)
   - 6.1 [Danh sách sự kiện](#61-danh-sách-sự-kiện-theo-dạng-bảng-event-list)
   - 6.2 [Event Schema](#62-event-schema-json)
   - 6.3 [Eventing Rules](#63-eventing-rules)

7. [Workflow Orchestration (Temporal)](#7-workflow-orchestration-temporal) *(OPTIONAL)*
   - 7.1 [Workflow Summary](#71-tóm-tắt-về-workflow-workflow-summary)
   - 7.2 [Activities](#72-activities)
   - 7.3 [Signals & Timers](#73-signals)
   - 7.4 [Retry Policies](#74-retry-policies)
   - 7.5 [Workflow Diagrams](#75-workflow-diagram-mermaid)

8. [Phụ lục](#phụ-lục)
   - [A. Glossary](#a-glossary)
   - [B. Assumptions](#b-assumptions)
   - [C. Open Questions](#c-open-questions)

---

## Chi tiết các phần

### Cấu trúc tổng quan

- **Phần 1**: Sử dụng các template trong folder `01-context/`
- **Phần 2**: Sử dụng các template trong folder `02-diagrams/`
- **Phần 3**: Sử dụng các template trong folder `03-workflows/`
- **Phần 4**: Sử dụng các template trong folder `04-state-machine/`
- **Phần 5**: Sử dụng các template trong folder `05-data-model/`
- **Phần 6**: Sử dụng các template trong folder `06-event-architecture/`
- **Phần 7**: Sử dụng các template trong folder `07-workflow-orchestration/`
- **Phần 8**: Sử dụng các template trong folder `08-appendix/`

### Quy ước Placeholder

- `[TÊN_HỆ_THỐNG]` - Tên hệ thống hoặc tính năng chính
- `[ACTOR_NAME]` - Tên người dùng/vai trò
- `[SERVICE_NAME]` - Tên microservice
- `[TABLE_NAME]` - Tên bảng database
- `[EVENT_NAME]` - Tên sự kiện
- `[WORKFLOW_NAME]` - Tên workflow

### Lưu ý khi sử dụng

1. **Bắt buộc**: Các phần 1-5 luôn phải có
2. **Tùy chọn**: Phần 6-7 tùy thuộc vào kiến trúc hệ thống
3. **Mermaid diagrams**: Validate trước khi commit
4. **Consistent terminology**: Sử dụng thuật ngữ nhất quán xuyên suốt tài liệu
