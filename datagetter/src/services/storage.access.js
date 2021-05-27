export default {
  // get, save and delete returns a Promise
  get(key, id = null) {
    const useKey = id ? `${key}.${id}` : key;
    return window.QBexBridge.send("storage.get", {
      key: useKey
    }).then(event => {
      return event.data;
    });
  },

  save(key, data) {
    return window.QBexBridge.send("storage.set", { key, data }).then(event => {
      return event.data;
    });
  },

  delete(key, id = null) {
    const useKey = id ? `${key}.${id}` : key;
    return window.QBexBridge.send("storage.remove", {
      keys: useKey
    });
  },

  // An empty list or object will return an empty result object. Pass in null to get the entire contents of chrome storage.
  getAll() {
    return this.get(null).then(allItems => {
      return allItems;
    });
  },

  // getAllPost() instead of getAll().filter() because deletion from object by key in background-hooks chrome storage is more efficient
  // than filtering the returned array and removing the array items which are not posts.
  getAllPosts() {
    return window.QBexBridge.send("storage.get.all.posts", {}).then(event => {
      return event.data;
    });
  },

  deletePosts(postsToDeleteIds) {
    // postsToDeleteIds is an array of strings of ids
    return this.delete(postsToDeleteIds);
  },

  // each individual post is saved as a key-value pair in chrome storage
  // but each individual chunk is saved as a property in 1 single "chunk" key in chrome storage
  // note that chrome.storage API only gives access to top level keys
  // hence when updating / deleting a chunk, we have to replace the entire "chunk" key in chrome storage
  updateChunks(newChunks) {
    return this.save("chunks", newChunks);
  },

  deleteAllChunks() {
    return this.delete("chunks");
  }
};
