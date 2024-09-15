import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {}

export const studypodSlice = createSlice({
  name: 'studypod',
  initialState,
  reducers: reducers
})

export const { setStudypod } = studypodSlice.actions

export default studypodSlice.reducer