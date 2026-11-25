load("config.js");

// Muc luc STV: lay thang qua endpoint cua site (da kiem chung bang curl
// 25/11/2026):
//   GET /index.php?ngmar=chapterlist&h=<nguon>&bookid=<id>&sajax=getchapterlist
//   Header Referer: <trang truyen> BAT BUOC (khong co Referer server tra rong).
// Tra ve JSON {code:1, data:"<seg>-/-<id chuong>-/-<ten chuong>(-/-vip) -//- ..."}.
// URL chuong = /truyen/<nguon>/<seg>/<id truyen>/<id chuong>/.
// (Kiem chung: Lam thanh qidian/1/1048640442 co 208 chuong,
//  chuong 1 = 901511569, chuong 2 = 901618906, chuong 3 = 901719276.)
function fetchChapterList(host, bookId) {
  var listUrl = BASE_URL + "/index.php?ngmar=chapterlist&h=" + host + "&bookid=" + bookId + "&sajax=getchapterlist";
  var raw = "";
  try {
    var req = Http.get(listUrl);
    try { req.headers({ "User-Agent": UA, "Referer": bookUrl(host, bookId), "Cookie": "mac_tt=true", "Accept": "application/json, text/plain, */*" }); } catch (e) {}
    raw = req.string();
  } catch (e2) {}
  return raw || "";
}

function execute(url) {
  var parsed = parseBookUrl(url);
  if (!parsed) return Response.error("Link truyen SangTacViet khong dung dang /truyen/<nguon>/1/<id>/");
  var raw = fetchChapterList(parsed.source, parsed.bookId);
  if (!raw) {
    // Thu lap phien bang cach mo trang truyen truoc roi goi lai
    try { getDoc(bookUrl(parsed.source, parsed.bookId)); } catch (e) {}
    raw = fetchChapterList(parsed.source, parsed.bookId);
  }
  if (!raw) return Response.error("Khong tai duoc danh sach chuong (server tra rong). Mo trang truyen trong trinh duyet vBook mot lan roi thu lai.");
  var data = chapterDataFromJson(raw);
  if (!data) return Response.error("Danh sach chuong tra ve khong doc duoc. Thu lai sau.");
  var entries = String(data).split("-//-");
  var out = [];
  for (var i = 0; i < entries.length; i++) {
    var parts = entries[i].split("-/-");
    if (parts.length < 3) continue;
    var seg = clean(parts[0]) || "1";
    var cid = clean(parts[1]);
    var title = cleanChapTitle(parts[2]);
    if (!cid || !title) continue;
    out.push({ name: title, url: chapterUrl(parsed.source, parsed.bookId, cid), host: chapterUrl(parsed.source, parsed.bookId, cid) });
  }
  if (!out.length) return Response.error("Danh sach chuong rong - truyen co the da bi xoa tren SangTacViet.");
  // Site dao nguoc danh sach doi voi nguon uukanshu
  if (parsed.source === "uukanshu") out.reverse();
  return Response.success(out);
}
