# Ext vBook: SangTacViet (sangtacviet.com)

Đọc truyện chữ Trung Quốc đã dịch VietPhrase tiếng Việt trong vBook, nguồn SangTacViet.

## Cài đặt

1. Trong vBook: `︙ -> Phần mở rộng -> Nhập phần mở rộng`, chọn file zip này.
2. Mở tab nguồn **SangTacViet**, dùng như nguồn truyện bình thường: tìm kiếm, trang chủ, thể loại, chi tiết, mục lục, đọc chương.

## v13 (25/11/2026) — sửa lỗi bình luận không hiện, test 60/60

- v12 làm xong comment.js nhưng quên mất chỗ quan trọng nhất: detail.js phải trả về mảng `comments` thì vBook mới hiện tab Bình luận ở trang giới thiệu truyện. Không có mảng đó thì comment.js không bao giờ được gọi, nên chị mở truyện nào cũng không thấy gì, trong khi bên QuocBao hiện bình thường.
- v13 sửa đúng chỗ đó: detail.js (cả đường JSON lẫn đường HTML) giờ trả về `comments: [{title: "Bình luận", input: <URL API comment đầy đủ>, script: "comment.js"}]`, học đúng cách QuocBao làm. comment.js cũng đọc được input là URL API đầy đủ, và trang 1 luôn trả next=2 để vBook hiện nút xem thêm.

## v12 (25/11/2026) — thêm bình luận độc giả ở trang giới thiệu truyện, test 56/56

- Chị nhắc em quên bê bình luận vô. Giờ mở trang giới thiệu truyện là có tab bình luận: lấy từ API /mobile/comment.php?act=readcomment của STV, 10 bình luận/trang, có phân trang, hiện cả trả lời (dạng ↳ tên: nội dung), tên người bình luận + thời gian.
- Kiểm chứng live: truyện Lâm thánh (qidian/1048640442) trang 1 và 2 đều trả code 100, 10 bình luận/trang, cả 2 base đều đọc được, không cần Referer. Chức năng khác không đổi.

## v11 (25/11/2026) — trang chủ đổi sang 6 tab giống ext QuocBao, bỏ tab Truyện Vip Free lỗi, test 50/50

- Chị dặn giữ lại mấy tab như hình bên QuocBao. Trang chủ giờ có đúng 6 tab: Mới cập nhật, Đọc tuần, Đọc ngày, Đọc tổng, Mới nhập kho, Đề cử ngẫu nhiên, chỉ hiện truyện từ 50 chương trở lên (minc=50) như bên đó.
- Xóa tab "Truyện Vip Free" vì bị lỗi: tag=vip, API trả danh sách rỗng, mở lên không có truyện nào. Kiểm chứng live cả 6 tab mới đều trả code 100, có sách.

## v10 (25/11/2026) — đổi icon ext thành ảnh Odette chibi, test 50/50

- Chị nhờ kiếm ảnh Genshin dễ thương làm ảnh ext. Em tìm được 3 tấm (Odette đang ăn, Paimon nháy mắt, Vodyanitsa người cá), chị chọn **Odette** — ảnh chibi bé đang ăn salad, tóc xanh nhạt mắt tím, nền xanh nhạt, làm icon 512×512 thay cho icon chữ "STV" cũ. Chức năng không đổi gì, chỉ đổi icon.

## v9 (25/11/2026) — rà lại toàn bộ tag, lọc thêm 5 kiểu rác nữa, test 50/50

- Chị bảo vẫn còn nhiều nên em rà hết lại toàn bộ 1.880 tag một lượt. Ngoài 4 loại đã lọc ở v8, còn lòi ra 5 kiểu rác nữa: (1) chữ lặp đôi "X X" (sử sử, đại đại, sinh sinh, thần thần, auth auth...) — 116 tag, chỉ giữ lại mấy từ lặp thật là cường cường, tỷ tỷ, ca ca, bảo bảo, bá bá, ma ma; (2) tiền tố 1 chữ lẻ ("o nhẹ nhõm", "e cứu rỗi", "f kho sách", "a kho sách"...) — 34 tag, riêng "y" (thần y, y thuật, pháp y) và "n" (n thứ nguyên) được giữ vì là từ thật; (3) ngoặc lệch ("trung nhị (", "sue )") và tag kết bằng dấu lạ ("loại hình :", "sân trường •"); (4) chữ Hán chưa dịch ("閮 tạ cạnh"); (5) thêm vào denylist: mary (mảnh của mary sue), ngũ, thập, khácấm áp, 4 chuỗi giải thưởng ("lần thứ 2 người mới thưởng"...).
- Tổng cộng bỏ 311 tag rác, còn **1.564 mục** (15 nguồn lớn + 10 core + 1.539 tag). Đã kiểm tra kỹ tag thật vẫn giữ đủ, kể cả mấy kiểu dễ nhầm: trung nhị, cường cường, tỷ tỷ, thần y, người ở rể, y thuật, n thứ nguyên, 1v1, cao h, đấu la II, siêu a, cthulhu, anime.
- Mạng hỏng thì tự rơi về 10 thể loại core như cũ.

## v8 (25/11/2026) — lọc tag lỗi và tag 1 chữ không hiểu là thể loại gì, test 48/48

- Chị báo một số tag lỗi và một số tag chỉ có 1 chữ. Kiểm tra dữ liệu thật mới thấy nguyên nhân: một số nguồn tách tên thể loại thành từng chữ lẻ (vd faloo có cả "đô thị ngôn tình" lẫn "đô", "thị", "ngôn", "tình"), và có cả tag chứa mã HTML ("cập nhật lần cuối: <font color="red">2018").
- v8 lọc 4 loại: (1) tag chứa mã HTML (`<`, `>`, `&`, font/color) — 37 tag; (2) tag ≤ 2 ký tự (a, dị, bố, các chữ cái lẻ, số lẻ) — 51 tag; (3) tag 1 chữ là mảnh vụn của tag dài hơn có nhiều truyện gấp 3 lần trở lên (vd "đô" trong "đô thị", "khủng"/"linh" trong "kinh khủng linh dị") — 51 tag, riêng "anime" được giữ lại vì là thể loại thật; (4) danh sách đen cụ thể: tiểu, thuyết, qua qua, động động, lớn nữ chính, thành công học, áo vải sinh hoạt, trở về, kỳ duyên, roman, làm làm, áo lót văn.
- Tổng cộng bỏ 149 tag rác, còn **1.721 mục** (15 nguồn lớn + 10 core + 1.696 tag). Tag thật vẫn giữ đủ: tiên hiệp, xuyên qua, hệ thống, kỳ huyễn, cổ đại, cung đấu, trạch đấu, cthulhu, anime, hoàng đế, hải đảo...
- Mạng hỏng thì tự rơi về 10 thể loại core như cũ.

## v7 (25/11/2026) — bỏ hết tên nguồn lung tung, tag lấy đủ toàn bộ, test 46/46

- Chị báo tab thể loại toàn tên nguồn lạ (Kanman, Kuhu168, Nhentai...) và thiếu tag so với ext QuocBao. v7 xóa sạch ~90 tên nguồn lẻ + nhóm 18+, chỉ giữ 5 nguồn lớn có nhãn tiếng Việt (Fanqie/Qidian/JJWXC/Faloo/Ciweimao · Mới cập nhật / Đọc tuần / Đọc ngày) + 10 thể loại core.
- Tag giờ lấy **toàn bộ, không giới hạn**: v6 chỉ lấy top 60 nên thiếu, v7 lấy hết 1.880 tag từ `/searchfaceted.json` (tag ít nhất cũng có 10 truyện), xếp theo tổng số truyện giảm dần — tổng cộng tab thể loại có **1.846 mục** (15 nguồn lớn + 10 core + 1.821 tag; một số tag trùng slug thì gộp một lần). Đã kiểm chứng tag ở sâu trong danh sách vẫn chạy đúng (tinh linh #500, chủ nghĩa hiện thực #1000).
- Mạng hỏng thì tự rơi về 10 thể loại core như cũ.

## v6 (25/11/2026) — thể loại đầy đủ (nguồn + tag), test 45/45

- v5 chỉ có 10 thể loại core nên chị bảo thiếu. v6 bê nguyên danh sách thể loại của QuocBao sang: lấy từ `/searchfaceted.json` (98 nguồn, tổng số truyện theo từng tag) và `/stv.host.js` (102 nguồn) — **kiểm chứng bằng dữ liệu thật** (curl + test): tìm theo host (fanqie, 48 truyện) và theo tag slug (tiên hiệp, xuyên qua, 48 truyện) đều chạy đúng qua JSON API.
- Danh sách thể loại giờ có: 5 nguồn lớn × 3 kiểu sắp xếp (Fanqie/Qidian/JJWXC/Faloo/Ciweimao · Mới cập nhật / Đọc tuần / Đọc ngày) + ~90 nguồn còn lại xếp theo tên (Uukanshu, Qimao, 69shu...) + nhóm nguồn 18+ / nguồn ẩn (Yushubo, Aikanshu...) + 10 thể loại core cũ + **60 tag nhiều truyện nhất** (xuyên qua, hệ thống, trùng sinh, nữ chính, tiên hiệp...). Mạng hỏng thì tự rơi về 10 thể loại core như cũ.
- Tag trùng tên với thể loại core (vd tag "đô thị" = thể loại Đô thị) chỉ hiện một lần, không trùng lặp.

## v5 (25/11/2026) — đọc được chương theo luồng của app (grant + chapterkey + readchapter có chữ ký), test 40/40

- Đã port xong luồng đọc chương của QuocBao: xin grant (`GET /io/grantcontext/context?hostid=&bookid=`, 790KB JS) → chạy grant lấy chapterkey → ký readchapter bằng MD5 (muối `erogh982^%*%^*`, tham số xếp theo alphabet) → `GET /?sajax=readchapter&h=&bookid=&c=&key=` kèm header `x-stv-sign` + cookie `readcontextid` (lấy từ Set-Cookie của grant) + `mac_tt=true` → JSON code 0, làm sạch HTML liên chữ thành tiếng Việt. **Kiểm chứng end-to-end bằng dữ liệu thật** (Lâm thánh chương 1, curl + Node): chapterkey 190 ký tự, readchapter 80.846 ký tự, làm sạch còn 11.372 ký tự tiếng Việt đúng, không còn thẻ `<i>`.
- Chapterkey lấy bằng cách chạy grant ngay trong JS engine của ext (đặt window/self/globalThis giả lên global rồi eval, xong trả lại — đã kiểm chứng cho đúng key; engine cũ không đọc được `(()=>{` thì tự đổi sang `function(){`), hỏng thì rơi về cách của QuocBao (chạy grant trong trình duyệt của vBook, Worker rồi direct), cuối cùng mới rơi về cách cào trang cũ (v2).
- Cookie `readcontextid` là **bắt buộc** — thử không gửi thì server trả code 10002 "Khởi động lại ứng dụng để tự cập nhật".
- Thêm `src/crypto.js` (thư viện CryptoJS chuẩn, để tính MD5) và `src/chap_decode.js` (grant, chapterkey, làm sạch chương, giải mã ký tự webfont nguồn sangtac/dich). Chưa port WebName engine (cần tải thêm hanviet.js/qtOnline.js trong trình duyệt để dịch tên riêng theo từ điển của truyện) vì bản chữ liên chữ đã đọc được ngay sau khi làm sạch — để dành cho bản sau nếu chị thấy tên chưa chuẩn.

## v4 (25/11/2026) — dùng JSON API của app STV (học từ ext QuocBao sau khi dịch ngược), test 33/33

- Đã dịch ngược được ext mã hoá của QuocBao: tải APK vBook về, dùng androguard đọc code giải mã trong app — file mã hoá chỉ là base64 với 3 ký tự `+` `/` `=` thay bằng `x0P1Xx`/`x0P2Xx`/`x0P3Xx`, rồi mã hoá AES/CBC/PKCS7, khoá = SHA-256(MD5("com.vbook.app" + source + author)) (vd STV: MD5("com.vbook.apphttps://sangtacviet.com/QuocBao")), IV 16 byte 0. Script giải mã lưu ở `hidden_test/decrypt-quocbao.py` (dùng được cho mọi ext mã hoá của QuocBao).
- Từ code đã giải mã, app STV có JSON API riêng: gửi kèm header `x-stv-transport: app` + `x-requested-with: com.sangtacviet.mobilereader` thì server trả JSON thay vì HTML — `GET /io/searchtp/searchBooks?method=search&...&p=<0-based>` trả `{code:100, list:[...]}` (tên Việt, tác giả, bìa, trạng thái), `GET /mobile/bookinfo.php?host=&hid=` trả `{code:100, book:{...}}` (tên, tác giả, bìa, mô tả, trạng thái, số chương). Đã kiểm chứng bằng curl trên cả sangtacviet.com và IP app 14.225.254.182, không cần cookie.
- v4: tìm kiếm / trang chủ / thể loại / chi tiết đều thử JSON trước (sangtacviet.com trước, IP app dự phòng), hỏng thì rơi về HTML cũ (v2/v3). Mục lục thêm cookie `mac_tt=true`. Đọc chương vẫn qua browser trong app vì bước xin chapterkey chạy đoạn JS mã hoá 790KB trong trình duyệt — chưa port được.
- Lỗi chi tiết của ext QuocBao (tên "Sangtacviet.com", bìa đen, mọi cuốn) nhiều khả năng do họ chỉ gọi bookinfo.php qua IP app duy nhất; v4 gọi sangtacviet.com trước nên tránh được điểm chết này.

## v3 (25/11/2026) — sửa lỗi nhận nhầm truyện còn sống thành "đã bị xóa", test 25/25

- Khi thử đại 3 cuốn thật ở 3 nguồn khác nhau (fanqie, qimao, ciweimao) mới lòi ra lỗi này: cụm "Truyện đã bị xóa" cũng nằm trong thẻ `<script>` của trang truyện CÒN SỐNG (template JS hiện thông báo khi mục lục lỗi), nên cách kiểm tra cũ (tìm cụm này trong toàn bộ chữ của trang) có thể báo nhầm mọi cuốn thành đã bị xóa. v3 kiểm tra h1 tên truyện + biến bookinfo trước (trang xóa thật không có 2 thứ này, trang sống thì có), rồi mới kết luận. Kiểm chứng trên trang thật: 3 cuốn sống đều đọc đúng tên/tác giả/bìa, cuốn Phàm Nhân Tu Tiên Truyện (qidian/107580) đã xóa thì báo đúng là đã bị xóa.
- Về ext QuocBao: chị xác nhận lỗi trang chi tiết (tên thành "Sangtacviet.com", bìa đen) bị ở MỌI cuốn, không riêng cuốn nào — tức là phần chi tiết của họ lỗi hệ thống, không phải do từng cuốn.

## v2 (25/11/2026) — sửa lỗi "không load được gì", test 23/23 trên dữ liệu thật

- **Nguyên nhân v1 lỗi**: tìm kiếm / trang chủ / thể loại / đọc chương v1 chạy qua trình duyệt trong app (Engine.newBrowser) và chờ chữ "Kết quả" — trên máy chị nó không trả về gì nên mọi mục đều trống. Chi tiết + mục lục v1 vốn đã đọc trực tiếp bằng Http nên không sao.
- **Sửa**: tìm kiếm / trang chủ / thể loại giờ gọi thẳng endpoint của site `POST /io/searchtp/searchBooks?find=...&tag=` (body `ignores=`), **không cần browser, không cần cookie, trả trong ~1 giây**. Kiểm chứng thật: tìm "林圣" ra 2 truyện đúng; Mới cập nhật ra 48 truyện/trang; phân trang `&p=2` ra 48 truyện khác hẳn. Kết quả có tên (`b.searchbooktitle`), tác giả (`span.searchbookauthor`), bìa, mô tả, trạng thái Còn tiếp / Hoàn thành.
- **Đọc chương** vẫn qua browser trong app (endpoint đọc chương của site trả mã 7 khi chưa có phiên đã xác minh, không lấy được nội dung bằng Http), nhưng đã sửa cách tìm khối nội dung: site đổi id khối thành `cld-<id truyện>-<id chương>` sau khi render xong nên v1 tìm `#content-container` có thể trượt — v2 thử cả 3 id (`#content-container`, `[id^='cld-']`, `#maincontent`) rồi mới cắt theo mốc chữ.
- So với ext "STV App Vi" v9 của QuocBao (vbookext.me): bản đó mã hóa toàn bộ code nên không đọc được, nhưng plugin.json của họ lộ ra 2 điểm — họ bắt người dùng dán **STV Cookie** (PHPSESSID) vào cài đặt ext để gọi API, và có file giải mã chương riêng (chap_decode.js + crypto.js). Ext của mình không cần cookie, gọi endpoint công khai nên cài xong dùng luôn.

## v1 (25/11/2026) — bản đầu, test 20/20 trên dữ liệu thật

- **Tìm kiếm**: chạy qua trình duyệt trong app (kết quả tải bằng JS). URL `/?find=&findinname=<tên>`. Dán thẳng link truyện/chương STV vào ô tìm cũng mở được.
- **Chi tiết**: đọc trực tiếp bằng Http (nhanh). Tên `h1#book_name2`, tác giả/mô tả/thể loại từ `#book-sumary` + các dòng `.blk-body` + biến `bookinfo` JSON trong trang. Bìa lấy từ nguồn gốc (vd bookcover.yuewen.com).
- **Mục lục**: gọi thẳng endpoint của site `GET /index.php?ngmar=chapterlist&h=<nguồn>&bookid=<id>&sajax=getchapterlist`, **bắt buộc gửi header Referer là trang truyện** (không có Referer server trả rỗng). Trả JSON 208 chương cho truyện test Lâm thánh (chương 1 = 901511569). Nguồn uukanshu tự đảo ngược danh sách như site.
- **Đọc chương**: chạy qua trình duyệt trong app, lấy nội dung từ `#content-container`, bỏ dòng đánh dấu `@Bạn đang đọc bản lưu trong hệ thống`. Nếu trang hiện "Nhấp vào để tải chương..." thì ext tự bấm.
- **Trang chủ**: Mới cập nhật, Mới nhập kho, Xem nhiều trong tuần, Hot tuần, Vip Free.
- **Thể loại**: 10 thể loại, mã lấy từ nút `data-t` trên trang `/search/` (hh, dt, nt, vd, kh, ls, dn, dna, ld, ln).

## Lưu ý đã biết (v1)

- Tìm kiếm / trang chủ / thể loại / đọc chương chạy qua trình duyệt trong app nên **chậm hơn ext 69shu**, mỗi lần mở chờ vài giây tới khoảng 1 phút nếu mạng chậm.
- **CAPTCHA**: lần đầu tải chương, site có thể bắt nhập mã xác thực riêng (đọc ký tự theo mũi tên). Cách xử lý: mở `sangtacviet.com` trong trình duyệt của vBook, nhập mã một lần, rồi đọc lại — phiên browser dùng chung cookie nên một lúc sau không hỏi nữa.
- **Truyện bị xóa**: truyện có bản quyền đã bị xóa khỏi STV (vd Phàm Nhân Tu Tiên Truyện cả 3 bản) thì ext báo rõ "đã bị xóa", không đọc được.
- **Chưa có phân trang** ở trang chủ / thể loại (chưa rõ tham số trang của site).
- Tên truyện trong kết quả tìm kiếm có thể hơi dài/thừa chữ (site nối tên + tác giả + nguồn + trạng thái vào một dòng), bấm vào xem chi tiết sẽ hiện tên chuẩn.
- Chương VIP vẫn hiện trong mục lục; nếu chương đó không tải được nội dung thì site đã khóa, không phải lỗi ext.
