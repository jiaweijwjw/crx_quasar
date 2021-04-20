export default {
  /**
   * This will ask for ALL items from chrome storage and return only the ones we're interested in.
   * An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
   * @param type
   */
  getAll() {
    return this.get(null).then(allItems => {
      //   return allItems.filter(f => f && f.type && f.type === type);
      return allItems;
    });
  },

  /**
   * Use the bridge to contact the background BEX script and get a given key from BEX storage.
   * @param key
   * @param id
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
   * Use the bridge to contact the background BEX script and save a given key to the BEX storage.
   * @param key
   * @param data
   * @returns {Promise<unknown>}
   */
  save(key, data) {
    return window.QBexBridge.send("storage.set", { key, data }).then(event => {
      console.log("Saving data popup side: " + event.data);
      return event.data;
    });
  },

  /**
   * Use the bridge to contact the background BEX script and delete a given key from BEX storage.
   * @param key
   * @param id
   * @returns {Promise<unknown>}
   */
  delete(key, id) {
    return window.QBexBridge.send("storage.remove", {
      key: `${key}.${id}`
    }).then(event => {
      console.log("Removing data popup side: " + event.data);
    });
  }
};
