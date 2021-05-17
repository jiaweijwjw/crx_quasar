(function() {
  // send the chunk to quasar then generate a uid there and send it back to store in the chrome.storage
  function onClickAddChunk(info) {
    const text = info.selectionText;
    const url = info.pageUrl;
    console.log("Text selected: '" + text + "' from url: " + url);
    console.log("Number of characters selected: " + text.length);
    if (text.length !== 0) {
      console.log("There was some text selected.");
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
          chrome.storage.sync.set({ ["chunks"]: chunkObj }, function() {
            console.log("id from quasar: " + res.id);
          });
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
})();
