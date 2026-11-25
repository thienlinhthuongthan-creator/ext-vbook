load("config.js");

function execute(url) {
  var doc = getDoc(url);
  if (!doc) return Response.error("Khong tai duoc trang truyen 69shu, thu lai sau");
  var name = txt(selOne(doc, "div.booknav2 > h1 > a"));
  if (!name) name = txt(selOne(doc, "div.booknav2 h1"));
  if (!name) name = metaContent(doc, "book_name");
  if (!name) name = txt(selOne(doc, "h1"));
  if (!name) name = txt(selOne(doc, "title"));

  var author = txt(selOne(doc, "div.booknav2 > p:nth-child(2) > a"));
  if (!author) author = txt(selOne(doc, '.booknav2 p a[href*="author"]'));
  if (!author) author = metaContent(doc, "author");
  if (!author) {
    var al = selOne(doc, ".booknav2 p a");
    if (al) author = txt(al);
  }

  var cover = "";
  var img = selOne(doc, "div.bookimg2 img");
  if (!img) img = selOne(doc, ".imgbox img");
  if (img) cover = attr(img, "src") || attr(img, "data-src") || "";
  if (!cover) cover = metaContent(doc, "image");
  if (cover) cover = coverUrl(cover);
  if (!cover) cover = coverFromId(bookIdFromUrl(url));

  var desc = "";
  var navtxtP = selOne(doc, "div.navtxt > p");
  if (navtxtP) { try { desc = navtxtP.html(); } catch (e) { desc = txt(navtxtP); } }
  if (!desc) desc = txt(selOne(doc, "div.navtxt"));
  if (!desc) desc = txt(selOne(doc, ".jianjie"));
  if (!desc) desc = metaContent(doc, "description");

  var status = "";
  var infoItems = sel(doc, ".infolist li");
  for (var i = 0; i < infoItems.length; i++) {
    var t = txt(infoItems[i]);
    if (t.indexOf("连载") !== -1 || t.indexOf("全本") !== -1 || t.indexOf("完结") !== -1 || t.indexOf("完本") !== -1) status = t;
  }
  if (!status) status = metaContent(doc, "status");
  var lastChapter = metaContent(doc, "chapter_name");
  if (!lastChapter) {
    var st = selOne(doc, ".status p a, .status a");
    if (st) lastChapter = txt(st);
  }
  var detail = "";
  if (status) detail += status + "\n";
  if (lastChapter) detail += lastChapter + "\n";
  if (infoItems.length) {
    var parts = [];
    for (var j = 0; j < infoItems.length; j++) parts.push(txt(infoItems[j]));
    if (parts.join(" ")) detail += parts.join(" | ");
  }
  if (!detail) detail = desc;

  var ongoing = true;
  if (status.indexOf("全本") !== -1 || status.indexOf("完本") !== -1 || status.indexOf("完结") !== -1) ongoing = false;

  return Response.success({
    name: name,
    cover: cover,
    host: url,
    author: author,
    description: desc,
    detail: detail,
    ongoing: ongoing
  });
}
