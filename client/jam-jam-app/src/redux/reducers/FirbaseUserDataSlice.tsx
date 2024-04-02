// userSlice.tsx
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User as FirebaseUser} from "firebase/auth"

interface UserState {
  firebaseUserData: FirebaseUser | null
}

const initialState: UserState = {
  firebaseUserData: null,
}

const firebaseDataSlice = createSlice({
  name: "firbaseUser",
  initialState,
  reducers: {
    setFirebaseUserData: (state, action: PayloadAction<FirebaseUser>) => {
      state.firebaseUserData = action.payload
    },
    clearFirebaseUserData: (state) => {
      state.firebaseUserData = null
    },
  },
})

export const {setFirebaseUserData, clearFirebaseUserData} =
  firebaseDataSlice.actions

export const selectFirebaseUserData = (state: {
  firebaseUserData: FirebaseUser
}) => state.firebaseUserData

export default firebaseDataSlice.reducer

export type {UserState}
