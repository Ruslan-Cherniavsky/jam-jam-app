// store.tsx
import {configureStore} from "@reduxjs/toolkit"

import firebaseDataSlice from "./reducers/FirbaseUserDataSlice"
import usersDataSlice from "./reducers/JammersDataSliceMongoDB"
import userDataSlice from "./reducers/UserDataSlice"
import userDataSliceMongoDB from "./reducers/UserDataSliceMongoDB"

const store = configureStore({
  reducer: {
    usersData: usersDataSlice,
    userData: userDataSlice,
    userDataMongoDB: userDataSliceMongoDB,
    firbaseUser: firebaseDataSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
