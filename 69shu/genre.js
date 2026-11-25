load("config.js");

function execute() {
  return Response.success([
    { title: "玄幻魔法·连载", input: BASE_URL + "/novels/monthvisit_1_2_1.htm", script: "genrecontent.js" },
    { title: "修真武侠·连载", input: BASE_URL + "/novels/monthvisit_2_2_1.htm", script: "genrecontent.js" },
    { title: "言情小说·连载", input: BASE_URL + "/novels/monthvisit_3_2_1.htm", script: "genrecontent.js" },
    { title: "历史军事·连载", input: BASE_URL + "/novels/monthvisit_4_2_1.htm", script: "genrecontent.js" },
    { title: "游戏竞技·连载", input: BASE_URL + "/novels/monthvisit_5_2_1.htm", script: "genrecontent.js" },
    { title: "科幻空间·连载", input: BASE_URL + "/novels/monthvisit_6_2_1.htm", script: "genrecontent.js" },
    { title: "悬疑惊悚·连载", input: BASE_URL + "/novels/monthvisit_7_2_1.htm", script: "genrecontent.js" },
    { title: "同人小说·连载", input: BASE_URL + "/novels/monthvisit_8_2_1.htm", script: "genrecontent.js" },
    { title: "都市小说·连载", input: BASE_URL + "/novels/monthvisit_9_2_1.htm", script: "genrecontent.js" },
    { title: "官场职场·连载", input: BASE_URL + "/novels/monthvisit_10_2_1.htm", script: "genrecontent.js" },
    { title: "穿越时空·连载", input: BASE_URL + "/novels/monthvisit_11_2_1.htm", script: "genrecontent.js" },
    { title: "青春校园·连载", input: BASE_URL + "/novels/monthvisit_12_2_1.htm", script: "genrecontent.js" },
    { title: "玄幻魔法·全本", input: BASE_URL + "/novels/monthvisit_1_1_1.htm", script: "genrecontent.js" },
    { title: "修真武侠·全本", input: BASE_URL + "/novels/monthvisit_2_1_1.htm", script: "genrecontent.js" },
    { title: "言情小说·全本", input: BASE_URL + "/novels/monthvisit_3_1_1.htm", script: "genrecontent.js" },
    { title: "历史军事·全本", input: BASE_URL + "/novels/monthvisit_4_1_1.htm", script: "genrecontent.js" },
    { title: "游戏竞技·全本", input: BASE_URL + "/novels/monthvisit_5_1_1.htm", script: "genrecontent.js" },
    { title: "科幻空间·全本", input: BASE_URL + "/novels/monthvisit_6_1_1.htm", script: "genrecontent.js" },
    { title: "悬疑惊悚·全本", input: BASE_URL + "/novels/monthvisit_7_1_1.htm", script: "genrecontent.js" },
    { title: "同人小说·全本", input: BASE_URL + "/novels/monthvisit_8_1_1.htm", script: "genrecontent.js" },
    { title: "都市小说·全本", input: BASE_URL + "/novels/monthvisit_9_1_1.htm", script: "genrecontent.js" },
    { title: "官场职场·全本", input: BASE_URL + "/novels/monthvisit_10_1_1.htm", script: "genrecontent.js" },
    { title: "穿越时空·全本", input: BASE_URL + "/novels/monthvisit_11_1_1.htm", script: "genrecontent.js" },
    { title: "青春校园·全本", input: BASE_URL + "/novels/monthvisit_12_1_1.htm", script: "genrecontent.js" }
  ]);
}
