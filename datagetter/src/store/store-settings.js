import Storage from "../services/storage.access";
import { router } from "../router/index";
import { DEFAULT_ROUTE } from "../router/routes";

const defaultState = () => {
  return {
    appStatusToggle: null,
    drawerStatusToggle: null,
    sideDrawer: false
  };
};

const state = defaultState();

const mutations = {
  resetState(state) {
    Object.assign(state, defaultState());
  },
  setAppStatusToggle(state, appStatusToggle) {
    state.appStatusToggle = appStatusToggle;
  },
  setDrawerStatusToggle(state, drawerStatusToggle) {
    state.drawerStatusToggle = drawerStatusToggle;
  },
  setSideDrawer(state, sideDrawer) {
    state.sideDrawer = sideDrawer;
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  setAppStatusToggle({ commit }, appStatusToggle) {
    Storage.save("appStatusToggle", appStatusToggle).then(res => {
      commit("setAppStatusToggle", res);
    });
  },
  setDrawerStatusToggle({ commit }, drawerStatusToggle) {
    Storage.save("drawerStatusToggle", drawerStatusToggle).then(res => {
      commit("setDrawerStatusToggle", res);
      this._vm.$q.bex.send("toggle.drawer", {
        showDrawer: res
      });
    });
  },
  setSideDrawer({ commit }, sideDrawer) {
    commit("setSideDrawer", sideDrawer);
  },
  async initCrxBrowser({ commit }) {
    Storage.get("drawerStatusToggle").then(res => {
      commit("setDrawerStatusToggle", res);
    });
    Storage.get("crxBrowserPageView").then(res => {
      if (res !== DEFAULT_ROUTE) {
        router.push({ name: res });
      }
    });
  },
  async initCrxPopup({ commit }) {
    Storage.get("appStatusToggle").then(res => {
      if (!res) {
        // first time accessing the extension, appStatusToggle in storage will be undefined.
        Storage.save("appStatusToggle", false).then(res => {
          commit("setAppStatusToggle", res);
        });
      } else {
        commit("setAppStatusToggle", res);
      }
    });
  }
};

const getters = {
  getAppStatusToggle: state => {
    return state.appStatusToggle;
  },
  getDrawerStatusToggle: state => {
    return state.drawerStatusToggle;
  },
  getSideDrawer: state => {
    return state.sideDrawer;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
