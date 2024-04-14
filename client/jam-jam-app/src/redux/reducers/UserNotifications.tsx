import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface Notifications {
  friendRequestsNumber: number
  jamRequestsNumber: number
  jamInvitesNumber: number
}

const initialState: Notifications = {
  friendRequestsNumber: 0,
  jamRequestsNumber: 0,
  jamInvitesNumber: 0,
}

const userNotificationsSlice = createSlice({
  name: "UserNotifications",
  initialState,
  reducers: {
    setFriendRequestsNumber: (state, action: PayloadAction<number>) => {
      state.friendRequestsNumber = action.payload
    },
    setJamRequestsNumber: (state, action: PayloadAction<number>) => {
      state.jamRequestsNumber = action.payload
    },
    setJamInvitesNumber: (state, action: PayloadAction<number>) => {
      state.jamInvitesNumber = action.payload
    },
  },
})

export const {
  setFriendRequestsNumber,
  setJamRequestsNumber,
  setJamInvitesNumber,
} = userNotificationsSlice.actions

export default userNotificationsSlice.reducer
