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
  // Use Vue.set or Object.assign when mutating object states to maintain reactivity
  resetState(state) {
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
        let postsObj = res.reduce(
          (objInArr, post) => ((objInArr[post.id] = post), objInArr),
          {}
        );
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
    // selection is an array of strings of id of the selected posts
    // get the state posts object and remove the selected posts then set the state posts object with the new object after deletion.
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
