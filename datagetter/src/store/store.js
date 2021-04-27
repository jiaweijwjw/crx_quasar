const util = require("util");
import Vue from "vue";
import Storage from "../services/storage.access";

const defaultState = () => {
  return {
    chunks: {},
    selectedChunks: []
  };
};

const updateChunks = (newChunks = null) => {
  if (newChunks === null) {
    return {
      chunks: {},
      selectedChunks: []
    };
  } else {
    return {
      chunks: newChunks,
      selectedChunks: []
    };
  }
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
  },
  addChunk(state, chunk) {
    Vue.set(state.chunks, chunk.id, chunk);
  },
  setSelectedChunks(state, selection) {
    state.selectedChunks = selection;
  },
  deleteAllChunks(state) {
    Object.assign(state, updateChunks()); // have to do this to maintain reactivity
  },
  deleteChunks(state, chunksAfterDeletion) {
    Object.assign(state, updateChunks(chunksAfterDeletion));
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
    commit("addChunk", chunk);
  },
  setSelectedChunks({ commit }, selection) {
    commit("setSelectedChunks", selection);
  },
  deleteAllChunks({ commit }) {
    Storage.deleteAllChunks().then(() => {
      commit("deleteChunks");
    });
  },
  async deleteChunks({ commit, getters }, selection) {
    // selection is an array of strings of the id of the selected chunks
    const removeProperties = async () => {
      let cloneChunks = { ...getters["getChunks"] }; // cannot directly assign the getters["getChunks"]
      for (let i = 0; i < selection.length; i++) {
        delete cloneChunks[selection[i]];
      }
      return cloneChunks;
    };
    let chunksAfterDeletion = await removeProperties();
    Storage.updateChunks(chunksAfterDeletion).then(() => {
      commit("deleteChunks", chunksAfterDeletion);
    });
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
