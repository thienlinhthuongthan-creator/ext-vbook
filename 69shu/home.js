load("config.js");

function execute() {
  return Response.success([
    { title: "最近更新", input: BASE_URL + "/novels/weekvisit_0_0_1.htm", script: "homecontent.js" },
    { title: "全部小说", input: BASE_URL + "/novels/monthvisit_0_0_1.htm", script: "homecontent.js" },
    { title: "完本小说", input: BASE_URL + "/novels/monthvisit_0_1_1.htm", script: "homecontent.js" },
    { title: "女生小说", input: BASE_URL + "/novels/female", script: "homecontent.js" },
    { title: "男生小说", input: BASE_URL + "/novels/male", script: "homecontent.js" },
    { title: "排行 - 月点击", input: BASE_URL + "/novels/monthvisit_0_2_1.htm", script: "homecontent.js" },
    { title: "排行 - 总推荐", input: BASE_URL + "/novels/allvote_0_2_1.htm", script: "homecontent.js" }
  ]);
}
