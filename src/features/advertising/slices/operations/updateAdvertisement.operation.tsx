import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'
import { Advertisement, UpdateAdvertisingPayload } from '../../models/advertisingModel'
import { AdvertisingState } from '../advertising.slices'

const createUpdateFormData = (payload: UpdateAdvertisingPayload) => {
  const formData = new FormData()

  if (payload.title !== undefined) {
    formData.append('title', payload.title)
  }
  if (payload.targetUrl !== undefined && payload.targetUrl.trim()) {
    formData.append('targetUrl', payload.targetUrl.trim())
  }
  if (payload.isRedirectEnabled !== undefined) {
    formData.append('isRedirectEnabled', String(payload.isRedirectEnabled))
  }
  if (payload.isActive !== undefined) {
    formData.append('isActive', String(payload.isActive))
  }
  if (payload.sortOrder !== undefined) {
    formData.append('sortOrder', String(payload.sortOrder))
  }
  if (payload.startsAt !== undefined && payload.startsAt) {
    formData.append('startsAt', payload.startsAt)
  }
  if (payload.endsAt !== undefined && payload.endsAt) {
    formData.append('endsAt', payload.endsAt)
  }
  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export const updateAdvertisement = createAsyncThunk(
  'advertising/updateAdvertisement',
  async (payload: UpdateAdvertisingPayload): Promise<Advertisement> => {
    const response = await mainCustomAxios.patch(
      `/advertisements/${payload.id}`,
      createUpdateFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }
)

interface CreateAsyncUpdateAdvertisementReducerArgs {
  builder: ActionReducerMapBuilder<AdvertisingState>
}

export const createAsyncUpdateAdvertisementReducer = ({
  builder,
}: CreateAsyncUpdateAdvertisementReducerArgs) => {
  builder
    .addCase(updateAdvertisement.pending, (state: AdvertisingState) => {
      state.saving = true
      state.saveError = null
    })
    .addCase(
      updateAdvertisement.fulfilled,
      (state: AdvertisingState, action: PayloadAction<Advertisement>) => {
        state.saving = false
        state.saveError = null
        state.advertisements = state.advertisements.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      }
    )
    .addCase(
      updateAdvertisement.rejected,
      (state: AdvertisingState, action) => {
        state.saving = false
        state.saveError = action.error.message || 'No se pudo actualizar la publicidad'
      }
    )
}
