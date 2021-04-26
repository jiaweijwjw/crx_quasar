import Vue from "vue";

export function setChunks(state, chunks) {
  state.chunks = Object.assign({}, state.chunks, chunks);
  // state.chunks = chunks;
}

export function addChunk(state, chunk) {
  // Object.assign(state.chunks, chunk);
  // state.chunks = { ...state.chunks, [chunk.id]: chunk };
  Vue.set(state.chunks, chunk.id, chunk);
}
