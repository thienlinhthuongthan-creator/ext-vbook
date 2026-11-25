load("config.js");

// Chi tiet truyen STV: tieu de / tac gia / mo ta / thong tin deu render
// san trong HTML tho (h1#book_name2, #book-sumary, cac .blk-body,
// bien bookinfo JSON) nen chi can Http, khong can browser.
// (Kiem chung tren /truyen/qidian/1/1048640442/ ngay 25/11/2026.)
function bookinfoFromHtml(html) {
  if (!html) return null;
  try {
    var m = String(html).match(/bookinfo\s*=\s*(\{[^}]*\})/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch (e) {}
    var o = {};
    var get = function (k) {
      var mm = m[1].match(new RegExp('"' + k + '"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"'));
      return mm ? unescapeJsonStr(mm[1]) : "";
    };
    o.id = get("id"); o.lid = get("lid"); o.host = get("host");
    o.name = get("name"); o.thumb = get("thumb"); o.namevi = get("namevi");
    o.author = get("author"); o.lastupdate = get("lastupdate");
    return o;
  } catch (e2) { return null; }
}

// Tab "Binh luan" o trang gioi thieu truyen (v13): vBook chi hien muc
// binh luan khi detail tra ve mang comments [{title, input, script}].
// input la URL day du cua API comment; comment.js se doc host/bookid
// tu query string cua no. (Hoc tu ext QuocBao sau khi dich nguoc -
// v12 thieu cho nay nen comment.js khong bao gio duoc goi.)
function commentInputUrl(host, bookId) {
  return BASE_URL + "/mobile/comment.php?act=readcomment&host=" + encodeURIComponent(host) + "&bookid=" + encodeURIComponent(bookId) + "&start=0&order=new";
}
function commentSection(host, bookId) {
  if (!host || !bookId) return [];
  return [{ title: "Bình luận", input: commentInputUrl(host, bookId), script: "comment.js" }];
}

function execute(url) {
  // Duong 1 (moi, v4): JSON /mobile/bookinfo.php - ten tieng Viet, tac gia,
  // bia, mo ta, trang thai, so chuong deu co san trong JSON.
  var parsed = parseBookUrl(url);
  if (parsed) {
    var book = bookinfoJson(parsed.source, parsed.bookId);
    if (book) {
      var name = clean(book.tname || book.hname || book.name || "");
      var author = clean(book.hauthor || book.author || "");
      var cover = clean(book.thumb || "");
      var info = String(book.info || "").replace(/\t/g, " ").replace(/\r\n/g, "\n").replace(/\n/g, "<br>");
      var lines = [];
      if (book.name) lines.push("Tên tiếng Trung: " + clean(book.name));
      if (book.host) lines.push("Nguồn: " + clean(book.host));
      if (book.id) lines.push("BookID: " + clean(String(book.id)));
      if (book.chaptercount) lines.push("Số chương: " + clean(String(book.chaptercount)));
      if (book.status) lines.push("Trạng thái: " + clean(book.status));
      if (book.category) lines.push("Thể loại: " + clean(book.category));
      var status = clean(book.status || "");
      var chost = clean(book.host || parsed.source || "");
      var cbookId = clean(String(book.id || parsed.bookId || ""));
      return Response.success({
        name: name || clean(book.name || ""),
        cover: cover,
        host: url,
        author: author,
        description: info || "Không có mô tả.",
        detail: lines.join("<br>"),
        ongoing: status.indexOf("Hoàn thành") === -1,
        genres: "",
        comments: commentSection(chost, cbookId)
      });
    }
  }

  // Duong 2 (v1-v3): HTML trang truyen - giu lam du phong.
  var doc = getDoc(url);
  if (!doc) return Response.error("Khong tai duoc trang truyen SangTacViet, thu lai sau");
  if (isDeletedDoc(doc)) return Response.error("Truyen nay da bi xoa tren SangTacViet (vi pham ban quyen hoac nguon khong con hoat dong).");
  var html = "";
  try { html = doc.html(); } catch (e) {}
  var info = bookinfoFromHtml(html);

  var name = txt(selOne(doc, "h1#book_name2"));
  if (!name) name = txt(selOne(doc, "h1"));
  if (!name && info && info.namevi) name = clean(info.namevi);
  if (!name) name = txt(selOne(doc, "title"));

  // Thong tin: cac dong .blk-body "Ten goc: ...", "Tac gia: ...", ...
  var infoLines = [];
  var infoMap = {};
  var blocks = sel(doc, ".blk-body");
  for (var i = 0; i < blocks.length; i++) {
    var t = txt(blocks[i]);
    if (!t) continue;
    if (t.indexOf("Tên gốc:") === 0 || t.indexOf("Hán việt:") === 0 || t.indexOf("Tác giả:") === 0 ||
        t.indexOf("Thể loại:") === 0 || t.indexOf("Nguồn truyện:") === 0 ||
        t.indexOf("Loại truyện:") === 0 || t.indexOf("Nhập thời:") === 0) {
      infoLines.push(t);
      var colon = t.indexOf(":");
      if (colon !== -1) infoMap[clean(t.substring(0, colon))] = clean(t.substring(colon + 1));
    }
  }

  var author = infoMap["Tác giả"] || "";
  if (!author && info && info.author) author = info.author;

  var cover = "";
  if (info && info.thumb) cover = info.thumb;
  if (!cover) {
    var imgs = sel(doc, "img");
    for (var j = 0; j < imgs.length; j++) {
      var s = attr(imgs[j], "src") || "";
      if (s.indexOf("bookcover") !== -1 || s.indexOf("bookcover256") !== -1) { cover = absUrl(s); break; }
    }
  }
  if (!cover) {
    var img = selOne(doc, "img[alt]");
    if (img) cover = coverFromImg(img);
  }

  var desc = "";
  var sum = selOne(doc, "#book-sumary");
  if (sum) { try { desc = sum.html(); } catch (e2) { desc = txt(sum); } }
  if (!desc) desc = txt(selOne(doc, "#book-sumary"));

  var genres = infoMap["Thể loại"] || "";
  var detail = infoLines.length ? infoLines.join("\n") : desc;

  var ongoing = true;
  var st = txt(selOne(doc, "#bookstatus"));
  if (st.indexOf("Hoàn thành") !== -1) ongoing = false;

  var chost = (info && info.host) || (parsed && parsed.source) || "";
  var cbookId = (info && info.id) || (parsed && parsed.bookId) || "";
  return Response.success({
    name: name,
    cover: cover,
    host: url,
    author: author,
    description: desc,
    detail: detail,
    ongoing: ongoing,
    genres: genres,
    comments: commentSection(chost, cbookId)
  });
}
