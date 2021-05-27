let observer = null;

const addPostBtnStyle = {
  color: "#fdf6e3",
  backgroundColor: "#002b36",
  border: "medium ridge #073642",
  fontSize: "small",
  boxShadow: "1px 1px 2px 0px #000",
  cursor: "pointer",
  margin: "0 3px 0 0",
  padding: "0 3px 0 3px",
  textAlign: "centre"
};
const addPostBtnSuccessStyle = {
  color: "#859900",
  border: "medium ridge #859900"
};
const addPostBtnFailStyle = {
  color: "#dc322f",
  border: "medium ridge #dc322f"
};
const addPostBtnNotTotalSuccessStyle = {
  color: "#b58900",
  border: "medium ridge #b58900"
};

const whichFacebookViewEnum = Object.freeze({
  NEWSFEED: 1,
  PAGE: 2
});
const postBodyPartEnum = Object.freeze({
  TEXT: 1,
  BLOCKQUOTE: 2,
  OTHER_FB_POST: 3,
  OWN_CONTENT: 4,
  UNKNOWN: 5
});
const reactionTypeEnum = Object.freeze({
  LIKE: { value: 1, label: "Like" },
  LOVE: { value: 2, label: "Love" },
  CARE: { value: 3, label: "Care" },
  HAHA: { value: 4, label: "Haha" },
  WOW: { value: 5, label: "Wow" },
  SAD: { value: 6, label: "Sad" },
  ANGRY: { value: 7, label: "Angry" }
});

const POST_COMMON_PARENT =
  "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div";
const ADDPOST_BTN_SIBLING =
  "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.oi732d6d.ik7dh3pa.ht8s03o8.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d9wwppkn.fe6kdd0r.mau55g9w.c8b282yb.mdeji52x.e9vueds3.j5wam9gi.knj5qynh.m9osqain.hzawbc8m[dir='auto'] > span[id^='jsc']";
const CLASS_IF_IS_OWN_CONTENT_BODY_PART = "l9j0dhe7";
const NEWSFEED = "[role='feed']";
const PAGEFEED =
  "div.dp1hu0rb.d2edcug0.taijpn5t.j83agx80.gs1a9yip > div.k4urcfbm.dp1hu0rb.d2edcug0.cbu4d94t.j83agx80.bp9cbjyn[role='main'] > div.k4urcfbm";
const NEWSFEED_POST = "[data-pagelet^='FeedUnit']";
const PAGEFEED_POST = "div.k4urcfbm > div.du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0";
const POST_AUTHOR =
  "[id^='jsc'].gmql0nx0.l94mrbxd.p1ri9a11.lzcic4wl.aahdfvyu.hzawbc8m > span.nc684nl6 > a[role='link']";
const POST_META_SECTION =
  "div.stjgntxs.ni8dbmo4.l82x9zwi.uo3d90p7.h905i5nu.monazrh9 > div > div > div > div.l9j0dhe7";
const META_REACTIONS_SECTION =
  "div.bp9cbjyn.j83agx80.buofh1pr.ni8dbmo4.stjgntxs";
const META_REACTIONS_SECTION_TOTAL_REACTIONS_COUNT =
  "span.tojvnm2t.a6sixzi8.abs2jz4q.a8s20v7p.t1p8iaqh.k5wvi7nf.q3lfd5jv.pk4s997a.bipmatt0.cebpdrjk.qowsmv63.owwhemhu.dp1hu0rb.dhp61c6y.iyyx5f41 > div[role='button'] > span.bzsjyuwj.ni8dbmo4.stjgntxs.ltmttdrg.gjzvkazv";
const META_LIST_OF_REACTIONS =
  "span[aria-label='See who reacted to this'][role='toolbar'] > span[id^='jsc']";
const META_EACH_IN_LIST_OF_REACTIONS = "div[role='button']";
// const META_EACH_IN_LIST_OF_REACTIONS_IMG_SRC = "img"; // uncomment if used.
const META_NUM_COMMENTSSHARES_SECTION =
  "div.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e";
const COMMENTS_SECTION =
  "div.stjgntxs.ni8dbmo4.l82x9zwi.uo3d90p7.h905i5nu.monazrh9 > div > div.cwj9ozl2.tvmbv18p > ul";
const INDIVIDUAL_COMMENT_COMMON_PARENT2 =
  "div[role='article'].l9j0dhe7.ecm0bbzt.rz4wbd8a.qt6c0cv9.dati1w0a.j83agx80.btwxx1t3.lzcic4wl > div.rj1gh0hx.buofh1pr.ni8dbmo4.stjgntxs.hv4rvrfc";
const INDIVIDUAL_COMMENT_COMMON_PARENT =
  "div.e72ty7fz.qlfml3jp.inkptoze.qmr60zad.rq0escxv.oo9gr5id.q9uorilb.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.d2edcug0.jm1wdb64.l9j0dhe7.l3itjdph.qv66sw1b > div.tw6a2znq.sj5x9vvc.d1544ag0.cxgpxx05";
// g5ia77u1 if the text comment section is empty. indicating only attached media as comment. b3i9ofy5 if there is text comment.
const COMMENT_COMMENTOR = "span.nc684nl6 > a[role='link']";
const COMMENT_SAID = "div.ecm0bbzt.e5nlhep0.a8c37x1j";
const COMMENT_ATTACHED = "div.j83agx80.bvz0fpym.c1et5uql";
const COMMENT_ATTACHED_IMG = "img";
const COMMENT_ATTACHED_EXT_LINK = "a[role='link']";
const POST_BODY_OWN_CONTENT_EXT_LINK = "a[role='link']";
const POST_BODY_OWN_CONTENT_VIDEO = "div[aria-label='Play video']";
const POST_BODY_OTHER_FB_POST_LINK = "a[role='link']";
const POST_BODY_BLOCK_QUOTE =
  "div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql.ii04i59q";
const GETALLREPLIES_MORE_REPLIES =
  "ul:not(._6coi.oygrvhab.ozuftl9m.l66bhrea.linoseic)";

const CLASSES_IF_IS_POST_ON_PAGE = [
  "du4w35lb",
  "k4urcfbm",
  "l9j0dhe7",
  "sjgh65i0"
];
const CLASSES_IF_IS_OTHER_FB_POST_BODY_PART = [
  "cwj9ozl2",
  "qbxu24ho",
  "bxzzcbxg",
  "lxuwth05",
  "h2mp5456",
  "ue3kfks5",
  "pw54ja7n",
  "uo3d90p7",
  "l82x9zwi",
  "goun2846",
  "ccm00jje",
  "s44p3ltw",
  "mk2mc5f4",
  "frvqaej8",
  "ed0hlay0",
  "afxsp9o4",
  "jcgfde61",
  "tvfksri0",
  "ozuftl9m"
];
