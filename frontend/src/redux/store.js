import { configureStore } from "@reduxjs/toolkit";
import studypodReducer from "./studypod";
import reviewerReducer from './reviewer'
import { loadState, saveState } from './utils' 

const persistedState = loadState()

const store = configureStore({
  reducer: {
    studypod: studypodReducer,
    reviewer: reviewerReducer,
  },
  preloadedState: persistedState
})

store.subscribe(() => {
  saveState({
    studypod: store.getState().studypod,
    reviewer: store.getState().reviewer,
  })
})

export default store