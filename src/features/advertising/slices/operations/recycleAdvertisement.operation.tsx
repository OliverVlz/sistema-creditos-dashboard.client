import {
  ActionReducerMapBuilder,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { Advertisement } from '../../models/advertisingModel'
import { AdvertisingState } from '../advertising.slices'

interface RecycleAdvertisementPayload {
  id: string
  historyId: string
}

export const recycleAdvertisement = createAsyncThunk(
  'advertising/recycleAdvertisement',
  async (payload: RecycleAdvertisementPayload): Promise<Advertisement> => {
    const response = await mainCustomAxios.post(
      `/advertisements/${payload.id}/recycle`,
      { historyId: payload.historyId }
    )
    return response.data
  }
)

interface CreateAsyncRecycleAdvertisementReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncRecycleAdvertisementReducer = ({
  builder,
}: CreateAsyncRecycleAdvertisementReducerArgs) => {
  builder
    .addCase(recycleAdvertisement.pending, (state: AdvertisingState) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(recycleAdvertisement.fulfilled, (state: AdvertisingState, action) => {
      state.saving = false
      state.saveError = null
      state.advertisements = state.advertisements.map((item) =>
        item.id === action.payload.id ? action.payload : item
      )
    })
    .addCase(recycleAdvertisement.rejected, (state: AdvertisingState, action) => {
      state.saving = false
      state.saveError = action.error.message || 'No se pudo reciclar la versión'
    })
}
