import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {value: {}}

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: reducers
})

export const { setSubject } = subjectSlice.actions

export default subjectSlice.reducer