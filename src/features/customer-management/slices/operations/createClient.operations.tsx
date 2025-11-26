import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { ClientsState } from '../client.slices'
import { Client } from '../../models/clientsTableModel'
import { ClientFormData } from '../../models/formClientModel'

export const createClient = createAsyncThunk(
    'clients/createClient',
    async (client: ClientFormData) => {
        const response = await mainCustomAxios.post('/clients/register', client)
        return response.data
    }
)

interface createAsyncCreateClientReducerArgs {
    builder: ActionReducerMapBuilder<ClientsState>
}

export const createAsyncCreateClientReducer = ({
    builder,
}: createAsyncCreateClientReducerArgs) => {
    builder
        .addCase(createClient.pending, (state: ClientsState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                createClient.fulfilled,
            (state: ClientsState, action: PayloadAction<Client[]>) => {
                state.loading = false
                state.clients = action.payload
            }
        )
        .addCase(
            createClient.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: ClientsState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
