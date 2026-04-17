import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanRequestsState } from '../loanRequests.slices'
import { LoanRequestDetail } from '../../models/loanRequestsModel'

export const fetchLoanRequestDetail = createAsyncThunk(
    'loanRequests/fetchLoanRequestDetail',
    async (loanId: string): Promise<LoanRequestDetail> => {
        const response = await mainCustomAxios.get(`/loans/${loanId}`)
        return response.data
    }
)

interface CreateAsyncFetchLoanRequestDetailReducerArgs {
    builder: ActionReducerMapBuilder<LoanRequestsState>
}

export const createAsyncFetchLoanRequestDetailReducer = ({
    builder,
}: CreateAsyncFetchLoanRequestDetailReducerArgs) => {
    builder
        .addCase(fetchLoanRequestDetail.pending, (state: LoanRequestsState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
            fetchLoanRequestDetail.fulfilled,
            (state: LoanRequestsState, action: PayloadAction<LoanRequestDetail>) => {
                state.loading = false
                state.selectedLoanRequest = action.payload
            }
        )
        .addCase(
            fetchLoanRequestDetail.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: LoanRequestsState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}

