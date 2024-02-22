// userSlice.tsx
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User as FirebaseUser} from "firebase/auth"

export interface UserDataSliceMongoDB {
  _id: string
  email: string
  userRole: string
  //---
  img: string
  userName: string
  firstName: string
  lastName: string
  city: string
  region: string
  isoCode: string
  country: string
  age: number
  gender: string
  genres: Array<Object>
  instruments: Array<Object>
  links: Array<string>
  oboutMe: string
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

export default userDataSliceMongoDB.reducer

export type {UserDataStateMongoDB}
