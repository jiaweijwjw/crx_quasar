const util = require("util");
import Vue from "vue";
import Storage from "../services/storage.access";

const defaultState = () => {
  return {
    chunks: {},
    selectedChunks: []
  };
};

const state = defaultState();

const mutations = {
  resetState(state) {
    // Merge rather than replace so we don't lose observers
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, defaultState());
  },
  setChunks(state, chunks) {
    state.chunks = Object.assign({}, state.chunks, chunks);
    // state.chunks = chunks;
  },
  addChunk(state, chunk) {
    // Object.assign(state.chunks, chunk);
    // state.chunks = { ...state.chunks, [chunk.id]: chunk };
    Vue.set(state.chunks, chunk.id, chunk);
  },
  setSelectedChunks(state, selection) {
    state.selectedChunks = selection;
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  initData({ commit }) {
    Storage.get("chunks")
      .then(res => {
        console.log(res);
        if (res) {
          commit("setChunks", res);
        } else {
          commit("setChunks", {});
        }
      })
      .catch(() => {
        commit("setChunks", {});
      });
  },
  addChunk({ commit }, chunk) {
    // commit("addChunk", { [chunk.id]: chunk });
    commit("addChunk", chunk);
  },
  setSelectedChunks({ commit }, selection) {
    commit("setSelectedChunks", selection);
  }
};

const getters = {
  getChunks: state => {
    return state.chunks;
  },
  getSelectedChunks: state => {
    return state.selectedChunks;
  },
  getSelectedChunksIds: state => {
    return state.selectedChunks.map(chunk => chunk.id);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
