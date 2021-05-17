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
  deleteChunks(state, chunksAfterDeletion) {
    Object.assign(state, updateChunks(chunksAfterDeletion));
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  initChunkData({ commit }) {
    Storage.get("chunks")
      .then(res => {
        commit("setChunks", res);
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
    const removeProperties = async () => {
      let cloneChunks = { ...getters["getChunks"] };
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
