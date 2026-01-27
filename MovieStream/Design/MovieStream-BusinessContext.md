# MovieStream - Business Context & Vision

## Giới thiệu

Tài liệu này mô tả bối cảnh kinh doanh, tầm nhìn và sứ mệnh của dự án **MovieStream** - nền tảng phát video trực tuyến (VOD) dành cho thị trường Việt Nam, tập trung vào nội dung phim bộ/phim tập do chính đội ngũ sản xuất.

---

## 1. Bối cảnh thị trường

### 1.1. Tổng quan thị trường VOD Việt Nam

Thị trường video-on-demand (VOD) tại Việt Nam đang phát triển mạnh mẽ với các đặc điểm:

- **Tăng trưởng nhanh**: Doanh thu VOD tại Việt Nam dự kiến đạt ~$200 triệu USD vào 2025
- **Người dùng trẻ**: 70% người xem phim online trong độ tuổi 18-35
- **Thiết bị mobile**: 65% lượt xem đến từ điện thoại di động
- **Sẵn sàng trả phí**: Người dùng Việt Nam ngày càng chấp nhận mô hình subscription

### 1.2. Đối thủ cạnh tranh

| Nền tảng | Loại hình | Điểm mạnh | Điểm yếu |
|----------|-----------|-----------|----------|
| Netflix | Quốc tế | Nội dung chất lượng, UX tốt | Giá cao, ít nội dung Việt |
| VieON | Nội địa | Nội dung Việt phong phú | UX chưa tối ưu |
| FPT Play | Nội địa | Thể thao, phim truyền hình | Phụ thuộc FPT |
| Galaxy Play | Nội địa | Phim Việt chiếu rạp | Nội dung hạn chế |
| YouTube | Miễn phí | Miễn phí, đa dạng | Nhiều quảng cáo, khó monetize |

### 1.3. Cơ hội thị trường

1. **Nội dung độc quyền**: Phim bộ tự sản xuất tạo sự khác biệt
2. **Chi phí tối ưu**: Tận dụng công nghệ mới để giảm chi phí vận hành
3. **Trải nghiệm tập trung**: Không bị phân tán bởi quá nhiều nội dung
4. **Cộng đồng fan**: Xây dựng cộng đồng fan trung thành cho content riêng

---

## 2. Vấn đề cần giải quyết

### 2.1. Thách thức về bản quyền và bảo vệ nội dung

**Vấn đề**: Video piracy là vấn đề nghiêm trọng tại Việt Nam
- Hàng trăm website phim lậu hoạt động công khai
- Video bị tải lại và đăng lên các nền tảng khác trong vài giờ
- Thiệt hại doanh thu ước tính 30-50% cho các nhà sản xuất nội dung

**Giải pháp cần triển khai**:
- HLS Encryption (AES-128)
- Signed URLs với thời hạn ngắn
- Dynamic watermark hiển thị thông tin người xem
- Domain restriction & referer check
- Rate limiting để ngăn chặn download hàng loạt

### 2.2. Thách thức về chi phí infrastructure

**Vấn đề**: Chi phí hosting video rất cao
- Bandwidth cho video streaming tốn kém
- Lưu trữ video 1080p cần dung lượng lớn
- CDN chất lượng có giá cao

**Giải pháp cần triển khai**:
- Sử dụng Bunny.net Stream (chi phí thấp nhất thị trường)
- Adaptive Bitrate Streaming để tối ưu bandwidth
- Lazy loading và caching hiệu quả

### 2.3. Thách thức về thanh toán

**Vấn đề**: Thanh toán online tại Việt Nam phức tạp
- Nhiều phương thức: Thẻ ngân hàng, ví điện tử, chuyển khoản
- Tỷ lệ giao dịch thất bại cao với thẻ quốc tế
- Cần hỗ trợ recurring payment cho subscription

**Giải pháp cần triển khai**:
- Tích hợp VNPay (phổ biến nhất)
- Tích hợp MoMo (ví điện tử hàng đầu)
- Auto-renewal với webhook

---

## 3. Tầm nhìn & Sứ mệnh

### 3.1. Tầm nhìn (Vision)

> Trở thành nền tảng phát sóng phim bộ độc quyền hàng đầu, nơi khán giả Việt Nam có thể thưởng thức những tác phẩm chất lượng với trải nghiệm xem tuyệt vời và chi phí hợp lý.

### 3.2. Sứ mệnh (Mission)

1. **Nội dung chất lượng**: Cung cấp phim bộ do chính đội ngũ sản xuất với chất lượng cao
2. **Trải nghiệm mượt mà**: Đảm bảo video streaming nhanh, ổn định trên mọi thiết bị
3. **Giá cả hợp lý**: Mức giá subscription phù hợp với thu nhập người Việt
4. **Bảo vệ sáng tạo**: Bảo vệ công sức của đội ngũ sản xuất khỏi nạn piracy

### 3.3. Giá trị cốt lõi

- **Chất lượng**: Không thỏa hiệp về chất lượng nội dung và kỹ thuật
- **Đơn giản**: Giao diện và trải nghiệm người dùng đơn giản, dễ sử dụng
- **Minh bạch**: Rõ ràng về giá cả và quyền lợi subscription
- **Bảo mật**: Bảo vệ thông tin người dùng và nội dung bản quyền

---

## 4. Đối tượng người dùng mục tiêu

### 4.1. Persona chính: Người xem phim (Viewer)

**Đặc điểm nhân khẩu học**:
- Độ tuổi: 18-45
- Giới tính: Cả nam và nữ
- Vị trí: Việt Nam (tập trung thành phố lớn)
- Thu nhập: Trung bình trở lên

**Hành vi**:
- Xem phim online hàng ngày/tuần
- Thích phim bộ, theo dõi từng tập
- Sử dụng điện thoại và laptop để xem
- Sẵn sàng trả phí cho nội dung chất lượng

**Nhu cầu**:
- Nội dung hay, hấp dẫn
- Video load nhanh, không giật lag
- Dễ dàng theo dõi tiến độ xem
- Thanh toán đơn giản

### 4.2. Persona phụ: Quản trị viên (Admin)

**Đặc điểm**:
- Thành viên đội ngũ sản xuất
- Cần upload và quản lý video
- Theo dõi doanh thu và analytics

**Nhu cầu**:
- Upload video nhanh, dễ dàng
- Quản lý metadata (title, description, thumbnail)
- Xem báo cáo doanh thu, lượt xem
- Quản lý subscription users

---

## 5. Yêu cầu tuân thủ & Pháp lý

### 5.1. Bản quyền nội dung

- **Sở hữu trí tuệ**: Tất cả nội dung phải do chính đội ngũ sản xuất hoặc có giấy phép hợp lệ
- **Đăng ký bản quyền**: Cần đăng ký bản quyền tại Cục Bản quyền tác giả
- **DMCA Takedown**: Thiết lập quy trình xử lý vi phạm bản quyền

### 5.2. Bảo vệ dữ liệu người dùng

- **Nghị định 13/2023/NĐ-CP**: Tuân thủ quy định về bảo vệ dữ liệu cá nhân
- **Chính sách bảo mật**: Công bố rõ ràng cách thu thập và sử dụng dữ liệu
- **Mã hóa**: Mã hóa thông tin nhạy cảm (password, payment info)

### 5.3. Thanh toán điện tử

- **Nghị định 101/2024/NĐ-CP**: Tuân thủ quy định về thanh toán không dùng tiền mặt
- **PCI DSS**: Sử dụng payment gateway có chứng chỉ PCI DSS (VNPay, MoMo)
- **Hóa đơn điện tử**: Cung cấp hóa đơn cho giao dịch subscription

### 5.4. Nội dung phát sóng

- **Luật Điện ảnh**: Nội dung phải phù hợp quy định về điện ảnh Việt Nam
- **Phân loại độ tuổi**: Hiển thị nhãn phân loại nội dung (P, C13, C16, C18)
- **Giấy phép**: Nếu cần, xin giấy phép cung cấp dịch vụ phát sóng trực tuyến

---

## 6. Mô hình kinh doanh

### 6.1. Nguồn doanh thu chính: Subscription

| Gói | Giá đề xuất | Quyền lợi |
|-----|-------------|-----------|
| **Cơ bản** | 49,000 VNĐ/tháng | Xem tất cả phim miễn phí, 720p |
| **Premium** | 79,000 VNĐ/tháng | Xem tất cả phim kể cả premium, 1080p, không quảng cáo |
| **VIP Năm** | 699,000 VNĐ/năm | Tương đương Premium, tiết kiệm 26% |

### 6.2. Mô hình Freemium

- **Miễn phí**: Một số tập đầu của phim bộ
- **Trả phí**: Các tập tiếp theo và phim premium
- **Trial**: 7 ngày dùng thử Premium miễn phí

### 6.3. Chỉ số thành công (KPIs)

| Chỉ số | Mục tiêu 6 tháng | Mục tiêu 1 năm |
|--------|------------------|----------------|
| Registered Users | 5,000 | 20,000 |
| Paid Subscribers | 500 | 3,000 |
| Monthly Revenue | 25 triệu VNĐ | 200 triệu VNĐ |
| Churn Rate | < 10%/tháng | < 7%/tháng |
| Average Watch Time | 30 phút/ngày | 45 phút/ngày |

---

## 7. Roadmap sản phẩm

### Phase 1: MVP (Tháng 1-2)

**Mục tiêu**: Ra mắt phiên bản cơ bản có thể thu phí

Tính năng:
- [ ] Trang chủ với danh sách phim
- [ ] Trang chi tiết phim với danh sách tập
- [ ] Đăng ký/Đăng nhập
- [ ] Xem video với HLS streaming
- [ ] Thanh toán subscription (VNPay)
- [ ] Admin upload video cơ bản

### Phase 2: Enhancement (Tháng 3-4)

**Mục tiêu**: Nâng cao trải nghiệm người dùng

Tính năng:
- [ ] Tích hợp MoMo payment
- [ ] Review & Vote system
- [ ] Lịch sử xem & tiếp tục xem
- [ ] Category & Tag filtering
- [ ] Search functionality
- [ ] Dynamic watermark

### Phase 3: Growth (Tháng 5-6)

**Mục tiêu**: Mở rộng và tối ưu

Tính năng:
- [ ] Push notification cho tập mới
- [ ] Referral program
- [ ] Analytics dashboard cho admin
- [ ] Multi-profile per account
- [ ] Download offline (nếu khả thi)

---

## 8. Rủi ro và giảm thiểu

| Rủi ro | Mức độ | Giảm thiểu |
|--------|--------|------------|
| Video bị piracy | Cao | HLS encryption, watermark, DMCA takedown |
| Chi phí vượt ngân sách | Trung bình | Sử dụng Bunny.net, monitor chặt chẽ |
| Ít người đăng ký | Trung bình | Content marketing, free trial, giá hợp lý |
| Thanh toán thất bại | Thấp | Multiple payment options, retry mechanism |
| Server downtime | Thấp | Sử dụng cloud provider uy tín, CDN |

---

*Tài liệu này được cập nhật lần cuối: Tháng 1/2026*
