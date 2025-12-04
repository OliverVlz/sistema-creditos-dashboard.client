import { ActionReducerMapBuilder, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mainCustomAxios } from '../../../../config/axios.config';
import { LoanCalculationResponse, LoanCalculationRequest } from '../../models/loanCalculationModel';
import { CreditManagementState } from '../creditManagement';

export const calculateLoan = createAsyncThunk(
    'creditManagement/calculateLoan',
    async (request: LoanCalculationRequest) => {
        const response = await mainCustomAxios.post<LoanCalculationResponse>('/loans/calculate', request);
        const loanCalculation: LoanCalculationResponse = response.data;
        console.log('loanCalculation', loanCalculation);
        return loanCalculation;
    }
)

export const createAsyncCalculateLoanReducer = ({
    builder,
}: {
    builder: ActionReducerMapBuilder<CreditManagementState>;
}) => {
    builder
        .addCase(calculateLoan.pending, (state: CreditManagementState) => {
            state.calculatingLoan = true;
            state.loanCalculationError = null;
        })        
        .addCase(
            calculateLoan.fulfilled,
            (state: CreditManagementState, action: PayloadAction<LoanCalculationResponse>) => {
                state.calculatingLoan = false;
                state.loanCalculation = action.payload;
            }
        )
        .addCase(
            calculateLoan.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: CreditManagementState, action: any) => {
                state.calculatingLoan = false;
                state.loanCalculationError = action.error.message;
            }
        )
}

