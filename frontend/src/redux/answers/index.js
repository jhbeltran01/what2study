import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {value: {
  answers: [],
  question_type: '',
  reviewer_slug: ''
}}

export const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: reducers
})

export const { 
  setAnswers,
  addUserAnswer,
  setCheckedAnswers,
  removeLastAnswer,
  pushAnItem,
  addUserAnswerForMultipleChoice,
} = answersSlice.actions

export default answersSlice.reducer