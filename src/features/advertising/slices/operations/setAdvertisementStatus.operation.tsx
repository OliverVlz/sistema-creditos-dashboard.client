import {
  ActionReducerMapBuilder,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { Advertisement } from '../../models/advertisingModel'
import { AdvertisingState } from '../advertising.slices'

interface SetStatusPayload {
  id: string
  isActive: boolean
}

export const setAdvertisementStatus = createAsyncThunk(
  'advertising/setAdvertisementStatus',
  async (payload: SetStatusPayload): Promise<Advertisement> => {
    const endpoint = payload.isActive ? 'activate' : 'deactivate'
    const response = await mainCustomAxios.post(
      `/advertisements/${payload.id}/${endpoint}`
    )
    return response.data
  }
)

interface CreateAsyncSetAdvertisementStatusReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncSetAdvertisementStatusReducer = ({
  builder,
}: CreateAsyncSetAdvertisementStatusReducerArgs) => {
  builder
    .addCase(setAdvertisementStatus.pending, (state: AdvertisingState) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(setAdvertisementStatus.fulfilled, (state: AdvertisingState, action) => {
      state.saving = false
      state.saveError = null
      state.advertisements = state.advertisements.map((item) =>
        item.id === action.payload.id ? action.payload : item
      )
    })
    .addCase(setAdvertisementStatus.rejected, (state: AdvertisingState, action) => {
      state.saving = false
      state.saveError = action.error.message || 'No se pudo cambiar el estado'
    })
}
