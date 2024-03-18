import {createSlice} from "@reduxjs/toolkit"
import type {RootState} from "../store"

interface JammersDataSlice {
  data: any
  status: boolean
}

const initialState: JammersDataSlice = {
  data: [] || undefined,
  status: true,
}

const jammersDataSlice = createSlice({
  name: "jammersData",
  initialState,
  reducers: {
    setUsersData: (state, action) => {
      state.data = action.payload
    },
    setUsersDataUpdated: (state) => {
      state.status = !state.status
    },
    resetUsersData: (state) => {
      state.data = ""
    },
  },
})

export const {setUsersData, setUsersDataUpdated, resetUsersData} =
  jammersDataSlice.actions
export default jammersDataSlice.reducer

// export const selectCount = (state: RootState) => state.vcData.data;
