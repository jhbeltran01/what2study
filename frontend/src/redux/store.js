import { configureStore } from "@reduxjs/toolkit";
import studypodReducer from "./studypod";
import { loadState, saveState } from './utils' 

const persistedState = loadState()

const store = configureStore({
  reducer: {
    studypod: studypodReducer
  },
  preloadedState: persistedState
})

store.subscribe(() => {
  saveState({
    studypod: store.getState().studypod,
  })
})

export default store