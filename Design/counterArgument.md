1. Phản biện về: "Verified but Anonymous" (Xác thực mù)
🔴 Lỗ hổng 1: Rào cản tâm lý "Hoang tưởng" (Paranoia Barrier) quá lớn

Thực tế: Người dùng Việt Nam có tính đa nghi cực cao. Dù bạn giải thích về Zero-Knowledge hay Hashing, họ chỉ nhìn thấy hành động: "Web này đòi upload Bảng lương/Hợp đồng".

Hệ quả: Conversion rate ở bước này sẽ cực thấp (< 1%). Chỉ những người cực kỳ bức xúc (muốn trả thù) mới bất chấp upload, hoặc những người làm giả giấy tờ. Người dùng bình thường sẽ bỏ cuộc ngay lập tức vì sợ rò rỉ thông tin cá nhân.

🔴 Lỗ hổng 2: Vô hiệu hóa ẩn danh ở quy mô nhỏ (Small Sample Size Deanonymization)

Thực tế: Giải pháp "Time-delayed" và "Batch publishing" vô dụng với các team/công ty nhỏ (SME).

Ví dụ: Công ty có 10 người, tháng đó chỉ có 1 người nghỉ việc. Dù bạn delay review 3 tháng sau mới hiện, sếp và đồng nghiệp cũ vẫn biết chính xác 100% đó là ai.

Hệ quả: Tính năng ẩn danh chỉ hoạt động với công ty >500 nhân viên. Với SME, user vẫn bị lộ danh tính như thường dựa trên văn phong và context câu chuyện.

🔴 Lỗ hổng 3: Xác thực giả mạo (Fraud Verification)

Thực tế: Photoshop một bảng lương hay hợp đồng lao động quá dễ. Bạn không lưu dữ liệu gốc, bạn chỉ validate tại thời điểm upload.

Hệ quả: Nếu dùng AI check -> dễ bị qua mặt. Nếu dùng Người check -> Vi phạm cam kết "Admin không xem được danh tính". Đối thủ cạnh tranh hoàn toàn có thể fake 50 cái hợp đồng để vào dìm hàng đối thủ.

2. Phản biện về: "Cold Start Strategy" (Seeding & Incentives)
🔴 Lỗ hổng 1: "Review to Unlock" tạo ra dữ liệu rác (Junk Data Incentive)

Thực tế: Khi bạn bắt user phải review mới được xem nội dung (Phase 3), user sẽ viết cho có lệ để qua ải.

Hệ quả: Bạn sẽ nhận được hàng nghìn review kiểu: "Công ty tốt", "Môi trường oke", "Lương bình thường"... chỉ để đủ ký tự. Dữ liệu này làm loãng hệ thống và giảm Trust Score của toàn sàn xuống mức 0.

🔴 Lỗ hổng 2: Chiến lược Niche IT/Tech là "Húc đầu vào đá"

Thực tế: Bạn chọn ngành IT làm bàn đạp là sai lầm chiến lược.

Dân IT là nhóm khó tính nhất, rành công nghệ nhất (biết fake IP, block ads, inspect element).

Dân IT đã có quá nhiều kênh: Blind (global), Voz, Reddit, Dev cãi nhau...

Dân IT đa nghi nhất về vấn đề bảo mật (quay lại vấn đề 1).

Hệ quả: Chi phí user acquisition cho ngành này cực cao nhưng độ trung thành thấp.

🔴 Lỗ hổng 3: Rủi ro pháp lý từ Phase 1 (Seeding Data)

Thực tế: "Import dữ liệu công ty từ nguồn công khai" nghe có vẻ hợp lý, nhưng nếu bạn scrape data từ các trang tuyển dụng khác hoặc trang vàng, bạn có thể bị kiện vi phạm bản quyền Database hoặc Terms of Service của họ trước khi kịp lớn.

3. Phản biện về: "Firewall Business Model"
🔴 Lỗ hổng 1: Mô hình "Bảo kê" trá hình (Protection Racket Perception)

Thực tế: Dù bạn có "Firewall", user vẫn sẽ nhìn thấy: Công ty A mua gói Premium -> Công ty A có nhiều badge đẹp -> Công ty A phản hồi nhanh.

Hệ quả: User mặc định coi đây là "Pay to win". Khi một công ty Premium có rating cao, user sẽ nghi ngờ tính trung thực của nền tảng. Glassdoor đã mất uy tín chính vì lý do này, dù họ cũng thề thốt là có Firewall.

🔴 Lỗ hổng 2: Nghịch lý khách hàng (Adverse Selection)

Thực tế: Những công ty có văn hóa tốt, họ không cần mua Employer Branding Tool của bạn. Hữu xạ tự nhiên hương.

Hệ quả: Khách hàng trả tiền cho bạn chủ yếu là những công ty có phốt, muốn dùng công cụ của bạn để "tẩy trắng" hoặc kiểm soát khủng hoảng. Bạn sẽ trở thành công cụ cho những "kẻ phản diện" có tiền.

🔴 Lỗ hổng 3: Dòng tiền không đủ nuôi bộ máy (Revenue Insufficiency)

Thực tế: Bán "Analytics" và "Badge" tại thị trường Việt Nam cực khó. Các công ty VN thường không chi ngân sách cho Data/Insight vô hình. Họ chỉ chi tiền cho Lead tuyển dụng (CV).

Hệ quả: Nếu không bán CV (làm trang tuyển dụng) hoặc không xóa bài (làm dịch vụ truyền thông bẩn), doanh thu sẽ không đủ bù chi phí server và legal.

4. Phản biện về: "Legal & Moderation"
🔴 Lỗ hổng 1: Luật An Ninh Mạng Việt Nam không có "Safe Harbor" tuyệt đối

Thực tế: Bạn viện dẫn DMCA/Safe Harbor (luật Mỹ). Tại Việt Nam, chủ sở hữu nền tảng chịu trách nhiệm liên đới rất cao. Khi có công văn từ cơ quan chức năng yêu cầu gỡ bỏ thông tin "sai sự thật/bôi nhọ", bạn buộc phải gỡ trước khi chứng minh được ai đúng ai sai.

Hệ quả: Cam kết "Never Delete" của bạn sẽ sụp đổ ngay khi nhận công văn dấu đỏ đầu tiên.

🔴 Lỗ hổng 2: Weaponized Community Moderation (Vũ khí hóa cộng đồng)

Thực tế: Cơ chế "5 flags -> Auto-hide" là con dao hai lưỡi.

Kịch bản: Công ty X bị nhân viên bóc phốt. Giám đốc lệnh cho 20 nhân viên HR/Marketing tạo tài khoản, vào flag cái review đó là "Spam/Fake".

Hệ quả: Review thật bị ẩn tự động bởi đám đông seeding của công ty. Hệ thống kiểm duyệt cộng đồng bị thao túng (Gaming the system).

5. Phản biện về: "Balanced Ecosystem" (Selection Bias)
🔴 Lỗ hổng 1: "Cooling Period" 7 ngày giết chết cảm xúc (Engagement Killer)

Thực tế: User viết review vì họ đang bức xúc (nóng). Bắt họ đợi 7 ngày mới hiện?

Họ tưởng web lỗi.

Họ quên mất mình đã viết.

Họ mất hứng thú quay lại xem phản hồi.

Hệ quả: Giảm retention rate cực mạnh. Mạng xã hội cần sự tức thời (Instant Gratification).

🔴 Lỗ hổng 2: Ép buộc "Pros & Cons" tạo ra nội dung giả tạo

Thực tế: Một người vừa bị quỵt lương, họ vào để chửi. Bạn ép họ phải viết "Điểm tốt"?

Hệ quả: Họ sẽ viết: "Điểm tốt: Không có gì", "Điểm tốt: Nhà vệ sinh sạch". Trường dữ liệu này trở nên vô nghĩa và gây ức chế trải nghiệm người dùng (UX Friction).

🔴 Lỗ hổng 3: Thuật toán hiển thị gây nghi ngờ (Algorithmic Bias)

Thực tế: Nếu công ty đó thực sự tệ (100 review 1 sao), nhưng thuật toán của bạn cố tình đẩy 1 review 4 sao lên đầu để "Balance".

Hệ quả: User vào làm việc, thấy bị lừa, quay lại chửi nền tảng là "bao che". Sự thật không phải lúc nào cũng cân bằng (bell curve), đôi khi sự thật là lệch hẳn về một phía. Cố tình cân bằng là bóp méo sự thật.