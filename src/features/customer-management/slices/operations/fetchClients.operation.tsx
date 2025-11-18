import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ClientsState } from '../client.slices'
import { Client } from '../../models/clientsTableModel'
import { ClientApiResponse } from '../../models/clientsTableModel'



export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async ({page = 1, limit = 100, searchTerm = '', status = '', organizationId = ''}: {page?: number, limit?: number, searchTerm?: string, status?: string, organizationId?: string} = {}) => {  
        const params: Record<string, string | number> = {
            page,
            limit
        }

        if (searchTerm) params.terms = searchTerm
        if (status) params.status = status
        if (organizationId) params.organizationId = organizationId
        
        const response = await mainCustomAxios.get('/clients/all', { params })
        console.log('response.data', response.data.data)
        const clients = response.data.data.map((client: ClientApiResponse): Client => ({
            id: client.id || client.documentNumber,
            isActive: client.isActive,
            fullName: client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
            documentNumber: client.documentNumber,
            email: client.email,
            phoneNumber: client.phoneNumber,
            organization: client.organization,
            employmentStatus: client.employmentStatus,
            createdAt: client.createdAt
        }))
        return clients
    }
)

interface createAsyncFetchClientsReducerArgs {
    builder: ActionReducerMapBuilder<ClientsState>
}

export const createAsyncFetchClientsReducer = ({
    builder,
}: createAsyncFetchClientsReducerArgs) => {
    builder
        .addCase(fetchClients.pending, (state: ClientsState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
            fetchClients.fulfilled,
            (state: ClientsState, action: PayloadAction<Client[]>) => {
                state.loading = false
                state.clients = action.payload
            }
        )
        .addCase(
            fetchClients.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: ClientsState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
