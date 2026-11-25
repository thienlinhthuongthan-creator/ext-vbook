load("config.js");

// Tim kiem qua mirror gofq.52dns.cc (API chinh thuc cua Fanqie khong co
// endpoint tim kiem cong khai dung duoc tu vBook).
// Tra ve { code: 0, search_tabs: [{ has_more, data | book_data: [...] }] }.
function execute(key, page) {
  if (!page) page = "1";
  var response = fetchPage(MIRROR_URL + "/search?key=" + encodeURIComponent(key) + "&page=" + encodeURIComponent(page) + "&tab_type=1", { timeout: 15000, cache: 300 });
  if (!response || !response.ok) {
    return Response.error("Không thể tìm kiếm (HTTP " + (response ? response.status : "unknown") + "). Kiểm tra kết nối và thử lại.");
  }
  var json = SafeJson(response);
  if (!json) return Response.error("Dữ liệu tìm kiếm không đúng định dạng. Thử lại sau.");

  var list = [];
  var seen = {};
  var hasMore = false;
  var tabs = json.search_tabs || [];
  for (var t = 0; t < tabs.length; t++) {
    if (tabs[t].has_more === true) hasMore = true;
    var items = tabs[t].data || tabs[t].book_data || [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var bd = (item.book_data && item.book_data.length > 0) ? item.book_data : [item];
      for (var c = 0; c < bd.length; c++) {
        var b = bd[c];
        if (!b || !b.book_id || !b.book_name) continue;
        var bid = String(b.book_id);
        if (seen[bid]) continue;
        seen[bid] = true;
        var cat = decodeText(b.category || "");
        var score = b.score ? "⭐" + b.score : "";
        list.push({
          name: decodeText(String(b.book_name).replace(/<\/?em>/g, "")),
          author: decodeText(String(b.author || "").replace(/<\/?em>/g, "")),
          cover: b.thumb_url || "",
          description: decodeText(cleanText(b.abstract || "")),
          detail: [cat, score].filter(Boolean).join(" "),
          link: bookLink(bid),
          host: FANQIE_URL
        });
      }
    }
  }
  var next = (hasMore && list.length > 0) ? String(parseInt(page, 10) + 1) : "";
  return Response.success(list, next);
}
