load("config.js");

// Chi tiet truyen qua mirror /detail.
// Tra ve { code: 0, data: { book_name, author, thumb_url, abstract,
// category, pure_category_tags, creation_status, score, word_number,
// read_count, last_chapter_title } }.
function execute(url) {
  url = normalizeUrl(url);
  var bookId = getBookId(url);
  if (!bookId) return Response.error("Không tìm thấy ID truyện");

  var response = fetchPage(MIRROR_URL + "/detail?book_id=" + bookId, { timeout: 15000, cache: 3600 });
  if (!response || !response.ok) {
    return Response.error("Lỗi kết nối proxy (HTTP " + (response ? response.status : "unknown") + ")");
  }
  var json = SafeJson(response);
  if (!json) return Response.error("Lỗi phân tích dữ liệu");
  if (json.code !== 0) return Response.error("Lỗi máy chủ: " + (json.message || json.code));
  if (!json.data) return Response.error("Dữ liệu truyện trống");

  var b = json.data;
  var statusVal = b.creation_status !== undefined ? b.creation_status : b.status;
  var ongoing = (statusVal === 1 || statusVal === "1");
  if (statusVal === undefined || statusVal === null || statusVal === "") ongoing = true;

  var infoLines = [];
  if (b.score) infoLines.push("评分: " + b.score);
  if (b.word_number) infoLines.push("字数: " + formatNum(b.word_number) + "字");
  if (b.read_count) infoLines.push("阅读: " + formatNum(b.read_count));
  if (b.last_chapter_title) infoLines.push("最新: " + decodeText(b.last_chapter_title));

  var genres = [];
  var suggests = [];
  if (b.category) {
    var mainCategory = decodeText(b.category);
    genres.push({ title: mainCategory, input: mainCategory, script: "search.js" });
    suggests.push({ title: "同类型:" + mainCategory, input: mainCategory, script: "search.js" });
  }
  if (b.pure_category_tags) {
    var tags = String(b.pure_category_tags).split(",");
    for (var i = 0; i < tags.length; i++) {
      var tag = decodeText(tags[i].trim());
      if (tag && tag !== decodeText(b.category || "")) {
        genres.push({ title: tag, input: tag, script: "search.js" });
      }
    }
  }
  if (genres.length > 6) genres = genres.slice(0, 6);

  return Response.success({
    name: decodeText(b.book_name || ""),
    cover: b.thumb_url || "",
    host: FANQIE_URL,
    author: decodeText(b.author || ""),
    description: decodeText(cleanText(b.abstract || "")),
    ongoing: ongoing,
    detail: infoLines.join("\n"),
    url: bookLink(bookId),
    type: "novel",
    format: "novel",
    genres: genres,
    suggests: suggests
  });
}

// So luong -> "452.2 vạn" cho de doc.
function formatNum(n) {
  var num = parseInt(String(n), 10);
  if (isNaN(num)) return "";
  if (num >= 10000) return Math.round(num / 1000) / 10 + " vạn";
  return String(num);
}
