# Ext vBook: Cà Chua (Fanqie Novel)

Đọc truyện chữ Trung Quốc từ **Fanqie Novel (番茄小说, fanqienovel.com)** — kho truyện miễn phí lớn nhất Trung Quốc. Tác giả: Linnea / tieu y tien.

## v2 (25/11/2026, 21:02) — đổi icon

- Icon mới: **Klee chibi** (nháy mắt, ngó qua mép) — ảnh dễ thương trên Pinterest, chị chọn trong 4 tấm (Kazuha, Lumine, Klee, Mualani), đã cắt 512×512.
- Chức năng không đổi so với v1 (chị báo oke hết).

## v1 (25/11/2026, 20:50) — bản đầu tiên

- **Trang chủ:** 4 tab từ API thư viện chính thức của Fanqie — Hot, Mới, Hoàn, Dài.
- **Thể loại:** API `/api/author/book/category_list/v0/` (260 mục). Mặc định chỉ hiện nhóm thể loại chính (主分类, 36 mục); tắt toggle trong Cài đặt để xem toàn bộ (thêm 主题/角色/情节).
- **Tìm kiếm:** qua mirror `gofq.52dns.cc/search` (API chính thức không có endpoint tìm kiếm dùng được từ vBook).
- **Chi tiết / Mục lục / Chương:** qua mirror `gofq.52dns.cc` (`/detail`, `/catalog`, `/content`).
- **Cài đặt (giống ext Cà Chua C2 của kychi):**
  - **Lọc giới tính:** `-1=Tất cả` (mặc định), `1=Truyện nam`, `0=Truyện nữ` — lọc cả trang chủ lẫn thể loại.
  - **Chỉ hiện thể loại chính:** bật/tắt.
  - Kết nối song song 3 luồng, giãn cách 100ms.
- **Giải mã font:** tên sách/thể loại/chương từ Fanqie bị mã hoá font (ký tự vùng riêng U+E378–U+E59B) — ext giải mã bằng bảng charset (đã kiểm chứng live: "觉醒：EX级法师，开局无限火力", "北派盗墓笔记").

## Nguồn / cách làm

- Học từ ext **"[Fanqie] Cà Chua C2" v6** của **kychi** (kychitoge/vbook-ext, `extensions/chinese_novel/kychi-cachua-c2`) — code gốc không mã hoá, đã đọc toàn bộ và kiểm chứng live từng endpoint ngày 25/11/2026. Ext Sói Xám v3 của kychi dùng login bên thứ ba (giới hạn 3 chương/ngày cho khách) nên không theo hướng đó.
- Kiểm chứng live 25/11/2026 (curl, dữ liệu thật trong `hidden_test/`):
  - Mirror search "庆余年": code 0, 9 tab, 10 kết quả/tab.
  - Detail 北派盗墓笔记 (book 6985246250434038815): tên/tác giả Vân Phong, 4.522.103 chữ, điểm 9.6, thể loại 悬疑灵异.
  - Catalog: 1856 chương, chương 1 "第1章 离家".
  - Content chương 1: đọc được sạch ("我在里面待了七年...").
  - API chính thức book_list: code 0, 20 sách (tên cần giải mã font — đã kiểm chứng đúng).
  - API chính thức category_list: code 0, 260 thể loại.
- Harness `hidden_test/test-fanqie.js`: **39/39 pass** (config/home/genre/gen/search/detail/toc/chap trên dữ liệu thật).

## Lưu ý

- Mirror `gofq.52dns.cc` là dịch vụ bên thứ ba (proxy), không phải của Fanqie. Nếu nó chết thì tìm kiếm/chi tiết/mục lục/chương sẽ hỏng; trang chủ + thể loại (API chính thức) vẫn chạy.
- Icon cà chua vẽ bằng PIL (tạm); có thể thay bằng ảnh đẹp hơn sau.
