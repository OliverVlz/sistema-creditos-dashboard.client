import { createSlice } from "@reduxjs/toolkit"
import { createAsyncFetchLoanRequestsReducer } from "./operations/fetchLoanRequests.operation"
import { createAsyncFetchLoanRequestDetailReducer } from "./operations/fetchLoanRequestDetail.operation"
import { createAsyncUpdateLoanWithDocumentsReducer } from "./operations/updateLoanWithDocuments.operation"
import { LoanRequestTableItem, LoanRequestDetail } from "../models/loanRequestsModel"

export interface LoanRequestsState {
    loanRequests: LoanRequestTableItem[]
    selectedLoanRequest: LoanRequestDetail | null
    loading: boolean
    error: string | null
    updating: boolean
    updateError: string | null
    pagination: {
        currentPage: number
        totalPages: number
        total: number
        limit: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    } | null
}

const initialState: LoanRequestsState = {
    loanRequests: [],
    selectedLoanRequest: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
    pagination: null,
}

export const loanRequestsSlice = createSlice({
    name: 'loanRequests',
    initialState,
    reducers: {
        setLoanRequests: (state, action) => {
            state.loanRequests = action.payload
        },
        removeLoanRequestById: (state, action) => {
            state.loanRequests = state.loanRequests.filter((loan) => loan.id !== action.payload)
            if (state.pagination && state.pagination.total > 0) {
                state.pagination.total -= 1
            }
        },
        clearLoanRequests: (state) => {
            state.loanRequests = []
            state.error = null
            state.pagination = null
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchLoanRequestsReducer({ builder })
        createAsyncFetchLoanRequestDetailReducer({ builder })
        createAsyncUpdateLoanWithDocumentsReducer({ builder })
    }
})

export const { setLoanRequests, removeLoanRequestById, clearLoanRequests } = loanRequestsSlice.actions
export default loanRequestsSlice.reducer

