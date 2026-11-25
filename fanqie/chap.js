load("config.js");

// Noi dung chuong qua mirror /content.
// Tra ve { code: 0, data: { content: "<p>...</p><p>...</p>" } }.
// Chuong co the chua ky tu ma hoa font -> decodeText tung doan.
function execute(url) {
  url = normalizeUrl(url);
  var m = String(url).match(/(\d{10,})/);
  var itemId = m ? m[1] : "";
  if (!itemId) {
    return Response.error("Không tìm thấy mã chương trong liên kết. Mở lại mục lục và thử lại.");
  }

  // Thu lay noi dung - retry 1 lan neu 5xx.
  var response = fetchPage(MIRROR_URL + "/content?item_id=" + itemId, { timeout: 20000 });
  if (response && response.status >= 500 && response.status < 600) {
    response = fetchPage(MIRROR_URL + "/content?item_id=" + itemId, { timeout: 20000 });
  }
  if (!response || !response.ok) {
    var code = response ? response.status : "unknown";
    if (code === 500 || code === 503) {
      return Response.error("Lỗi máy chủ proxy (" + code + "). Chương này có thể bị lỗi tạm thời, thử lại.");
    }
    return Response.error("Lỗi tải chương (HTTP " + code + ")");
  }

  var json = SafeJson(response);
  if (!json || json.code !== 0 || !json.data) {
    return Response.error("Nội dung chương không khả dụng");
  }
  var content = json.data.content || json.data.text || "";
  if (!content) return Response.error("Nội dung chương trống");

  var paragraphs = [];
  var pReg = /<p[^>]*>([\s\S]*?)<\/p>/g;
  var match;
  while ((match = pReg.exec(content)) !== null) {
    var t = match[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .trim();
    if (t) paragraphs.push(decodeText(t));
  }
  if (paragraphs.length === 0) {
    var raw = content.replace(/<[^>]+>/g, "").trim();
    if (raw) paragraphs.push(decodeText(raw));
  }
  if (paragraphs.length === 0) return Response.error("Nội dung rỗng sau xử lý");

  return Response.success(paragraphs.join("<br><br>"));
}
