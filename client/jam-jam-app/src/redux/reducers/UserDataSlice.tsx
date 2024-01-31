import {createSlice} from "@reduxjs/toolkit"
import type {RootState} from "../store"

// TODO_____update user reducer. create data reducer with paylod

interface UserDataSlice {
  userName: string
  userRole: string
  userId: string
}

const initialState: UserDataSlice = {
  userName: "",
  userRole: "",
  userId: "",
}

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload
    },
    resetUserName: (state) => {
      state.userName = ""
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload
    },
    resetUserRole: (state) => {
      state.userRole = ""
    },
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    resetUserId: (state) => {
      state.userId = ""
    },
  },
})

export const {
  setUserName,
  resetUserName,
  setUserRole,
  resetUserRole,
  setUserId,
  resetUserId,
} = userDataSlice.actions

export default userDataSlice.reducer

export const selecUserName = (state: RootState) => state.userData.userName
export const selecUserRole = (state: RootState) => state.userData.userRole
export const selecUserId = (state: RootState) => state.userData.userId
