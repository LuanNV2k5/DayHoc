# HỌC LIỆU DẠY HỌC: BÀI 21 – CÁC THUẬT TOÁN SẮP XẾP ĐƠN GIẢN
**Môn:** Tin học 11 – Bộ sách *Kết nối tri thức với cuộc sống*  
**Đối tượng sử dụng:** Giáo viên trình chiếu trên máy chiếu / Smart TV trong lớp học (không yêu cầu học sinh đăng nhập).

---

## 1. Mục tiêu và tính năng chính

Ứng dụng mô phỏng trực quan chuẩn sư phạm cho 3 thuật toán sắp xếp trong chương trình:
1. **Sắp xếp chèn (Insertion Sort):** Mô tả chuẩn cơ chế **"DỊCH → TẠO CHỖ → CHÈN"**, nhấc biến `value` lên khay nổi bật, dịch các phần tử lớn hơn sang phải và chèn vào đúng chỗ.
2. **Sắp xếp chọn (Selection Sort):** Mô tả chuẩn quy tắc **"TÌM HẾT → CHỌN NHỎ NHẤT (iMin) → ĐỔI CHỖ 1 LẦN"** với `A[i]`.
3. **Sắp xếp nổi bọt (Bubble Sort):** Mô tả trực quan so sánh cặp liền kề `A[j]` và `A[j+1]`, đẩy dần số lớn về vùng cố định bên phải với huy hiệu *"Đã đúng vị trí – không cần xét lại"*.

### Các công cụ sư phạm đắc lực cho Giáo viên:
- **Hai chế độ bài giảng linh hoạt:**
  - **Khởi động (Chỉ hình):** Ẩn toàn bộ mã Python và giải thích để học sinh quan sát sự vận động của dãy số và tự rút ra quy luật.
  - **Hình thành kiến thức:** Hiển thị đồng bộ mô phỏng, dòng mã Python đang chạy, bảng biến và bảng trace.
- **Chế độ trình chiếu (Presentation Mode):** Phóng to cột số, số lớn rõ từ cuối lớp, tối ưu tỷ lệ 16:9.
- **Tự động dừng sau mỗi vòng ngoài:** Dừng lại ở cuối mỗi vòng và đưa ra câu hỏi sư phạm: *"Sau vòng này, điều gì đã chắc chắn đúng?"*.
- **Bảng Trace theo vòng lặp (SGK):** Tự động ghi nhận trạng thái sau mỗi vòng lặp; giáo viên có thể nhấp vào bất kỳ dòng nào để đưa mô phỏng về trạng thái đó; hỗ trợ in/xuất làm phiếu học tập.
- **Hai chế độ điều khiển:** Tự động (với 4 mức tốc độ) và Từng bước (Next, Prev, Nhảy vòng, Reset) kèm phím tắt tiện lợi (Phím Space, Mũi tên).

---

## 2. Cấu trúc thư mục mã nguồn

```
├── index.html                    # Entry point HTML thiết lập font tiếng Việt, title chuẩn SGK
├── metadata.json                 # Metadata ứng dụng AI Studio
├── package.json                  # Cấu hình dependency (React 19, Tailwind CSS, Lucide Icons)
├── README.md                     # Tài liệu hướng dẫn sử dụng và triển khai
├── src/
│   ├── main.tsx                  # Điểm khởi chạy React
│   ├── App.tsx                   # Thành phần trung tâm điều phối trạng thái và phím tắt
│   ├── index.css                 # CSS toàn cục Tailwind
│   ├── types.ts                  # Định nghĩa kiểu dữ liệu (Snapshots, Traces, Variables)
│   ├── algorithms/
│   │   ├── insertionSort.ts      # Bộ tạo snapshot và trace cho Sắp xếp chèn (chuẩn mã SGK)
│   │   ├── selectionSort.ts      # Bộ tạo snapshot và trace cho Sắp xếp chọn (chuẩn mã SGK)
│   │   ├── bubbleSort.ts         # Bộ tạo snapshot và trace cho Sắp xếp nổi bọt (chuẩn mã SGK)
│   │   └── index.ts              # Export metadata thuật toán và các dãy số mẫu thử
│   └── components/
│       ├── Navbar.tsx            # Thanh điều hướng, chọn thuật toán, chế độ trình chiếu
│       ├── ArrayControls.tsx     # Nhập dãy tùy chỉnh, tạo ngẫu nhiên, hoàn tác dãy SGK
│       ├── Visualizer.tsx        # Trực quan hóa cột số, banner so sánh ĐÚNG/SAI, con trỏ i/j/iMin
│       ├── PlaybackControls.tsx  # Bộ điều khiển Tự động / Từng bước, thanh tốc độ, dừng theo vòng
│       ├── StepExplanation.tsx   # Khung giải thích bước hiện tại ngắn gọn chuẩn lớp 11
│       ├── PythonCodePanel.tsx   # Khung mã Python SGK highlight dòng đồng bộ, bảng biến
│       ├── TraceTable.tsx        # Bảng trace theo vòng lặp tương tác và nút in ấn
│       ├── LoopReflectionBanner.tsx # Khung câu hỏi sư phạm sau mỗi vòng ngoài
│       └── GuideModal.tsx        # Hộp thoại hướng dẫn mục tiêu bài học và cách dạy
```

---

## 3. Hướng dẫn chạy Local (Phát triển)

Yêu cầu máy tính đã cài đặt **Node.js (phiên bản 18 trở lên)**.

```bash
# 1. Mở terminal tại thư mục dự án và cài đặt gói thư viện
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Mở trình duyệt web truy cập địa chỉ:
http://localhost:3000
```

---

## 4. Hướng dẫn Build bản Offline (Dùng trên lớp không cần Internet)

Giáo viên có thể xuất toàn bộ web thành các file tĩnh để copy vào USB mang lên máy tính lớp học chạy trực tiếp:

```bash
# Thực hiện lệnh build sản phẩm
npm run build
```

- Sau khi chạy xong, thư mục **`dist/`** được tạo ra.
- Thư mục `dist/` chứa toàn bộ mã nguồn HTML, CSS, JavaScript đã được đóng gói hoàn chỉnh.
- Giáo viên có thể dùng bất kỳ trình duyệt web nào (Chrome, Edge, Cốc Cốc) để mở file `dist/index.html` hoặc dùng tiện ích mở rộng Local Server để trình chiếu mà **không cần kết nối mạng Internet**.

---

## 5. Danh sách phím tắt cho Giáo viên khi đứng lớp

- **Phím Space (Cách):** Bật / Tạm dừng chạy tự động.
- **Phím Mũi tên phải (→):** Thực hiện một bước tiếp theo.
- **Phím Mũi tên trái (←):** Lùi lại một bước trước.
- **Phím R:** Khôi phục về đầu (Bước 1).
