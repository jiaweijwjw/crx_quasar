// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be listened for by all client BEX bridges for this BEX

const nonPostKeys = [
  "chunks",
  "appStatusToggle",
  "drawerStatusToggle",
  "crxBrowserPageView"
];

export default function attachBackgroundHooks(bridge, allActiveConnections) {
  bridge.on("storage.get", event => {
    const payload = event.data;
    if (payload.key === null) {
      // if key === null, get all keys in chrome storage
      chrome.storage.sync.get(null, items => {
        const results = [];
        // The bridge also does some work to split large data which is too big to be transmitted in one go
        // due to the browser extension 60mb data transfer limit. In order for this to happen, the payload must be an array.
        // Group the items up into an array to take advantage of the bridge's chunk splitting.
        for (const itemKey in items) {
          results.push(items[itemKey]); // value = obj[key]
        }
        bridge.send(event.eventResponseKey, results);
      });
    } else {
      // get a specific key-value pair from chrome storage
      chrome.storage.sync.get([payload.key], items => {
        bridge.send(event.eventResponseKey, items[payload.key]);
      });
    }
  });

  bridge.on("storage.set", event => {
    const payload = event.data;
    chrome.storage.sync.set(
      {
        [payload.key]: payload.data
      },
      () => {
        bridge.send(event.eventResponseKey, payload.data);
      }
    );
  });

  bridge.on("storage.remove", event => {
    const payload = event.data;
    chrome.storage.sync.remove(payload.keys, () => {
      bridge.send(event.eventResponseKey);
    });
  });

  bridge.on("storage.get.all.posts", event => {
    chrome.storage.sync.get(null, items => {
      // items is an object of objects (key: value in chrome.storage)
      const results = [];
      for (let i = 0; i < nonPostKeys.length; i++) {
        delete items[nonPostKeys[i]];
      }
      for (const itemKey in items) {
        results.push(items[itemKey]); // value = obj[key]
      }
      bridge.send(event.eventResponseKey, results);
    });
  });

  bridge.on("initial.get", event => {
    // get initial app and drawer status at content script side
    const payload = event.data;
    if (payload.msg === "getInitialStatuses") {
      chrome.storage.sync.get(
        ["appStatusToggle", "drawerStatusToggle"],
        results => {
          bridge.send(event.eventResponseKey, results);
        }
      );
    }
  });

  // Every tab will trigger this
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if (key === "appStatusToggle" && namespace === "sync") {
        console.log("newvalue: " + newValue);
        if (newValue === true) {
          // if (newValue) {} else {}
          bridge.send("app.status", {
            onApp: true
          });
        }
        if (newValue === false) {
          bridge.send("app.status", {
            onApp: false
          });
        }
      }
    }
  });
}
