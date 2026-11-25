load("config.js");

function execute(url) {
  var doc = getDoc(url);
  if (!doc) return Response.error("Khong tai duoc chuong 69shu");
  // v9 - hoc tu ext blackkk: trang chuong co chu "69shubaV1" la trang
  // chan hien bang JS, noi dung that chi co trong browser
  try {
    var raw = docText(doc);
    if (raw.indexOf("69shubaV1") !== -1) {
      var bdoc = getBrowserDoc(url);
      if (bdoc) doc = bdoc;
    }
  } catch (e) {}
  var body = selOne(doc, "div.txtnav");
  if (!body) body = selOne(doc, "div.yd_text2");
  if (!body) body = selOne(doc, "#txtnav, .txtnav");
  if (!body) return Response.error("Khong tim thay noi dung chuong");
  // Bo tieu de / thong tin thua trong khoi noi dung (theo lncrawl)
  try {
    var junk = sel(body, "h1, div.txtinfo, div#txtright, script, style, ins, .ads, iframe");
    for (var i = 0; i < junk.length; i++) {
      try { junk[i].remove(); } catch (e) {}
    }
  } catch (e2) {}
  var content = "";
  try { content = body.html(); } catch (e3) {}
  if (!content) {
    try { content = body.text(); } catch (e4) {}
  }
  if (!content) return Response.error("Chuong rong");
  return Response.success(content);
}
