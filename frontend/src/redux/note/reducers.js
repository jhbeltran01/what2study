export default {
  setNote: (state, action) => {
    state.value = action.payload
  },
  updateNote: (state, action) => {
    state.value = {
      ...state.value,
      ...action.payload
    }
  }
}