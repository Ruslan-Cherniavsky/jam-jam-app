import {configureStore} from "@reduxjs/toolkit"
import firebaseDataSlice from "./reducers/FirbaseUserDataSlice"
import userDataSliceMongoDB from "./reducers/UserDataSliceMongoDB"
import userNotificationsSlice from "./reducers/UserNotifications"

const store = configureStore({
  reducer: {
    userDataMongoDB: userDataSliceMongoDB,
    firbaseUser: firebaseDataSlice,
    userNotifications: userNotificationsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
