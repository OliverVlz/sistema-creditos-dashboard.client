import { createSlice } from '@reduxjs/toolkit'
import { LoanTypeTableItem, LoanType } from '../models/loanTypesModel'
import { createAsyncFetchLoanTypesReducer } from './operations/fetchLoanTypes.operation'
import { createAsyncCreateLoanTypeReducer } from './operations/createLoanType.operation'
import { createAsyncUpdateLoanTypeReducer } from './operations/updateLoanType.operation'
import { createAsyncDeleteLoanTypeReducer } from './operations/deleteLoanType.operation'

export interface LoanTypesState {
  loanTypes: LoanTypeTableItem[]
  selectedLoanType: LoanType | null
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

const initialState: LoanTypesState = {
  loanTypes: [],
  selectedLoanType: null,
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

const loanTypesSlice = createSlice({
  name: 'loanTypes',
  initialState,
  reducers: {
    clearSelectedLoanType: (state) => {
      state.selectedLoanType = null
    },
    clearSaveError: (state) => {
      state.saveError = null
    },
    setSelectedLoanType: (state, action) => {
      state.selectedLoanType = action.payload
    },
  },
  extraReducers: (builder) => {
    createAsyncFetchLoanTypesReducer({ builder })
    createAsyncCreateLoanTypeReducer({ builder })
    createAsyncUpdateLoanTypeReducer({ builder })
    createAsyncDeleteLoanTypeReducer({ builder })
  },
})

export const { clearSelectedLoanType, clearSaveError, setSelectedLoanType } = loanTypesSlice.actions
export default loanTypesSlice.reducer

