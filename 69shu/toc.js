load("config.js");

function chapNum(title) {
  var m = String(title || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : -1;
}

function collectFromDoc(doc) {
  var out = [];
  var seen = {};
  // v9 - hoc tu ext blackkk: muc luc con co dang div.catalog (ban .tw),
  // thu truoc roi moi den div#catalog (ban .com da kiem chung)
  var links = sel(doc, "div.catalog > ul > li > a");
  if (!links.length) links = sel(doc, "div#catalog ul li a");
  if (!links.length) links = sel(doc, ".mulu_list li a");
  if (!links.length) links = sel(doc, "#catalog a");
  for (var i = 0; i < links.length; i++) {
    var href = absUrl(attr(links[i], "href"));
    var name = txt(links[i]);
    if (!href || !name) continue;
    if (seen[href]) continue;
    seen[href] = true;
    out.push({ name: name, url: href, host: href });
  }
  return out;
}

function execute(url) {
  var doc = getDoc(url);
  if (!doc) return Response.error("Khong tai duoc muc luc 69shu");
  var list = collectFromDoc(doc);
  if (list.length) {
    // Catalog cua 69shu liet ke moi nhat truoc -> dao lai de doc tu dau
    if (list.length > 1 && chapNum(list[0].name) > chapNum(list[list.length - 1].name)) list.reverse();
    return Response.success(list);
  }
  // Thu link "完整目录" / nut muc luc tren trang chi tiet
  var tocLink = null;
  var anchors = sel(doc, "a");
  for (var i = 0; i < anchors.length; i++) {
    var t = txt(anchors[i]);
    if (t.indexOf("完整目录") !== -1 || t.indexOf("目录") !== -1) { tocLink = absUrl(attr(anchors[i], "href")); break; }
  }
  var candidates = [];
  if (tocLink) candidates.push(tocLink);
  candidates.push(url.replace("/txt/", "/").replace(".htm", "/"));
  candidates.push(url.replace("/book/", "/").replace(".htm", "/"));
  candidates.push(url.replace(".htm", "/"));
  candidates.push(url.replace(".htm", "") + "/");
  for (var c = 0; c < candidates.length; c++) {
    if (!candidates[c] || candidates[c] === url) continue;
    var d2 = getDoc(candidates[c]);
    if (!d2) continue;
    var l2 = collectFromDoc(d2);
    if (l2.length) {
      if (l2.length > 1 && chapNum(l2[0].name) > chapNum(l2[l2.length - 1].name)) l2.reverse();
      return Response.success(l2);
    }
  }
  return Response.error("Khong tim thay muc luc cua truyen nay tren 69shu");
}
