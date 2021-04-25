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
        chrome.storage.sync.set(
          {
            [res.id]: {
              text,
              url
            }
          },
          () => {
            console.log("id from quasar: " + res.id);
          }
        );
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

// function onClickAddChunk(info) {
//   const text = info.selectionText;
//   const url = info.pageUrl;
//   console.log("Text selected: '" + text + "' from url: " + url);
//   console.log("Number of characters selected: " + text.length);
//   if (text.length !== 0) {
//     console.log("There was some text selected.");
//     bridge
//       .send("new.chunk.added", {
//         chunk: { text, url }
//       })
//       .then(res => {
//         let id = res.data;
//         let details = {
//           text,
//           url
//         };
//         chrome.storage.sync.set({ [id]: details }, () => {
//           console.log("id from quasar: " + id);
//           console.log("details: " + details);
//         });
//       });
//   } else {
//     console.log("No text was selected.");
//   }
// }
