import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"   
import { ClientsState } from '../client.slices'        
import { Client } from '../../models/clientsTableModel'
import { ClientFormData } from '../../models/formClientModel'

export const editClientById = createAsyncThunk(
    'clients/editClientById',
    async ({clientId, client}: {clientId: string, client: ClientFormData}) => {
        const response = await mainCustomAxios.patch(`/clients/${clientId}`, client)
        return response.data
    }
)

interface createAsyncEditClientByIdReducerArgs {
    builder: ActionReducerMapBuilder<ClientsState>
}

export const createAsyncEditClientByIdReducer = ({
    builder,
    }: createAsyncEditClientByIdReducerArgs) => {
    builder
        .addCase(editClientById.pending, (state: ClientsState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                editClientById.fulfilled,
            (state: ClientsState, action: PayloadAction<Client>) => {
                state.loading = false
                state.selectedClient = action.payload as Client
            }
        )
        .addCase(
            editClientById.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: ClientsState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
