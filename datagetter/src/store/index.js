import Vue from "vue";
import Vuex from "vuex";

import chunkstore from "./store-chunk";
import fbpoststore from "./store-fbpost";

Vue.use(Vuex);

let store = null;

export default function(/* { ssrContext } */) {
  store = new Vuex.Store({
    modules: {
      chunkstore,
      fbpoststore
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  });

  return store;
}

export { store }; // to be able to import and use in any js files
