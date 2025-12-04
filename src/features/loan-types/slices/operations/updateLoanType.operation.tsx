import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanTypesState } from '../loanTypes.slices'
import { LoanType, UpdateLoanTypePayload } from '../../models/loanTypesModel'

export const updateLoanType = createAsyncThunk(
    'loanTypes/updateLoanType',
    async (payload: UpdateLoanTypePayload): Promise<LoanType> => {
        const { id, ...data } = payload
        const response = await mainCustomAxios.patch(`/loan-types/${id}`, data)
        console.log('Loan type updated:', response.data)
        return response.data
    }
)

interface CreateAsyncUpdateLoanTypeReducerArgs {
    builder: ActionReducerMapBuilder<LoanTypesState>
}

export const createAsyncUpdateLoanTypeReducer = ({
    builder,
}: CreateAsyncUpdateLoanTypeReducerArgs) => {
    builder
        .addCase(updateLoanType.pending, (state: LoanTypesState) => {
            state.saving = true
            state.saveError = null
        })
        .addCase(
            updateLoanType.fulfilled,
            (state: LoanTypesState, action: PayloadAction<LoanType>) => {
                state.saving = false
                state.saveError = null
                // Actualizar en la lista
                const index = state.loanTypes.findIndex(lt => lt.id === action.payload.id)
                if (index !== -1) {
                    state.loanTypes[index] = {
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
                    }
                }
                // Actualizar el seleccionado si es el mismo
                if (state.selectedLoanType?.id === action.payload.id) {
                    state.selectedLoanType = action.payload
                }
            }
        )
        .addCase(
            updateLoanType.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: LoanTypesState, action: any) => {
                state.saving = false
                state.saveError = action.error.message || 'Error al actualizar el tipo de préstamo'
            }
        )
}

