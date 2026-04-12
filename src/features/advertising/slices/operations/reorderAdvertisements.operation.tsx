import {
  ActionReducerMapBuilder,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { AdvertisingState } from '../advertising.slices'
import { fetchAdvertisements } from './fetchAdvertisements.operation'

interface ReorderItem {
  id: string
  sortOrder: number
}

export const reorderAdvertisements = createAsyncThunk(
  'advertising/reorderAdvertisements',
  async (items: ReorderItem[], thunkApi) => {
    await mainCustomAxios.patch('/advertisements/reorder', { items })
    await thunkApi.dispatch(fetchAdvertisements({}))
    return items
  }
)

interface CreateAsyncReorderAdvertisementsReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncReorderAdvertisementsReducer = ({
  builder,
}: CreateAsyncReorderAdvertisementsReducerArgs) => {
  builder
    .addCase(reorderAdvertisements.pending, (state: AdvertisingState) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(reorderAdvertisements.fulfilled, (state: AdvertisingState) => {
      state.saving = false
      state.saveError = null
    })
    .addCase(reorderAdvertisements.rejected, (state: AdvertisingState, action) => {
      state.saving = false
      state.saveError = action.error.message || 'No se pudo reordenar'
    })
}
