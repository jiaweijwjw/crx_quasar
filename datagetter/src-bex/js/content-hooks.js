// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// Still, is it better to use chrome message parsing or bridge?
// console.logs here will show in the webpage dev tools console.

const util = require("util"); // for logging purposes only

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
}
