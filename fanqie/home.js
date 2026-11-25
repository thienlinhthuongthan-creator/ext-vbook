load("config.js");

// Trang chu: 4 tab tu API thu vien chinh thuc cua Fanqie.
// sort: 0 = hot, 1 = moi nhat, 2 = nhieu chu; creation_status: -1 = tat ca,
// 0 = da hoan; word_count: 3 = dai (>= 100 van chu). gender lay tu cai dat
// (CONFIG_GENDER: -1 tat ca, 1 nam, 0 nu).
function execute() {
  var g = String(GENDER);
  var base = FANQIE_URL + "/api/author/library/book_list/v0/?page_count=20&creation_status=-1&word_count=-1&book_type=-1&gender=" + g + "&category_id=-1";
  return Response.success([
    { title: "热门推荐", input: base + "&sort=0&page_index={{page}}", script: "gen.js" },
    { title: "新书速递", input: base + "&sort=1&page_index={{page}}", script: "gen.js" },
    { title: "完结精选", input: FANQIE_URL + "/api/author/library/book_list/v0/?page_count=20&creation_status=0&word_count=-1&book_type=-1&sort=0&gender=" + g + "&category_id=-1&page_index={{page}}", script: "gen.js" },
    { title: "长篇巨著", input: FANQIE_URL + "/api/author/library/book_list/v0/?page_count=20&creation_status=-1&word_count=3&book_type=-1&sort=2&gender=" + g + "&category_id=-1&page_index={{page}}", script: "gen.js" }
  ]);
}
