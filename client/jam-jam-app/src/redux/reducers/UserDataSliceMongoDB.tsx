import {createSlice, PayloadAction} from "@reduxjs/toolkit"
export interface UserDataSliceMongoDB {
  _id: string
  email: string
  userName: string
  firstName: string
  lastName: string
  country: string
  isoCode: string
  city: string
  region: string
  age: number
  gender: string
  genres: string[]
  instruments: string[]
  img: string
  references: string
  oboutMe: string
  links: string[]
  dob: Date
  reports: Report[]
  friends: string[]
  createdAt: Date
  role: string
}

export interface Report {
  reporter: string
  reason: string
  date: Date
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
