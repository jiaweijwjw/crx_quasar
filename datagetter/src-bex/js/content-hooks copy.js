// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.

const iFrame = document.createElement("iframe"),
  defaultFrameHeight = "0px",
  defaultFrameWidth = "0px";

const setIFrameDimensions = (height, width) => {
  iFrame.height = height;
  iFrame.width = width;
  document.body.style.paddingLeft = width;
};

const resetIFrame = () => {
  setIFrameDimensions(defaultFrameHeight, defaultFrameWidth);
};

let Bridge = null;
export default function attachContentHooks(bridge) {
  bridge.on("toggle.drawer", event => {
    const payload = event.data;
    if (payload.openDrawer) {
      setIFrameDimensions("100%", "100%");
      // setIFrameDimensions("100%", "300px");
    } else {
      resetIFrame();
    }
    bridge.send(event.eventResponseKey);
  });

  Bridge = bridge;
}

// function addElWithClass(tag, className, container) {
//   const item = document.createElement(tag);
//   item.className = className;
//   container.append(item);
//   return item;
// }

iFrame.id = "app-iframe";
iFrame.width = "100%";
resetIFrame();

// Assign some styling so it looks seamless
Object.assign(iFrame.style, {
  position: "fixed",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  border: "0",
  zIndex: "2147483001",
  overflow: "visible"
});

(function() {
  // IIFE. When the page loads, insert our browser extension code.
  iFrame.src = chrome.runtime.getURL("www/index.html");
  document.body.prepend(iFrame);

  // const elements = document.querySelectorAll('.rc')
  // for (const element of elements) {
  //   const container = addElWithClass('div', 'bex-add-todo__container', element)
  //   const addTodo = addElWithClass('button', 'bex-btn', container)
  //   addTodo.innerHTML = '+ Todo'

  //   const clickFn = () => {
  //     Bridge.send('bex.add.todo', {
  //       text: element.querySelector('.r a h3').innerText,
  //       link: element.querySelector('.r a').href
  //     })
  //   }

  //   addTodo.addEventListener('click', clickFn)
  // }
})();
