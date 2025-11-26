import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ProfileData, ProfileState, ProfileUpdateData } from '../../models/profileModel'

export const updateMyProfile = createAsyncThunk(
  'profile/updateMyProfile',
  async (data: ProfileUpdateData) => {
    const response = await mainCustomAxios.patch('/clients/me/profile', data)
    return response.data as ProfileData
  }
)

interface createAsyncUpdateMyProfileReducerArgs {
  builder: ActionReducerMapBuilder<ProfileState>
}

export const createAsyncUpdateMyProfileReducer = ({
  builder,
}: createAsyncUpdateMyProfileReducerArgs) => {
  builder
    .addCase(updateMyProfile.pending, (state: ProfileState) => {
      state.updateLoading = true
      state.updateError = null
    })
    .addCase(
      updateMyProfile.fulfilled,
      (state: ProfileState, action: PayloadAction<ProfileData>) => {
        state.updateLoading = false
        state.profile = action.payload
      }
    )
    .addCase(
      updateMyProfile.rejected,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: ProfileState, action: any) => {
        state.updateLoading = false
        state.updateError = action.error.message
      }
    )
}

