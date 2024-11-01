export default {
  setReviewer: (state, action) => {
    state.value = action.payload
  },
  setReviewerSlug: (state, action) => {
    state.value = {
      ...state.value,
      reviewer: action.payload
    }
  },
  setReviewerIsPublic: (state, action) => {
    state.value = {
      ...state.value,
      is_public: action.payload
    }
  }
}