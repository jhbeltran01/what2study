import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = []

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: reducers
})

export const { 
  setNotes, 
} = notesSlice.actions

export default notesSlice.reducer