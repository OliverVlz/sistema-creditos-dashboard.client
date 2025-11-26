import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ProfileData, ProfileState } from '../../models/profileModel'

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async () => {
    const response = await mainCustomAxios.get('/clients/me/profile')
    return response.data as ProfileData
  }
)

interface createAsyncFetchMyProfileReducerArgs {
  builder: ActionReducerMapBuilder<ProfileState>
}

export const createAsyncFetchMyProfileReducer = ({
  builder,
}: createAsyncFetchMyProfileReducerArgs) => {
  builder
    .addCase(fetchMyProfile.pending, (state: ProfileState) => {
      state.loading = true
      state.error = null
    })
    .addCase(
      fetchMyProfile.fulfilled,
      (state: ProfileState, action: PayloadAction<ProfileData>) => {
        state.loading = false
        state.profile = action.payload
      }
    )
    .addCase(
      fetchMyProfile.rejected,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: ProfileState, action: any) => {
        state.loading = false
        state.error = action.error.message
      }
    )
}

