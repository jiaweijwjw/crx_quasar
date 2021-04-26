// outside of a Vue file
// import { LocalStorage } from 'quasar'

// LocalStorage.set(key, value)
// let value = LocalStorage.getItem(key)
import Storage from "../../services/storage.access";

export function initData({ commit }) {
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
}

export function addChunk({ commit }, chunk) {
  // commit("addChunk", { [chunk.id]: chunk });
  commit("addChunk", chunk);
}
