import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {}

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: reducers
})

export const { 
  setNote,
  updateNote,
} = noteSlice.actions

export default noteSlice.reducer