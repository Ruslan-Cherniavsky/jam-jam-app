import {configureStore} from "@reduxjs/toolkit"
import firebaseDataSlice from "./reducers/FirbaseUserDataSlice"
import userDataSliceMongoDB from "./reducers/UserDataSliceMongoDB"

const store = configureStore({
  reducer: {
    userDataMongoDB: userDataSliceMongoDB,
    firbaseUser: firebaseDataSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
