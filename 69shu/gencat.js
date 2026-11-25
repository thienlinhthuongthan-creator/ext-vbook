load("config.js");

// v9 - hoc tu ext blackkk (gen.js): the loai lay qua endpoint ajax nhe
// /ajax_novels/full/<id>/<trang>.htm - tra ve fragment HTML tran 50 truyen,
// khong header/footer nen nhe va nhanh hon trang /novels/class/.
// Trang tiep tinh theo mau URL (fragment khong co link phan trang);
// chi tra next khi trang day 50 truyen, trang le thi dung.
function execute(url, page) {
  page = page || "1";
  var ajaxUrl = BASE_URL + String(url).replace("{0}", page);
  var doc = getDoc(ajaxUrl, 0);
  var list = doc ? parseListDoc(doc) : [];
  if (!list.length) {
    // Ajax bi chan hoac rong -> thu trang the loai goc /novels/class/
    var m = String(url).match(/full\/(\d+)\//);
    if (m) {
      var cdoc = getDoc(BASE_URL + "/novels/class/" + m[1] + ".htm");
      if (cdoc) {
        if (is404Doc(cdoc)) return Response.error("The loai nay khong con tren 69shu (trang 404).");
        list = parseListDoc(cdoc);
      }
    }
  }
  if (!list.length) return Response.error("Danh sach rong - 69shu dang chan kiem tra Cloudflare. Mo trang 69shu trong trinh duyet cua vBook, vuot qua o 'Xac minh ban la con nguoi', roi bam lai the loai.");
  var next = null;
  if (list.length >= 50) {
    try { next = String(parseInt(page, 10) + 1); } catch (e) {}
  }
  return Response.success(list, next);
}
