import { createSlice } from '@reduxjs/toolkit'
import { Advertisement, AdvertisementHistoryItem } from '../models/advertisingModel'
import { createAsyncFetchAdvertisementsReducer } from './operations/fetchAdvertisements.operation'
import { createAsyncCreateAdvertisementReducer } from './operations/createAdvertisement.operation'
import { createAsyncUpdateAdvertisementReducer } from './operations/updateAdvertisement.operation'
import { createAsyncSetAdvertisementStatusReducer } from './operations/setAdvertisementStatus.operation'
import { createAsyncFetchAdvertisementHistoryReducer } from './operations/fetchAdvertisementHistory.operation'
import { createAsyncRecycleAdvertisementReducer } from './operations/recycleAdvertisement.operation'
import { createAsyncReorderAdvertisementsReducer } from './operations/reorderAdvertisements.operation'

export interface AdvertisingState {
  advertisements: Advertisement[]
  history: AdvertisementHistoryItem[]
  selectedAdvertisement: Advertisement | null
  loading: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  pagination: {
    currentPage: number
    totalPages: number
    total: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

const initialState: AdvertisingState = {
  advertisements: [],
  history: [],
  selectedAdvertisement: null,
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

const advertisingSlice = createSlice({
  name: 'advertising',
  initialState,
  reducers: {
    setSelectedAdvertisement: (state, action) => {
      state.selectedAdvertisement = action.payload
    },
    clearSelectedAdvertisement: (state) => {
      state.selectedAdvertisement = null
    },
    clearAdvertisingHistory: (state) => {
      state.history = []
    },
  },
  extraReducers: (builder) => {
    createAsyncFetchAdvertisementsReducer({ builder })
    createAsyncCreateAdvertisementReducer({ builder })
    createAsyncUpdateAdvertisementReducer({ builder })
    createAsyncSetAdvertisementStatusReducer({ builder })
    createAsyncFetchAdvertisementHistoryReducer({ builder })
    createAsyncRecycleAdvertisementReducer({ builder })
    createAsyncReorderAdvertisementsReducer({ builder })
  },
})

export const {
  setSelectedAdvertisement,
  clearSelectedAdvertisement,
  clearAdvertisingHistory,
} = advertisingSlice.actions

export default advertisingSlice.reducer
