// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX
const util = require("util");

export default function attachBackgroundHooks(bridge, allActiveConnections) {
  bridge.on("storage.get", event => {
    const payload = event.data;
    if (payload.key === null) {
      //getAll()
      chrome.storage.sync.get(null, items => {
        const results = [];
        // The bridge also does some work to split large data which is too big to be transmitted
        // in one go due to the browser extension 60mb data transfer limit. In order for this to happen, the payload must be an array.
        // Group the items up into an array to take advantage of the bridge's chunk splitting.
        for (const itemKey in items) {
          results.push(items[itemKey]); // value = obj[key]
        }
        console.log("Getting all data background side: " + results);
        bridge.send(event.eventResponseKey, results);
      });
    } else {
      chrome.storage.sync.get([payload.key], items => {
        console.log("Getting data background side: " + items[payload.key]);
        bridge.send(event.eventResponseKey, items[payload.key]);
      });
    }
  });

  bridge.on("storage.get.all.posts", event => {
    chrome.storage.sync.get(null, items => {
      // items is an object of objects (key: value in chrome.storage)
      const results = [];
      delete items.chunks;
      delete items.appStatusToggle;
      delete items.drawerStatusToggle;
      delete items.crxBrowserPageView;
      for (const itemKey in items) {
        results.push(items[itemKey]); // value = obj[key]
      }
      console.log("Getting all data background side: " + results);
      bridge.send(event.eventResponseKey, results);
    });
  });

  bridge.on("storage.set", event => {
    const payload = event.data;
    chrome.storage.sync.set(
      {
        [payload.key]: payload.data
      },
      () => {
        console.log("Saving data background side: " + payload.data);
        bridge.send(event.eventResponseKey, payload.data);
      }
    );
  });

  bridge.on("storage.remove", event => {
    const payload = event.data;
    if (payload.keys === null) {
      let storageObj;
      const keysToKeep = ["appStatusToggle", "drawerStatusToggle", "chunks"];
      chrome.storage.sync.get(keysToKeep, itemsToKeep => {
        storageObj = Object.assign({}, itemsToKeep);
      });
      chrome.storage.sync.clear();
      console.log(storageObj);
      chrome.storage.sync.set(storageObj);
      bridge.send(event.eventResponseKey);
    } else {
      chrome.storage.sync.remove(payload.keys, () => {
        bridge.send(event.eventResponseKey);
      });
    }
  });

  bridge.on("initial.get", event => {
    const payload = event.data;
    if (payload.msg === "getInitialStatuses") {
      chrome.storage.sync.get(
        ["appStatusToggle", "drawerStatusToggle"],
        results => {
          console.log("results: " + results);
          console.log(util.inspect(results, false, null, true));
          console.log(
            "Value of appStatusToggle is " + results["appStatusToggle"]
          );
          console.log(
            "Value of drawerStatusToggle is " + results["drawerStatusToggle"]
          );
          bridge.send(event.eventResponseKey, results);
        }
      );
    }
  });

  bridge.on("testdirect", event => {
    const payload = event.data;
    if (payload.msg === "hello") {
      console.log("hello");
    }
    bridge.send(event.eventResponseKey);
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
  // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  //   chrome.storage.sync.get(["appStatusToggle"], r => {
  //     console.log("Getting initial appStatusToggle background side: " + r["appStatusToggle"]);
  //     bridge.send(event.eventResponseKey, r[payload.key]);
  //   });
  //   chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(
  //     response
  //   ) {
  //     console.log(response.farewell);
  //   });
  // });

  /*
  // EXAMPLES
  // Listen to a message from the client
  bridge.on('test', d => {
    console.log(d)
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
}
