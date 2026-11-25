// v3 - sua loi � o chi tiet + muc luc (anh chup 24/11/2026 21:07):
//  - Http.html() cua vBook VAN giai ma body theo UTF-8, khong theo meta
//    charset, nen trang cu GBK (/book/, /txt/, search) van bi �.
//    Trang list moi (/novels/*) la UTF-8 nen van doc duoc.
//  - Cach sua: getDoc() kiem tra doc co chua U+FFFD khong; co thi doi sang
//    Engine.newBrowser() (Chromium tu giai ma GBK theo meta charset).
//    Day la cach duy nhat trong API vBook (Http chi co html/string/code,
//    khong co bytes() hay charset) - Wiki Darkrai9x da xac nhan.
var BASE_URL = "https://www.69shuba.com";
var SEARCH_URL = BASE_URL + "/modules/article/search.php";
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

function metaContent(doc, suffix) {
  var els = sel(doc, "meta[property$='" + suffix + "'], meta[name$='" + suffix + "']");
  for (var i = 0; i < els.length; i++) {
    var c = attr(els[i], "content");
    if (c) return clean(c);
  }
  return "";
}

function docText(doc) {
  if (!doc) return "";
  try { return clean(doc.text()); } catch (e) { return ""; }
}

function isGarbledDoc(doc) {
  // Chu Trung bi giai ma sai GBK -> UTF-8 se thanh U+FFFD (�), kem theo
  // vai ky tu Cyrillic/Hy Lap lac. Trang list moi (/novels/*) la UTF-8
  // nen khong co �; trang cu (/book/, /txt/, search) la GBK nen co.
  return docText(doc).indexOf("\uFFFD") !== -1;
}

function getBrowserDoc(url, maxWaitMs) {
  // v8 - sua loi tag bi Cloudflare chan (kiem chung 24/11/2026 22:02):
  //  - Trang tag ton tai (/tag/HE/ load duoc), nhung phien moi bi
  //    Cloudflare Turnstile chan, bam tay cung reset lien tuc.
  //  - launch() tra ve ngay khi trang chan load xong, khong doi
  //    Turnstile qua, nen phai poll bang callJs cho toi khi list
  //    (a.imgbox) hoac chi tiet (div.booknav2 / div.txtnav) xuat hien.
  //  - Neu trang da load xong (khong bi chan) thi tra ve ngay, khong doi.
  var maxWait = maxWaitMs || 45000;
  var browser = null;
  try { browser = Engine.newBrowser(); } catch (e) { return null; }
  var doc = null;
  try { doc = browser.launch(url, 25000); } catch (e2) {}
  var waited = 0;
  try {
    while (doc && waited < maxWait) {
      var t = docText(doc);
      var blocked = t.indexOf("Just a moment") !== -1 || t.indexOf("Chờ một chút") !== -1;
      if (!blocked) break; // trang that da load (co list, 404, hay GBK) - khong doi nua
      try { doc = browser.callJs("void 0", 5000); } catch (e3) { break; }
      waited += 5000;
    }
  } catch (e4) {}
  try { browser.close(); } catch (e5) {}
  return doc;
}

function fetchDoc(url) {
  // v9 - hoc tu ext blackkk (69shuba.tw): vBook co API fetch() moi,
  // response.html(charset) giai ma dung charset ngay tu dau, khong
  // can browser nhu cach cu. Thu fetch truoc (nhanh); neu app cu
  // khong co fetch hoac fetch tra ve dang khac thi tra null de getDoc
  // roi ve Http/browser nhu cu.
  // v10 - sua v9: chi giai ma 'gbk' cho trang cu GBK (/book/, /txt/,
  // search). Trang list moi (/novels/*, /tag/, /ajax_novels/) la
  // UTF-8 - ep 'gbk' cho chung se lam ten truyen thanh moji nen
  // dung 'utf-8' cho cac trang do.
  try {
    if (typeof fetch === "undefined") return null;
    var res = fetch(url);
    if (!res || !res.ok) return null;
    if (typeof res.html !== "function") return null;
    var isGbk = /\/book\/|\/txt\/|search\.php/.test(String(url));
    var d = isGbk ? res.html("gbk") : res.html("utf-8");
    if (!d) return null;
    return d;
  } catch (e) { return null; }
}

function is404Doc(doc) {
  // Trang 404 cua 69shu: title "69书吧_404", than trang "页面不存在或被删除"
  if (!doc) return false;
  var t = "";
  try { t = clean(doc.title()); } catch (e) {}
  if (t.indexOf("404") !== -1) return true;
  var body = docText(doc);
  return body.indexOf("页面不存在") !== -1;
}

function getDoc(url, browserWaitMs) {
  // Thu fetch truoc (nhanh, dung charset theo loai trang: 'gbk' cho
  // /book/, /txt/, search; 'utf-8' cho trang list moi), roi moi Http,
  // roi browser.
  var fdoc = fetchDoc(url);
  if (fdoc && docText(fdoc).indexOf("Just a moment") === -1 && !isGarbledDoc(fdoc)) return fdoc;
  // fetch tra ve trang chan hoac van bi � -> roi xuong Http/browser nhu cu.
  // Thu Http truoc (nhanh, du cho trang UTF-8 nhu /novels/female).
  // Http.html() cua vBook giai ma body theo UTF-8 nen trang GBK
  // (/book/, /txt/, search) se bi � - phat hien bang isGarbledDoc
  // roi doi sang browser that (Chromium tu giai ma GBK theo meta charset).
  var doc = null;
  try {
    var req = Http.get(url);
    try { req.headers({ "User-Agent": UA, "Referer": BASE_URL + "/", "Accept-Language": "zh-CN,zh;q=0.9" }); } catch (e) {}
    doc = req.html();
  } catch (e4) {}
  if (doc && docText(doc).indexOf("Just a moment") === -1 && !isGarbledDoc(doc)) return doc;
  // browserWaitMs === 0: goi y chi muon Http (de phan goi tu xu ly browser
  // sau, tranh mo browser 2 lan cho cung 1 trang).
  if (browserWaitMs === 0) return doc;
  var bdoc = getBrowserDoc(url, browserWaitMs);
  if (bdoc && docText(bdoc).indexOf("Just a moment") === -1 && !isGarbledDoc(bdoc)) return bdoc;
  if (bdoc) return bdoc;
  return doc;
}

function postSearchDoc(key) {
  var body = "searchkey=" + encodeURIComponent(key) + "&searchtype=all";
  var doc = null;
  try {
    var req = Http.post(SEARCH_URL);
    try { req.headers({ "User-Agent": UA, "Referer": BASE_URL + "/", "Content-Type": "application/x-www-form-urlencoded; charset=gbk", "Accept-Language": "zh-CN,zh;q=0.9" }); } catch (e) {}
    try { req.body(body); } catch (e2) {}
    doc = req.html();
  } catch (e3) {}
  if (doc && docText(doc).indexOf("Just a moment") === -1 && !isGarbledDoc(doc)) return doc;
  try {
    var doc2 = getDoc(SEARCH_URL + "?searchkey=" + encodeURIComponent(key) + "&searchtype=all");
    if (doc2) return doc2;
  } catch (e5) {}
  return doc;
}

function coverFromImg(img) {
  // Bia that co the nam o data-src (trang moi), data-original /
  // data-lazy (lazy-load kieu cu), srcset (lay URL dau tien), hoac src.
  // Trang ajax dung src = anh giu cho nocover.jpg, data-src moi la bia
  // that nen data-src phai duoc uu tien truoc src.
  if (!img) return "";
  var c = attr(img, "data-src") || attr(img, "data-original") || attr(img, "data-lazy") || attr(img, "data-echo");
  if (!c) {
    var ss = attr(img, "srcset");
    if (ss) c = clean(ss).split(",")[0].split(" ")[0];
  }
  if (!c) c = attr(img, "src");
  return c ? coverUrl(c) : "";
}

function pickCover(img, link) {
  // v11 - sua loi bia trang xep hang toan o mau tron: anh trich tu img
  // neu la anh giu cho (nocover/noimg/placeholder/data:) thi dung cong
  // thuc CDN da kiem chung theo id truyen; cac truong hop da kiem chung
  // (48273, 90442, 43484, 58801, 9991651...) URL trich ra va URL tinh
  // theo cong thuc la mot, nen doi sang cong thuc khong lam hong bia
  // dang chay tot, chi cuu duoc muc bi placeholder.
  var extracted = coverFromImg(img);
  var id = bookIdFromUrl(link);
  var computed = id ? coverFromId(id) : "";
  if (!extracted) return computed;
  var low = extracted.toLowerCase();
  if (low.indexOf("nocover") !== -1 || low.indexOf("noimg") !== -1 || low.indexOf("placeholder") !== -1 || low.indexOf("data:") === 0) return computed || extracted;
  return extracted;
}

function coverFromId(id) {
  if (!id) return "";
  id = String(id).replace(/\D/g, "");
  if (!id) return "";
  // Bia that da kiem chung: https://cdn.cdnshu.com/files/article/image/43/43484/43484s.jpg
  var parent = id.length > 3 ? id.slice(0, -3) : "0";
  return "https://cdn.cdnshu.com/files/article/image/" + parent + "/" + id + "/" + id + "s.jpg";
}

function coverUrl(raw) {
  if (!raw) return "";
  raw = String(raw).trim();
  if (raw.indexOf("/files/article/image/") === 0) return "https://cdn.cdnshu.com" + raw;
  return absUrl(raw);
}

function bookIdFromUrl(url) {
  if (!url) return "";
  var m = String(url).match(/(\d+)\.htm/);
  if (m) return m[1];
  m = String(url).match(/\/(\d+)\/?$/);
  return m ? m[1] : "";
}

// Parse 1 muc trong list (search / home / genre) - dung chung
function parseListItem(li) {
  var a = selOne(li, "h3 a");
  if (!a) a = selOne(li, "a[href*='/book/'], a[href*='/txt/']");
  if (!a) return null;
  var link = absUrl(attr(a, "href"));
  var name = clean(txt(a));
  if (!name) return null;
  var img = selOne(li, "img");
  var cover = pickCover(img, link);
  var author = "";
  var labels = sel(li, "label");
  if (labels.length) author = txt(labels[0]);
  if (!author) {
    var sp = selOne(li, ".sp_3 a, .author a");
    if (sp) author = txt(sp);
  }
  var desc = "";
  var ol = selOne(li, "ol");
  if (ol) desc = txt(ol);
  if (!desc) {
    var p = selOne(li, "p");
    if (p) desc = txt(p);
  }
  return { name: name, link: link, host: link, cover: cover, author: author, description: desc };
}

function parentEl(el) {
  if (!el) return null;
  try { return el.parent(); } catch (e) { return null; }
}

function parseFromImgbox(a) {
  var link = absUrl(attr(a, "href"));
  if (!link) return null;
  var img = selOne(a, "img");
  var cover = pickCover(img, link);
  // Leo len cac cap cha de tim node chua h3>a cung link (node chua ca truyen)
  var node = parentEl(a);
  for (var depth = 0; depth < 3 && node; depth++) {
    var h = selOne(node, "h3 a");
    if (h && absUrl(attr(h, "href")) === link) break;
    node = parentEl(node);
  }
  var item = null;
  if (node) item = parseListItem(node);
  if (item && item.name) {
    if (!item.cover || item.cover.indexOf("fengmian") !== -1) item.cover = cover;
    return item;
  }
  // Khong tim duoc node chua: lay ten tu h3 gan nhat trong node cha lon nhat da leo
  var name = "";
  if (node) {
    var hh = selOne(node, "h3 a");
    if (hh) name = txt(hh);
  }
  if (!name) return null;
  return { name: name, link: link, host: link, cover: cover, author: "", description: "" };
}

function parseListDoc(doc) {
  var out = [];
  var seen = {};
  // Cach 1 (moi, cho /novels/female, /novels/male, /novels/weekvisit_*):
  // moi truyen bat dau bang a.imgbox chua anh bia that tren cdn.cdnshu.com
  var imgboxes = sel(doc, "a.imgbox");
  for (var b = 0; b < imgboxes.length; b++) {
    var it = parseFromImgbox(imgboxes[b]);
    if (it && !seen[it.link]) { seen[it.link] = true; out.push(it); }
  }
  if (out.length) return out;
  // Cach 2 (search, cu): div.newbox ul li ...
  // v9 - hoc tu ext blackkk (gen2.js): trang /newtag/ dung ul#article_list_content li
  var containers = [
    "ul#article_list_content li",
    "div.newbox ul li", ".sk_box li", ".sk_cont li",
    "div.newbox li", "ul li"
  ];
  for (var c = 0; c < containers.length; c++) {
    var items = sel(doc, containers[c]);
    for (var i = 0; i < items.length; i++) {
      var it2 = parseListItem(items[i]);
      if (it2 && !seen[it2.link]) { seen[it2.link] = true; out.push(it2); }
    }
    if (out.length) return out;
  }
  // Fallback cuoi: quet moi link /book/ tren trang
  var links = sel(doc, "a[href*='/book/']");
  for (var j = 0; j < links.length; j++) {
    var href = absUrl(attr(links[j], "href"));
    var nm = txt(links[j]);
    if (href && nm && nm.length > 1 && !seen[href]) {
      seen[href] = true;
      out.push({ name: nm, link: href, host: href, cover: coverFromId(bookIdFromUrl(href)), author: "", description: "" });
    }
  }
  return out;
}
