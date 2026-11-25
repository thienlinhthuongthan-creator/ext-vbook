// SangTacViet vBook ext v1 - config chung.
// STV khac 69shu o cho: moi thu quan trong deu tai bang JavaScript
// (ket qua tim kiem, muc luc, noi dung chuong), nen ext phai chay qua
// Engine.newBrowser() la chinh; Http/fetch chi doc duoc vo HTML tho
// (tieu de/tac gia/mo ta tren trang truyen co the da co san).
// STV la UTF-8 nen khong can GBK. STV co CAPTCHA rieng khi tai chuong
// (/generate_captcha.php) - gap thi bao loi de chi xac minh 1 lan trong
// trinh duyet vBook roi thu lai (phien browser dung chung cookie).
var BASE_URL = "https://sangtacviet.com";
var UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function absUrl(u) {
  if (!u) return "";
  u = String(u).trim();
  if (!u) return "";
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return BASE_URL + u;
  return BASE_URL + "/" + u;
}

function clean(s) {
  if (s === null || s === undefined) return "";
  return String(s).replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function toArray(elements) {
  var arr = [];
  if (!elements) return arr;
  try {
    var n = elements.size();
    for (var i = 0; i < n; i++) arr.push(elements.get(i));
    return arr;
  } catch (e) {}
  try {
    elements.forEach(function (el) { arr.push(el); });
  } catch (e2) {}
  return arr;
}

function sel(doc, css) {
  if (!doc) return [];
  try { return toArray(doc.select(css)); } catch (e) { return []; }
}

function selOne(doc, css) {
  var a = sel(doc, css);
  return a.length ? a[0] : null;
}

function txt(el) {
  if (!el) return "";
  try { return clean(el.text()); } catch (e) { return ""; }
}

function attr(el, name) {
  if (!el) return "";
  try { return el.attr(name) || ""; } catch (e) { return ""; }
}

function docText(doc) {
  if (!doc) return "";
  try { return clean(doc.text()); } catch (e) { return ""; }
}

// STV hien CAPTCHA rieng khi tai chuong: o "Nhập mã xác thực" + nut "Xác thực".
function isCaptchaDoc(doc) {
  var t = docText(doc);
  if (t.indexOf("Nhập mã xác thực") !== -1) return true;
  if (t.indexOf("generate_captcha") !== -1) return true;
  return false;
}

function isDeletedDoc(doc) {
  // Truyen co ban quyen bi xoa: "Truyện đã bị xóa do vi phạm hoặc nguồn đã không còn hoạt động."
  // CHU Y: cum tu nay cung xuat hien trong <script> cua trang truyen CON SONG
  // (template JS hien thong bao khi muc luc loi), nen khong duoc ket luan chi
  // dua tren doc.text() - trang xoa that khong co h1#book_name2 va bookinfo,
  // trang song thi co ca hai, kiem tra 2 thu nay truoc.
  var name = "";
  try { name = txt(selOne(doc, "h1#book_name2")); } catch (e) {}
  if (name) return false;
  var html = "";
  try { html = doc.html(); } catch (e2) {}
  if (html && html.indexOf("bookinfo") !== -1) return false;
  return docText(doc).indexOf("Truyện đã bị xóa") !== -1;
}

function fetchDoc(url) {
  // STV la UTF-8, fetch + html('utf-8') doc duoc vo trang tho.
  // Chi dung cho vo trang (detail shell); noi dung tai bang JS thi
  // fetch khong thay duoc.
  try {
    if (typeof fetch === "undefined") return null;
    var res = fetch(url);
    if (!res || !res.ok) return null;
    if (typeof res.html !== "function") return null;
    return res.html("utf-8") || null;
  } catch (e) { return null; }
}

function getDoc(url) {
  var fdoc = fetchDoc(url);
  if (fdoc) return fdoc;
  var doc = null;
  try {
    var req = Http.get(url);
    try { req.headers({ "User-Agent": UA, "Referer": BASE_URL + "/", "Accept-Language": "vi-VN,vi;q=0.9" }); } catch (e) {}
    doc = req.html();
  } catch (e2) {}
  return doc;
}

// Mo trang bang browser trong app, doi cho JS tai xong.
// opts: {maxWaitMs, readyText (chuoi phai xuat hien moi xong),
//        notText (chuoi "Đang tải..." phai bien mat moi xong),
//        clickJs (JS chay 1 lan sau khi load, vd bam nut tai chuong)}
// Tra ve doc (da dong browser). Neu gap CAPTCHA thi tra ve doc do luon
// de phia goi tu phat hien bang isCaptchaDoc.
function getBrowserDoc(url, opts) {
  opts = opts || {};
  var maxWait = opts.maxWaitMs || 60000;
  var browser = null;
  try { browser = Engine.newBrowser(); } catch (e) { return null; }
  var doc = null;
  try { doc = browser.launch(url, 25000); } catch (e2) {}
  if (doc && opts.clickJs) {
    try { doc = browser.callJs(opts.clickJs, 5000); } catch (e3) {}
  }
  var waited = 0;
  try {
    while (doc && waited < maxWait) {
      var t = docText(doc);
      if (isCaptchaDoc(doc)) break;
      var loading = opts.notText ? t.indexOf(opts.notText) !== -1 : false;
      var ready = opts.readyText ? t.indexOf(opts.readyText) !== -1 : true;
      if (!loading && ready) break;
      try { doc = browser.callJs("void 0", 5000); } catch (e4) { break; }
      waited += 5000;
    }
  } catch (e5) {}
  try { browser.close(); } catch (e6) {}
  return doc;
}

function searchUrl(key) {
  return BASE_URL + "/?find=&findinname=" + encodeURIComponent(key);
}

// /truyen/<nguon>/1/<id>/ -> {source, bookId}
function parseBookUrl(url) {
  var m = String(url || "").match(/\/truyen\/([^\/]+)\/1\/(\d+)\/?/);
  return m ? { source: m[1], bookId: m[2] } : null;
}

function bookUrl(source, bookId) {
  return BASE_URL + "/truyen/" + source + "/1/" + bookId + "/";
}

function chapterUrl(source, bookId, chapterId) {
  return BASE_URL + "/truyen/" + source + "/1/" + bookId + "/" + chapterId + "/";
}

// Bia STV lay thang tu nguon goc (vd bookcover.yuewen.com), giu nguyen URL.
function coverFromImg(img) {
  if (!img) return "";
  var c = attr(img, "data-src") || attr(img, "data-original") || attr(img, "data-lazy");
  if (!c) {
    var ss = attr(img, "srcset");
    if (ss) c = clean(ss).split(",")[0].split(" ")[0];
  }
  if (!c) c = attr(img, "src");
  return c ? absUrl(c) : "";
}

// --- Parse danh sach ket qua tim kiem / muc trang chu / the loai ---
// Cac muc nay deu la "search view" cua STV: ket qua tai bang JS, moi
// item la link that /truyen/<nguon>/1/<id>/ (da kiem chung 25/11/2026).
// Text trong link la ten + tac gia + nguon + trang thai noi lien nhau
// nen chi tach duoc trang thai o cuoi; ten giu nguyen phan con lai.
var STV_SOURCES = ["qidian", "69shu", "69shuorg", "fanqie", "ciweimao", "jjwxc", "sfacg", "tadu", "qimao", "idejian", "zongheng", "linovel", "wenku8", "ddxs", "230book", "biqugese", "trxs", "bxwxorg", "faloo", "biquge", "uukanshu"];

function stripResultTail(text) {
  var t = clean(text);
  t = t.replace(/\s*(Còn Tiếp|Hoàn Thành|Tạm ngưng|Không tạm ngưng)\s*$/i, "");
  for (var i = 0; i < STV_SOURCES.length; i++) {
    var re = new RegExp("\\s*" + STV_SOURCES[i] + "\\s*$", "i");
    if (re.test(t)) { t = t.replace(re, ""); break; }
  }
  // Link ket qua co the lap van ban 2 lan (link long nhau) -> cat mot nua
  if (t.length >= 4 && t.length % 2 === 0) {
    var half = t.substring(0, t.length / 2);
    if (t === half + half) t = half;
  }
  return clean(t);
}

// ---- Search / danh sach qua endpoint /io/searchtp/searchBooks ----
// (Kiem chung 25/11/2026: POST /io/searchtp/searchBooks?find=...&tag=,
//  body "ignores=", tra HTML voi 48 muc/trang, class .booksearch.
//  Khong can cookie, khong can browser, tra trong ~1s.
//  Phan trang: them &p=<so trang> vao query.)
function searchBooksUrl(query) {
  return BASE_URL + "/io/searchtp/searchBooks" + query;
}
function postSearchBooks(query) {
  var url = searchBooksUrl(query);
  try {
    var req = Http.post(url);
    try { req.headers({ "User-Agent": UA, "Referer": BASE_URL + "/search/", "Content-Type": "application/x-www-form-urlencoded", "Accept": "text/html, */*" }); } catch (e) {}
    try { req.body("ignores="); } catch (e2) {}
    return req.html();
  } catch (e3) {
    // Thu lai bang Http.get neu POST loi (mot so ban vBook cu)
    try { return Http.get(url).html(); } catch (e4) { return null; }
  }
}
function parseBooksearchDoc(doc) {
  var out = [];
  var seen = {};
  var items = sel(doc, "a.booksearch");
  for (var i = 0; i < items.length; i++) {
    var a = items[i];
    var href = attr(a, "href") || "";
    if (href.indexOf("/truyen/") === -1) continue;
    var link = absUrl(href);
    var parsed = parseBookUrl(link);
    if (!parsed) continue;
    link = bookUrl(parsed.source, parsed.bookId);
    if (seen[link]) continue;
    seen[link] = true;
    var name = txt(selOne(a, "b.searchbooktitle"));
    if (!name) name = stripResultTail(txt(a));
    var author = txt(selOne(a, "span.searchbookauthor"));
    var cover = "";
    var img = selOne(a, "img");
    if (img) {
      cover = coverFromImg(img);
      if (cover.indexOf("bookcover256.jpg") !== -1) cover = "";
    }
    // Mo ta = doan span.lhr dai nhat trong muc (cac span.lhr khac chi la so 0)
    var desc = "";
    var lhrs = sel(a, "span.lhr");
    for (var j = 0; j < lhrs.length; j++) {
      var t = txt(lhrs[j]);
      if (t.length > desc.length) desc = t;
    }
    var full = txt(a);
    var status = "";
    if (full.indexOf("Hoàn Thành") !== -1) status = "[Hoàn thành] ";
    else if (full.indexOf("Còn Tiếp") !== -1) status = "[Còn tiếp] ";
    else if (full.indexOf("Tạm ngưng") !== -1) status = "[Tạm ngưng] ";
    out.push({ name: name, link: link, host: link, cover: cover, author: author, description: status + desc });
  }
  return out;
}

function parseSearchDoc(doc) {
  var out = [];
  var seen = {};
  var links = sel(doc, "a[href*='/truyen/']");
  for (var i = 0; i < links.length; i++) {
    var href = absUrl(attr(links[i], "href"));
    var m = href.match(/\/truyen\/([^\/]+)\/1\/(\d+)\/?/);
    if (!m) continue;
    href = bookUrl(m[1], m[2]);
    if (seen[href]) continue;
    seen[href] = true;
    var name = stripResultTail(txt(links[i]));
    if (!name) continue;
    var img = selOne(links[i], "img");
    var cover = img ? coverFromImg(img) : "";
    out.push({ name: name, link: href, host: href, cover: cover, author: "", description: "" });
  }
  return out;
}

// --- Parse JSON tra ve cua sajax=getchapterlist ---
function unescapeJsonStr(s) {
  if (!s) return "";
  return String(s)
    .replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/\\\//g, "/").replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, " ").replace(/\\\\/g, "\\");
}

function chapterDataFromJson(text) {
  if (!text) return "";
  try {
    var d = JSON.parse(text);
    if (d && d.data) return d.data;
    return "";
  } catch (e) {}
  var m = String(text).match(/"data"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (!m) return "";
  return unescapeJsonStr(m[1]);
}

function cleanChapTitle(t) {
  var s = clean(String(t || "").replace(/<br\s*\/?>/gi, " ").replace(/&nbsp;/g, " "));
  s = s.replace(/Thứ\s+([\d,]+)\s*chương/i, "Chương $1:");
  return s;
}

// --- JSON API cua app STV (hoc tu ext QuocBao sau khi dich nguoc, 25/11/2026) ---
// App STV dung 2 may chu: sangtacviet.com + http://14.225.254.182.
// Gui kem header x-stv-transport: app + x-requested-with:
// com.sangtacviet.mobilereader thi server tra JSON thay vi HTML:
//   GET /io/searchtp/searchBooks?method=search&minc=&category=&findinname=
//       &find=&host=&sort=update&tag=&step=&p=<0-based> -> {code:100, list:[...]}
//   GET /mobile/bookinfo.php?host=<nguon>&hid=<id> -> {code:100, book:{...}}
// (Kiem chung bang curl 25/11/2026: JSON tra ve dung tren ca 2 may chu,
//  khong can cookie; searchBooks p=0/1/2 moi trang 48 muc khac nhau.)
// Thu sangtacviet.com truoc (may chi mo duoc), IP app lam du phong.
var STV_APP_UA = "Mozilla/5.0 (Linux; Android 11; sdk_gphone64_x86_64 Build/RSR1.201013.001.A1) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36";
var STV_BASES = ["https://sangtacviet.com", "http://14.225.254.182"];
// Muoi ky readchapter (hoc tu ext QuocBao sau khi dich nguoc, 25/11/2026).
var STV_SIGN_SALT = "erogh982^%*%^*";

function stvAppHeaders(extra) {
  var h = {
    "User-Agent": STV_APP_UA,
    "Accept": "*/*",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    "x-stv-transport": "app",
    "x-requested-with": "com.sangtacviet.mobilereader"
  };
  if (extra) {
    for (var k in extra) { if (extra.hasOwnProperty(k)) h[k] = extra[k]; }
  }
  return h;
}

// JSON.parse chiu duoc BOM / tien to rac truoc "{" (giong cach app lam).
function parseJsonLoose(text) {
  if (!text) return null;
  var s = String(text).replace(/^\uFEFF/, "");
  var i = s.indexOf("{");
  if (i > 0) s = s.substring(i);
  s = clean(s);
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) { return null; }
}

// Lay chuoi JSON qua fetch (co options) truoc, Http.get du phong.
function fetchJsonText(url, headers) {
  try {
    if (typeof fetch !== "undefined") {
      var res = fetch(url, { method: "GET", headers: headers });
      if (res && res.ok && typeof res.text === "function") {
        var t = res.text();
        if (t) return t;
      }
    }
  } catch (e) {}
  try {
    var req = Http.get(url);
    try { req.headers(headers); } catch (e2) {}
    return req.string();
  } catch (e3) { return ""; }
}

// Thu tung base cho toi khi co JSON hop le (code 100 hoac co list/book).
function fetchJsonOnBases(path, headers) {
  for (var i = 0; i < STV_BASES.length; i++) {
    var url = STV_BASES[i] + path;
    var text = fetchJsonText(url, headers);
    var json = parseJsonLoose(text);
    if (json && (json.code === 100 || json.list || json.book)) {
      return { json: json, base: STV_BASES[i] };
    }
  }
  return null;
}

// Tach query string "?a=b&c=d" thanh object (decode tung gia tri).
function parseQueryStr(q) {
  var out = {};
  var s = String(q || "");
  if (s.charAt(0) === "?") s = s.substring(1);
  var pairs = s.split("&");
  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    var idx = pairs[i].indexOf("=");
    var k = idx >= 0 ? pairs[i].substring(0, idx) : pairs[i];
    var v = idx >= 0 ? pairs[i].substring(idx + 1) : "";
    try { v = decodeURIComponent(v); } catch (e) {}
    try { k = decodeURIComponent(k); } catch (e2) {}
    out[k] = v;
  }
  return out;
}

// Tim kiem / trang chu / the loai qua JSON.
// query: chuoi query kieu "?find=&findinname=...&minc=0&sort=update&tag=".
// page: so trang cua vBook (bat dau tu 1); API dung p 0-based (trang 1 -> p=0).
// Tra ve {items, next} hoac null neu JSON that bai (de phia goi dung HTML).
function searchBooksJson(query, page) {
  var p = parseQueryStr(query);
  page = page ? parseInt(page, 10) : 1;
  if (!page || page < 1) page = 1;
  var q = "?method=search"
    + "&minc=" + encodeURIComponent(p.minc || "")
    + "&category=" + encodeURIComponent(p.category || "")
    + "&findinname=" + encodeURIComponent(p.findinname || "")
    + "&find=" + encodeURIComponent(p.find || "")
    + "&host=" + encodeURIComponent(p.host || "")
    + "&sort=" + encodeURIComponent(p.sort || "update")
    + "&tag=" + encodeURIComponent(p.tag || "")
    + "&step=" + encodeURIComponent(p.step || "")
    + "&p=" + (page - 1);
  var found = fetchJsonOnBases("/io/searchtp/searchBooks" + q, stvAppHeaders());
  if (!found || !found.json || !found.json.list) return null;
  var list = found.json.list;
  var out = [];
  var seen = {};
  for (var i = 0; i < list.length; i++) {
    var b = list[i] || {};
    var host = clean(b.host || "");
    var id = clean(String(b.id || ""));
    if (!host || !id) continue;
    var link = bookUrl(host, id);
    if (seen[link]) continue;
    seen[link] = true;
    var name = clean(b.tname || b.hname || b.name || "");
    if (!name) continue;
    var author = clean(b.hauthor || b.author || "");
    var status = clean(b.status || "");
    var desc = author;
    if (status) desc += " · " + status;
    if (host) desc += " · " + host;
    out.push({ name: name, link: link, host: link, cover: clean(b.thumb || ""), author: author, description: desc });
  }
  return { items: out, next: out.length > 0 ? page + 1 : null };
}

// Chi tiet qua JSON /mobile/bookinfo.php. Tra ve book object hoac null.
function bookinfoJson(host, id) {
  var path = "/mobile/bookinfo.php?host=" + encodeURIComponent(host) + "&hid=" + encodeURIComponent(id);
  var found = fetchJsonOnBases(path, stvAppHeaders());
  if (!found || !found.json || found.json.code !== 100 || !found.json.book) return null;
  return found.json.book;
}
