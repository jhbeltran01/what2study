import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {}

export const reviewerSlice = createSlice({
  name: 'reviewer',
  initialState,
  reducers: reducers
})

export const { 
  setReviewer, 
  setReviewerSlug,
  setReviewerIsPublic, 
} = reviewerSlice.actions

export default reviewerSlice.reducer