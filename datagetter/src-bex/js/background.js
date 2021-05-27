(function() {
  // send the chunk to quasar then generate a uid there and send it back to store in the chrome.storage
  function onClickAddChunk(info) {
    const text = info.selectionText;
    const url = info.pageUrl;
    console.log("Text selected: '" + text + "' From url: '" + url + "'");
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
        chrome.storage.local.get(["chunks"], function(results) {
          let chunkObj = results["chunks"] ? results["chunks"] : {}; // value = obj[key]
          let newChunk = { [res.id]: { id: res.id, text, url } }; // es6 computed property names
          Object.assign(chunkObj, newChunk);
          chrome.storage.local.set({ ["chunks"]: chunkObj });
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
      // use: ( a === b || a === c )
      // ( a === ( b || c )) does not work
      if (
        (key === "appStatusToggle" && namespace === "local") ||
        (key === "drawerStatusToggle" && namespace === "local")
      ) {
        console.log("newvalue: " + newValue);
        const msg = key === "appStatusToggle" ? "app.status" : "toggle.drawer";
        const status = key === "appStatusToggle" ? "onApp" : "showDrawer";
        let parcel = {
          message: msg,
          content: {
            [status]: null
          }
        };
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          function(tabs) {
            parcel.content[status] = newValue;
            chrome.tabs.sendMessage(tabs[0].id, parcel);
            // DO NOT OPEN Dev Tools when using/testing this functionality.
            // A recent change in the API will not return the Dev Tools tab. So if you're debugging your extension and the Dev Tools window is open and focused,
            // the array will be empty. the id will be undefined, causing the crx to stop working.
          }
        );
      }
    }
  });

  chrome.runtime.onMessage.addListener(function(parcel, sender, sendResponse) {
    /* from chrome docs:
     * This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to
     * send a response asynchronously (this will keep the message channel open to the other end until sendResponse is called).
     */
    if (parcel.message === "initial.get") {
      chrome.storage.local.get(
        ["appStatusToggle", "drawerStatusToggle"],
        results => {
          sendResponse({
            appStatusToggle: results.appStatusToggle,
            drawerStatusToggle: results.drawerStatusToggle
          });
        }
      );
      return true; // Getting from chrome.storage is asynchronous. return true to indicate we will be sending a response asynchronously.
    }
    if (parcel.message == "new.fb.post.cs.to.bg") {
      // this listener just has the responsibility of being a middleman to pass the parcel from contentscript to quasar.
      // this is because if pass directly to quasar, will have multiple posts added if multiple tabs are running the extension.
      // however, there is only one background script running for one extension. so putting the listener here will only add the post once even if multiple tabs are open with the extension.
      let forwardedParcel = {
        message: "new.fb.post.added",
        content: Object.assign({}, parcel.content)
      };
      chrome.runtime.sendMessage(forwardedParcel, res => {
        chrome.storage.local.set(
          {
            [res.id]: parcel.content
          },
          function() {
            chrome.storage.local.get([res.id], function(results) {
              if (results) {
                sendResponse(true);
              } else {
                sendResponse(false);
              }
            });
          }
        );
      });
      return true; // return true to indicate we will be sending a response asynchronously.
    }
  });
})();
