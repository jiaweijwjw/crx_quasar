const util = require("util");
import Vue from "vue";
import Storage from "../services/storage.access";

const defaultState = () => {
  return {
    posts: {},
    selectedPosts: []
  };
};

const updatePosts = (newPosts = null) => {
  if (newPosts === null) {
    return {
      posts: {},
      selectedPosts: []
    };
  } else {
    return {
      posts: newPosts,
      selectedPosts: []
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
  setPosts(state, posts) {
    state.posts = Object.assign({}, state.posts, posts);
  },
  addPost(state, post) {
    Vue.set(state.posts, post.id, post);
  },
  setSelectedPosts(state, selection) {
    state.selectedPosts = selection;
  },
  // deleteAllPosts(state) {
  //   Object.assign(state, updatePosts()); // have to do this to maintain reactivity
  // },
  deletePosts(state, postsAfterDeletion) {
    Object.assign(state, updatePosts(postsAfterDeletion));
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  initPostData({ commit }) {
    Storage.getAllPosts()
      .then(res => {
        console.log(res);
        // let postsObj = Object.assign({}, res); // this will have keys starting from 0 instead of the post id.
        let postsObj = res.reduce(
          (objInArr, post) => ((objInArr[post.id] = post), objInArr),
          {}
        );
        console.log(postsObj);
        commit("setPosts", postsObj);
      })
      .catch(() => {
        commit("setPosts", {});
      });
  },
  addPost({ commit }, post) {
    return new Promise((resolve, reject) => {
      Storage.addPost(post).then(
        res => {
          commit("addPost", post);
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  setSelectedPosts({ commit }, selection) {
    commit("setSelectedPosts", selection);
  },
  deleteAllPosts({ commit, getters }) {
    let allPostsIds = Object.keys(getters["getPosts"]);
    Storage.deletePosts(allPostsIds).then(() => {
      commit("deletePosts");
    });
  },
  async deletePosts({ commit, getters }, selection) {
    // selection is an array of strings of the id of the selected posts
    const removeProperties = async () => {
      let clonePosts = {
        ...getters["getPosts"]
      }; // cannot directly assign the getters["getPosts"]
      for (let i = 0; i < selection.length; i++) {
        delete clonePosts[selection[i]];
      }
      return clonePosts;
    };
    let postsAfterDeletion = await removeProperties();
    Storage.deletePosts(selection).then(() => {
      commit("deletePosts", postsAfterDeletion);
    });
  }
};

const getters = {
  getPosts: state => {
    return state.posts;
  },
  getSelectedPosts: state => {
    return state.selectedPosts;
  },
  getSelectedPostsIds: state => {
    return state.selectedPosts.map(post => post.id);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
