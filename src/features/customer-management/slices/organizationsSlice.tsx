import { createSlice } from "@reduxjs/toolkit"
import { createAsyncFetchOrganizationsReducer } from "./operations/fetchOrganizations.operation"
import { Organization } from "../models/formClientModel"

export interface OrganizationsState {
    organizations: Organization[]
    loading: boolean
    error: string | null
}

const initialState: OrganizationsState = {
    organizations: [],
    loading: false,
    error: null,
}

export const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        setOrganizations: (state, action) => {
            state.organizations = action.payload
        },
        clearOrganizations: (state) => {
            state.organizations = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchOrganizationsReducer({ builder })
    }
})

export const { setOrganizations, clearOrganizations } = organizationsSlice.actions
export default organizationsSlice.reducer