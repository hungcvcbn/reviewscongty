# TỔNG QUAN VỀ HỆ THỐNG REVIEW COMPANY

Hệ thống Review Company là một nền tảng cho phép người dùng tìm kiếm, xem thông tin, đánh giá và bình luận về các công ty. Hệ thống hướng đến việc tạo ra một môi trường minh bạch, đáng tin cậy để người lao động có thể tham khảo thông tin trước khi ứng tuyển vào các công ty.

## Mục tiêu hệ thống

- **Cho người dùng (Regular Users)**: Tìm kiếm công ty, xem thông tin chi tiết, tạo review và đánh giá
- **Cho Admin/Manager**: Tạo và quản lý thông tin công ty
- **Cho Company Owners**: Quản lý thông tin công ty và phản hồi review

## Mô hình hoạt động

```
ADMIN/MANAGER                  REGULAR USER              COMPANY OWNER
       │                            │                         │
       ├─ 1. Tạo công ty            │                         │
       ├─ 2. Duyệt công ty ─────────┤                         │
       │                            ├─ 3. Tìm kiếm công ty    │
       │                            ├─ 4. Xem chi tiết công ty│
       │                            ├─ 5. Tạo review ─────────┤
       │                            │                         ├─ 6. Phản hồi review
       │                            ├─ 7. Bình luận và trả lời bình luận ──────────┤
       │                            │                         │
       └─ 8. Quản lý công ty        └─ 9. Quản lý review      └─ 10. Quản lý công ty
```

## Các luồng nghiệp vụ chính

| STT | Luồng | Mô tả |
|-----|-------|-------|
| 1 | **Tạo và duyệt công ty** | Admin/Manager tạo công ty → Admin duyệt → Công ty hiển thị công khai |
| 2 | **Tìm kiếm và xem công ty** | User tìm kiếm → Xem danh sách → Xem chi tiết công ty |
| 3 | **Tạo review** | User đăng nhập → Tạo review với rating → Đánh giá theo categories |
| 4 | **Bình luận và phản hồi** | User bình luận trên review → User trả lời bình luận của nhau → Company Owner phản hồi review |

---

# 1. BỐI CẢNH THỊ TRƯỜNG

## 1.1. Thực trạng Thị trường Tuyển dụng Việt Nam

### 📊 Thực trạng hiện tại

**Thị trường lao động:**
- 🔴 **Thiếu thông tin minh bạch** về môi trường làm việc tại các công ty
- 🔴 **Người lao động khó đánh giá** chất lượng công ty trước khi ứng tuyển
- 🔴 **Thông tin một chiều** chỉ từ phía nhà tuyển dụng
- 🔴 **Chi phí tìm việc cao** do phải thử sai nhiều lần

**Công ty/Doanh nghiệp:**
- Khó xây dựng employer branding hiệu quả
- Thiếu kênh tiếp nhận phản hồi từ nhân viên
- Không có cơ chế cải thiện dựa trên feedback thực tế

### 📈 Tác động

- Tỷ lệ nghỉ việc trong năm đầu: **30-40%**
- Thời gian tìm việc phù hợp: **3-6 tháng**
- Chi phí tuyển dụng lại: **50-200% lương hàng năm**

---

## 1.2. Cơ hội từ Thị trường

**Xu hướng hiện tại:**
- 🔄 Nhu cầu minh bạch thông tin tăng cao
- 👥 Cộng đồng chia sẻ kinh nghiệm làm việc phát triển mạnh
- 📱 Digital transformation trong lĩnh vực HR
- 🏢 Employer branding trở thành yếu tố cạnh tranh

**💡 Insight then chốt:**
> Người lao động cần một nền tảng đáng tin cậy để đánh giá công ty trước khi quyết định ứng tuyển.

**🎯 Cơ hội vàng:**
1. **Trust Gap**: Không có nền tảng nào cung cấp thông tin đáng tin cậy về môi trường làm việc
2. **Community Power**: Ai xây dựng được cộng đồng review chất lượng sẽ có lợi thế cạnh tranh
3. **Network Effects**: Càng nhiều review, nền tảng càng có giá trị

---

# 2. VẤN ĐỀ CẦN GIẢI QUYẾT

## 2.1. Pain Points của Các Stakeholders

### 👨‍💼 **Người lao động (Regular Users)**

**Pain Points:**
- 😰 Thiếu thông tin thực tế về môi trường làm việc
- 💸 Mất thời gian và công sức khi chọn sai công ty
- 🛠️ Khó verify thông tin từ tin tuyển dụng
- 📚 Không có cơ sở so sánh giữa các công ty

**What they want:**
- ✅ Nền tảng review minh bạch và đáng tin cậy
- ✅ Thông tin chi tiết về môi trường làm việc
- ✅ Đánh giá theo nhiều tiêu chí (lương, văn hóa, cơ hội phát triển)
- ✅ Phản hồi từ chính công ty

### 🏢 **Công ty (Company Owners)**

**Pain Points:**
- 💰 Khó xây dựng employer branding hiệu quả
- 📉 Thiếu kênh tiếp nhận phản hồi từ nhân viên/ứng viên
- 🔧 Không có cơ chế cải thiện dựa trên feedback thực tế

**What they want:**
- ✅ Kênh quản lý và phản hồi review
- ✅ Xây dựng hình ảnh công ty tích cực
- ✅ Tiếp nhận feedback để cải thiện

### 👨‍💻 **Admin/Manager**

**Pain Points:**
- 😰 Quản lý thông tin công ty thủ công
- 💸 Khó kiểm soát chất lượng nội dung review

**What they want:**
- ✅ Công cụ quản lý công ty hiệu quả
- ✅ Cơ chế duyệt và kiểm duyệt nội dung
- ✅ Dashboard thống kê và báo cáo

---

## 2.2. Market Gaps (Khoảng trống thị trường)

### 🚫 **Gap 1: Thiếu nền tảng review công ty uy tín**

**Hiện trạng:**
- Thông tin review phân tán trên nhiều nền tảng (Facebook, forums, etc.)
- Không có cơ chế xác thực người review

**Cơ hội:**
- ✅ Xây dựng nền tảng review tập trung với cơ chế xác thực

### 🚫 **Gap 2: Thiếu cơ chế đánh giá đa chiều**

**Hiện trạng:**
- Review thường chỉ là text đơn thuần
- Không có rating theo từng tiêu chí

**Cơ hội:**
- ✅ Hệ thống rating theo categories (Môi trường làm việc, Lương thưởng, Văn hóa, Cơ hội phát triển)

### 🚫 **Gap 3: Thiếu kênh phản hồi từ công ty**

**Hiện trạng:**
- Review một chiều, công ty không có cơ hội phản hồi

**Cơ hội:**
- ✅ Company Response feature cho phép công ty phản hồi review

---

# 3. TẦM NHÌN & SỨ MỆNH

## 3.1. Tầm Nhìn (Vision)

> **"Trở thành nền tảng review công ty hàng đầu Việt Nam, tạo ra môi trường minh bạch giúp người lao động đưa ra quyết định nghề nghiệp đúng đắn và giúp doanh nghiệp xây dựng employer branding hiệu quả."**

## 3.2. Sứ Mệnh (Mission)

> **"Kết nối người lao động và doanh nghiệp thông qua thông tin minh bạch, review chất lượng và phản hồi xây dựng."**

### 🎯 **Mission Breakdown**

**Cho Người lao động:**
- 👨‍💼 Cung cấp thông tin thực tế về môi trường làm việc
- 🚀 Giúp đưa ra quyết định nghề nghiệp sáng suốt
- 🛠️ Nền tảng chia sẻ kinh nghiệm làm việc

**Cho Công ty:**
- 🎓 Xây dựng và quản lý employer branding
- 🎯 Tiếp nhận feedback để cải thiện
- 📊 Phản hồi và tương tác với review

**Cho Xã hội:**
- 🌱 Tăng tính minh bạch trong thị trường lao động
- 📈 Giảm tỷ lệ nghỉ việc do chọn sai công ty
- 🤝 Xây dựng cộng đồng chia sẻ kinh nghiệm

---

## 3.3. Core Values (Giá trị cốt lõi)

### 💎 **5 Core Values**

1. **Transparency (Minh bạch)**
   - Mọi review đều công khai và minh bạch
   - Quy trình duyệt rõ ràng

2. **Trust (Tin cậy)**
   - Xác thực người review
   - Quality control cho nội dung

3. **Fairness (Công bằng)**
   - Cho phép công ty phản hồi review
   - Cơ chế báo cáo nội dung không phù hợp

4. **Community (Cộng đồng)**
   - Xây dựng cộng đồng chia sẻ kinh nghiệm
   - Bình luận và thảo luận xây dựng

5. **Impact (Tác động)**
   - Đo lường thành công bằng giá trị mang lại cho người dùng
   - Tác động tích cực đến thị trường lao động

---

# 4. GIẢI QUYẾT CÁC THÁCH THỨC CỐT LÕI

## 4.1. Nghịch lý "Niềm tin & Ẩn danh" (The Anonymity Paradox)

### 🔴 **Vấn đề**
- Nếu **bắt buộc KYC**: Người dùng sợ bị lộ danh tính, bị công ty cũ trả thù → Không ai dám review
- Nếu **ẩn danh hoàn toàn**: Đối thủ spam review xấu, nhân viên bị sa thải trả thù cá nhân → Dữ liệu rác

### ✅ **Giải pháp: "Verified but Anonymous" Model**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BLIND VERIFICATION FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Submit    →   System Verify   →   Store Only Hash   →  Show  │
│  ┌──────────┐       ┌────────────┐      ┌─────────────┐     Badge  │
│  │Email công│       │Check domain│      │verified_at_ │     ┌────┐ │
│  │ty/Payslip│   →   │Validate    │  →   │company_X=   │  →  │ ✓  │ │
│  │/Contract │       │Encrypt     │      │true         │     └────┘ │
│  └──────────┘       └────────────┘      └─────────────┘            │
│                                                                     │
│  ❌ KHÔNG lưu: Tên, Email cụ thể, Thời gian làm việc chính xác     │
│  ✅ CHỈ lưu: verified = true/false, company_id                      │
└─────────────────────────────────────────────────────────────────────┘
```

| Cơ chế | Mô tả | Mục đích |
|--------|-------|----------|
| **Zero-Knowledge Verification** | Xác thực user TỪNG làm việc tại công ty, KHÔNG lưu danh tính cụ thể | Cân bằng Trust & Privacy |
| **Time-delayed Review** | Review được publish sau 3-6 tháng nghỉ việc | Giảm khả năng truy ngược danh tính |
| **Batch Publishing** | Gộp nhiều review và publish cùng lúc (ví dụ: mỗi tuần 1 lần) | Không ai biết review nào của ai |
| **Credential Hashing** | Hash thông tin xác thực bằng one-way encryption | Ngay cả admin cũng không xem được danh tính |
| **Verification Tiers** | Level 1: Email công ty, Level 2: Payslip, Level 3: Contract | Nhiều cách verify, tùy mức độ tin cậy |

### 📊 **Verification Levels**

| Level | Phương thức | Badge | Trust Score |
|-------|-------------|-------|-------------|
| 0 | Không verify | Không có | ⭐ |
| 1 | Email công ty (@company.com) | 🔵 Verified Email | ⭐⭐ |
| 2 | Payslip/Bảng lương (blur info nhạy cảm) | 🟢 Verified Employee | ⭐⭐⭐ |
| 3 | Hợp đồng lao động (blur info nhạy cảm) | 🟡 Verified Contract | ⭐⭐⭐⭐ |

---

## 4.2. Vấn đề "Con gà & Quả trứng" (Cold Start Problem)

### 🔴 **Vấn đề**
- User chỉ vào xem khi web có nhiều review
- User chỉ viết review khi web đã nổi tiếng
- Company chỉ claim khi thấy có traffic
- **→ Giai đoạn đầu website vắng = Giá trị = 0**

### ✅ **Giải pháp: Multi-phase Launch Strategy**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COLD START STRATEGY                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Phase 1        Phase 2          Phase 3          Phase 4          │
│  SEEDING    →   INCENTIVE    →   VIRAL        →   ORGANIC          │
│  ┌────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     │
│  │Partner │     │Reward    │     │Review to │     │SEO +     │     │
│  │+ Seed  │ →   │Credits   │  →  │Unlock    │  →  │Word of   │     │
│  │Data    │     │System    │     │Content   │     │Mouth     │     │
│  └────────┘     └──────────┘     └──────────┘     └──────────┘     │
│                                                                     │
│  Target: 1K     Target: 5K       Target: 20K      Target: 100K+    │
│  reviews        reviews          reviews          reviews          │
└─────────────────────────────────────────────────────────────────────┘
```

| Phase | Chiến lược | Chi tiết | KPI |
|-------|-----------|----------|-----|
| **Phase 1: Seeding** | Partnership + Seed Data | - Hợp tác với cộng đồng IT (VietDev, VNOI, TopDev community)<br>- Import dữ liệu công ty từ nguồn công khai<br>- Cuộc thi "Review công ty đầu tiên" có thưởng<br>- Mời Influencers/KOLs trong ngành HR | 1,000 reviews |
| **Phase 2: Incentive** | Reward System | - User review = nhận Credits<br>- Credits dùng để xem review chi tiết/analytics<br>- Gamification: Badge, Leaderboard | 5,000 reviews |
| **Phase 3: Viral** | Review-to-Unlock | - Muốn xem review công ty X → Phải review 1 công ty bạn từng làm<br>- Share review lên LinkedIn = bonus credits | 20,000 reviews |
| **Phase 4: Organic** | SEO + Network Effects | - Trang công ty chuẩn SEO<br>- Google search "review [tên công ty]" → Trang của chúng ta<br>- Word-of-mouth từ user hài lòng | 100,000+ reviews |

### 🎯 **Niche Focus Strategy**
> Thay vì launch rộng, tập trung vào **1 ngành trước** (ví dụ: IT/Tech companies)
> - Cộng đồng IT đông, active, hay chia sẻ
> - Dễ partnership với TopDev, ITviec
> - Sau đó mở rộng sang Finance, FMCG, etc.

---

## 4.3. Xung đột Monetization vs Core Values

### 🔴 **Vấn đề**
- Nếu thu phí từ Company → Họ yêu cầu xóa review xấu → Mất Trust với User
- Nếu không thu phí → Không có doanh thu để vận hành
- **Thực tế**: Glassdoor bị tố "bán mình" cho doanh nghiệp, ẩn review tiêu cực của công ty Premium

### ✅ **Giải pháp: "Firewall" Business Model**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REVENUE vs CONTENT FIREWALL                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│     CONTENT TEAM                    BUSINESS TEAM                   │
│     ┌──────────────┐                ┌──────────────┐                │
│     │ Review       │                │ Sales        │                │
│     │ Moderation   │   🔥 FIREWALL  │ Partnership  │                │
│     │ Guidelines   │ ◄────────────► │ Premium Acct │                │
│     │ Quality      │   NO CROSSING  │ Analytics    │                │
│     └──────────────┘                └──────────────┘                │
│                                                                     │
│     ❌ Business KHÔNG THỂ yêu cầu Content xóa review                │
│     ❌ Premium account KHÔNG ảnh hưởng đến hiển thị review          │
└─────────────────────────────────────────────────────────────────────┘
```

### 💰 **Revenue Streams (Không xung đột với Values)**

| Stream | Mô tả | Tại sao không conflict |
|--------|-------|------------------------|
| **1. Verified Response Badge** | Công ty trả phí để có badge xác thực khi phản hồi review | Họ MUA QUYỀN PHẢN HỒI, không phải xóa review |
| **2. Employer Branding Tools** | Dashboard, analytics về perception của công ty | Bán INSIGHT, không bán quyền edit review |
| **3. Job Posting Integration** | Đăng tin tuyển dụng trên profile công ty | Hoàn toàn tách biệt với review system |
| **4. Aggregated Analytics** | Bán báo cáo tổng hợp cho HR firms/recruiters | Dữ liệu ẩn danh, không cá nhân |
| **5. Premium Company Profile** | Thêm video, hình ảnh, mô tả chi tiết hơn | Enhancement, không ảnh hưởng review |

### 📜 **"Never Delete" Policy**

> **CAM KẾT CÔNG KHAI:**
> 1. Review chỉ bị xóa nếu vi phạm Community Guidelines (spam, hate speech, thông tin cá nhân)
> 2. Công ty trả tiền KHÔNG được quyền yêu cầu xóa review
> 3. Publish **Monthly Transparency Report**: Số review bị xóa, lý do, appeal results
> 4. User có quyền appeal nếu review bị xóa sai

---

## 4.4. Rủi ro Pháp lý & Kiểm duyệt Nội dung

### 🔴 **Vấn đề**
- Ranh giới "Review chân thật" vs "Xúc phạm/Vu khống" rất mong manh
- Công ty bị review xấu có thể kiện vì "bôi nhọ uy tín doanh nghiệp"
- Human moderation không scale, AI moderation dễ bị lọt

### ✅ **Giải pháp: Multi-layer Content Moderation**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTENT MODERATION LAYERS                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Layer 1          Layer 2          Layer 3          Layer 4        │
│  PRE-SUBMIT   →   AI FILTER    →   COMMUNITY    →   LEGAL          │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐   │
│  │Guidelines│     │Keyword   │     │User Flag │     │Legal Team│   │
│  │Checklist │ →   │NLP Check │  →  │Report    │  →  │Review    │   │
│  │Education │     │Auto-block│     │Vote      │     │Decision  │   │
│  └──────────┘     └──────────┘     └──────────┘     └──────────┘   │
│                                                                     │
│  ~80% pass        ~15% blocked     ~4% flagged      ~1% escalated  │
└─────────────────────────────────────────────────────────────────────┘
```

| Layer | Cơ chế | Chi tiết |
|-------|--------|----------|
| **Layer 1: Pre-submission** | Education + Guidelines | - Hiển thị DO's and DON'Ts trước khi viết<br>- Checklist: "Review của tôi không chứa tên cá nhân, không xúc phạm..."<br>- Ví dụ review tốt vs review vi phạm |
| **Layer 2: AI Filter** | Auto-moderation | - Chặn: Tên cá nhân, số điện thoại, thông tin riêng tư<br>- Flag: Từ khóa nhạy cảm, slang ám chỉ<br>- NLP detect: Sentiment cực đoan, hate speech |
| **Layer 3: Community** | Crowdsourced moderation | - User flag review vi phạm<br>- Trusted reviewers (high karma) có quyền vote<br>- Threshold: 5 flags → Auto-hide pending review |
| **Layer 4: Legal Review** | Human + Legal | - Đội ngũ pháp lý review các case bị flag nhiều<br>- Response SLA cho takedown requests<br>- Appeal process cho user bị xóa review |

### ⚖️ **Legal Protection Framework**

| Biện pháp | Mục đích |
|-----------|----------|
| **Safe Harbor Clause trong ToS** | Platform là trung gian, không chịu trách nhiệm về nội dung user tạo |
| **Clear Content Policy** | Định nghĩa rõ: Review chấp nhận vs Không chấp nhận |
| **DMCA-style Takedown Process** | Quy trình tiếp nhận khiếu nại từ công ty, có deadline response |
| **Counter-notification** | User có quyền phản đối nếu review bị xóa sai |
| **Legal Insurance** | Bảo hiểm pháp lý cho các vụ kiện |

### 📋 **Content Guidelines Summary**

| ✅ Được phép | ❌ Không được phép |
|-------------|-------------------|
| Chia sẻ trải nghiệm cá nhân | Nêu tên cá nhân cụ thể |
| Đánh giá môi trường làm việc | Tiết lộ thông tin mật của công ty |
| Nhận xét về chính sách công ty | Xúc phạm, chửi bới, đe dọa |
| So sánh với các công ty khác | Vu khống không có căn cứ |
| Góp ý xây dựng | Spam, quảng cáo |

---

## 4.5. Sự thiên lệch về Cảm xúc (Selection Bias)

### 🔴 **Vấn đề**
- Người ta thường chỉ review khi RẤT THÍCH hoặc RẤT GHÉT (thường là ghét)
- Nền tảng dễ trở thành "thùng rác cảm xúc" (toxic environment)
- Công ty tốt và nhân tài sẽ rời bỏ nếu môi trường quá toxic

### ✅ **Giải pháp: Balanced Review Ecosystem**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BALANCED REVIEW MECHANISMS                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ STRUCTURED FORM │  │ COOLING PERIOD  │  │ HELPFULNESS     │     │
│  │ ───────────────│  │ ───────────────│  │ ───────────────│     │
│  │ Bắt buộc nêu   │  │ Review publish  │  │ Community vote  │     │
│  │ cả Pros & Cons │  │ sau 7 ngày      │  │ "Hữu ích"       │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ TENURE WEIGHT   │  │ VERIFIED BOOST  │  │ BALANCED ALGO   │     │
│  │ ───────────────│  │ ───────────────│  │ ───────────────│     │
│  │ Làm lâu năm =  │  │ Verified user = │  │ Ưu tiên hiển   │     │
│  │ trọng số cao   │  │ được highlight  │  │ thị review cân │     │
│  │                 │  │                 │  │ bằng            │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

| Cơ chế | Mô tả | Mục đích |
|--------|-------|----------|
| **Structured Review Form** | Bắt buộc điền: "Điều tốt" VÀ "Điều cần cải thiện" | Tránh review một chiều (toàn khen hoặc toàn chê) |
| **Cooling Period** | Review chỉ publish sau 7 ngày submit | Cho user thời gian suy nghĩ lại, giảm review nóng giận |
| **Helpfulness Score** | Community vote "Review này hữu ích" | Review cân bằng, chi tiết được ưu tiên hiển thị |
| **Tenure-based Weight** | Review từ người làm 2+ năm có trọng số cao hơn | Ý kiến từ người có kinh nghiệm thực tế quan trọng hơn |
| **Verified Employee Badge** | Highlight review từ verified employees | Tăng trust cho review chất lượng |
| **Balanced Display Algorithm** | Hiển thị mix review tích cực + tiêu cực | Tránh bias hiển thị toàn review tiêu cực |

### 📊 **Review Score Formula**

```
Display_Priority = 
    (Helpfulness_Votes × 2) +
    (Verification_Level × 1.5) +
    (Tenure_Weight × 1) +
    (Balance_Score × 1) -
    (Extreme_Sentiment_Penalty × 0.5) -
    (Age_Decay × 0.1)

Trong đó:
- Balance_Score: Cao nếu review có cả Pros và Cons
- Extreme_Sentiment_Penalty: Cao nếu review quá cực đoan (toàn 1⭐ hoặc toàn 5⭐)
```

### 🎨 **UI/UX Design cho Balanced Reviews**

| Element | Design |
|---------|--------|
| **Review Form** | 2 text areas bắt buộc: "Điểm tốt" + "Điểm cần cải thiện" |
| **Rating Display** | Hiển thị distribution (30% 5⭐, 40% 4⭐, etc.) thay vì chỉ số trung bình |
| **Filter Options** | Cho phép filter: "Most Helpful", "Most Recent", "Balanced Reviews" |
| **Sentiment Tags** | Tag review: "Constructive", "Detailed", "Verified" |

---

# 5. CHIẾN LƯỢC TRIỂN KHAI

## 5.1. Roadmap tổng quan

| Phase | Timeline | Focus | Key Milestones |
|-------|----------|-------|----------------|
| **Phase 1: Foundation** | Month 1-3 | Core platform + Verification system | Launch MVP với basic features |
| **Phase 2: Seeding** | Month 4-6 | Cold start strategy execution | 1,000 reviews, 100 công ty |
| **Phase 3: Growth** | Month 7-12 | Viral mechanics + Monetization | 10,000 reviews, Revenue positive |
| **Phase 4: Scale** | Year 2+ | Expand categories + Enterprise | 100,000+ reviews, Multi-industry |

## 5.2. Success Metrics

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| **Reviews** | 100 | 1,000 | 10,000 | 100,000+ |
| **Companies** | 50 | 500 | 2,000 | 10,000+ |
| **MAU** | 1,000 | 10,000 | 100,000 | 1,000,000+ |
| **Verification Rate** | 20% | 40% | 60% | 70%+ |
| **Helpfulness Score Avg** | - | 3.0 | 3.5 | 4.0+ |

## 5.3. Risk Mitigation Summary

| Risk | Mitigation | Contingency |
|------|------------|-------------|
| Low user adoption | Multi-phase launch, niche focus | Pivot to B2B model (sell to recruiters) |
| Legal challenges | Safe harbor, legal insurance | Partner with law firm, compliance review |
| Revenue-Trust conflict | Firewall model, transparency reports | Open-source moderation rules |
| Content quality | Multi-layer moderation | Stricter verification requirements |
| Competition | First-mover in VN market, community focus | Differentiation through trust & transparency |
