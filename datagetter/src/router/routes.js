// App is small, so skip the lazy loading benefits as they could add more overhead than what it’s worth.
import BrowserLayout from "layouts/BrowserLayout.vue";
import PopupLayout from "layouts/PopupLayout.vue";
import AddChunkPage from "pages/AddChunkPage.vue";
import AddFbPostPage from "src/pages/AddFbPostPage.vue";
import PopupPage from "pages/PopupPage.vue";
import Error404 from "pages/Error404.vue";

const routes = [
  {
    path: "/",
    component: BrowserLayout,
    children: [
      { path: "/", redirect: "/addpost" },
      { name: "AddChunkPage", path: "/addchunk", component: AddChunkPage },
      { name: "AddFbPostPage", path: "/addpost", component: AddFbPostPage }
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
