import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ClientsState } from '../client.slices'
import { ClientFormData } from '../../models/formClientModel'

export const fetchClientById = createAsyncThunk(
    'clients/fetchClientById',
    async (clientId: string) => {
        const response = await mainCustomAxios.get(`/clients/${clientId}/profile`)
        const clientData = response.data
        const mappedClient: ClientFormData & { id: string } = {
            id: clientData.id,
            email: clientData.email,
            password: '',
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            address: clientData.clientInfo?.address || '',
            birthDate: clientData.clientInfo?.birthDate || '',
            documentNumber: clientData.documentNumber,
            phoneNumber: clientData.phoneNumber,
            employmentStatus: clientData.clientInfo?.employmentStatus || '',
            employmentStatusOther: '',
            organizationId: clientData.clientInfo?.organization?.id || '',
        }
        
        console.log('Mapped client:', mappedClient)
        return mappedClient
    }
)

interface createAsyncFetchClientByIdReducerArgs {
    builder: ActionReducerMapBuilder<ClientsState>
}

export const createAsyncFetchClientByIdReducer = ({
    builder,
}: createAsyncFetchClientByIdReducerArgs) => {
    builder
        .addCase(fetchClientById.pending, (state: ClientsState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                fetchClientById.fulfilled,
            (state: ClientsState, action: PayloadAction<ClientFormData & { id: string }>) => {
                state.loading = false
                state.selectedClient = action.payload
            }
        )
        .addCase(
            fetchClientById.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: ClientsState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
