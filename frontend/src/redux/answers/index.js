import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {value: {}}

export const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: reducers
})

export const { 
  setAnswers,
  addUserAnswer,
  setCheckedAnswers,
} = answersSlice.actions

export default answersSlice.reducer