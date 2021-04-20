import Vue from 'vue'
import Vuex from 'vuex'

import main from './main'

Vue.use(Vuex)

let store = null

export default function (/* { ssrContext } */) {
  store = new Vuex.Store({
    modules: {
      main
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return store
}

export { store } // to be able to import and use in any js files
