load("config.js");

// Muc luc qua mirror /catalog.
// Tra ve { code: 0, data: { item_data_list: [{ item_id, title }] } }.
// url cua moi chuong la item_id (so); chap.js dung no de goi /content.
function execute(url) {
  url = normalizeUrl(url);
  var bookId = getBookId(url);
  if (!bookId) return Response.error("Không tìm thấy ID truyện");

  var response = fetchPage(MIRROR_URL + "/catalog?book_id=" + bookId, { timeout: 20000, cache: 600 });
  if (!response || !response.ok) {
    return Response.error("Lỗi tải mục lục (HTTP " + (response ? response.status : "unknown") + ")");
  }
  var json = SafeJson(response);
  if (!json || json.code !== 0 || !json.data) return Response.success([]);

  var rawList = json.data.item_data_list || json.data.catalog_data || [];
  var chapters = [];
  for (var i = 0; i < rawList.length; i++) {
    var item = rawList[i];
    if (!item) continue;
    var itemId = item.item_id || item.catalog_id || "";
    var title = item.title || item.catalog_title || "";
    if (itemId && title) {
      chapters.push({ name: decodeText(title), url: String(itemId), host: MIRROR_URL });
    }
  }
  return Response.success(chapters);
}
