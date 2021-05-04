// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// console.logs here will show in the webpage dev tools console.
const util = require("util");
let drawerStatusToggle = null;

const iFrame = document.createElement("iframe");
iFrame.id = "datagetter-iframe";
iFrame.name = ""; // name attribute is to differentiate between the drawer state.

// somehow it is not automatically injected like the docs said. so we inject the css stylesheet ourselves.
const link = document.createElement("link");
link.href = "./css/content-css.css";
link.type = "text/css";
link.rel = "stylesheet";
document.head.appendChild(link); // document.getElementsByTagName("head")[0].appendChild(link);

// Style the iframe (common settings) and giving it an initial style attribute.
Object.assign(iFrame.style, {
  right: "0",
  bottom: "0",
  left: "0",
  // display: "block",
  // margin: "0",
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

const setupMutationObserver = targetNode => {
  const config = { childList: true };
  const callback = function(mutationRecordsArray, observer) {
    mutationRecordsArray.forEach(mutation => {
      switch (mutation.type) {
        case "childList":
          console.log("in mutation");
          if (mutation.addedNodes.length !== 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              console.log(mutation.addedNodes[i]);
              if (mutation.addedNodes[i].hasAttributes()) {
                let attrs = mutation.addedNodes[i].attributes; // element.attributes is a NamedNodeMap, not an array.
                for (let y = attrs.length - 1; y >= 0; y--) {
                  if (
                    attrs[y].name === "data-pagelet" &&
                    attrs[y].value === "FeedUnit_1"
                  ) {
                    break;
                  } else if (attrs[y].name === "data-pagelet") {
                    renderAddPostButton(mutation.addedNodes[i]);
                  } else {
                    continue;
                  }
                }
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

const renderAddPostButton = post => {
  let top, middle, bottom;
  let postCommonParent = post.querySelector(
    "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div"
  );
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
    const elclicker = document.createElement("span");
    const textnode = document.createTextNode("ADD THIS POST");
    Object.assign(elclicker.style, {
      color: "yellow",
      backgroundColor: "blue",
      border: "thick solid #000000",
      fontSize: "small",
      cursor: "pointer",
      marginRight: "8px"
    });
    elclicker.appendChild(textnode);
    // bridge is available as parent scope variable
    // it works, but the question remains if it is a recommended way of event processing from DOM to Quasar webpage
    elclicker.onclick = event => {
      console.log("click elclicker");
      // const elanchor = event.target.nextElementSibling;
      // const url = elanchor.href;
      // const title = elanchor.innerText;
      // const ldata = {};
      // ldata[url] = { url, title, checked: true };
      // bridge.send("webpage.getTable.return", { links: ldata });
    };
    linkToOpenPostInOwnPage.parentNode.insertBefore(
      elclicker,
      linkToOpenPostInOwnPage
    );
  } else {
    console.log("cant find postCommonParent");
  }
};

export default function attachContentHooks(bridge) {
  bridge.send("initial.get", { msg: "getInitialStatuses" }).then(res => {
    console.log(
      "initial get statuses: " + util.inspect(res, false, null, true)
    );
    const results = res.data;
    drawerStatusToggle = results.drawerStatusToggle;
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
    if (payload.onApp) {
      drawerStatusToggle ? showDrawer() : hideDrawer();
    } else {
      offApp();
    }
    bridge.send(event.eventResponseKey);
  });

  if (
    document.domain === "facebook.com" &&
    document.readyState === "interactive"
  ) {
    // querySelectorAll returns a Static Nodelist. So we have to requery the DOM when there are changes. (When there are more posts loaded.)
    // the nodes/elements are live, it is the Nodelist returned by querySelectorAll() that is Static.
    const newsFeed = document.querySelector('[role="feed"]'); // theres no point querying this if we are not going to reference it in future.
    setupMutationObserver(newsFeed);
    const posts = newsFeed.querySelectorAll('[data-pagelet^="FeedUnit"]');
    // const posts = document.querySelectorAll(
    //   'div[role="feed"] > [data-pagelet^="FeedUnit"]'
    // );
    console.log("number of posts: " + posts.length);
    for (var value of posts.values()) {
      console.log(value);
    }
    for (let i = 0; i < posts.length; i++) {
      // somehow FeedUnit_1 is always empty, not pointing to the second post. Post number 2 onwards starts from index 2.
      if (i == 1) {
        continue;
      }
      console.log(i);
      let post = posts[i];
      renderAddPostButton(post);
    }
  }
}

(function() {
  // IIFE. When the page loads, insert the browser extension code.
  iFrame.src = chrome.runtime.getURL("www/index.html");
  document.body.prepend(iFrame);
  chrome.runtime.onMessage.addListener(function(parcel, sender, sendResponse) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    if (parcel.message == "get.post.data") {
      let top, middle, bottom;
      // What if not in the main facebook page?
      const newsFeed = document.querySelector('[role="feed"]'); // theres no point querying this if we are not going to reference it in future.
      const posts = newsFeed.querySelectorAll('[data-pagelet^="FeedUnit"]');
      console.log("number of posts: " + posts.length);
      for (var value of posts.values()) {
        console.log(value);
      }
      for (let i = 0; i < posts.length; i++) {
        // somehow FeedUnit_1 is always empty, not pointing to the second post.
        if (i == 1) {
          continue;
        }
        console.log(i);
        let post = posts[i];
        const postCommonParent = post.querySelector(
          "div.lzcic4wl[role='article'] > div.j83agx80.cbu4d94t > div.rq0escxv.l9j0dhe7.du4w35lb > div.j83agx80.l9j0dhe7.k4urcfbm > div.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs > div > div:not(:empty) > div"
        );
        const childrenArray = Array.from(
          postCommonParent.childNodes
        ).filter(node => node.hasChildNodes()); // childrenArray consists of the header (top), body (middle) and footer (bottom) of a post.
        (top = childrenArray[0]),
          (middle = childrenArray[1]),
          (bottom = childrenArray[2]);
        // const author = top.querySelectorAll("span:last-of-type");
        // console.log(author);
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
              const comment = individualCommentCommonParent.children[1].querySelector(
                "div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql > div[dir='auto']"
              ).textContent;
              console.log("commentor: " + commentor);
              console.log("comment: " + comment);
            }
          }
        }
      }
      sendResponse({ msg: "test" });
    }
  });
  // chrome.runtime.onMessage.addListener(function(parcel, sender, sendResponse) {
  //   console.log(
  //     sender.tab
  //       ? "from a content script:" + sender.tab.url
  //       : "from the extension"
  //   );
  //   if (parcel.message == "get.post.data") {
  //     const commentsSection = document.getElementsByClassName(
  //       "cwj9ozl2 tvmbv18p"
  //     );
  //     const chatbubble = commentsSection[0].getElementsByClassName(
  //       "tw6a2znq sj5x9vvc d1544ag0 cxgpxx05"
  //     );
  //     console.log(chatbubble);
  //     const comments = commentsSection[0].getElementsByClassName(
  //       "kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x c1et5uql"
  //     );
  //     for (let i = 0; i < comments.length; i++) {
  //       console.log(comments[i].firstChild.textContent);
  //     }
  //     sendResponse({ msg: "test" });
  //   }
  // });
})();
