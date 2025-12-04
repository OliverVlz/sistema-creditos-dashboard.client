import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanTypesState } from '../loanTypes.slices'

export const deleteLoanType = createAsyncThunk(
    'loanTypes/deleteLoanType',
    async (id: string): Promise<string> => {
        await mainCustomAxios.delete(`/loan-types/${id}`)
        console.log('Loan type deleted:', id)
        return id
    }
)

interface CreateAsyncDeleteLoanTypeReducerArgs {
    builder: ActionReducerMapBuilder<LoanTypesState>
}

export const createAsyncDeleteLoanTypeReducer = ({
    builder,
}: CreateAsyncDeleteLoanTypeReducerArgs) => {
    builder
        .addCase(deleteLoanType.pending, (state: LoanTypesState) => {
            state.saving = true
            state.saveError = null
        })
        .addCase(
            deleteLoanType.fulfilled,
            (state: LoanTypesState, action: PayloadAction<string>) => {
                state.saving = false
                state.saveError = null
                // Eliminar de la lista
                state.loanTypes = state.loanTypes.filter(lt => lt.id !== action.payload)
                state.pagination.total -= 1
                // Limpiar el seleccionado si es el eliminado
                if (state.selectedLoanType?.id === action.payload) {
                    state.selectedLoanType = null
                }
            }
        )
        .addCase(
            deleteLoanType.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: LoanTypesState, action: any) => {
                state.saving = false
                state.saveError = action.error.message || 'Error al eliminar el tipo de préstamo'
            }
        )
}

