// Content script content goes here or in activatedContentHooks (use activatedContentHooks if you need a variable
// accessible to both the content script and inside a hook

// TAKE NOTE OF THE ORDER OF CONTENT SCRIPTS IN MANIFEST FILE. DO NOT REARRANGE
// the content scripts are concatenated and injected according to the order there

let drawerStatusToggle = null;
let appStatusToggle = null;

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
  console.log("initial app status: " + initialAppStatusToggle);
  console.log("initial drawer status: " + initialDrawerStatusToggle);
  if (!initialAppStatusToggle) {
    offApp();
  } else {
    initialDrawerStatusToggle ? showDrawer() : hideDrawer();
  }
};

(function() {
  // IIFE. When the page loads, insert the browser extension code.
  iFrame.src = chrome.runtime.getURL("www/index.html");
  document.body.prepend(iFrame);
})();
