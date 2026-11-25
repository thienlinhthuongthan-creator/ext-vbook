load("config.js");

// The loai STV day du (v8) - 5 nguon lon + the loai core + TOAN BO tag,
// da loc tag rac. Tag lay tu /searchfaceted.json (98 nguon).
// Kiem chung 25/11/2026: faceted co 3.514 muc the loai, gom 1.880 tag;
// mot so tag la manh vun cua the loai that bi tach ra (vd nguon faloo co
// ca "do thi ngon tinh" lan "do", "thi", "ngon", "tinh"; co ca tag chua
// ma HTML nhu "cap nhat lan cuoi: <font color="red">2018").
// Loc: tag chua HTML, tag <= 2 ky tu, tag 1 chu la manh vun cua tag dai
// hon co nhieu truyen gap 3 lan tro len (tru "anime"), + danh sach den
// cu the (tieu, thuyet, qua qua, dong dong, lon nu chinh, thanh cong hoc,
// ao vai sinh hoat, tro ve, ky duyen, roman, lam lam, ao lot van).
// Sau loc con ~1.731 tag. Mang hong thi tra 10 the loai core.
var STV_MAJOR_HOSTS = [
  { key: "fanqie", title: "Fanqie" },
  { key: "qidian", title: "Qidian" },
  { key: "jjwxc", title: "JJWXC" },
  { key: "faloo", title: "Faloo" },
  { key: "ciweimao", title: "Ciweimao" }
];
var STV_CORE_CATEGORIES = [
  { title: "Huyền huyễn", code: "hh" },
  { title: "Đô thị", code: "dt" },
  { title: "Ngôn tình", code: "nt" },
  { title: "Võng du", code: "vd" },
  { title: "Khoa học viễn tưởng", code: "kh" },
  { title: "Lịch sử", code: "ls" },
  { title: "Đồng nhân", code: "dn" },
  { title: "Dị năng", code: "dna" },
  { title: "Linh dị", code: "ld" },
  { title: "Light Novel", code: "ln" }
];

var GENRE_DROP = { "tiểu": true, "thuyết": true, "qua qua": true, "động động": true, "lớn nữ chính": true, "thành công học": true, "áo vải sinh hoạt": true, "trở về": true, "kỳ duyên": true, "roman": true, "làm làm": true, "áo lót văn": true, "mary": true, "ngũ": true, "thập": true, "khácấm áp": true, "lần thứ 2 người mới thưởng": true, "sáng tạo nghĩ chuyện tình 2nd": true, "dị giới2018 nhẹ chi kho sách sáng tạo nghĩ chuyện tình đại thưởng 1st": true, "nam sinh bảng truyện mới no.76": true };
var GENRE_KEEP = { "anime": true };
var GENRE_KEEP_X2 = { "cường cường": true, "tỷ tỷ": true, "ca ca": true, "bảo bảo": true, "bá bá": true, "ma ma": true };
function genreHasCjk(text) {
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if (code >= 0x4E00 && code <= 0x9FFF) return true;
  }
  return false;
}
function genreCountChar(text, ch) {
  var n = 0;
  for (var i = 0; i < text.length; i++) if (text.charAt(i) === ch) n++;
  return n;
}
function genreIsJunkTag(name, count, maxLongerCount) {
  var lower = name.toLowerCase();
  if (GENRE_DROP[lower]) return true;
  if (name.indexOf("<") !== -1 || name.indexOf(">") !== -1 || name.indexOf("&") !== -1 || lower.indexOf("font") !== -1 || lower.indexOf("color=") !== -1) return true;
  if (name.length <= 2) return true;
  if (genreHasCjk(name)) return true;
  if (genreCountChar(name, "(") !== genreCountChar(name, ")")) return true;
  var last = name.charAt(name.length - 1);
  if (last === ":" || last === "•" || last === "″") return true;
  var words = lower.split(/\s+/);
  if (words.length >= 1 && words[0].length === 1 && words[0] !== "y" && words[0] !== "ý" && words[0] !== "n") return true;
  if (words.length === 2 && words[0] === words[1] && !GENRE_KEEP_X2[lower]) return true;
  if (GENRE_KEEP[lower]) return false;
  if (words.length === 1 && (maxLongerCount[lower] || 0) >= 3 * count) return true;
  return false;
}

var GENRE_DIACRITICS = { "à": "a", "á": "a", "ạ": "a", "ả": "a", "ã": "a", "â": "a", "ầ": "a", "ấ": "a", "ậ": "a", "ẩ": "a", "ẫ": "a", "ă": "a", "ằ": "a", "ắ": "a", "ặ": "a", "ẳ": "a", "ẵ": "a", "è": "e", "é": "e", "ẹ": "e", "ẻ": "e", "ẽ": "e", "ê": "e", "ề": "e", "ế": "e", "ệ": "e", "ể": "e", "ễ": "e", "ì": "i", "í": "i", "ị": "i", "ỉ": "i", "ĩ": "i", "ò": "o", "ó": "o", "ọ": "o", "ỏ": "o", "õ": "o", "ô": "o", "ồ": "o", "ố": "o", "ộ": "o", "ổ": "o", "ỗ": "o", "ơ": "o", "ờ": "o", "ớ": "o", "ợ": "o", "ở": "o", "ỡ": "o", "ù": "u", "ú": "u", "ụ": "u", "ủ": "u", "ũ": "u", "ư": "u", "ừ": "u", "ứ": "u", "ự": "u", "ử": "u", "ữ": "u", "ỳ": "y", "ý": "y", "ỵ": "y", "ỷ": "y", "ỹ": "y", "đ": "d" };
function genreSlug(text) {
  var s = clean(String(text || "")).toLowerCase();
  var out = "";
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    out += GENRE_DIACRITICS[ch] || ch;
  }
  out = out.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
  return out;
}
function genreFetchText(url) {
  try {
    if (typeof fetch !== "undefined") {
      var res = fetch(url, { method: "GET", headers: stvAppHeaders() });
      if (res && res.ok && typeof res.text === "function") {
        var t = res.text();
        if (t) return t;
      }
    }
  } catch (e) {}
  try {
    var req = Http.get(url);
    try { req.headers(stvAppHeaders()); } catch (e2) {}
    return req.string();
  } catch (e3) { return ""; }
}
function genreLoadFaceted() {
  for (var i = 0; i < STV_BASES.length; i++) {
    var text = genreFetchText(STV_BASES[i] + "/searchfaceted.json");
    var json = parseJsonLoose(text);
    if (json && typeof json === "object") {
      var hasHost = false;
      for (var k in json) { if (json.hasOwnProperty(k)) { hasHost = true; break; } }
      if (hasHost) return json;
    }
  }
  return null;
}
function genreCoreItems() {
  var out = [];
  for (var i = 0; i < STV_CORE_CATEGORIES.length; i++) {
    out.push({ title: STV_CORE_CATEGORIES[i].title, input: "?find=&minc=0&category=" + STV_CORE_CATEGORIES[i].code + "&tag=", script: "genrecontent.js" });
  }
  return out;
}

function execute() {
  var out = [];
  var seen = {};
  function push(key, title, input) {
    if (!key || seen[key]) return;
    seen[key] = true;
    out.push({ title: title, input: input, script: "genrecontent.js" });
  }
  var faceted = null;
  try { faceted = genreLoadFaceted(); } catch (e) { faceted = null; }
  if (!faceted) return Response.success(genreCoreItems());

  // Nguon lon: 3 muc sap xep moi nguon.
  for (var m = 0; m < STV_MAJOR_HOSTS.length; m++) {
    var major = STV_MAJOR_HOSTS[m];
    push("src:" + major.key + ":update", major.title + " · Mới cập nhật", "?find=&minc=50&host=" + major.key + "&sort=update&tag=");
    push("src:" + major.key + ":viewweek", major.title + " · Đọc tuần", "?find=&minc=50&host=" + major.key + "&sort=viewweek&tag=");
    push("src:" + major.key + ":viewday", major.title + " · Đọc ngày", "?find=&minc=50&host=" + major.key + "&sort=viewday&tag=");
  }

  // The loai core.
  for (var c = 0; c < STV_CORE_CATEGORIES.length; c++) {
    var core = STV_CORE_CATEGORIES[c];
    push("cate-core:" + core.code, core.title, "?find=&minc=0&category=" + core.code + "&tag=");
    var coreSlug = genreSlug(core.title);
    if (coreSlug) seen["cate-tag:" + coreSlug] = true;
  }

  // TOAN BO tag (da loc rac): gop so truyen theo ten tag (khong phan biet
  // hoa/thuong), sap xep theo tong so truyen giam dan.
  var aggregate = {};
  for (var fh in faceted) {
    if (!faceted.hasOwnProperty(fh)) continue;
    var entry = faceted[fh];
    var catMap = entry && entry.category && typeof entry.category === "object" ? entry.category : {};
    for (var catName in catMap) {
      if (!catMap.hasOwnProperty(catName)) continue;
      var name = clean(catName);
      if (!name) continue;
      var key = name.toLowerCase();
      var count = parseInt(catMap[catName], 10);
      if (isNaN(count) || count < 0) count = 0;
      if (!aggregate[key]) aggregate[key] = { name: name, count: 0 };
      aggregate[key].count += count;
    }
  }
  var tags = [];
  for (var tk in aggregate) { if (aggregate.hasOwnProperty(tk)) tags.push(aggregate[tk]); }
  tags.sort(function (x, y) {
    if (x.count !== y.count) return y.count - x.count;
    var xn = x.name.toLowerCase(), yn = y.name.toLowerCase();
    if (xn < yn) return -1;
    if (xn > yn) return 1;
    return 0;
  });
  // Voi moi tu don, so truyen lon nhat cua tag dai hon co chua tu do
  // (de phat hien manh vun nhu "do" trong "do thi ngon tinh").
  var maxLongerCount = {};
  for (var mi = 0; mi < tags.length; mi++) {
    var mwords = tags[mi].name.toLowerCase().split(/\s+/);
    if (mwords.length <= 1) continue;
    for (var mw = 0; mw < mwords.length; mw++) {
      var w = mwords[mw];
      if (!w) continue;
      if (tags[mi].count > (maxLongerCount[w] || 0)) maxLongerCount[w] = tags[mi].count;
    }
  }
  for (var t = 0; t < tags.length; t++) {
    if (genreIsJunkTag(tags[t].name, tags[t].count, maxLongerCount)) continue;
    var slug = genreSlug(tags[t].name);
    if (!slug) continue;
    push("cate-tag:" + slug, tags[t].name, "?find=&minc=50&tag=" + encodeURIComponent(slug) + "&sort=update");
  }
  return Response.success(out);
}
