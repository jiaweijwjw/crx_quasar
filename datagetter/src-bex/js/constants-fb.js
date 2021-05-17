const addPostBtnStyle = {
  color: "#d33682",
  backgroundColor: "#002b36",
  border: "medium ridge #073642",
  fontSize: "small",
  boxShadow: "1px 1px 2px 0px #000",
  cursor: "pointer",
  margin: "0 3px 0 0",
  padding: "0 3px 0 3px",
  textAlign: "centre"
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
const SELECTOR_TO_POST_COMMON_PARENT =
  "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div";
const SELECTOR_TO_ADDPOST_BTN_SIBLING =
  "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.oi732d6d.ik7dh3pa.ht8s03o8.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d9wwppkn.fe6kdd0r.mau55g9w.c8b282yb.mdeji52x.e9vueds3.j5wam9gi.knj5qynh.m9osqain.hzawbc8m[dir='auto'] > span[id^='jsc']";
const CLASS_IF_IS_OWN_CONTENT_BODY_PART = "l9j0dhe7";
const SELECTOR_TO_NEWSFEED = "[role='feed']";
const SELECTOR_TO_PAGEFEED =
  "div.dp1hu0rb.d2edcug0.taijpn5t.j83agx80.gs1a9yip > div.k4urcfbm.dp1hu0rb.d2edcug0.cbu4d94t.j83agx80.bp9cbjyn[role='main'] > div.k4urcfbm";
const SELECTOR_TO_NEWSFEED_POST = "[data-pagelet^='FeedUnit']";
const SELECTOR_TO_PAGEFEED_POST =
  "div.k4urcfbm > div.du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0";
const SELECTOR_TO_POST_AUTHOR =
  "[id^='jsc'].gmql0nx0.l94mrbxd.p1ri9a11.lzcic4wl.aahdfvyu.hzawbc8m > span.nc684nl6 > a[role='link']";
const SELECTOR_TO_COMMENTS_SECTION =
  "div.stjgntxs.ni8dbmo4.l82x9zwi.uo3d90p7.h905i5nu.monazrh9 > div > div.cwj9ozl2.tvmbv18p > ul";
const SELECTOR_TO_INDIVIDUAL_COMMENT_COMMON_PARENT2 =
  "div[role='article'].l9j0dhe7.ecm0bbzt.rz4wbd8a.qt6c0cv9.dati1w0a.j83agx80.btwxx1t3.lzcic4wl > div.rj1gh0hx.buofh1pr.ni8dbmo4.stjgntxs.hv4rvrfc";
const SELECTOR_TO_INDIVIDUAL_COMMENT_COMMON_PARENT =
  "div.e72ty7fz.qlfml3jp.inkptoze.qmr60zad.rq0escxv.oo9gr5id.q9uorilb.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.d2edcug0.jm1wdb64.l9j0dhe7.l3itjdph.qv66sw1b > div.tw6a2znq.sj5x9vvc.d1544ag0.cxgpxx05";
// g5ia77u1 if the text comment section is empty. indicating only attached media as comment. b3i9ofy5 if there is text comment.
const SELECTOR_TO_COMMENT_COMMENTOR = "span.nc684nl6 > a[role='link']";
const SELECTOR_TO_COMMENT_SAID = "div.ecm0bbzt.e5nlhep0.a8c37x1j";
const SELECTOR_TO_COMMENT_ATTACHED = "div.j83agx80.bvz0fpym.c1et5uql";
const SELECTOR_TO_COMMENT_ATTACHED_IMG = "img";
const SELECTOR_TO_COMMENT_ATTACHED_EXT_LINK = "a[role='link']";
const SELECTOR_TO_POST_BODY_OWN_CONTENT_EXT_LINK = "a[role='link']";
const SELECTOR_TO_POST_BODY_OWN_CONTENT_VIDEO = "div[aria-label='Play video']";
const SELECTOR_TO_POST_BODY_OTHER_FB_POST_LINK = "a[role='link']";
const SELECTOR_TO_POST_BODY_BLOCK_QUOTE =
  "div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql.ii04i59q";
const SELECTOR_TO_GETALLREPLIES_MORE_REPLIES =
  "ul:not(._6coi.oygrvhab.ozuftl9m.l66bhrea.linoseic)";
