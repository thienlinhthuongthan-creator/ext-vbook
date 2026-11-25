// Doc chuong STV theo luong cua app (hoc tu ext QuocBao sau khi dich nguoc,
// 25/11/2026) - grantcontext -> chapterkey -> readchapter co chu ky.
// Kiem chung end-to-end bang curl + Node 25/11/2026 tren truyen Lam thanh:
// grant (790KB JS) chay duoc trong JS engine thuong, chapterkey 190 ky tu,
// readchapter tra code 0 + HTML lien chu, lam sach thanh tieng Viet dung.
// Khong dung WebName engine (can browser tai them hanviet.js/qtOnline.js)
// vi ban chu lien chu da doc duoc ngay sau khi lam sach.

function stvTrim(text) {
  return String(text === null || typeof text === "undefined" ? "" : text).replace(/^\s+|\s+$/g, "");
}
function stvFirst(v1, v2, v3) {
  if (stvTrim(v1)) return v1;
  if (stvTrim(v2)) return v2;
  return v3 || "";
}
function stvEncode(text) {
  try { return encodeURIComponent(String(text === null || typeof text === "undefined" ? "" : text)); } catch (e) { return String(text || ""); }
}
function stvDecode(text) {
  try { return decodeURIComponent(String(text || "")); } catch (e) { return String(text || ""); }
}
function stvJsString(value) {
  var text = value === null || typeof value === "undefined" ? "" : String(value);
  if (typeof JSON !== "undefined" && JSON && typeof JSON.stringify === "function") {
    try { return JSON.stringify(text); } catch (e) {}
  }
  return "\"" + text.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + "\"";
}
function stvGetGlobalObject() {
  if (typeof globalThis !== "undefined") return globalThis;
  try { return Function("return this")(); } catch (e) { return {}; }
}
function stvAtobFallback(input) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var str = stvTrim(String(input)).replace(/[^A-Za-z0-9\+\/\=]/g, "");
  var output = "";
  var i = 0;
  while (i < str.length) {
    var e1 = chars.indexOf(str.charAt(i++));
    var e2 = chars.indexOf(str.charAt(i++));
    var e3 = chars.indexOf(str.charAt(i++));
    var e4 = chars.indexOf(str.charAt(i++));
    if (e1 < 0 || e2 < 0) continue;
    var c1 = (e1 << 2) | (e2 >> 4);
    var c2 = ((e2 & 15) << 4) | (e3 >> 2);
    var c3 = ((e3 & 3) << 6) | e4;
    output += String.fromCharCode(c1);
    if (e3 !== 64 && e3 >= 0) output += String.fromCharCode(c2);
    if (e4 !== 64 && e4 >= 0) output += String.fromCharCode(c3);
  }
  return output;
}
function stvBtoaFallback(input) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var str = String(input === null || input === undefined ? "" : input);
  var output = "";
  var index = 0;
  while (index < str.length) {
    var chr1 = str.charCodeAt(index++) & 255;
    var chr2 = index < str.length ? str.charCodeAt(index++) & 255 : NaN;
    var chr3 = index < str.length ? str.charCodeAt(index++) & 255 : NaN;
    var enc1 = chr1 >> 2;
    var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    var enc4 = chr3 & 63;
    if (isNaN(chr2)) { enc3 = 64; enc4 = 64; } else if (isNaN(chr3)) { enc4 = 64; }
    output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
  }
  return output;
}
function stvDecodeBase64Utf8(base64Text) {
  var input = stvTrim(base64Text).replace(/\s+/g, "");
  if (!input) return "";
  var binary = "";
  var g = stvGetGlobalObject();
  try {
    binary = (g && typeof g.atob === "function") ? g.atob(input) : stvAtobFallback(input);
  } catch (e) { return ""; }
  try { return decodeURIComponent(escape(binary)); } catch (e2) { return binary; }
}
function stvDecodeGrantHtml(htmlText) {
  var text = stvTrim(htmlText);
  if (!text) return "";
  text = text.replace(/^\s*<html[^>]*>\s*<head[^>]*>[\s\S]*?<\/head>\s*<body[^>]*>/i, "");
  text = text.replace(/<\/body>\s*<\/html>\s*$/i, "");
  text = text.replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  return text;
}
function stvLooksLikeGrantScript(text) {
  var sample = stvTrim(text);
  if (!sample) return false;
  if (sample.indexOf("(()=>") === 0 || sample.indexOf("(() =>") === 0) return true;
  if (sample.indexOf("app.reader") >= 0) return true;
  if (sample.indexOf("chapterkey") >= 0) return true;
  return false;
}
function stvSortQuery(params) {
  var keys = [];
  for (var k in params) { if (params.hasOwnProperty(k)) keys.push(k); }
  keys.sort();
  var out = "";
  for (var i = 0; i < keys.length; i++) { out += keys[i] + "=" + params[keys[i]] + "&"; }
  return out;
}
function stvEscapeHtml(text) {
  var value = text === null || typeof text === "undefined" ? "" : String(text);
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function stvDecodeHtmlEntities(text) {
  return String(text === null || typeof text === "undefined" ? "" : text)
    .replace(/&nbsp;/gi, " ").replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&");
}
function stvGetHeaderValue(headers, wantedName) {
  if (!headers || !wantedName) return "";
  var lowerWanted = String(wantedName).toLowerCase();
  if (typeof headers.get === "function") {
    var direct = headers.get(wantedName);
    if (direct) return String(direct);
    var lowered = headers.get(lowerWanted);
    if (lowered) return String(lowered);
  }
  var keys = [wantedName, lowerWanted, "Set-Cookie", "set-cookie"];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (typeof headers[key] !== "undefined" && headers[key] !== null) {
      var value = headers[key];
      if (Object.prototype.toString.call(value) === "[object Array]") return value.join("; ");
      return String(value);
    }
  }
  for (var name in headers) {
    if (!headers.hasOwnProperty(name)) continue;
    if (String(name).toLowerCase() !== lowerWanted) continue;
    var val = headers[name];
    if (Object.prototype.toString.call(val) === "[object Array]") return val.join("; ");
    return String(val);
  }
  return "";
}
function stvExtractSetCookie(headers) {
  return stvGetHeaderValue(headers, "set-cookie");
}
function stvFindReadContextId(setCookieText) {
  var text = stvTrim(setCookieText);
  if (!text) return "";
  var match = text.match(/readcontextid=([^;\s]+)/i);
  return match && match[1] ? match[1] : "";
}
function stvMd5Hex(text) {
  if (typeof CryptoJS !== "undefined" && CryptoJS && typeof CryptoJS.MD5 === "function") {
    return String(CryptoJS.MD5(String(text)));
  }
  return "";
}
function stvBuildBookUrl(base, host, bookid, status) {
  var b = String(base || "").replace(/\/+$/, "");
  return b + "/truyen/" + host + "/" + (status || 1) + "/" + bookid + "/";
}
function stvParseChapterUrl(url) {
  var text = String(url || "");
  var m = text.match(/\/truyen\/([^\/]+)\/(\d+)\/([^\/]+)\/([^\/\?#]+)/);
  if (!m) return null;
  var base = "";
  var bm = text.match(/^(https?:\/\/[^\/]+)/i);
  if (bm) base = bm[1];
  return { base: base, host: m[1], status: m[2], bookid: m[3], cid: m[4] };
}

// Giai ma ky tu webfont cua STV (vung Private Use Area -> ASCII).
// Chi dung cho nguon sangtac / dich.
function giaiMaChuoi(input) {
  var text = input === null || typeof input === "undefined" ? "" : String(input);
  if (!text) return "";
  var mapping_list = [
    [0xE01B, "A"], [0xE01E, "y"], [0xE05F, "3"], [0xE063, "z"],
    [0xE06B, "K"], [0xE06C, "t"], [0xE089, "l"], [0xE0D5, "S"],
    [0xE0D6, "T"], [0xE100, "o"], [0xE101, "P"], [0xE116, "4"],
    [0xE122, "W"], [0xE124, "Z"], [0xE14B, "J"], [0xE160, "e"],
    [0xE184, "O"], [0xE186, "D"], [0xE1A4, "f"], [0xE1AD, "e"],
    [0xE1B4, "k"], [0xE1B8, "f"], [0xE1BF, "n"], [0xE1C0, "Y"],
    [0xE1C1, "1"], [0xE1D8, "K"], [0xE1E4, "M"], [0xE1EA, "Y"],
    [0xE215, "C"], [0xE218, "A"], [0xE22B, "h"], [0xE240, "x"],
    [0xE248, "v"], [0xE257, "G"], [0xE27E, "b"], [0xE2A9, "B"],
    [0xE2C5, "s"], [0xE2C7, "t"], [0xE2CA, "G"], [0xE2E3, "k"],
    [0xE2F8, "q"], [0xE30F, "F"], [0xE311, "u"], [0xE32F, "E"],
    [0xE334, "2"], [0xE34A, "I"], [0xE37C, "R"], [0xE38F, "v"],
    [0xE39B, "X"], [0xE3B0, "l"], [0xE3B7, "7"], [0xE3F1, "l"],
    [0xE41B, "o"], [0xE41C, "H"], [0xE426, "S"], [0xE427, "J"],
    [0xE43E, "6"], [0xE44E, "X"], [0xE46A, "b"], [0xE477, "y"],
    [0xE49A, "c"], [0xE4A3, "8"], [0xE4AE, "2"], [0xE4CC, "s"],
    [0xE4D3, "5"], [0xE4DB, "L"], [0xE4DF, "N"], [0xE4EC, "5"],
    [0xE4F3, "r"], [0xE519, "0"], [0xE51F, "g"], [0xE550, "E"],
    [0xE557, "h"], [0xE566, "N"], [0xE571, "F"], [0xE57B, "O"],
    [0xE5BD, "C"], [0xE5C1, "d"], [0xE5C9, "8"], [0xE5D1, "x"],
    [0xE5DC, "m"], [0xE5E1, "9"], [0xE5F0, "u"], [0xE5FA, "m"],
    [0xE5FF, "a"], [0xE603, "U"], [0xE62A, "w"], [0xE636, "P"],
    [0xE63E, "D"], [0xE648, "6"], [0xE65B, "H"], [0xE65D, "z"],
    [0xE660, "9"], [0xE68D, "1"], [0xE691, "M"], [0xE6A4, "q"],
    [0xE6A5, "c"], [0xE6D7, "W"], [0xE6E0, "R"], [0xE6F1, "T"],
    [0xE6F3, "a"], [0xE6F5, "g"], [0xE705, "w"], [0xE71A, "3"],
    [0xE735, "Z"], [0xE74F, "Q"], [0xE762, "r"], [0xE765, "n"],
    [0xE775, "V"], [0xE77A, "d"], [0xE77D, "L"], [0xE77E, "4"],
    [0xE7C7, "U"], [0xE7E5, "0"], [0xE7F6, "7"], [0xE902, "A"],
    [0xE915, "O"], [0xE91F, "e"], [0xE946, "a"], [0xE95D, "2"],
    [0xE97B, "f"], [0xE9A8, "y"], [0xE9CC, "P"], [0xE9D5, "o"],
    [0xE9D7, "r"], [0xE9F8, "O"], [0xE9F9, "K"], [0xEA15, "e"],
    [0xEA20, "Y"], [0xEA24, "N"], [0xEA2D, "v"], [0xEA2E, "R"],
    [0xEA2F, "C"], [0xEA43, "4"], [0xEA47, "l"], [0xEA65, "S"],
    [0xEA75, "M"], [0xEA76, "H"], [0xEA77, "u"], [0xEA82, "o"],
    [0xEAA1, "k"], [0xEAA4, "a"], [0xEAA5, "x"], [0xEAA6, "z"],
    [0xEAB2, "6"], [0xEAB4, "t"], [0xEABB, "y"], [0xEAC5, "w"],
    [0xEACF, "b"], [0xEAD5, "L"], [0xEAE3, "A"], [0xEAED, "F"],
    [0xEB02, "s"], [0xEB06, "s"], [0xEB0E, "C"], [0xEB0F, "R"],
    [0xEB18, "w"], [0xEB27, "D"], [0xEB62, "l"], [0xEB63, "9"],
    [0xEB75, "h"], [0xEB85, "X"], [0xEBEC, "k"], [0xEBF6, "N"],
    [0xEC0F, "q"], [0xEC19, "J"], [0xEC50, "7"], [0xEC6D, "g"],
    [0xEC75, "d"], [0xEC85, "n"], [0xECAD, "V"], [0xECB4, "S"],
    [0xECD4, "L"], [0xECDB, "Z"], [0xECE6, "E"], [0xECF8, "U"],
    [0xED07, "V"], [0xED2C, "Q"], [0xED35, "l"], [0xED37, "J"],
    [0xED48, "W"], [0xED64, "5"], [0xED71, "2"], [0xED72, "v"],
    [0xED8C, "E"], [0xEDEB, "Y"], [0xEDEC, "5"], [0xEDED, "m"],
    [0xEE01, "c"], [0xEE09, "Q"], [0xEE0C, "n"], [0xEE0F, "u"],
    [0xEE47, "W"], [0xEE5C, "P"], [0xEE69, "b"], [0xEE8D, "0"],
    [0xEEA1, "X"], [0xEEBB, "F"], [0xEEC1, "I"], [0xEECC, "B"],
    [0xEECF, "c"], [0xEEDA, "1"], [0xEEDB, "D"], [0xEEE3, "G"],
    [0xEF1F, "8"], [0xEF26, "K"], [0xEF35, "x"], [0xEF37, "6"],
    [0xEF3A, "d"], [0xEF57, "H"], [0xEF5A, "U"], [0xEF61, "G"],
    [0xEF91, "8"], [0xEF94, "T"], [0xEFC8, "m"], [0xEFD4, "1"],
    [0xEFD7, "Z"], [0xEFDA, "h"], [0xEFEE, "3"], [0xEFEF, "4"],
    [0xEFF6, "3"], [0xF00A, "q"], [0xF019, "T"], [0xF050, "B"],
    [0xF065, "0"], [0xF073, "7"], [0xF096, "z"], [0xF0A6, "t"],
    [0xF0BA, "r"], [0xF0BD, "M"], [0xF0C0, "g"], [0xF7A0, "0"],
    [0xF7A1, "1"], [0xF7A2, "2"], [0xF7A3, "3"], [0xF7A4, "4"],
    [0xF7A5, "5"], [0xF7A6, "6"], [0xF7A7, "7"], [0xF7A8, "8"],
    [0xF7A9, "9"], [0xF8FF, "*"]
  ];
  var mapping_dict = {};
  for (var i = 0; i < mapping_list.length; i++) {
    var code = String.fromCharCode(mapping_list[i][0]);
    mapping_dict[code] = mapping_list[i][1];
  }
  var output = "";
  for (var j = 0; j < text.length; j++) {
    var ch = text.charAt(j);
    output += mapping_dict.hasOwnProperty(ch) ? mapping_dict[ch] : ch;
  }
  return output;
}
function stvLooksLikeInterlinearHtml(text) {
  var sample = stvTrim(text);
  if (!sample) return false;
  return /<i\b[^>]*\b(?:t|v|p)\s*=\s*['"][^'"]*['"][^>]*>/i.test(sample);
}
// Lam sach HTML lien chu (<i h/t/v/p>) thanh van ban tieng Viet sach.
function stvNormalizeInterlinearChapter(rawText) {
  var text = rawText === null || typeof rawText === "undefined" ? "" : String(rawText);
  if (!text) return "";
  var marker = "__STV_I_GAP__";
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/br\s*>/gi, "\n");
  text = text.replace(/<\/i>\s*\n+\s*(?=[,.;:!?%\)\]\}\u3002\uff0c\u3001\uff01\uff1f\uff1b\uff1a\u201d\u2019\u300d\u300f\u3011\u300b])/gi, "</i>");
  text = text.replace(/<\/i>\s*<i\b/gi, "</i>" + marker + "<i");
  text = text.replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, "$1");
  text = text.replace(/<\/?(p|div|article|section|li|tr|h[1-6]|blockquote|ul|ol)[^>]*>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/[<>]/g, "");
  text = stvDecodeHtmlEntities(text);
  text = text.replace(new RegExp(marker, "g"), " ");
  text = text.replace(/(^|\n)\s*@Bạn đang đọc bản lưu trong hệ thống\s*(?=\n|$)/g, "$1");
  text = text.replace(/[\t\f\v ]+/g, " ");
  text = text.replace(/([“「『]) +/g, "$1");
  text = text.replace(/ +([,.;:!?%\)\]\}\u3002\uff0c\u3001\uff01\uff1f\uff1b\uff1a\u201d\u2019\u300d\u300f\u3011\u300b])/g, "$1");
  text = text.replace(/\n+([,.;:!?%\)\]\}\u3002\uff0c\u3001\uff01\uff1f\uff1b\uff1a\u201d\u2019\u300d\u300f\u3011\u300b])/g, "$1");
  text = text.replace(/[ ]*\n[ ]*/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = stvTrim(text);
  if (!text) return "";
  return text.replace(/\n/g, "<br>");
}
function stvNormalizeChapterHtml(host, base, rawContent, bookid, cid, defaultName) {
  var hostKey = stvTrim(host).toLowerCase();
  var text = rawContent === null || typeof rawContent === "undefined" ? "" : String(rawContent);
  if (!text) return "";
  if (hostKey === "fanqie") {
    text = text.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
    text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
    text = text.replace(/<\/?article>/gi, "");
    text = text.replace(/\sidx="\d+"/g, "");
    if (stvLooksLikeInterlinearHtml(text)) return stvNormalizeInterlinearChapter(text);
    return text;
  }
  if (hostKey === "sangtac" || hostKey === "dich") {
    text = giaiMaChuoi(text);
    if (stvLooksLikeInterlinearHtml(text)) return stvNormalizeInterlinearChapter(text);
    var isHtml = /<\w+[^>]*>/.test(text);
    if (!isHtml) {
      text = stvEscapeHtml(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n/g, "<br>");
    }
    return text;
  }
  if (!/<\w+[^>]*>/.test(text)) {
    return stvEscapeHtml(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n/g, "<br>");
  }
  if (stvLooksLikeInterlinearHtml(text)) return stvNormalizeInterlinearChapter(text);
  return text;
}

// --- Lay grant + chapterkey ---
function stvFetchGrantText(url, options) {
  try {
    if (typeof fetch !== "undefined") {
      var response = fetch(url, options || {});
      var text = "";
      if (response && typeof response.html === "function") {
        try {
          var fromHtml = stvDecodeGrantHtml(response.html());
          if (stvLooksLikeGrantScript(fromHtml)) text = fromHtml;
        } catch (e1) { text = ""; }
      }
      if (!text && response && typeof response.base64 === "function") {
        try {
          var fromBase64 = stvDecodeBase64Utf8(response.base64());
          if (stvLooksLikeGrantScript(fromBase64)) text = fromBase64;
        } catch (e2) { text = ""; }
      }
      if (!text && response && typeof response.text === "function") {
        try { text = response.text(); } catch (e3) { text = ""; }
      }
      return { ok: !!(response && response.ok), status: response ? response.status : 0, text: text, headers: response ? response.headers : null };
    }
  } catch (e4) {}
  try {
    var req = Http.get(url);
    try { req.headers((options && options.headers) || {}); } catch (e5) {}
    var t = req.string();
    return { ok: !!t, status: t ? 200 : 0, text: t || "", headers: null };
  } catch (e6) {
    return { ok: false, status: 0, text: "", headers: null, error: e6 };
  }
}

// Duong 1 (moi): chay grant ngay trong JS engine cua ext.
// Grant chi la JS thuan (kiem chung 25/11/2026): no tim window qua global,
// nen dat window/self/globalThis gia len global roi eval, xong tra lai.
// Neu engine cu khong doc duoc mui ten (()=>{) thi doi sang function() {.
function stvEvalGrantKeyInEngine(code) {
  var src = stvTrim(code);
  if (!src) return "";
  var g = null;
  try { g = (function () { return this; })(); } catch (e) { g = stvGetGlobalObject(); }
  if (!g) return "";
  var fakeWindow = { Capacitor: {}, document: { hidden: false }, navigator: { userAgent: STV_APP_UA }, UWNgB: true, app: { tcYCI: true, reader: {} } };
  fakeWindow.window = fakeWindow; fakeWindow.self = fakeWindow; fakeWindow.globalThis = fakeWindow;
  var prevWindow = g.window, prevSelf = g.self, prevGlobalThis = g.globalThis;
  var prevBtoa = g.btoa, prevEscape = g.escape;
  try {
    g.window = fakeWindow; g.self = fakeWindow; g.globalThis = fakeWindow;
    if (typeof g.btoa !== "function") g.btoa = stvBtoaFallback;
    if (typeof g.escape !== "function") g.escape = function (s) { return encodeURIComponent(String(s === null || s === undefined ? "" : s)); };
    try {
      eval(src);
    } catch (e1) {
      var code2 = src;
      if (code2.indexOf("(()=>{") === 0) code2 = "(function(){" + code2.substring(6);
      eval(code2);
    }
    var r = fakeWindow.app && fakeWindow.app.reader;
    return String((r && (r.chapterkey || r.chapterKey || r.key)) || "").trim();
  } catch (e2) {
    return "";
  } finally {
    try { g.window = prevWindow; } catch (e3) {}
    try { g.self = prevSelf; } catch (e4) {}
    try { g.globalThis = prevGlobalThis; } catch (e5) {}
    try { g.btoa = prevBtoa; } catch (e6) {}
    try { g.escape = prevEscape; } catch (e7) {}
  }
}

// --- Duong 2 (du phong): chay grant trong trinh duyet cua vBook ---
function stvBrowserHasElement(browser, markerId) {
  if (!markerId) return true;
  if (!browser || typeof browser.callJs !== "function") return false;
  var key = "stv_browser_marker_" + Math.random().toString(36).substring(2);
  var doc = null;
  try {
    doc = browser.callJs("try{Cache.putVariable(" + stvJsString(key) + ",document.getElementById(" + stvJsString(markerId) + ")?'1':'0');}catch(_){}", 1000);
    if (typeof browser.getVariable === "function" && stvTrim(browser.getVariable(key)) === "1") return true;
  } catch (e) { doc = null; }
  try {
    var outNode = doc ? doc.select("#" + markerId).first() : null;
    return !!outNode;
  } catch (e2) { return false; }
}
function stvBrowserGetLocationHref(browser) {
  if (!browser || typeof browser.callJs !== "function") return "";
  var key = "stv_browser_href_" + Math.random().toString(36).substring(2);
  try {
    browser.callJs("try{Cache.putVariable(" + stvJsString(key) + ",String(location.href||''));}catch(_){}", 1000);
    if (typeof browser.getVariable === "function") return stvTrim(browser.getVariable(key));
  } catch (e) { return ""; }
  return "";
}
function stvBrowserReturnedText(doc) {
  if (!doc) return "";
  try {
    var body = doc.select("body").first();
    if (body) return stvTrim(body.text());
  } catch (e) {}
  try { if (typeof doc.text === "function") return stvTrim(doc.text()); } catch (e2) { return ""; }
  return "";
}
function stvDecodeBrowserReturn(text) {
  var value = stvTrim(text);
  var prefix = "__STVURI__:";
  if (value.indexOf(prefix) === 0) return stvDecode(value.substring(prefix.length));
  return value;
}
function stvBrowserLoadHtml(browser, base, html, markerId) {
  if (!browser || typeof browser.loadHtml !== "function") return false;
  try {
    browser.loadHtml(String(base || "").replace(/\/+$/, ""), html);
    if (!stvBrowserHasElement(browser, markerId)) return false;
    var href = stvBrowserGetLocationHref(browser);
    return !!href && href.indexOf("data:") !== 0 && href.indexOf("about:") !== 0;
  } catch (e) { return false; }
}
function stvReadBrowserOutput(browser, key, doc, nodeId) {
  var output = "";
  try { if (typeof browser.getVariable === "function") output = stvTrim(browser.getVariable(key)); } catch (e) { output = ""; }
  if (output) return output;
  try {
    var outNode = doc && nodeId ? doc.select("#" + nodeId).first() : null;
    output = outNode ? stvTrim(outNode.text()) : "";
  } catch (e2) { output = ""; }
  if (output) return output;
  return stvDecodeBrowserReturn(stvBrowserReturnedText(doc));
}
function stvChapterKeyWorkerSource() {
  return ""
    + "self.onmessage=function(event){"
    + "var payload=event&&event.data?event.data:{};"
    + "var code=String(payload.code||'');"
    + "var ua=String(payload.userAgent||'');"
    + "var fakeWindow={Capacitor:{},document:{hidden:false},navigator:{userAgent:ua},UWNgB:true,app:{tcYCI:true,reader:{}}};"
    + "var nativeBtoa=typeof self.btoa==='function'?self.btoa.bind(self):null;"
    + "var nativeEscape=typeof self.escape==='function'?self.escape.bind(self):null;"
    + "function fallbackBtoa(input){var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';var str=String(input==null?'':input);var output='';var index=0;while(index<str.length){var chr1=str.charCodeAt(index++)&255;var chr2=index<str.length?str.charCodeAt(index++)&255:NaN;var chr3=index<str.length?str.charCodeAt(index++)&255:NaN;var enc1=chr1>>2;var enc2=((chr1&3)<<4)|(chr2>>4);var enc3=((chr2&15)<<2)|(chr3>>6);var enc4=chr3&63;if(isNaN(chr2)){enc3=64;enc4=64;}else if(isNaN(chr3)){enc4=64;}output+=chars.charAt(enc1)+chars.charAt(enc2)+chars.charAt(enc3)+chars.charAt(enc4);}return output;}"
    + "self.window=fakeWindow;"
    + "self.globalThis=self;"
    + "self.self=self;"
    + "self.process=undefined;"
    + "self.Packages=undefined;"
    + "self.java=undefined;"
    + "self.btoa=nativeBtoa||fallbackBtoa;"
    + "self.escape=nativeEscape||function(value){return encodeURIComponent(String(value==null?'':value));};"
    + "self.console=self.console||{log:function(){},warn:function(){},error:function(){}};"
    + "var error='';var hasGetter=false;var chapterkey='';"
    + "try{(0,eval)(code);}catch(err){error=String(err&&err.message?err.message:err);}"
    + "try{var descriptor=Object.getOwnPropertyDescriptor(fakeWindow.app.reader,'chapterkey');hasGetter=!!(descriptor&&typeof descriptor.get==='function');}catch(_){}"
    + "try{chapterkey=String((fakeWindow.app&&fakeWindow.app.reader&&(fakeWindow.app.reader.chapterkey||fakeWindow.app.reader.chapterKey||fakeWindow.app.reader.key))||'').trim();}catch(readErr){var readError=String(readErr&&readErr.message?readErr.message:readErr);error=error?(error+' | read: '+readError):('read: '+readError);}"
    + "self.postMessage({chapterkey:chapterkey,hasGetter:hasGetter,error:error});"
    + "};";
}
function stvWorkerChapterKeyScript(outKey, code) {
  return ""
    + "(function(){"
    + "var __outKey=" + stvJsString(outKey) + ";"
    + "var __code=" + stvJsString(code) + ";"
    + "var __src=" + stvJsString(stvChapterKeyWorkerSource()) + ";"
    + "function __finish(value){var out=String(value||'');try{Cache.putVariable(__outKey,out);}catch(_){}try{document.getElementById('stv_chapterkey_out').innerText=out;}catch(_){}return out;}"
    + "try{"
    + "if(typeof Worker!=='function'||typeof Blob!=='function'||typeof URL==='undefined'||!URL||typeof URL.createObjectURL!=='function')return '__STVURI__:'+encodeURIComponent(__finish('__ERR__:Worker không khả dụng'));"
    + "var __url=URL.createObjectURL(new Blob([__src],{type:'text/javascript'}));"
    + "var __worker=new Worker(__url);"
    + "var __done=false;"
    + "var __timer=null;"
    + "function __cleanup(){try{if(__timer)clearTimeout(__timer);}catch(_){}try{__worker.terminate();}catch(_){}try{URL.revokeObjectURL(__url);}catch(_){}}"
    + "function __doneWith(out){if(__done)return;__done=true;__cleanup();__finish(out);}"
    + "__worker.onmessage=function(event){var data=event&&event.data?event.data:{};var key=String(data.chapterkey||'').trim();if(key)__doneWith('__KEY__:'+key);else __doneWith('__ERR__:'+(data.error||((data.hasGetter?'Có getter chapterkey nhưng rỗng':'Worker không sinh chapterkey'))));};"
    + "__worker.onerror=function(event){__doneWith('__ERR__:Worker lỗi '+String(event&&event.message||''));};"
    + "__timer=setTimeout(function(){__doneWith('__ERR__:Worker timeout');},12000);"
    + "__worker.postMessage({code:__code,userAgent:" + stvJsString(STV_APP_UA) + "});"
    + "__finish('__PENDING__:worker');"
    + "return '__STVURI__:'+encodeURIComponent('__PENDING__:worker');"
    + "}catch(e){return '__STVURI__:'+encodeURIComponent(__finish('__ERR__:'+String(e&&e.message?e.message:e)));}"
    + "})()";
}
function stvPollBrowserOutput(browser, outKey, doc, nodeId, maxPolls) {
  var output = stvReadBrowserOutput(browser, outKey, doc, nodeId);
  for (var i = 0; i < maxPolls && (!output || output.indexOf("__PENDING__:") === 0); i++) {
    var waitUntil = new Date().getTime() + 120;
    while (new Date().getTime() < waitUntil) {}
    try {
      doc = browser.callJs("document.getElementById(" + stvJsString(nodeId) + ")?document.getElementById(" + stvJsString(nodeId) + ").innerText:''", 1000);
    } catch (e) {}
    output = stvReadBrowserOutput(browser, outKey, doc, nodeId);
  }
  return output;
}
function stvDirectChapterKeyScript(outKey, code) {
  return "var __root=window;"
    + "try{__root=Function('return this')()||window;}catch(__rootErr){__root=window;}"
    + "try{window.globalThis=window.globalThis||window;}catch(_){}"
    + "try{window.self=window.self||window;}catch(_){}"
    + "window.Capacitor=window.Capacitor||{};"
    + "window.UWNgB=true;"
    + "window.document=window.document||{}; window.document.hidden=false;"
    + "window.navigator=window.navigator||{};"
    + "window.app=window.app||{}; window.app.tcYCI=true; window.app.reader=window.app.reader||{};"
    + "try{globalThis.app=window.app;globalThis.Capacitor=window.Capacitor;globalThis.UWNgB=true;globalThis.document=window.document;globalThis.navigator=window.navigator;}catch(_){}"
    + "try{self.app=window.app;self.Capacitor=window.Capacitor;self.UWNgB=true;self.document=window.document;self.navigator=window.navigator;}catch(_){}"
    + "try{__root.app=window.app;__root.Capacitor=window.Capacitor;__root.UWNgB=true;__root.document=window.document;__root.navigator=window.navigator;}catch(_){}"
    + "if(typeof window.btoa!=='function'){window.btoa=function(input){var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';var str=String(input);var out='';var i=0;while(i<str.length){var c1=str.charCodeAt(i++)&255;var c2=i<str.length?str.charCodeAt(i++):NaN;var c3=i<str.length?str.charCodeAt(i++):NaN;var e1=c1>>2;var e2=((c1&3)<<4)|(isNaN(c2)?0:(c2>>4));var e3=isNaN(c2)?64:(((c2&15)<<2)|(isNaN(c3)?0:(c3>>6)));var e4=isNaN(c3)?64:(c3&63);out+=chars.charAt(e1)+chars.charAt(e2)+chars.charAt(e3)+chars.charAt(e4);}return out;};}"
    + "if(typeof window.atob!=='function'){window.atob=function(input){var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';var str=String(input).replace(/[^A-Za-z0-9\\+\\/\\=]/g,'');var out='';var i=0;while(i<str.length){var e1=chars.indexOf(str.charAt(i++));var e2=chars.indexOf(str.charAt(i++));var e3=chars.indexOf(str.charAt(i++));var e4=chars.indexOf(str.charAt(i++));if(e1<0||e2<0)continue;var c1=(e1<<2)|(e2>>4);var c2=((e2&15)<<4)|(e3>>2);var c3=((e3&3)<<6)|e4;out+=String.fromCharCode(c1);if(e3!==64&&e3>=0)out+=String.fromCharCode(c2);if(e4!==64&&e4>=0)out+=String.fromCharCode(c3);}return out;};}"
    + "var __err='';"
    + "try{eval(" + JSON.stringify(code) + ");}"
    + "catch(e){__err=String(e&&e.message?e.message:e);};"
    + "var __k='';"
    + "function __readK(o){try{return String((o&&o.app&&o.app.reader&&(o.app.reader.chapterkey||o.app.reader.chapterKey||o.app.reader.key))||'');}catch(_){return '';}}"
    + "try{__k=__readK(window)||__readK(typeof globalThis!=='undefined'?globalThis:null)||__readK(typeof self!=='undefined'?self:null)||__readK(__root);}"
    + "catch(e2){__err=__err+'|read:'+String(e2&&e2.message?e2.message:e2);}"
    + "var __out=(__k?('__KEY__:'+__k):('__ERR__:'+__err));"
    + "try{Cache.putVariable(" + stvJsString(outKey) + ",__out);}catch(_){}"
    + "try{document.getElementById('stv_chapterkey_out').innerText=__out;}catch(_){}"
    + "'__STVURI__:'+encodeURIComponent(__out);";
}
function stvRunDirectChapterKey(browser, outKey, code) {
  try {
    var doc = browser.callJs(stvDirectChapterKeyScript(outKey, code), 20000);
    return stvReadBrowserOutput(browser, outKey, doc, "stv_chapterkey_out");
  } catch (e) {
    return "__ERR__:" + stvTrim(e && e.message ? e.message : e);
  }
}
function stvRunWorkerChapterKey(browser, outKey, code) {
  var doc = null;
  var callError = "";
  try {
    doc = browser.callJs(stvWorkerChapterKeyScript(outKey, code), 1500);
  } catch (e) {
    callError = stvTrim(e && e.message ? e.message : e);
  }
  var output = stvPollBrowserOutput(browser, outKey, doc, "stv_chapterkey_out", 30);
  if (output) return output;
  return "__ERR__:" + callError;
}
function stvExtractChapterKeyByBrowser(base, grantBody) {
  var code = stvTrim(grantBody);
  if (!code) return { chapterkey: "", error: "" };
  if (typeof Engine === "undefined" || !Engine || typeof Engine.newBrowser !== "function") {
    return { chapterkey: "", error: "Engine.newBrowser không khả dụng" };
  }
  var browser = null;
  try {
    browser = Engine.newBrowser();
    if (!browser || typeof browser.loadHtml !== "function" || typeof browser.callJs !== "function") {
      return { chapterkey: "", error: "Browser API không khả dụng" };
    }
    if (typeof browser.setUserAgent === "function") browser.setUserAgent(STV_APP_UA);
    var shell = "<html><head><meta charset='utf-8'></head><body><pre id='stv_chapterkey_out'></pre></body></html>";
    if (!stvBrowserLoadHtml(browser, base, shell, "stv_chapterkey_out")) {
      return { chapterkey: "", error: "Browser không dựng được HTML" };
    }
    var outKey = "stv_chapterkey_" + Math.random().toString(36).substring(2);
    var output = stvRunWorkerChapterKey(browser, outKey, code);
    var workerError = "";
    if (output.indexOf("__KEY__:") === 0) return { chapterkey: stvTrim(output.substring(8)), error: "" };
    if (output.indexOf("__ERR__:") === 0) workerError = stvTrim(output.substring(8));
    output = stvRunDirectChapterKey(browser, outKey, code);
    if (output.indexOf("__KEY__:") === 0) return { chapterkey: stvTrim(output.substring(8)), error: "" };
    if (output.indexOf("__ERR__:") === 0) return { chapterkey: "", error: stvTrim(workerError || output.substring(8)) };
    return { chapterkey: "", error: stvTrim(workerError || output) };
  } catch (e) {
    return { chapterkey: "", error: stvTrim(e && e.message ? e.message : e) };
  } finally {
    try { if (browser && typeof browser.close === "function") browser.close(); } catch (e2) {}
  }
}

// --- Grant + readchapter ---
function stvGrantContext(base, host, bookid) {
  var path = "/io/grantcontext/context?hostid=" + stvEncode(host) + "&bookid=" + stvEncode(bookid);
  var url = String(base).replace(/\/+$/, "") + path;
  var referer = stvBuildBookUrl(base, host, bookid, 1);
  var result = stvFetchGrantText(url, { method: "GET", headers: stvAppHeaders({ "Referer": referer, "Cookie": "mac_tt=true" }) });
  if (!result.ok || !result.text) {
    return { chapterkey: "", readcontextid: "", grantErr: "Không tải được grantcontext." };
  }
  var chapterkey = stvEvalGrantKeyInEngine(result.text);
  var grantErr = "";
  if (!chapterkey) {
    var browserResult = stvExtractChapterKeyByBrowser(base, result.text);
    chapterkey = stvTrim(browserResult.chapterkey);
    grantErr = stvTrim(browserResult.error);
  }
  var readcontextid = stvFindReadContextId(stvExtractSetCookie(result.headers));
  return { chapterkey: chapterkey, readcontextid: readcontextid, grantErr: grantErr };
}
function stvFetchJsonText(url, headers) {
  try {
    if (typeof fetch !== "undefined") {
      var res = fetch(url, { method: "GET", headers: headers });
      if (res && res.ok && typeof res.text === "function") {
        var t = res.text();
        if (t) return t;
      }
    }
  } catch (e) {}
  try {
    var req = Http.get(url);
    try { req.headers(headers); } catch (e2) {}
    return req.string();
  } catch (e3) { return ""; }
}
function stvReadChapter(base, payload, grant) {
  if (!grant || !grant.chapterkey) return null;
  var params = { sajax: "readchapter", h: payload.host, bookid: payload.bookid, c: payload.cid, key: grant.chapterkey };
  var sorted = stvSortQuery(params);
  var sign = stvMd5Hex(sorted + STV_SIGN_SALT);
  if (!sign) return null;
  var url = String(base).replace(/\/+$/, "")
    + "/?sajax=readchapter"
    + "&h=" + stvEncode(payload.host)
    + "&bookid=" + stvEncode(payload.bookid)
    + "&c=" + stvEncode(payload.cid)
    + "&key=" + stvEncode(grant.chapterkey);
  var cookieParts = [];
  if (grant.readcontextid) cookieParts.push("readcontextid=" + grant.readcontextid);
  cookieParts.push("mac_tt=true");
  var headers = stvAppHeaders({ "x-stv-sign": sign, "Referer": stvBuildBookUrl(base, payload.host, payload.bookid, 1), "Cookie": cookieParts.join("; ") });
  var text = stvFetchJsonText(url, headers);
  return parseJsonLoose(text);
}
