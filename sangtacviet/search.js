load("config.js");

// Tim kiem STV: JSON truoc (app STV tra JSON khi gui kem header app),
// HTML sau (endpoint /io/searchtp/searchBooks, 48 muc/trang).
// (Kiem chung 25/11/2026: JSON code 100, list co tname/hauthor/thumb;
//  HTML .booksearch van dung duoc khi JSON that bai.)
function execute(key, page) {
  key = (key || "").trim();
  if (!key) return Response.error("Nhap ten truyen de tim");
  // Dan thang link truyen/chuong STV -> mo thang trang truyen do
  var pasted = parseBookUrl(key);
  if (pasted) {
    var link = bookUrl(pasted.source, pasted.bookId);
    return Response.success([{ name: key, link: link, host: link, cover: "", author: "", description: "" }], null);
  }
  page = page ? parseInt(page, 10) : 1;
  if (!page || page < 1) page = 1;
  var q = "?find=&findinname=" + encodeURIComponent(key);
  var j = searchBooksJson(q, page);
  if (j && j.items.length) return Response.success(j.items, j.next);
  if (page > 1) q += "&p=" + page;
  var doc = postSearchBooks(q);
  if (!doc) return Response.error("Khong tai duoc ket qua tim kiem SangTacViet, thu lai sau.");
  var list = parseBooksearchDoc(doc);
  if (!list.length) return Response.error("Khong tim thay truyen '" + key + "' tren SangTacViet. Thu tim bang ten goc tieng Trung hoac dan thang link truyen.");
  var next = list.length >= 48 ? (page + 1) : null;
  return Response.success(list, next);
}
