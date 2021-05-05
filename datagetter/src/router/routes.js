// App is small, skip the lazy loading benefits as they could add more overhead than what it’s worth.
import BrowserLayout from "layouts/BrowserLayout.vue";
import PopupLayout from "layouts/PopupLayout.vue";
import AddChunkPage from "pages/AddChunkPage.vue";
import AddFBPostPage from "pages/AddFBPostPage.vue";
import PopupPage from "pages/PopupPage.vue";
import Error404 from "pages/Error404.vue";

const routes = [
  {
    path: "/",
    component: BrowserLayout,
    children: [
      { path: "/", redirect: "/addchunk" },
      { name: "AddChunkPage", path: "/addchunk", component: AddChunkPage },
      { name: "AddFBPostPage", path: "/addpost", component: AddFBPostPage }
    ]
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
