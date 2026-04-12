import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { AdvertisingPayload, Advertisement } from '../../models/advertisingModel'
import { AdvertisingState } from '../advertising.slices'

const createFormData = (payload: AdvertisingPayload) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  if (payload.targetUrl.trim()) {
    formData.append('targetUrl', payload.targetUrl.trim())
  }
  formData.append('isRedirectEnabled', String(payload.isRedirectEnabled))
  formData.append('isActive', String(payload.isActive))
  formData.append('sortOrder', String(payload.sortOrder))
  if (payload.startsAt) {
    formData.append('startsAt', payload.startsAt)
  }
  if (payload.endsAt) {
    formData.append('endsAt', payload.endsAt)
  }
  if (payload.image) {
    formData.append('image', payload.image)
  }
  return formData
}

export const createAdvertisement = createAsyncThunk(
  'advertising/createAdvertisement',
  async (payload: AdvertisingPayload): Promise<Advertisement> => {
    const response = await mainCustomAxios.post(
      '/advertisements',
      createFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }
)

interface CreateAsyncCreateAdvertisementReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncCreateAdvertisementReducer = ({
  builder,
}: CreateAsyncCreateAdvertisementReducerArgs) => {
  builder
    .addCase(createAdvertisement.pending, (state: AdvertisingState) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(
      createAdvertisement.fulfilled,
      (state: AdvertisingState, action: PayloadAction<Advertisement>) => {
        state.saving = false
        state.saveError = null
        state.advertisements.unshift(action.payload)
        state.pagination.total += 1
      }
    )
    .addCase(
      createAdvertisement.rejected,
      (state: AdvertisingState, action) => {
        state.saving = false
        state.saveError = action.error.message || 'No se pudo crear la publicidad'
      }
    )
}
