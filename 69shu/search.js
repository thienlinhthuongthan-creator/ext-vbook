load("config.js");

function searchViaBrowser(key) {
  // Tim bang form that tren trang 69shu: trinh duyet Chromium tu ma hoa
  // searchkey theo GBK khi submit form (trang la GBK), nen khong can
  // tu ma hoa GBK bang tay. Http POST ben minh gui body UTF-8 nen
  // server GBK thuong khong hieu ten tieng Trung.
  var browser = null;
  try {
    browser = Engine.newBrowser();
    browser.launch(BASE_URL + "/", 20000);
    var q = "";
    try { q = JSON.stringify(key); } catch (e) { q = "'" + String(key).replace(/'/g, "") + "'"; }
    var js = "(function(){var i=document.querySelector('input[name=\"searchkey\"]');"
      + "if(!i){var a=document.querySelectorAll('input');for(var k=0;k<a.length;k++){if(a[k].type==='text'||a[k].type==='search'){i=a[k];break;}}}"
      + "if(!i) return 'no-input'; i.value=" + q + "; var f=i.form; if(!f) return 'no-form'; f.submit(); return 'ok';})()";
    var doc = browser.callJs(js, 8000);
    try { browser.close(); } catch (e2) {}
    return doc;
  } catch (e3) {
    try { if (browser) browser.close(); } catch (e4) {}
    return null;
  }
}

function gbkEncode(key) {
  // v9 - hoc tu ext blackkk: ma hoa searchkey theo GBK bang bang gbk.js,
  // roi tim bang GET (nhanh, khong can mo browser nhu cach cu).
  // '打更人' --> '%B4%F2%B8%FC%C8%CB'
  try {
    load("gbk.js");
    return GBK.encode(key);
  } catch (e) { return encodeURIComponent(key); }
}

function singleResult(doc) {
  // Tim trung 1 truyen thi 69shu tra thang trang chi tiet, khong phai list
  var name = txt(selOne(doc, "div.booknav2 > h1 > a")) || txt(selOne(doc, "div.booknav2 h1"));
  if (!name) return null;
  var link = "";
  var a = selOne(doc, "div.booknav2 > h1 > a");
  if (a) link = absUrl(attr(a, "href"));
  var img = selOne(doc, "div.bookimg2 img");
  var cover = img ? coverUrl(attr(img, "src") || attr(img, "data-src") || "") : "";
  var author = txt(selOne(doc, ".booknav2 p a"));
  return [{ name: name, link: link, host: link, cover: cover, author: author, description: author }];
}

function execute(key, page) {
  key = (key || "").trim();
  if (!key) return Response.error("Nhap ten truyen de tim");
  // Neu go thang ID so -> mo thang trang truyen
  if (/^\d+$/.test(key)) {
    var link = BASE_URL + "/book/" + key + ".htm";
    return Response.success([{ name: key, link: link, host: link, cover: coverFromId(key), description: "" }], null);
  }
  // Cach 1 (v9): GET voi searchkey ma hoa GBK - nhanh nhat
  try {
    var getUrl = SEARCH_URL + "?searchkey=" + gbkEncode(key) + "&searchtype=all";
    var gdoc = getDoc(getUrl);
    if (gdoc) {
      var glist = parseListDoc(gdoc);
      if (glist.length) return Response.success(glist, null);
      var one = singleResult(gdoc);
      if (one) return Response.success(one, null);
    }
  } catch (e1) {}
  var doc = postSearchDoc(key);
  if (doc) {
    var list = parseListDoc(doc);
    if (list.length) return Response.success(list, null);
    var one2 = singleResult(doc);
    if (one2) return Response.success(one2, null);
  }
  // POST khong ra ket qua (thuong do body UTF-8 server GBK khong hieu)
  // -> tim bang form that trong browser
  var bdoc = searchViaBrowser(key);
  if (bdoc && !isGarbledDoc(bdoc)) {
    var blist = parseListDoc(bdoc);
    if (blist.length) return Response.success(blist, null);
  }
  if (!doc && !bdoc) return Response.error("Tim kiem 69shu loi, thu lai sau. Neu hien Cloudflare, mo trang 69shu trong trinh duyet vBook xac minh mot lan roi tim lai.");
  return Response.error("Khong tim thay truyen '" + key + "' tren 69shu. Thu go ID so trong link /book/<id>.htm, hoac dan thang link truyen vao vBook.");
}
