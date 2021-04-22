// Background code goes here
// chrome.browserAction.onClicked.addListener((/* tab */) => {
//   // Opens our extension in a new browser window.
//   // Only if a popup isn't defined in the manifest.
//   chrome.tabs.create({
//     url: chrome.extension.getURL('www/index.html')
//   }, (/* newTab */) => {
//     // Tab opened.
//   })
// })

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

chrome.contextMenus.create({
  title: "Add Chunk",
  contexts: ["selection"],
  onclick: onClickAddChunk
});
