import { createSlice } from "@reduxjs/toolkit"
import { createAsyncFetchClientsReducer } from "./operations/fetchClients.operation"
import { createAsyncCreateClientReducer } from "./operations/createClient.operations"
import { createAsyncFetchClientByIdReducer } from "./operations/fetchClientById.operations"
import { createAsyncEditClientByIdReducer } from "./operations/editClientById.operations"
import { Client } from "../models/clientsTableModel"
import { ClientFormData } from "../models/formClientModel"

export interface ClientsState {
    clients: Client[]
    loading: boolean
    error: string | null
    selectedClient: Partial<ClientFormData> | null
}

const initialState: ClientsState = {
    clients: [],
    loading: false,
    error: null,
    selectedClient: null,
}

export const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setClients: (state, action) => {
            state.clients = action.payload
        },
        removeClientById: (state, action) => {
            state.clients = state.clients.filter((client) => client.id !== action.payload)
        },
        updateClientStatusById: (state, action) => {
            state.clients = state.clients.map((client) =>
                client.id === action.payload.clientId
                    ? { ...client, isActive: action.payload.isActive }
                    : client
            )
        },
        clearClients: (state) => {
            state.clients = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchClientsReducer({ builder })
        createAsyncCreateClientReducer({ builder })
        createAsyncFetchClientByIdReducer({ builder })
        createAsyncEditClientByIdReducer({ builder })
    }
})

export const { setClients, removeClientById, updateClientStatusById, clearClients } = clientsSlice.actions
export default clientsSlice.reducer
