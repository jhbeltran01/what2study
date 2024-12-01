import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {value: []}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: reducers,
})

export const { 
  setTodos,
  addTodoItem,
  deleteTodoItem,
  todosUpdateTodoItem,
} = todosSlice.actions

export default todosSlice.reducer