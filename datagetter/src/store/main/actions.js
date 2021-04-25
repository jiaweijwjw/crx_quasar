// outside of a Vue file
// import { LocalStorage } from 'quasar'

// LocalStorage.set(key, value)
// let value = LocalStorage.getItem(key)
import Storage from "../../services/storage.access";

export function initData({ commit }) {
  Storage.get("chunks")
    .then(res => {
      console.log(res);
      commit("setChunks", res);
    })
    .catch(() => {
      commit("setChunks", {});
    });
}
