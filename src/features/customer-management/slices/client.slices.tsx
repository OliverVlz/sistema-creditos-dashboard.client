import { createSlice } from "@reduxjs/toolkit"
import { createAsyncFetchClientsReducer } from "./operations/fetchClients.operation"
import { createAsyncCreateClientReducer } from "./operations/createClient.operations"
import { Client } from "../models/clientsTableModel"

export interface ClientsState {
    clients: Client[]
    loading: boolean
    error: string | null
}

const initialState: ClientsState = {
    clients: [],
    loading: false,
    error: null,
}

export const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setClients: (state, action) => {
            state.clients = action.payload
        },
        clearClients: (state) => {
            state.clients = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchClientsReducer({ builder })
        createAsyncCreateClientReducer({ builder })
    }
})

export const { setClients, clearClients } = clientsSlice.actions
export default clientsSlice.reducer