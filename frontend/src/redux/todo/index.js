import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {value: {}}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: reducers
})

export const { 
  setTodo,
} = todoSlice.actions

export default todoSlice.reducer