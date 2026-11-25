load("config.js");
load("crypto.js");
load("chap_decode.js");

// Doc chuong STV theo luong cua app (v5): grantcontext -> chapterkey
// -> readchapter co chu ky -> lam sach HTML lien chu.
// (Kiem chung 25/11/2026 tren truyen Lam thanh chuong 1: grant 790KB chay
//  duoc trong JS engine, chapterkey 190 ky tu, readchapter tra code 0,
//  noi dung lam sach thanh tieng Viet dung, 11.372 ky tu.)
// Neu luong nay that bai het thi roi ve cach cu: mo trang chuong trong
// browser trong app va cao noi dung (v2).
var CLICK_LOAD_JS = "(function(){var els=document.querySelectorAll('body *');for(var i=0;i<els.length;i++){var e=els[i];if(e.children.length===0&&e.textContent&&e.textContent.indexOf('Nhấp vào để tải chương')!==-1){e.click();return 'clicked';}}return 'notfound';})()";

// Khoi noi dung doi id khi JS chay xong: #content-container (HTML tho)
// -> #maincontent -> #cld-<id truyen>-<id chuong>.
function contentEl(doc) {
  var c = selOne(doc, "#content-container");
  if (c) return c;
  c = selOne(doc, "[id^='cld-']");
  if (c) return c;
  return selOne(doc, "#maincontent");
}

function scrapeChapterFallback(url) {
  var browser = null;
  try { browser = Engine.newBrowser(); } catch (e) { return null; }
  var doc = null;
  try { doc = browser.launch(url, 25000); } catch (e2) {}
  var waited = 0, clicked = false, captcha = false, loaded = false;
  try {
    while (doc && waited < 90000) {
      var t = docText(doc);
      if (isCaptchaDoc(doc)) { captcha = true; break; }
      if (t.indexOf("Bạn đang đọc bản lưu") !== -1) { loaded = true; break; }
      var c = contentEl(doc);
      if (c && clean(txt(c)).length > 100) { loaded = true; break; }
      if (!clicked && t.indexOf("Nhấp vào để tải chương") !== -1) {
        try { doc = browser.callJs(CLICK_LOAD_JS, 8000); } catch (e3) {}
        clicked = true; waited += 8000; continue;
      }
      try { doc = browser.callJs("void 0", 5000); } catch (e4) { break; }
      waited += 5000;
    }
  } catch (e5) {}
  try { browser.close(); } catch (e6) {}
  if (captcha) return { error: "SangTacViet yeu cau nhap ma xac thuc khi tai chuong. Mo sangtacviet.com trong trinh duyet vBook, nhap ma mot lan roi doc lai chuong nay." };
  if (!doc) return null;
  var content = "";
  var body = contentEl(doc);
  if (body) {
    try {
      var junk = sel(body, "script, style, iframe, ins, .ads");
      for (var i = 0; i < junk.length; i++) { try { junk[i].remove(); } catch (e7) {} }
    } catch (e8) {}
    try { content = body.html(); } catch (e9) {}
    if (!content) { try { content = txt(body); } catch (e10) {} }
    if (content) content = content.replace(/@Bạn đang đọc bản lưu trong hệ thống/g, "");
  }
  if (!content) {
    var full = docText(doc);
    var a = full.indexOf("Bạn đang đọc bản lưu trong hệ thống");
    if (a !== -1) {
      var b = full.indexOf("Chương trước", a + 10);
      if (b === -1) b = full.length;
      content = clean(full.substring(a, b));
      content = content.replace("Bạn đang đọc bản lưu trong hệ thống", "").trim();
    }
  }
  if (!content) {
    if (!loaded) return { error: "Khong tai duoc noi dung chuong (trang van hien 'Đang tải...'). Thu lai sau, hoac mo chuong trong trinh duyet vBook xem co bat nhap ma xac thuc khong." };
    return { error: "Chuong rong" };
  }
  // Noi dung cao tu trang la HTML tho (co the con the <i> lien chu);
  // lam sach qua bo loc lien chu neu co.
  if (stvLooksLikeInterlinearHtml(content)) content = stvNormalizeInterlinearChapter(content);
  return { content: content };
}

function execute(url) {
  var payload = stvParseChapterUrl(url);
  if (!payload || !payload.host || !payload.bookid || !payload.cid) {
    return Response.error("Link chuong SangTacViet khong dung dang /truyen/<nguon>/1/<id truyen>/<id chuong>/");
  }
  var lastErr = "";
  for (var i = 0; i < STV_BASES.length; i++) {
    var base = STV_BASES[i];
    var grant = stvGrantContext(base, payload.host, payload.bookid);
    if (!grant || !grant.chapterkey) {
      lastErr = stvFirst(grant ? grant.grantErr : "", "Không lấy được chapterkey.");
      continue;
    }
    var json = stvReadChapter(base, payload, grant);
    if (!json) {
      lastErr = "Không đọc được readchapter.";
      continue;
    }
    if (String(json.code) !== "0") {
      lastErr = stvFirst(json.err, json.info, "STV trả về lỗi không xác định.");
      continue;
    }
    var raw = stvFirst(json.data, "");
    var content = stvNormalizeChapterHtml(payload.host, base, raw, payload.bookid, payload.cid, json.defaultname);
    if (!content) return Response.error("Đã nhận dữ liệu chương nhưng không có nội dung.");
    return Response.success(content);
  }
  // Duong cuoi: cao trang chuong bang browser trong app.
  var fb = scrapeChapterFallback(url);
  if (fb && fb.content) return Response.success(fb.content);
  if (fb && fb.error) return Response.error(fb.error);
  return Response.error(lastErr || "Không thể tải nội dung chương STV.");
}
