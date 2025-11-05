import { createSlice } from "@reduxjs/toolkit"
import { createAsyncFetchClientsReducer } from "./operations/fetchClients.operation"
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
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchClientsReducer({ builder })
    }
})

export const { setClients } = clientsSlice.actions
export default clientsSlice.reducer