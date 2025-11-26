import { ActionReducerMapBuilder, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mainCustomAxios } from '../../../../config/axios.config';
import { ClientInformationResponse } from '../../models/clientInformationModel';
import { CreditManagementState } from '../creditManagement';

export const fetchClientInformation = createAsyncThunk(
    'creditManagement/fetchClientInformation',
    async () => {
        const response = await mainCustomAxios.get('/clients/me/profile');
        const clientInformation: ClientInformationResponse = response.data;
        console.log('clientInformation', clientInformation);
        return clientInformation;
    }
)

export const createAsyncFetchClientInformationReducer = ({
    builder,
}: {
    builder: ActionReducerMapBuilder<CreditManagementState>;
}) => {
    builder
        .addCase(fetchClientInformation.pending, (state: CreditManagementState) => {
            state.loading = true;
            state.error = null;
        })        
        .addCase(
            fetchClientInformation.fulfilled,
            (state: CreditManagementState, action: PayloadAction<ClientInformationResponse>) => {
                state.loading = false;
                state.clientInformation = action.payload;
            }
        )
        .addCase(
            fetchClientInformation.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: CreditManagementState, action: any) => {
                state.loading = false;
                state.error = action.error.message;
            }
        )
}   