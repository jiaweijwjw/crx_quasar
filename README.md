# Data Getter
Chrome extension for acquiring information on the web.

## Getting Started
To get started follow the following steps to get a hot-reloading development server up and running. 

### Check out the code
```bash
git clone https://github.com/jiaweijwjw/crx_quasar.git
```

### Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m bex
```
* In Chrome, navigate to chrome://extensions
* Toggle “Developer Mode”.
* Click “Load unpacked”. This will present you with the folder selection dialog. Navigate to and select your src-bex folder.
* You should now see your BEX mounted in Chrome.

### Build the app for production
```bash
quasar build -m bex
```
## About the app

### Usage:
There are two main functionalities that the extension can do which is to save any text selection or save the details of a Facebook post. After the extension is mounted on the chrome browser, pin the extension or click on the extension icon to open the popup page. The purpose of the popup page is to turn the extension On/Off. When the extension is on, then there will be a button on the bottom of the page to toggle the drawer Open/Close.

On any webpage with selectable text, highlight the desired text to be added and right click to access the context menu. Then click on the "add chunk" context menu item to add it to the app. Note that the context menu item will only show if there is a selection made.

On facebook domains, the currently supported webpages for rendering the Addpost buttons are the main "Newsfeed" page or a "Page" type page. If the button does not render, refresh the webpage or toggle the extension off and on. 

### Things to note:
* Using Quasar's bex mode allows us to have access to a bridge for communication. But is it better to use the bridge or standard chrome message passing? The latest implementation standardizes the use of chrome message passing for all communciations except for the get/save/delete functions in [storage.access.js](datagetter/src/services/storage.access.js). The working versions of communication via bridge is commented out.
* All chunks are stored in a single "chunks" key while each individual post is stored as a key-value pair in chrome storage.
* chrome.storage.local is used instead of chrome.storage.sync as the QUOTA_BYTES_PER_ITEM for chrome.storage.sync is too small for storing posts data.

### Communication:
* On/Off app and Open/Close drawer is done by listening to the changes of the status flag in chrome.storage.
* Addchunk sends the chunk to the app which generates an id that is returned in the response. (background -> app -> background (res) -> store in chrome storage)
* Addpost functionality first sends the post details from [content-script-fb](datagetter/src-bex/js/content-script-fb) -> [background](datagetter/src-bex/js/background.js) -> [app](datagetter/src/layouts/BrowserLayout.vue) -> background (res) -> store in chrome storage -> content-script-fb (res). This is because if the message is passed from content script to the app (BrowserLayout.vue) directly, all tabs that have the extension open will receive the message and the post will be added multiple times. However, by adding listening for the newly added post in background script instead, we can ensure that the post is only added a single time. The listener in background.js just acts as a middleman to pass the message.

### Functionalities that can be added / yet to be implemented:
* Render Addpost buttons on more variety of facebook webpages.
* Adjustable iframe drawer height.
* Enable/Disable "add chunk" context menu based on app On/Off status.
* Make changes to all instances of the extension drawer on all tabs without having to refresh the webpage.

## Debugging:
* Note that Vue Devtools extension does not detect Quasar app in bex mode.
* 
