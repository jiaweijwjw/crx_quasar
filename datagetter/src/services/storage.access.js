export default {
  /**
   * An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
   */
  getAll() {
    return this.get(null).then(allItems => {
      console.log(allItems);
      //   return allItems.filter(f => f && f.type && f.type === type);
      return allItems;
    });
  },

  /**
   * @returns {Promise<unknown>}
   */
  get(key, id = null) {
    const useKey = id ? `${key}.${id}` : key;
    return window.QBexBridge.send("storage.get", {
      key: useKey
    }).then(event => {
      console.log("Getting data popup side: " + event.data);
      return event.data;
    });
  },

  /**
   * @returns {Promise<unknown>}
   */
  save(key, data) {
    return window.QBexBridge.send("storage.set", { key, data }).then(event => {
      console.log("Saving data popup side: " + event.data);
      return event.data;
    });
  },

  deleteAllChunks() {
    return this.delete("chunks");
  },

  /**
   * uses chrome.storage.sync.set as all our chunks are stored in 1 single "chunk" key
   * chrome.storage API only gives access to top level keys
   */
  updateChunks(newChunks) {
    return this.save("chunks", newChunks);
  },

  /**
   * @returns {Promise<unknown>}
   */
  delete(key, id = null) {
    const useKey = id ? `${key}.${id}` : key;
    return window.QBexBridge.send("storage.remove", {
      keys: useKey // `${key}.${id}`
    }).then(event => {
      console.log("Removing data popup side: " + event.data);
    });
  }
};
