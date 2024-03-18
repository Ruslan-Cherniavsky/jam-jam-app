// userSlice.tsx
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User as FirebaseUser} from "firebase/auth"
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
  genres: string[] // Assuming genre IDs are stored as strings
  instruments: string[] // Assuming instrument IDs are stored as strings
  img: string
  references: string
  oboutMe: string
  links: string[]
  dob: Date
  reports: Report[]
  // friendRequests: FriendRequest[]
  friends: string[] // Assuming friend IDs are stored as strings
  createdAt: Date
  role: string
}

export interface Report {
  reporter: string // Assuming reporter ID is stored as a string
  reason: string
  date: Date
}

// export interface FriendRequest {
//   userId: string // Assuming user ID is stored as a string
//   status: "pending" | "approved" | "rejected"
// }

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
