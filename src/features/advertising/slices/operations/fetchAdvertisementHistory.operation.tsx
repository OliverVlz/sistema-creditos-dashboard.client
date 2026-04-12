import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { AdvertisementHistoryItem } from '../../models/advertisingModel'
import { AdvertisingState } from '../advertising.slices'

export const fetchAdvertisementHistory = createAsyncThunk(
  'advertising/fetchAdvertisementHistory',
  async (id: string): Promise<AdvertisementHistoryItem[]> => {
    const response = await mainCustomAxios.get(`/advertisements/${id}/history`)
    return response.data
  }
)

interface CreateAsyncFetchAdvertisementHistoryReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncFetchAdvertisementHistoryReducer = ({
  builder,
}: CreateAsyncFetchAdvertisementHistoryReducerArgs) => {
  builder
    .addCase(fetchAdvertisementHistory.pending, (state: AdvertisingState) => {
      state.loading = true
      state.error = null
    })
    .addCase(
      fetchAdvertisementHistory.fulfilled,
      (state: AdvertisingState, action: PayloadAction<AdvertisementHistoryItem[]>) => {
        state.loading = false
        state.history = action.payload
      }
    )
    .addCase(fetchAdvertisementHistory.rejected, (state: AdvertisingState, action) => {
      state.loading = false
      state.error = action.error.message || 'No se pudo obtener el histórico'
    })
}
