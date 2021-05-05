(function() {
  // send the text and url to quasar then generate a uid there and send it back to store in the chrome.storage
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

  // function onClickAddPostData(info) {
  //   console.log("onclickaddpostdata");
  //   console.log(info);
  //   let parcel = {
  //     message: "get.post.data"
  //   };
  //   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, parcel, res => {
  //       console.log(res);
  //     });
  //   });
  // }

  // chrome.contextMenus.create({
  //   title: "Add Post Data",
  //   contexts: ["all"],
  //   onclick: onClickAddPostData,
  //   documentUrlPatterns: ["*://*.facebook.com/*"]
  // });
})();
