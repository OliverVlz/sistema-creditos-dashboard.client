import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanTypesState } from '../loanTypes.slices'
import { LoanType, LoanTypeTableItem, LoanTypeFilters } from '../../models/loanTypesModel'

interface FetchLoanTypesResponse {
    loanTypes: LoanTypeTableItem[]
    pagination: LoanTypesState['pagination']
}

export const fetchLoanTypes = createAsyncThunk(
    'loanTypes/fetchLoanTypes',
    async ({ page = 1, limit = 10, name = '', isActive }: LoanTypeFilters = {}): Promise<FetchLoanTypesResponse> => {
        const params: Record<string, string | number | boolean> = {
            page,
            limit
        }

        if (name) params.name = name
        if (isActive !== undefined) params.isActive = isActive
        
        const response = await mainCustomAxios.get('/loan-types', { params })
        console.log('Loan types response:', response.data)
        
        const loanTypes: LoanTypeTableItem[] = response.data.data.map((loanType: LoanType): LoanTypeTableItem => ({
            id: loanType.id,
            name: loanType.name,
            description: loanType.description,
            interestRate: parseFloat(loanType.interestRate),
            minAmount: parseFloat(loanType.minAmount),
            maxAmount: parseFloat(loanType.maxAmount),
            minTerm: loanType.minTerm,
            maxTerm: loanType.maxTerm,
            isActive: loanType.isActive,
            createdAt: loanType.createdAt,
        }))
        
        return {
            loanTypes,
            pagination: response.data.pagination
        }
    }
)

interface CreateAsyncFetchLoanTypesReducerArgs {
    builder: ActionReducerMapBuilder<LoanTypesState>
}

export const createAsyncFetchLoanTypesReducer = ({
    builder,
}: CreateAsyncFetchLoanTypesReducerArgs) => {
    builder
        .addCase(fetchLoanTypes.pending, (state: LoanTypesState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
            fetchLoanTypes.fulfilled,
            (state: LoanTypesState, action: PayloadAction<FetchLoanTypesResponse>) => {
                state.loading = false
                state.loanTypes = action.payload.loanTypes
                state.pagination = action.payload.pagination
            }
        )
        .addCase(
            fetchLoanTypes.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: LoanTypesState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}

