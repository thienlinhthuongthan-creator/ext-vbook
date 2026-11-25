load("config.js");

function execute(url, page) {
  var doc = getDoc(url);
  if (!doc) return Response.error("Khong tai duoc danh sach 69shu");
  var list = parseListDoc(doc);
  if (!list.length) return Response.error("Danh sach rong");
  return Response.success(list, null);
}
