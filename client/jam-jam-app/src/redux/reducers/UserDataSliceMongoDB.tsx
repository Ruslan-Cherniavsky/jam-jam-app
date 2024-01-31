// userSlice.tsx
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User as FirebaseUser} from "firebase/auth"

interface UserDataSliceMongoDB {
  userName: string
  userRole: string
  userId: string
  musicalGaners: any
}

interface UserDataStateMongoDB {
  allUserData: UserDataSliceMongoDB | null
}

const initialState: UserDataStateMongoDB = {
  allUserData: null,
}

const userDataSliceMongoDB = createSlice({
  name: "allUserData",
  initialState,
  reducers: {
    setUserDataMongoDB: (
      state,
      action: PayloadAction<UserDataSliceMongoDB>
    ) => {
      state.allUserData = action.payload
    },
    clearUserDataMongoDB: (state) => {
      state.allUserData = null
    },
  },
})

export const {setUserDataMongoDB, clearUserDataMongoDB} =
  userDataSliceMongoDB.actions

// Selector function to get user data from the state

export default userDataSliceMongoDB.reducer

export type {UserDataStateMongoDB}
