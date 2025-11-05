import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ClientsState } from '../client.slices'
import { Client } from '../../models/clientsTableModel' 

export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async () => {       
        const response = await mainCustomAxios.get('/clients/all')
        console.log('response.data', response.data.data)
        const clients = response.data.data.map((client: Client) => ({
            ...client,
            id: client.id || client.documentNumber
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
