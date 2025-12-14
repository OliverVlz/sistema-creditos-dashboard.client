import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { mainCustomAxios } from '../../../../config/axios.config';
import { CreditManagementState } from '../creditManagement';

export interface SubmitLoanRequestPayload {
  clientId: string;
  loanTypeName: string;
  organizationName: string;
  amountRequested: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
  documentTypeCodes: string[];
  files: File[];
}

export interface SubmitLoanRequestResponse {
  loanId: string;
  loanNumber: string;
}

export const submitLoanRequest = createAsyncThunk<
  SubmitLoanRequestResponse,
  SubmitLoanRequestPayload
>(
    'creditManagement/submitLoanRequest',
    async (payload: SubmitLoanRequestPayload) => {
        // Crear FormData para multipart/form-data
        const formData = new FormData();
        
        // Agregar campos de texto
        formData.append('clientId', payload.clientId);
        formData.append('loanTypeName', payload.loanTypeName);
        formData.append('organizationName', payload.organizationName);
        formData.append('amountRequested', payload.amountRequested.toString());
        formData.append('termMonths', payload.termMonths.toString());
        formData.append('monthlyPayment', payload.monthlyPayment.toString());
        formData.append('totalInterest', payload.totalInterest.toString());
        formData.append('totalPayable', payload.totalPayable.toString());
        
        // Agregar códigos de tipo de documento como JSON string
        formData.append('documentTypeCodes', JSON.stringify(payload.documentTypeCodes));
        
        // Agregar archivos (en el mismo orden que los códigos)
        payload.files.forEach((file) => {
            formData.append('files', file);
        });
        
        const response = await mainCustomAxios.post('/loans/with-documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log('Loan request submitted:', response.data);
        return response.data;
    }
);

export const createAsyncSubmitLoanRequestReducer = ({
    builder,
}: {
    builder: ActionReducerMapBuilder<CreditManagementState>;
}) => {
    builder
        .addCase(submitLoanRequest.pending, (state: CreditManagementState) => {
            state.loading = true;
            state.error = null;
        })        
        .addCase(
            submitLoanRequest.fulfilled,
            (state: CreditManagementState) => {
                state.loading = false;
                // Opcional: limpiar el estado después de enviar exitosamente
            }
        )
        .addCase(
            submitLoanRequest.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: CreditManagementState, action: any) => {
                state.loading = false;
                state.error = action.error.message;
            }
        )
}

