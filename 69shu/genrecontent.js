load("config.js");

// v11 - phan trang tag (kiem chung 24/11/2026 22:51): trang tag dung
// phan trang tinh /tag/<ten>/<trang>/, khong co nut tai them hay cuon
// vo han, khong thay URL ajax trong DOM. Trang 2 da kiem chung co 30
// truyen khac trang 1 (mo dau 农门团宠：娇软福宝被全家宠上天).
function loadList(u) {
  var doc = getDoc(u, 0);
  var list = doc ? parseListDoc(doc) : [];
  // Trang 404 (tag khong con tren 69shu) thi bao thang, khong mo
  // browser vo ich - browser cung chi tra ve trang 404.
  if (!list.length && doc && is404Doc(doc)) return { error404: true, list: [] };
  if (!list.length && String(u).indexOf("%") !== -1) {
    // Thu them dang link chu Trung tho (khong ma hoa %XX): duong ajax
    // toan chu/s thuong chay ngon, con link tag ma hoa %XX co the bi
    // client Http/fetch cua vBook ma hoa sai them 1 lan. App tu ma hoa
    // lai dang tho nhu trinh duyet van lam.
    try {
      var raw = decodeURIComponent(String(u));
      if (raw !== u) {
        var rdoc = getDoc(raw, 0);
        if (rdoc) {
          if (is404Doc(rdoc)) return { error404: true, list: [] };
          list = parseListDoc(rdoc);
        }
      }
    } catch (e) {}
  }
  if (!list.length) {
    // Trang tag hay bi Cloudflare chan o lan mo dau (doc tra ve la trang
    // chan) - thu lai 1 lan bang browser co cho Turnstile qua.
    // Chi thu 1 lan de khong doi qua lau; neu van rong thi bao ro cach
    // xac minh thay vi bao chung chung "Danh sach rong".
    try {
      var bdoc = getBrowserDoc(u, 60000);
      if (bdoc) {
        if (is404Doc(bdoc)) return { error404: true, list: [] };
        list = parseListDoc(bdoc);
      }
    } catch (e2) {}
  }
  return { error404: false, list: list };
}

function execute(url, page) {
  page = page || "1";
  var pageUrl = String(url);
  if (page !== "1") {
    // v13 - 2 dang phan trang: tag /tag/<ten>/<trang>/ va list
    // /novels/<loai>_<cat>_<trangthai>_<trang>.htm (vd monthvisit_1_2_2.htm).
    // Dang list thay so cuoi _1.htm thanh _<trang>.htm; dang tag noi them.
    var m = pageUrl.match(/_(\d+)\.htm$/);
    if (m) {
      pageUrl = pageUrl.replace(/_(\d+)\.htm$/, "_" + page + ".htm");
    } else {
      if (pageUrl.charAt(pageUrl.length - 1) !== "/") pageUrl += "/";
      pageUrl = pageUrl + page + "/";
    }
  }
  var r = loadList(pageUrl);
  if (r.error404) {
    if (page !== "1") return Response.success([], null);
    return Response.error("Muc nay khong con tren 69shu (trang 404).");
  }
  if (!r.list.length) {
    // Trang 2+ rong nghia la het sach - tra list rong de app dung lai,
    // khong bao loi Cloudflare nua.
    if (page !== "1") return Response.success([], null);
    return Response.error("Danh sach rong - 69shu dang chan kiem tra Cloudflare. Mo trang 69shu trong trinh duyet cua vBook, vuot qua o 'Xac minh ban la con nguoi', roi bam lai muc nay.");
  }
  var next = null;
  if (r.list.length >= 30) {
    try { next = String(parseInt(page, 10) + 1); } catch (e) {}
  }
  return Response.success(r.list, next);
}
