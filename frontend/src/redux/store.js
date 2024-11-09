import { configureStore } from "@reduxjs/toolkit";
import studypodReducer from "./studypod";
import reviewerReducer from './reviewer'
import noteReducer from './note'
import notesReducer from './notes'
import todosReducer from './todos'
import todoReducer from './todo'
import userInfoReducer from './user_info'
import subjectReducer from './subject'
import { loadState, saveState } from './utils' 

const persistedState = loadState()

const store = configureStore({
  reducer: {
    studypod: studypodReducer,
    reviewer: reviewerReducer,
    note: noteReducer,
    notes: notesReducer,
    todos: todosReducer,
    todo: todoReducer,
    userInfo: userInfoReducer,
    subject: subjectReducer,
  },
  preloadedState: persistedState
})

store.subscribe(() => {
  saveState({
    studypod: store.getState().studypod,
    reviewer: store.getState().reviewer,
    note: store.getState().note,
    notes: store.getState().notes,
    todos: store.getState().todos,
    todo: store.getState().todo,
    userInfo: store.getState().userInfo,
    subject: store.getState().subject,
  })
})

export default store