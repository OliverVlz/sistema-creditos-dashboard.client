import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanTypesState } from '../loanTypes.slices'
import { LoanType, LoanTypePayload } from '../../models/loanTypesModel'

export const createLoanType = createAsyncThunk(
    'loanTypes/createLoanType',
    async (payload: LoanTypePayload): Promise<LoanType> => {
        const response = await mainCustomAxios.post('/loan-types', payload)
        console.log('Loan type created:', response.data)
        return response.data
    }
)

interface CreateAsyncCreateLoanTypeReducerArgs {
    builder: ActionReducerMapBuilder<LoanTypesState>
}

export const createAsyncCreateLoanTypeReducer = ({
    builder,
}: CreateAsyncCreateLoanTypeReducerArgs) => {
    builder
        .addCase(createLoanType.pending, (state: LoanTypesState) => {
            state.saving = true
            state.saveError = null
        })
        .addCase(
            createLoanType.fulfilled,
            (state: LoanTypesState, action: PayloadAction<LoanType>) => {
                state.saving = false
                state.saveError = null
                // Agregar el nuevo tipo a la lista
                state.loanTypes.unshift({
                    id: action.payload.id,
                    name: action.payload.name,
                    description: action.payload.description,
                    interestRate: parseFloat(action.payload.interestRate),
                    minAmount: parseFloat(action.payload.minAmount),
                    maxAmount: parseFloat(action.payload.maxAmount),
                    minTerm: action.payload.minTerm,
                    maxTerm: action.payload.maxTerm,
                    isActive: action.payload.isActive,
                    createdAt: action.payload.createdAt,
                })
                state.pagination.total += 1
            }
        )
        .addCase(
            createLoanType.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: LoanTypesState, action: any) => {
                state.saving = false
                state.saveError = action.error.message || 'Error al crear el tipo de préstamo'
            }
        )
}

