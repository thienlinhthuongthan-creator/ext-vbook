# Ext vBook — 69书吧 (69shuba.com) — v3

Ext đọc truyện cho app vBook, nguồn 69书吧.

## Có gì trong ext
- **Tìm kiếm**: gõ tên tiếng Trung, hoặc gõ thẳng **ID số** của truyện (ví dụ `43484` = 御兽从零分开始)
- **Chi tiết**: tên, tác giả, bìa, giới thiệu, trạng thái 連載 / 全本, chương mới nhất
- **Mục lục**: lấy từ `#catalog`, tự đảo lại theo thứ tự đọc từ chương 1
- **Nội dung chương**: lấy từ `div.txtnav`, đã bỏ tiêu đề / quảng cáo thừa
- **Trang chủ**: Mới cập nhật, Nữ chính, Nam chính, Truyện hoàn, Top click
- **Thể loại**: 12 thể loại (Huyền huyễn, Tu chân, Ngôn tình, Đô thị, Xuyên qua, Thanh xuân học đường...)

## Cài vào vBook (điện thoại chị)
1. Tải file `69shu-vbook-v15.zip` về điện thoại
2. Mở app vBook → `︙` → **Phần mở rộng** → **Nhập phần mở rộng**
3. Chọn file zip vừa tải → cài xong sẽ thấy nguồn **69书吧**
4. Vào nguồn, gõ tên truyện tiếng Trung để tìm, hoặc dán link truyện dạng `https://www.69shuba.com/book/43484.htm`

## v15 sửa gì (25/11/2026 07:04)
- **Đổi tên ext thành 69shu** (trước là 69书吧) và **xoá hẳn phần mô tả** tiếng Việt về Cloudflare theo ý chị.
- Giữ nguyên 24 ô thể loại 连载/全本 của v13, trang chủ 7 mục và icon chibi của v14.

## v14 sửa gì (25/11/2026 07:00)
- **Xoá tab 排行 - 新书热榜:** trang /novels/newhot_* bị Cloudflare chặn mạnh nhất (8–10 lần xác minh rồi reset, trên máy chị cũng báo "Danh sach rong"), nên bỏ luôn mục này khỏi trang chủ. Trang chủ còn 7 mục.
- **Đổi avatar ext:** icon mới là ảnh chibi chị gửi (bé tóc đen mắt tím, cánh trắng).
- Giữ nguyên 24 ô thể loại 连载/全本 của v13 và các sửa bìa của v11.

## v13 sửa gì (25/11/2026 06:54)
- **Trang thể loại chỉ còn đúng 24 ô như chị chụp:** 12 thể loại × 连载 (đang ra) + 全本 (đã hoàn), bỏ hết tag, bỏ luôn 女生小说 với 全部分类 theo đúng ý chị ("xoá hết đi để mấy cái này thôi").
- **Link đã kiểm chứng từng ô:** 连载 dùng /novels/monthvisit_<thể loại>_2_1.htm (kiểm chứng 玄幻: 50 truyện, 3 đầu 青山 / 苟在初圣魔门当人材 / 我所有职业，天赋全是神级？ đều 连载), 全本 dùng /novels/monthvisit_<thể loại>_1_1.htm (kiểm chứng 玄幻: 50 truyện, 3 đầu 诡秘之主 / 凛冬领主：从每日情报开始 / 在天魔世界的摆烂生活 đều 全本). Trang /novels/class/<id>.htm hoá ra là bảng top 200 của thể loại, không có lọc trạng thái nên không dùng nó nữa. Phân trang _N.htm (vd _2_2.htm) đã thêm vào genrecontent.js.
- Giữ nguyên các sửa của v11/v12: bìa đọc thêm data-original/data-lazy/srcset và tính lại theo công thức CDN khi gặp ảnh giữ chỗ.

## v12 sửa gì (25/11/2026 05:41)
- **Xoá sạch 200 tag:** chị xác nhận trên máy chị các tag không load được, chỉ 12 thể loại chính là sống (ảnh chụp màn hình 25/11/2026 05:39). Trang thể loại giờ chỉ còn 14 mục: 女生小说, 12 thể loại (玄幻魔法, 修真武侠, 言情小说, 历史军事, 游戏竞技, 科幻空间, 悬疑惊悚, 同人小说, 都市小说, 官场职场, 穿越时空, 青春校园) và 全部分类. Thể loại vẫn dùng đường ajax đã kiểm chứng là chạy được trên máy chị; 言情小说 giữ nguyên /novels/class/3.htm như cũ. Bản genre.js cũ có 200 tag được giữ lại ở hidden_test/genre-with-200-tags-backup.js, muốn khôi phục tag nào thì nói em thêm lại.
- Giữ nguyên các sửa của v11: tag có phân trang, bìa đọc thêm data-original/data-lazy/srcset và tính lại theo công thức CDN khi gặp ảnh giữ chỗ.

## v11 sửa gì (24/11/2026 23:05)
- **Tag có phân trang:** trang tag dùng phân trang tĩnh /tag/<tên>/<số trang>/, không có nút tải thêm hay ajax (đã kiểm chứng: trang 2 của tag HE có 30 truyện khác hẳn trang 1, mở đầu 农门团宠：娇软福宝被全家宠上天). Lướt hết 30 truyện trang 1 thì có trang 2, trang 3; trang sau rỗng nghĩa là hết sách, app dừng lại chứ không báo lỗi.
- **Bìa trang xếp hạng:** kiểm chứng trang xếp hạng tháng (/novels/monthvisit_0_2_1.htm) dùng đúng cấu trúc a.imgbox + img src=data-src như trang nữ (vd 阵问长生 bìa https://cdn.cdnshu.com/files/article/image/48/48273/48273s.jpg, 霍格沃茨的学习面板 bìa .../90/90442/90442s.jpg), không có huy hiệu hay placeholder. Trang xếp hạng mới (/novels/newhot_0_2_1.htm) thì Cloudflare chặn cả 2 đợt kiểm tra nên chưa đọc trực tiếp được HTML của nó. Để chắc ăn, ext giờ đọc bìa cả từ data-original / data-lazy / srcset, và nếu ảnh trích ra là ảnh giữ chỗ (nocover/noimg/placeholder) thì tính lại bìa theo công thức CDN theo id truyện (đã kiểm chứng khớp URL thật trong mọi trường hợp).
- Giữ nguyên các sửa của v10: fetch đúng charset theo loại trang, tag thử link chữ Trung thô, phân biệt 404 với Cloudflare, không xoá tag nào.

## v10 sửa gì (24/11/2026 22:36, sau khi kiểm chứng 6 link)
- **KHÔNG xoá tag nào:** kiểm chứng cả 4 tag chị báo lỗi (超A, 秦汉, 悬疑流, 强者流) đều còn sống, mỗi tag 30 truyện — ví dụ 超A mở đầu là 姜小姐今天又BUG了, 秦汉 là 三国之大秦复辟, 悬疑流 là 我有一份逃生指南, 强者流 là 罪恶之城. Lỗi là do Cloudflare chặn lượt mở mới, không phải tag chết, nên giữ nguyên đủ 200 tag.
- **Bằng chứng Cloudflare theo phiên:** 5/5 link mở trực tiếp đều bị chặn lúc đầu; sau khi 1 tab qua được thì điều hướng từ tab đó sang các link còn lại tải ngay không bị chặn nữa. Vì vậy: mở trang 69shu trong trình duyệt của vBook, vượt qua ô "Xác minh bạn là con người" 1 lần, rồi bấm tag trong cùng phiên đó sẽ dễ qua hơn.
- **Phân trang ajax đã xác nhận:** /ajax_novels/full/2/2.htm cũng tải 50 truyện khác (mở đầu 摆烂太狠，我被宗门当反面教材了) nên mẫu /full/<id>/<trang>.htm đúng; trang /novels/class/ không có link phân trang số nào nên ajax là đường phân trang duy nhất của thể loại.
- **Sửa lỗi charset của v9:** fetch giờ chỉ đọc "gbk" cho trang cũ GBK (/book/, /txt/, tìm kiếm), còn trang list mới (/novels/*, /tag/, /ajax_novels/) đọc "utf-8" — ép GBK cho trang UTF-8 làm tên truyện thành chữ linh tinh.
- **Tag thử thêm dạng link chữ Trung thô:** link tag mã hoá %XX mà rỗng thì thử lại bằng link chữ Trung không mã hoá (vd /tag/超A/) rồi mới mở browser, vì đường ajax toàn chữ/số thường chạy ngon còn link %XX có thể bị client của vBook mã hoá sai.
- **Phân biệt 404 với Cloudflare:** tag/thể loại nào chết thật (trang 404 "页面不存在") thì báo thẳng là không còn trên 69shu, không mở browser vô ích; chỉ khi bị Cloudflare mới báo cách xác minh.

## v9 sửa gì (học ext blackkk + tối ưu tốc độ cho vBook mới, 24/11/2026 22:15)
- **Nguồn tham khảo:** ext 69shuba của blackkk trên GitHub (Blackluffy2k4/my-vbook-ext, cho bản 69shuba.tw, source mở) + repo Darkrai9x/vbook-extensions (không có 69shu) + proxy Reflare ccyykkcyk/69 (chỉ là mẫu tự triển khai, không có proxy công cộng nên không dùng). Ext của QuocBao đã xem trước đó thì source mã hoá nên không băm được.
- **Đọc GBK thẳng bằng fetch() mới:** vBook bản mới có `fetch()` + `response.html('gbk')` — getDoc giờ thử fetch-gbk trước tiên (nhanh, đúng GBK cho /book/, /txt/, tìm kiếm), app cũ không có fetch thì tự rớt về Http/browser như cũ. Chị đang xài bản mới nên đường này chạy được.
- **Tìm kiếm nhanh bằng GBK:** bê bảng mã GBK (gbk.js, 56KB) từ ext blackkk — searchkey mã hoá GBK rồi tìm bằng GET (`search.php?searchkey=%B4%F2...`), không cần mở trình duyệt điền form nữa; vẫn giữ POST + browser-form làm dự phòng. Tìm trúng 1 truyện thì trả thẳng trang chi tiết đó.
- **Thể loại qua endpoint ajax nhẹ:** 12 mục thể loại (11 + Toàn bộ) giờ dùng `/ajax_novels/full/<id>/<trang>.htm` (fragment HTML trần 50 truyện, không header/footer) + phân trang (trang đủ 50 truyện thì có trang tiếp); rỗng thì rớt về `/novels/class/<id>.htm`. Đã kiểm chứng trên .com: fragment ajax có thật, 50 truyện/trang, bìa thật nằm ở data-src (ext mình đã ưu tiên data-src).
- **Tag /newtag/ hoá ra chỉ chuyển hướng về /tag/** trên .com nên giữ nguyên link /tag/<tên>/; selector ul#article_list_content không xác nhận được trên trang đã render nên chỉ để làm dự phòng, parser chính vẫn là a.imgbox + h3 a.
- **Mẹo nhỏ khác từ ext blackkk:** chi tiết ưu tiên `h1 > a` và tác giả dòng thứ 2, mô tả lấy `div.navtxt > p`; chương có chữ `69shubaV1` thì mở lại bằng browser; mục lục thử thêm `div.catalog`.
- **Tốc độ:** đường nhanh (fetch-gbk / ajax) chỉ 1-2s khi không bị chặn; browser ngầm chỉ dùng khi bị Cloudflare/GBK, mỗi trang tối đa 1 lần.

## v8 sửa gì (tag bị Cloudflare Turnstile chặn, 24/11/2026 22:02)
- **Nguyên nhân thật:** trang tag vẫn tồn tại và load được, nhưng phiên mới bị Cloudflare Turnstile chặn, bấm tay cũng reset liên tục (đã kiểm chứng trực tiếp `/tag/HE/` — chỉ khi đổi môi trường trình duyệt mới load được list 30 truyện). Tên miền dự phòng 69shu.com cũng chuyển về cùng trang chặn này nên không dùng được. Dấu `/` cuối ở v7 vẫn đúng và giữ nguyên.
- **Sửa:** `getBrowserDoc()` giờ poll bằng `callJs` cho tới khi list/chi tiết xuất hiện (tối đa 45s), thay vì trả về ngay trang chặn; nếu trang đã load xong thì trả về ngay không đợi. `genrecontent.js` khi list rỗng sẽ thử lại 1 lần bằng browser có chờ Turnstile, và nếu vẫn rỗng thì báo rõ: mở trang 69shu trong trình duyệt của vBook, vượt qua ô "Xác minh bạn là con người", rồi bấm lại tag.
- **Tốc độ:** đường nhanh không đổi (Http trước, ~1-2s khi không bị chặn); chỉ khi bị chặn mới mở browser, và mỗi tag chỉ mở browser tối đa 1 lần (không mở 2 lần như bản nháp đầu của v8).
- **Lưu ý:** Cloudflare chặn theo phiên/mạng nên có lúc tag load ngay, có lúc cần xác minh trước trong trình duyệt vBook rồi mới bấm lại tag.

## v7 sửa gì (tag 404 vì thiếu dấu / cuối, 24/11/2026 21:53)
- **Nguyên nhân tag bị "Danh sach rong":** link tag thật trên trang `/tags` luôn có dấu `/` cuối, dạng `/tag/<tên>/`; bản v6 dựng `/tag/<tên>` không có dấu `/` nên 69shu trả 404, ext không đọc được truyện nào. Đã kiểm chứng trực tiếp: `/tag/%E6%97%A0CP` (không dấu `/`) ra 404, `/tag/%E6%97%A0CP/` ra đúng list 30 truyện trang 1, sách đầu là 修仙进行中 (暗夜泠风, book/10023752.htm).
- **Sửa:** toàn bộ 200 URL tag trong `genre.js` giờ có dấu `/` cuối (`BASE_URL + "/tag/" + encodeURIComponent(tên) + "/"`). Cấu trúc list trang tag vẫn là `a.imgbox` + `h3 a[href="/book/..."]` như các list khác nên không cần đổi parser. Tag 女强 đã kiểm chứng cùng cấu trúc.

## v6 sửa gì (toàn bộ tag, 24/11/2026 21:34)
- **Thể loại giờ có đủ 214 mục:** 女生小说, 言情小说, rồi toàn bộ 200 tag từ trang https://www.69shuba.com/tags (link dạng `/tag/<tên tag>`), rồi 11 thể loại còn lại và 全部分类. Trang phân loại gốc của 69shu (`/novels/class/0.htm`) chỉ có 12 thể loại, không có phân loại con — 200 tag là ở trang tags riêng.
- **Tag nữ xếp lên đầu:** sau 女生小说 và 言情小说 là 女强, 甜宠, 1V1, 豪门, 宅斗, 日久生情, HE, 宫斗, 先婚后爱, 婚恋, 青梅竹马, 强强, 萌宝, 双洁, 团宠, 单女主, 女配, 王妃, 女扮男装, 嫡女, 皇后, 独宠… rồi mới tới các tag còn lại theo thứ tự trên trang tags.
- **Link thể loại đổi sang dạng gốc đã kiểm chứng:** `/novels/class/<id>.htm` (言情=3, 玄幻=1, 修真=2, 穿越=11, 都市=9, 历史=4, 游戏=5, 科幻=6, 悬疑=7, 同人=8, 官场=10, 青春=12, 全部=0), thay cho `/novels/weekvisit_<id>_0_1.htm` trước đây.
- Lưu ý: chỉ 6 tag đầu/giữa/cuối đã kiểm tra trực tiếp href `/tag/<tên>`; 194 tag còn lại theo cùng mẫu đó. Trang tag mở bằng `genrecontent.js` (parse list chung như các list khác).

## v5 sửa gì (tên gốc tiếng Trung, 24/11/2026 21:14)
- **Bỏ hết chữ Việt tự thêm:** tab trang chủ và thể loại đổi về tên gốc tiếng Trung như trang 69shu. Trang chủ giờ có 8 mục: 最近更新, 全部小说, 完本小说, 女生小说, 男生小说, 排行 - 新书热榜, 排行 - 月点击, 排行 - 总推荐. Thể loại 12 mục: 玄幻魔法, 修真武侠, 言情小说, 历史军事, 游戏竞技, 科幻空间, 悬疑惊悚, 同人小说, 都市小说, 官场职场, 穿越时空, 青春校园. Chi tiết truyện bỏ nhãn "Trạng thái:", "Chương mới:", chỉ giữ chữ Trung gốc.
- **Link tab 排行 đã kiểm chứng trực tiếp trên trang xếp hạng:** 新书热榜 = `/novels/newhot_0_2_1.htm`, 月点击 = `/novels/monthvisit_0_2_1.htm`, 总推荐 = `/novels/allvote_0_2_1.htm` — lưu ý bản v2 dùng `/allvote_0_2_1.htm` (không có `/novels/`) nên mới 404, bản này đã sửa. 全部小说 = `/novels/monthvisit_0_0_1.htm`, 完本小说 = `/novels/monthvisit_0_1_1.htm`.
- Test 34/34 pass (them kiểm tra tên gốc tiếng Trung và link 排行 có `/novels/`).

## v4 sửa gì (tìm kiếm, 24/11/2026 21:12)
- **Tìm tên tiếng Trung không ra:** Http POST gửi body `searchkey` mã UTF-8, server GBK không hiểu nên trả về rỗng. Cách sửa: nếu POST không ra kết quả, ext mở trang chủ 69shu bằng browser thật trong vBook, điền ô tìm kiếm và submit form thật — Chromium tự mã GBK khi submit nên server hiểu. Đã test bằng HTML mô phỏng: `searchViaBrowser` trả về đúng 2 kết quả, 29/29 test pass (them searchViaBrowser).
- Vẫn giữ cách tìm nhanh: gõ ID số trong link `/book/<id>.htm`, hoặc dán thẳng link truyện vào vBook.

## v3 sửa gì (theo ảnh lỗi chị gửi 24/11/2026 21:07)
- **Chi tiết + mục lục vẫn lỗi `�`:** `Http.html()` của vBook vẫn giải mã body theo UTF-8, không theo meta charset, nên trang cũ GBK (`/book/`, `/txt/`, search) vẫn lỗi. Trang list mới (`/novels/*`) là UTF-8 nên vẫn đọc được. Cách sửa duy nhất trong API vBook (Http chỉ có `html/string/code`, không có `bytes()` hay charset — Wiki Darkrai9x đã xác nhận): `getDoc()` kiểm tra trang có chứa `�` (U+FFFD) không, có thì đổi sang `Engine.newBrowser()` — trình duyệt thật tự giải mã GBK đúng. Đã test bằng HTML mô phỏng lỗi GBK: Http trả về `�`, browser trả về chữ đúng, 27/27 test pass.
- Nhược điểm: mở chi tiết / mục lục / chương sẽ chậm hơn một chút vì phải mở qua trình duyệt trong vBook, nhưng chữ sẽ đúng.

## v2 sửa gì (theo ảnh lỗi chị gửi 24/11/2026)
- **Nữ chính / Nam chính bìa không hiện**: bìa thật là
  `https://cdn.cdnshu.com/files/article/image/43/43484/43484s.jpg`,
  không phải `/fengmian/` trên www.69shuba.com. Đã sửa công thức bìa sang
  CDN này. List Nữ/Nam cũng không có khung `li` riêng từng truyện nên
  parse theo link bìa `a.imgbox` trước, rồi mới leo lên khung cha lấy tên.
- **Top đề cử tên lỗi `� � �`**: link cũ `/allvote_searchPage.htm` và
  `/allvote_0_2_1.htm` thật ra là **404** ("页面不存在或被删除") nên vBook
  parse nhầm list gợi ý trên trang 404. Đã bỏ tab Top đề cử.
  Top click dùng `/novels/weekvisit_0_2_1.htm`, đã kiểm chứng là có list
  50 truyện (nó chuyển sang `/novels/monthvisit_0_2_1.htm`).
- **Chữ Trung bị lỗi GBK**: đổi từ `req.string()` + `Html.parse()` sang
  `req.html()` để vBook tự giải mã GBK theo meta charset của trang.
- **Tên truyện giữ nguyên tiếng Trung**, ext không dịch gì cả.
  Tên tiếng Việt chị thấy trong app là do tính năng dịch sẵn của vBook.
- Tham khảo ext 69shuba v4 của QuocBao
  (BaoBao666888/ext-vbook-w): code của ông ấy mã hóa (`encrypt: true`)
  nên không đọc/be trực tiếp được. Bê được: `thread_num: 1`,
  `delay: 1000`, regexp chỉ nhận `/book/` và `/txt/`, và cách xử lý
  Cloudflare bằng cách mở trang nguồn trong browser vBook để xác minh.

## Nếu 69shu hiện Cloudflare "Just a moment"
Ext đã có sẵn đường dự phòng: nếu request thường bị chặn, nó sẽ tự dùng
browser trong vBook để mở trang. Nếu vẫn bị chặn, mở link truyện bằng
trình duyệt trong vBook một lần cho qua Cloudflare rồi quay lại đọc.

## Lưu ý về tìm kiếm
69shu dùng mã **GBK** cho ô tìm kiếm. Ext gửi tìm kiếm bằng POST tới
`/modules/article/search.php` với `searchkey=...&searchtype=all`.
Nếu gõ tên tiếng Trung mà không ra kết quả, thử:
- Gõ **ID số** của truyện (số trong link `/book/43484.htm`)
- Dán thẳng link truyện vào vBook để mở chi tiết, mục lục và chương vẫn đọc bình thường

## File trong gói
```
plugin.json          khai báo ext (69书吧, v2, chinese_novel)
icon.png             icon
src/config.js        helper chung + selector đã kiểm chứng
src/detail.js        chi tiết truyện
src/toc.js           mục lục
src/chap.js          nội dung chương
src/search.js        tìm kiếm
src/home.js          trang chủ
src/homecontent.js   list trang chủ
src/genre.js         thể loại
src/genrecontent.js  list thể loại
src/page.js          phân trang mục lục (69shu 1 trang)
```

## Selector đã kiểm chứng từ đâu
- `lncrawl/lightnovel-crawler` — `sources/zh/69shuba.py` (nhánh dev):
  title `div.booknav2 h1`, cover `div.bookimg2 img`,
  author `.booknav2 p a[href*="author"]`, synopsis `div.navtxt`,
  chapter `div.txtnav`, search POST `search.php`,
  items `div.newbox ul li`, toc `div#catalog ul li a` (mới nhất trước)
- Bìa thật đọc trực tiếp từ trang `/novels/female` 24/11/2026:
  `cdn.cdnshu.com/files/article/image/<id bỏ 3 số cuối>/<id>/<id>s.jpg`

## Test
Đã test bằng Node + cheerio với HTML mô phỏng đúng cấu trúc trên:
27/27 test pass (detail, toc đảo thứ tự, chap bỏ quảng cáo, search, home,
female parse theo `a.imgbox` + bìa cdnshu, genre), với mô phỏng lỗi GBK trên Http và khôi phục bằng browser.
Chưa test live trên điện thoại vì 69shu chặn Cloudflare với máy chủ của em —
chị cài vào vBook test thử 1 truyện rồi báo em nếu chỗ nào lỗi, em sửa ngay.
