import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { AdvertisingState } from '../advertising.slices'

interface DeleteAdvertisementResponse {
  id: string
}

export const deleteAdvertisement = createAsyncThunk(
  'advertising/deleteAdvertisement',
  async (id: string): Promise<DeleteAdvertisementResponse> => {
    const response = await mainCustomAxios.delete(`/advertisements/${id}`)
    return response.data
  }
)

interface CreateAsyncDeleteAdvertisementReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncDeleteAdvertisementReducer = ({
  builder,
}: CreateAsyncDeleteAdvertisementReducerArgs) => {
  builder
    .addCase(deleteAdvertisement.pending, (state: AdvertisingState) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(
      deleteAdvertisement.fulfilled,
      (state: AdvertisingState, action: PayloadAction<DeleteAdvertisementResponse>) => {
        state.saving = false
        state.saveError = null
        state.advertisements = state.advertisements.filter(
          (item) => item.id !== action.payload.id
        )
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      }
    )
    .addCase(deleteAdvertisement.rejected, (state: AdvertisingState, action) => {
      state.saving = false
      state.saveError = action.error.message || 'No se pudo eliminar la publicidad'
    })
}
