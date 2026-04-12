import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { AdvertisingFilters, Advertisement } from '../../models/advertisingModel'
import { AdvertisingState } from '../advertising.slices'

interface FetchAdvertisementsResponse {
  advertisements: Advertisement[]
  pagination: AdvertisingState['pagination']
}

export const fetchAdvertisements = createAsyncThunk(
  'advertising/fetchAdvertisements',
  async ({
    page = 1,
    limit = 10,
    terms = '',
    isActive,
  }: AdvertisingFilters = {}): Promise<FetchAdvertisementsResponse> => {
    const params: Record<string, string | number | boolean> = {
      page,
      limit,
    }

    if (terms) {
      params.terms = terms
    }
    if (isActive !== undefined) {
      params.isActive = isActive
    }

    const response = await mainCustomAxios.get('/advertisements', { params })

    return {
      advertisements: response.data.data,
      pagination: response.data.pagination,
    }
  }
)

interface CreateAsyncFetchAdvertisementsReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncFetchAdvertisementsReducer = ({
  builder,
}: CreateAsyncFetchAdvertisementsReducerArgs) => {
  builder
    .addCase(fetchAdvertisements.pending, (state: AdvertisingState) => {
      state.loading = true
      state.error = null
    })
    .addCase(
      fetchAdvertisements.fulfilled,
      (state: AdvertisingState, action: PayloadAction<FetchAdvertisementsResponse>) => {
        state.loading = false
        state.advertisements = action.payload.advertisements
        state.pagination = action.payload.pagination
      }
    )
    .addCase(
      fetchAdvertisements.rejected,
      (state: AdvertisingState, action) => {
        state.loading = false
        state.error = action.error.message || 'No se pudo obtener la publicidad'
      }
    )
}
