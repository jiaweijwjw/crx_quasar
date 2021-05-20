(function() {
  // send the chunk to quasar then generate a uid there and send it back to store in the chrome.storage
  function onClickAddChunk(info) {
    const text = info.selectionText;
    const url = info.pageUrl;
    console.log("Text selected: '" + text + "' from url: " + url);
    console.log("Number of characters selected: " + text.length);
    if (text.length !== 0) {
      let parcel = {
        message: "new.chunk.added",
        content: {
          text,
          url
        }
      };
      chrome.runtime.sendMessage(parcel, res => {
        chrome.storage.sync.get(["chunks"], function(results) {
          let chunkObj = results["chunks"] ? results["chunks"] : {}; // value = obj[key]
          let newChunk = { [res.id]: { id: res.id, text, url } }; // es6 computed property names
          Object.assign(chunkObj, newChunk);
          chrome.storage.sync.set({ ["chunks"]: chunkObj });
        });
      });
    } else {
      console.log("No text was selected.");
    }
  }

  chrome.contextMenus.create({
    title: "Add Chunk",
    contexts: ["selection"],
    onclick: onClickAddChunk
  });

  // Benefit of putting here is only send once. Here have to use chrome message passing instead of the bridge.
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if (key === "appStatusToggle" && namespace === "sync") {
        let parcel = {
          message: "app.status",
          content: { onApp: null }
        };
        console.log("newvalue: " + newValue);
        chrome.tabs.query({ active: true, currentWindow: true }, function(
          tabs
        ) {
          parcel.content.onApp = newValue;
          chrome.tabs.sendMessage(tabs[0].id, parcel);
        });
      }
    }
  });

  // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  //   console.log(changeInfo);
  //   console.log(tab);
  //   if (changeInfo.status) {
  //     chrome.tabs.sendMessage(tabId, {
  //       message: "status.complete"
  //     });
  //   }
  // });
})();
