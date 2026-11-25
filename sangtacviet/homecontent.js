load("config.js");

// Danh sach trang chu STV: JSON truoc, HTML sau.
// input la query string, vd "?find=&minc=0&sort=update&tag=".
// JSON: 48 muc/trang, p 0-based. HTML: &p=<so trang>.
function execute(url, page) {
  page = page ? parseInt(page, 10) : 1;
  if (!page || page < 1) page = 1;
  var q = String(url || "");
  var j = searchBooksJson(q, page);
  if (j && j.items.length) return Response.success(j.items, j.next);
  if (page > 1) q += "&p=" + page;
  var doc = postSearchBooks(q);
  if (!doc) return Response.error("Khong tai duoc danh sach SangTacViet, thu lai sau.");
  var list = parseBooksearchDoc(doc);
  if (!list.length) return Response.error("Danh sach rong - SangTacViet tai cham hoac dang bao tri. Thu lai sau.");
  var next = list.length >= 48 ? (page + 1) : null;
  return Response.success(list, next);
}
