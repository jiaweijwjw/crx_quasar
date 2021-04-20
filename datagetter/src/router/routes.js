// App is small, skip the lazy loading benefits as they could add more overhead than what it’s worth.
import BrowserLayout from "layouts/BrowserLayout.vue";
import PopupLayout from "layouts/PopupLayout.vue";
import BrowserDrawerPage from "pages/BrowserDrawerPage.vue";
import PopupPage from "pages/PopupPage.vue";
import Error404 from "pages/Error404.vue";

const routes = [
  {
    path: "/",
    component: BrowserLayout,
    children: [{ path: "", component: BrowserDrawerPage }]
  },
  {
    path: "/popup",
    component: PopupLayout,
    children: [{ path: "", component: PopupPage }]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: Error404
  }
];

export default routes;
