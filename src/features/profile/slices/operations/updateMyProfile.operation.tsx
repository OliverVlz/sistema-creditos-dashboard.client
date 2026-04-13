import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ProfileData, ProfileState, ProfileUpdateData } from '../../models/profileModel'
import { getUser } from '../../../../core/services/auth.service'

export const updateMyProfile = createAsyncThunk(
  'profile/updateMyProfile',
  async (data: ProfileUpdateData) => {
    const user = getUser()
    const role = user?.role?.toUpperCase()
    const isClient = role === 'CLIENTE'
    const endpoint = isClient ? '/clients/me/profile' : '/users/me/profile'
    const payload = isClient
      ? data
      : {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
        }
    const response = await mainCustomAxios.patch(endpoint, payload)
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

