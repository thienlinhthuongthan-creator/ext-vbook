load("config.js");

// Binh luan doc gia STV (v12): hien o tab binh luan trong trang gioi
// thieu truyen. API /mobile/comment.php?act=readcomment (hoc tu ext
// QuocBao sau khi dich nguoc). Kiem chung live 25/11/2026:
// /truyen/qidian/1/1048640442/ tra code 100, 10 binh luan/trang,
// start=0/10 phan trang duoc, ca 2 base deu tra duoc, khong can Referer.
function commentStripHtml(text) {
  var value = text === null || typeof text === "undefined" ? "" : String(text);
  if (!value) return "";
  value = value.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "");
  value = value.replace(/&nbsp;/gi, " ").replace(/&quot;/gi, "\"").replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&");
  value = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/[ \t\f\v]+/g, " ").replace(/[ ]*\n[ ]*/g, "\n").replace(/\n{3,}/g, "\n\n");
  return clean(value);
}

function commentEscapeHtml(text) {
  var value = text === null || typeof text === "undefined" ? "" : String(text);
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function commentToHtml(text) {
  var value = commentEscapeHtml(commentStripHtml(text));
  if (!value) return "";
  return value.replace(/\n/g, "<br>");
}

function execute(url, page) {
  var host = "";
  var bookId = "";
  var parsed = parseBookUrl(url);
  if (parsed) {
    host = parsed.source;
    bookId = parsed.bookId;
  } else {
    var q = parseQueryStr(url);
    host = clean(q.host || "");
    bookId = clean(q.bookid || q.hid || q.id || "");
  }
  if (!host || !bookId) return Response.error("Không đọc được bình luận: thiếu thông tin truyện.");
  page = page ? parseInt(page, 10) : 1;
  if (!page || page < 1) page = 1;
  var start = (page - 1) * 10;
  var path = "/mobile/comment.php?act=readcomment&host=" + encodeURIComponent(host) + "&bookid=" + encodeURIComponent(bookId) + "&start=" + start + "&order=new";
  var found = fetchJsonOnBases(path, stvAppHeaders({ "Referer": bookUrl(host, bookId) }));
  if (!found || !found.json || !found.json.list) return Response.error("Không tải được bình luận, thử lại sau.");
  var list = found.json.list || [];
  if (!list.length) return Response.success([]);
  var comments = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i] || {};
    var name = clean(item.name || item.nickname || "Ẩn danh");
    var time = clean(item.time || item.createdAt || "");
    var contentHtml = commentToHtml(item.content);
    var replies = item.reply && item.reply.length ? item.reply : [];
    var replyLines = [];
    for (var j = 0; j < replies.length; j++) {
      var r = replies[j] || {};
      var rName = clean(r.name || r.nickname || "Ẩn danh");
      var rContent = commentStripHtml(r.content);
      if (!rContent) continue;
      replyLines.push("↳ " + commentEscapeHtml(rName) + ": " + commentEscapeHtml(rContent));
    }
    if (replyLines.length) {
      if (contentHtml) contentHtml += "<br>";
      contentHtml += replyLines.join("<br>");
    }
    if (!contentHtml) continue;
    comments.push({ name: name, content: contentHtml, description: time });
  }
  var next = null;
  if (list.length >= 10) next = String(page + 1);
  return Response.success(comments, next);
}
