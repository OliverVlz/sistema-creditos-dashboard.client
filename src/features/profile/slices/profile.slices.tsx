import { createSlice } from "@reduxjs/toolkit"
import { createAsyncFetchMyProfileReducer } from "./operations/fetchMyProfile.operation"
import { createAsyncUpdateMyProfileReducer } from "./operations/updateMyProfile.operation"
import { ProfileState } from "../models/profileModel"

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null
      state.error = null
      state.updateError = null
    },
    clearProfileErrors: (state) => {
      state.error = null
      state.updateError = null
    }
  },
  extraReducers: (builder) => {
    createAsyncFetchMyProfileReducer({ builder })
    createAsyncUpdateMyProfileReducer({ builder })
  }
})

export const { clearProfile, clearProfileErrors } = profileSlice.actions
export default profileSlice.reducer

