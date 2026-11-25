// Ext Fanqie (番茄小说) v1 - 25/11/2026.
// API hoc tu ext "[Fanqie] Ca Chua C2" v6 cua kychi (kychitoge/vbook-ext,
// extensions/chinese_novel/kychi-cachua-c2) - da doc code goc (khong ma hoa)
// va kiem chung live tung endpoint ngay 25/11/2026:
// - Trang chu / the loai: API chinh thuc fanqienovel.com
//   /api/author/library/book_list/v0/ (20 sach/trang, code 0) va
//   /api/author/book/category_list/v0/ (260 the loai: 主分类 36, 主题 45,
//   角色 52, 情节 127).
// - Tim kiem / chi tiet / muc luc / chuong: mirror gofq.52dns.cc
//   /search, /detail, /catalog, /content (code 0). Da kiem chung voi
//   truyen that: 北派盗墓笔记 (book 6985246250434038815, 1856 chuong,
//   chuong 1 "第1章 离家" doc duoc sach).
// - Ten sach / the loai tu API chinh thuc bi ma hoa font (ky tu vung
//   rieng U+E378-U+E59B) - decodeText() duoi day giai ma dung (da kiem
//   chung: "觉醒：EX级法师，开局无限火力", "北派盗墓笔记"...).
// Luu y: mirror gofq.52dns.cc la dich vu ben thu ba (proxy), khong phai
// cua Fanqie; neu no chet thi tim kiem/chi tiet/muc luc/chuong se hong,
// con trang chu/the loai (API chinh thuc) van chay.
var FANQIE_URL = "https://fanqienovel.com";
var MIRROR_URL = "https://gofq.52dns.cc";
var BASE_UA = "Mozilla/5.0 (Linux; U; Android 13; zh-Hans-CN; PFJM10 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.4896.58 Quark/6.13.6.581 Mobile Safari/537.36";

// Loc gioi tinh: -1 = Tat ca, 1 = Truyen nam, 0 = Truyen nu.
// (Giong ext C2 cua kychi; chi thich co cai nay trong cai dat.)
var GENDER = -1;
try {
  if (typeof CONFIG_GENDER !== "undefined" && CONFIG_GENDER !== "") {
    var _g = parseInt(CONFIG_GENDER, 10);
    if (!isNaN(_g)) GENDER = _g;
  }
} catch (e) {}

// Chi hien nhom the loai chinh (主分类) hay toan bo (them 主题/角色/情节).
var MAIN_GENRE_ONLY = true;
try {
  if (typeof CONFIG_MAIN_GENRE_ONLY !== "undefined" && CONFIG_MAIN_GENRE_ONLY !== "") {
    MAIN_GENRE_ONLY = (String(CONFIG_MAIN_GENRE_ONLY) !== "false");
  }
} catch (e) {}

// Trich book_id tu URL fanqienovel.com/page/<id> hoac chuoi so dai.
function getBookId(url) {
  if (!url) return "";
  var s = String(url);
  var m = s.match(/page\/(\d{10,})/) || s.match(/book_id=(\d{10,})/) || s.match(/(\d{10,})/);
  return m ? m[1] : "";
}

// Link chuan cho mot cuon sach.
function bookLink(bookId) {
  return FANQIE_URL + "/page/" + String(bookId);
}

function cleanText(text) {
  if (text === undefined || text === null) return "";
  return String(text).replace(/[\r\n]+/g, "\n").replace(/[ \t]+/g, " ").trim();
}

function normalizeUrl(url) {
  if (!url) return "";
  return String(url).trim();
}

// JSON.parse chiu duoc BOM / tien to rac truoc "{".
function parseJsonLoose(text) {
  if (!text) return null;
  var s = String(text).replace(/^\uFEFF/, "");
  var i = s.indexOf("{");
  if (i > 0) s = s.substring(i);
  s = cleanText(s);
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) { return null; }
}

function fanqieHeaders(extra) {
  var h = {
    "User-Agent": BASE_UA,
    "Accept": "application/json, text/html, */*",
    "Accept-Language": "zh-CN,zh;q=0.9"
  };
  if (extra) {
    for (var k in extra) { if (extra.hasOwnProperty(k)) h[k] = extra[k]; }
  }
  return h;
}

// Lay chuoi JSON qua fetch (giong ext C2 cua kychi - da chay tren may chi).
function fetchPage(url, options) {
  if (!options) options = {};
  var headers = fanqieHeaders();
  if (options.headers) {
    for (var k in options.headers) {
      if (options.headers.hasOwnProperty(k)) headers[k] = options.headers[k];
    }
  }
  options.headers = headers;
  if (!options.hasOwnProperty("timeout")) options.timeout = 15000;
  return fetch(url, options);
}

function SafeJson(response) {
  if (!response) return null;
  try {
    if (typeof response.json === "function") return response.json();
    if (typeof response.text === "function") return parseJsonLoose(response.text());
    if (typeof response.string === "function") return parseJsonLoose(response.string());
    return parseJsonLoose(response);
  } catch (e) { return null; }
}

function fetchJson(url) {
  return SafeJson(fetchPage(url, { timeout: 15000 }));
}

// Giai ma font cua Fanqie: ky tu vung rieng U+E378-U+E59B (58344-58715)
// anh xa qua bang charset. Bang nay lay tu ext C2 cua kychi, da kiem
// chung giai ma dung voi du lieu that ngay 25/11/2026.
function decodeText(text) {
    if (!text) return "";
    var str = String(text);
    var CODE_ST = 58344, CODE_ED = 58715;
    var charset = ["体","y","十","现","快","便","话","却","月","物","水","的","放","知","爱","万","","表","风","理","O","老","也","p","常","克","平","几","最","主","她","s","将","法","情","o","光","a","我","呢","J","员","太","每","望","受","教","w","利","军","已","U","人","如","变","得","要","少","斯","门","电","m","男","没","A","K","国","时","中","走","么","何","口","小","向","问","轻","T","d","神","下","间","车","f","G","度","D","又","大","面","远","就","写","j","给","通","起","实","E","","它","去","S","到","道","数","吃","们","加","P","是","无","把","事","西","多","界","","发","新","外","活","解","孩","只","作","前","Y","尔","经","","u","心","告","父","等","Q","民","全","这","9","果","安","","i","母","8","r","说","任","先","和","地","C","张","战","场","g","像","c","q","你","使","","样","总","目","x","性","处","音","头","","应","乐","关","能","花","l","当","名","手","4","重","字","声","力","友","然","生","代","内","里","本","回","真","入","师","象","","0","点","R","亲","V","种","动","英","命","Z","h","X","做","特","边","高","有","B","为","期","自","年","马","认","出","接","至","H","正","方","感","所","明","者","棱","F","住","学","还","分","意","更","其","n","但","比","觉","以","由","死","家","让","失","士","L","2","I","金","叫","身","报","听","W","再","原","山","海","白","很","见","5","直","位","第","工","个","开","岁","好","用","都","于","可","同","3","次","四","","日","信","与","女","笑","满","并","部","什","不","从","或","机","此","","了","记","三","e","些","b","N","夫","会","才","儿","眼","两","美","被","一","公","来","立","z","长","对","己","看","k","许","因","相","色","后","往","打","结","格","过","世","气","7","子","条","在","书","之","定","v","拉","成","进","带","着","东","上","想","天","他","妈","1","文","而","路","那","别","德","6","M","t","行","候","难"];
    var result = [];
    for (var i = 0; i < str.length; i++) {
        var cc = str.charCodeAt(i);
        if (cc >= CODE_ST && cc <= CODE_ED) {
            var bias = cc - CODE_ST;
            result.push((bias >= 0 && bias < charset.length && charset[bias]) ? charset[bias] : str.charAt(i));
        } else {
            result.push(str.charAt(i));
        }
    }
    return result.join("");
}
