// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// Still, is it better to use chrome message parsing or bridge?
// console.logs here will show in the webpage dev tools console.
const util = require("util"); // for logging purposes only
let drawerStatusToggle = null;
let appStatusToggle = null;
const POST_COMMON_PARENT_PATH =
  "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div";

const whichFacebookViewEnum = Object.freeze({
  NEWSFEED: 1,
  PAGE: 2
});

const iFrame = document.createElement("iframe");
iFrame.id = "datagetter-iframe";
iFrame.name = ""; // name attribute is to differentiate between the drawer state.

// somehow it is not automatically injected like the quasar docs said. so we inject the css stylesheet ourselves.
const link = document.createElement("link");
link.href = "./css/content-css.css";
link.type = "text/css";
link.rel = "stylesheet";
document.head.appendChild(link);

// Style the iframe (common settings) and giving it an initial style attribute.
Object.assign(iFrame.style, {
  right: "0",
  bottom: "0",
  left: "0",
  border: "0",
  position: "fixed",
  zIndex: "2147483001",
  overflow: "visible"
});

const setIFrameDimensions = (height, width) => {
  iFrame.height = height;
  iFrame.width = width;
};

// toggling the iFrame.name will result in the different positions of the app. see css/content-css.css
const showDrawer = () => {
  console.log("show drawer");
  setIFrameDimensions("40%", "100%");
  iFrame.name = "shown";
};
const hideDrawer = () => {
  console.log("hide drawer");
  setIFrameDimensions("3%", "3%");
  iFrame.name = "hidden";
};
const offApp = () => {
  console.log("off app");
  setIFrameDimensions("0px", "0px");
};

const initBrowserApp = (initialAppStatusToggle, initialDrawerStatusToggle) => {
  console.log("initial app " + initialAppStatusToggle);
  console.log("initial drawer " + initialDrawerStatusToggle);
  if (!initialAppStatusToggle) {
    offApp();
  } else {
    initialDrawerStatusToggle ? showDrawer() : hideDrawer();
  }
};

// setup the mutation observer to look for any changes in the target node 'newsFeed'
// this is because the facebook webpage never fully loads but instead loads more posts as the user scrolls down.
// we are only interested to look at whether there are new childnodes which are fb posts.
const setupMutationObserver = (targetNode, view) => {
  const config = { childList: true };
  const callback = function(mutationRecordsArray, observer) {
    mutationRecordsArray.forEach(mutation => {
      switch (mutation.type) {
        case "childList":
          if (mutation.addedNodes.length !== 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              switch (view) {
                case whichFacebookViewEnum.NEWSFEED:
                  if (mutation.addedNodes[i].hasAttributes()) {
                    let attrs = mutation.addedNodes[i].attributes; // element.attributes is a NamedNodeMap, not an array.
                    for (let y = attrs.length - 1; y >= 0; y--) {
                      if (attrs[y].name === "data-pagelet") {
                        if (attrs[y].value === "FeedUnit_1") {
                          break; // stop checking the other attributes already.
                        } else {
                          renderAddPostButton(mutation.addedNodes[i]);
                        }
                      } else {
                        continue; // the current attribute does not tell any information whether this addedNode is a new post, so continue checking.
                      }
                    }
                  }
                  break;
                case whichFacebookViewEnum.PAGE:
                  const isPostClasses = [
                    "du4w35lb",
                    "k4urcfbm",
                    "l9j0dhe7",
                    "sjgh65i0"
                  ];
                  let classesInNode = mutation.addedNodes[i].classList;
                  if (classesInNode.length !== 4) {
                    break;
                  }
                  for (let z = isPostClasses.length - 1; z >= 0; z--) {
                    if (classesInNode.contains(isPostClasses[z])) {
                      break;
                    }
                  }
                  renderAddPostButton(mutation.addedNodes[i]);
                  break;
              }
            }
          }
          break;
      }
    });
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  // observer.disconnect();
};

const getPostData = event => {
  let top, middle, bottom;
  let author = "";
  let originalPostText = "assign a fixed string for now.";
  let comments = [];
  const postCommonParent = event.target.closest(
    "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div"
  );
  if (postCommonParent) {
    console.log(postCommonParent);
    const childrenArray = Array.from(postCommonParent.childNodes).filter(node =>
      node.hasChildNodes()
    ); // childrenArray consists of the header (top), body (middle) and footer (bottom) of a post.
    top = childrenArray[0];
    middle = childrenArray[1];
    bottom = childrenArray[2];
    author =
      top.querySelector("h4[id^='jsc']").querySelector("span").textContent ||
      `unable to get author's name`;
    console.log(author);
    // originalPostText = getLeafNodes(middle);
    // console.log(originalPostText);
    const commentsSection = bottom.querySelector(
      "div.stjgntxs.ni8dbmo4.l82x9zwi.uo3d90p7.h905i5nu.monazrh9 > div > div.cwj9ozl2.tvmbv18p > ul"
    );
    console.log(commentsSection); // an unordered list
    if (commentsSection && commentsSection.children.length !== 0) {
      let children = commentsSection.children;
      for (let i = 0; i < children.length; i++) {
        const individualCommentCommonParent = children[i].querySelector(
          "div > div.l9j0dhe7.ecm0bbzt.rz4wbd8a.qt6c0cv9.dati1w0a.j83agx80.btwxx1t3.lzcic4wl[role='article'] > div.rj1gh0hx.buofh1pr.ni8dbmo4.stjgntxs.hv4rvrfc > div > div.q9uorilb.bvz0fpym.c1et5uql.sf5mxxl7 > div > div > div.b3i9ofy5.e72ty7fz.qlfml3jp.inkptoze.qmr60zad.rq0escxv.oo9gr5id.q9uorilb.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.d2edcug0.jm1wdb64.l9j0dhe7.l3itjdph.qv66sw1b > div.tw6a2znq.sj5x9vvc.d1544ag0.cxgpxx05"
        );
        if (individualCommentCommonParent) {
          // .childNodes with return nodelist including comment type node. using .children will return a HTMLCollection which will only include the div and span
          const commentor = individualCommentCommonParent.children[0].querySelector(
            "span.pq6dq46d > span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.oi732d6d.ik7dh3pa.ht8s03o8.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d9wwppkn.fe6kdd0r.mau55g9w.c8b282yb.mdeji52x.e9vueds3.j5wam9gi.lrazzd5p.oo9gr5id[dir='auto']"
          ).textContent;
          const said = individualCommentCommonParent.children[1].querySelector(
            "div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql > div[dir='auto']"
          ).textContent;
          console.log("commentor: " + commentor);
          console.log("said: " + said);
          let comment = {
            commentor,
            said
          };
          comments.push(comment);
        }
      }
    }
  } else {
    console.log("cant find common parent.");
  }
  sendPostToCrx(author, originalPostText, comments);
};

const sendPostToCrx = (author, originalPostText, comments) => {
  let parcel = {
    message: "new.fb.post.added",
    content: {
      author,
      originalPostText,
      comments
    }
  };
  chrome.runtime.sendMessage(parcel, res => {
    console.log(res);
  });
};

const getLeafNodes = targetNode => {
  var nodes = Array.prototype.slice.call(
    targetNode.getElementsByTagName("*"),
    0
  );
  var leafNodes = nodes.filter(function(elem) {
    if (elem.hasChildNodes()) {
      // see if any of the child nodes are elements
      for (var i = 0; i < elem.childNodes.length; i++) {
        if (elem.childNodes[i].nodeType == 1) {
          // there is a child element, so return false to not include
          // this parent element
          return false;
        }
      }
    }
    return true;
  });
  return leafNodes;
};

const renderAddPostButton = postCommonParent => {
  let top, middle, bottom;
  // let postCommonParent = post.querySelector(
  //   "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div"
  // );
  if (postCommonParent) {
    // .childNodes returns a Live Nodelist
    let childrenArray = Array.from(postCommonParent.childNodes).filter(node =>
      node.hasChildNodes()
    ); // childrenArray consists of the header (top), body (middle) and footer (bottom) of a post.
    (top = childrenArray[0]),
      (middle = childrenArray[1]),
      (bottom = childrenArray[2]);

    let linkToOpenPostInOwnPage = top.querySelector(
      "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.oi732d6d.ik7dh3pa.ht8s03o8.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d9wwppkn.fe6kdd0r.mau55g9w.c8b282yb.mdeji52x.e9vueds3.j5wam9gi.knj5qynh.m9osqain.hzawbc8m[dir='auto'] > span[id^='jsc']"
    );
    const btnEl = document.createElement("span");
    const textNode = document.createTextNode("ADD THIS POST");
    Object.assign(btnEl.style, {
      color: "#d33682",
      backgroundColor: "#002b36",
      border: "medium ridge #073642",
      fontSize: "small",
      boxShadow: "1px 1px 2px 0px #000",
      cursor: "pointer",
      margin: "0 3px 0 0",
      padding: "0 3px 0 3px",
      textAlign: "centre"
    });
    // btnEl.classList.add("btnEl"); somehow cannot detect the class from content-css.css
    btnEl.appendChild(textNode);
    // bridge is available as parent scope variable
    // it works, but the question remains if it is a recommended way of event processing from DOM to Quasar webpage
    // have to pass the bridge in though
    btnEl.onclick = event => {
      getPostData(event);
    };
    linkToOpenPostInOwnPage.parentNode.insertBefore(
      btnEl,
      linkToOpenPostInOwnPage
    );
  } else {
    console.log("cant find postCommonParent");
  }
};

const initFacebookApp = () => {
  {
    let postContainer = { el: null, view: null };
    let posts = null;
    // querySelectorAll returns a Static Nodelist. So we have to requery the DOM when there are changes. (When there are more posts loaded.)
    // the nodes/elements are live, it is the Nodelist returned by querySelectorAll() that is Static.
    const newsFeed = document.querySelector('[role="feed"]');
    const pageFeed = document.querySelector(
      "div.dp1hu0rb.d2edcug0.taijpn5t.j83agx80.gs1a9yip > div.k4urcfbm.dp1hu0rb.d2edcug0.cbu4d94t.j83agx80.bp9cbjyn[role='main'] > div.k4urcfbm"
    );
    console.log(newsFeed);
    console.log(pageFeed);
    if (newsFeed) {
      postContainer.el = newsFeed;
      postContainer.view = whichFacebookViewEnum.NEWSFEED;
    }
    if (pageFeed) {
      postContainer.el = pageFeed;
      postContainer.view = whichFacebookViewEnum.PAGE;
    }
    if (!newsFeed && !pageFeed) {
      console.log("unable to get newsfeed or page data.");
      return;
    }
    setupMutationObserver(postContainer.el, postContainer.view);
    // can find other ways to check which facebook view is it?
    if (postContainer.view === whichFacebookViewEnum.NEWSFEED) {
      posts = newsFeed.querySelectorAll('[data-pagelet^="FeedUnit"]');
    }
    if (postContainer.view === whichFacebookViewEnum.PAGE) {
      posts = pageFeed.querySelectorAll("div.lzcic4wl[role='article']");
    }
    if (!posts) {
      console.log("unable to get posts.");
      return;
    }
    console.log("number of posts: " + posts.length);
    for (let value of posts.values()) {
      console.log(value);
    }
    for (let i = 0; i < posts.length; i++) {
      // somehow FeedUnit_1 is always empty, not pointing to the second post. Post number 2 onwards starts from index 2.
      if (i == 1) {
        continue;
      }
      console.log(i);
      let post = posts[i];
      renderAddPostButton(post.querySelector(POST_COMMON_PARENT_PATH));
    }
  }
};

export default function attachContentHooks(bridge) {
  bridge.send("initial.get", { msg: "getInitialStatuses" }).then(res => {
    console.log(
      "initial get statuses: " + util.inspect(res, false, null, true)
    );
    const results = res.data;
    drawerStatusToggle = results.drawerStatusToggle;
    appStatusToggle = results.appStatusToggle;
    initBrowserApp(results.appStatusToggle, results.drawerStatusToggle);
  });

  // somehow this toggle.drawer cannot be detected if sent by popup app.
  bridge.on("toggle.drawer", event => {
    const payload = event.data;
    drawerStatusToggle = payload.showDrawer;
    if (payload.showDrawer) {
      showDrawer();
    } else {
      hideDrawer();
    }
    bridge.send(event.eventResponseKey);
  });

  bridge.on("app.status", event => {
    const payload = event.data;
    appStatusToggle = payload.onApp;
    if (payload.onApp) {
      drawerStatusToggle ? showDrawer() : hideDrawer();
      // if (
      //   document.domain === "facebook.com" &&
      //   document.readyState === "complete"
      // ) {
      //   initFacebookApp();
      // }
    } else {
      offApp();
    }
    bridge.send(event.eventResponseKey);
  });

  document.onreadystatechange = function() {
    if (
      document.readyState === "complete" &&
      document.domain === "facebook.com" &&
      appStatusToggle
    ) {
      // For now have to refresh the page after toggling on/off on extension popup
      initFacebookApp();
    }
  };
}

(function() {
  // IIFE. When the page loads, insert the browser extension code.
  iFrame.src = chrome.runtime.getURL("www/index.html");
  document.body.prepend(iFrame);
})();
