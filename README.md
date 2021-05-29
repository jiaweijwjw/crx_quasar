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
There are two main functionalities that the extension can do which is to save any text selection or save the details of a Facebook post. After the extension is mounted on the chrome browser, pin the extension or click on the extension icon to open the popup page. The purpose of the popup page is to turn the extension on/off. When the extension is on, then there will be a button on the bottom of the page to toggle the drawer open/close. 

### Details:

### Things to note:
Using Quasar's bex mode allows us to have access to a bridge for communication. But is it better to use the bridge or standard chrome message passing? The latest implementation uses chrome message passing for all communciations except for the get/save/delete functions in [storage.access.js](src/services/storage.access.js)

### Communication:


### Functionalities that can be added:
### Component Branches
* [Trending/SandDance](https://github.com/eugenesiow/dso-viz/tree/nhs-test) - Visualise individual datapoints, not aggregates, all at once in 3D and transit between layouts.


## Open Projects
* [Trending/Perspective](docs/project_trending_perspective.md)

