import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanRequestsState } from '../loanRequests.slices'
import { LoanRequest, LoanRequestTableItem, LoanRequestFilters } from '../../models/loanRequestsModel'

interface FetchLoanRequestsResponse {
    loanRequests: LoanRequestTableItem[]
    pagination: LoanRequestsState['pagination']
}

export const fetchLoanRequests = createAsyncThunk(
    'loanRequests/fetchLoanRequests',
    async ({ page = 1, limit = 10, loanNumber = '', status = '', clientId = '' }: LoanRequestFilters = {}): Promise<FetchLoanRequestsResponse> => {
        const params: Record<string, string | number> = {
            page,
            limit
        }

        if (loanNumber) params.loanNumber = loanNumber
        if (status) params.status = status
        if (clientId) params.clientId = clientId // Filtrar por cliente cuando es rol CLIENTE
        
        const response = await mainCustomAxios.get('/loans', { params })
        console.log('Loan requests response:', response.data)
        
        const loanRequests: LoanRequestTableItem[] = response.data.data.map((loan: LoanRequest): LoanRequestTableItem => ({
            id: loan.id,
            loanNumber: loan.loanNumber,
            clientName: loan.client?.name 
                || (loan.client?.user 
                    ? `${loan.client.user.firstName || ''} ${loan.client.user.lastName || ''}`.trim() 
                    : '---'),
            organizationName: loan.organization?.name || '---',
            status: loan.status,
            amountRequested: parseFloat(loan.amountRequested),
            termMonths: loan.termMonths,
            appliedInterestRate: loan.annualRate ?? (loan.appliedInterestRate ? parseFloat(loan.appliedInterestRate) : 0),
            createdAt: loan.createdAt
        }))
        
        return {
            loanRequests,
            pagination: response.data.pagination
        }
    }
)

interface CreateAsyncFetchLoanRequestsReducerArgs {
    builder: ActionReducerMapBuilder<LoanRequestsState>
}

export const createAsyncFetchLoanRequestsReducer = ({
    builder,
}: CreateAsyncFetchLoanRequestsReducerArgs) => {
    builder
        .addCase(fetchLoanRequests.pending, (state: LoanRequestsState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
            fetchLoanRequests.fulfilled,
            (state: LoanRequestsState, action: PayloadAction<FetchLoanRequestsResponse>) => {
                state.loading = false
                state.loanRequests = action.payload.loanRequests
                state.pagination = action.payload.pagination
            }
        )
        .addCase(
            fetchLoanRequests.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: LoanRequestsState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}

