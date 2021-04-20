// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX

function onClickAddChunk(info) {
  const text = info.selectionText;
  console.log("Text selected: " + text);
  console.log("Number of characters selected: " + text.length);
  if (text.length !== 0) {
    console.log("There was some text selected.");
  } else {
    console.log("No text was selected.");
  }
}

export default function attachBackgroundHooks(bridge, allActiveConnections) {
  bridge.on("storage.get", event => {
    const payload = event.data;
    if (payload.key === null) {
      //getAll()
      chrome.storage.sync.get(null, r => {
        const results = [];

        // Group the items up into an array to take advantage of the bridge's chunk splitting.
        for (const itemKey in r) {
          results.push(r[itemKey]);
        }
        console.log("Getting all data background side: " + results);
        bridge.send(event.eventResponseKey, results);
      });
    } else {
      chrome.storage.sync.get([payload.key], r => {
        console.log("Getting data background side: " + r[payload.key]);
        bridge.send(event.eventResponseKey, r[payload.key]);
      });
    }
  });

  bridge.on("storage.set", event => {
    const payload = event.data;
    chrome.storage.sync.set({ [payload.key]: payload.data }, () => {
      console.log("Saving data background side: " + payload.data);
      bridge.send(event.eventResponseKey, payload.data);
    });
  });

  bridge.on("storage.remove", event => {
    const payload = event.data;
    chrome.storage.sync.remove(payload.key, () => {
      console.log("Removing data background side: " + payload.data);
      bridge.send(event.eventResponseKey, payload.data);
    });
  });

  // chrome.browserAction.onClicked.addListener(() => {
  //   bridge.send("toggle.drawer");
  // });

  chrome.contextMenus.create({
    title: "Add Chunk",
    contexts: ["selection"],
    onclick: onClickAddChunk
  });

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
