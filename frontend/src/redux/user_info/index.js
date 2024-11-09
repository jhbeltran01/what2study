import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'

const initialState = {value: {}}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: reducers
})

export const { 
  setUserInfo,
} = userInfoSlice.actions

export default userInfoSlice.reducer