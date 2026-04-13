import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ProfileData, ProfileState } from '../../models/profileModel'
import { getUser } from '../../../../core/services/auth.service'

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async () => {
    const user = getUser()
    const role = user?.role?.toUpperCase()
    const endpoint =
      role === 'CLIENTE' ? '/clients/me/profile' : '/users/me'
    const response = await mainCustomAxios.get(endpoint)
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

