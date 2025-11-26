import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { OrganizationsState } from '../organizationsSlice' // ✅ Solo importar el tipo
import { Organization } from '../../models/formClientModel' 

export const fetchOrganizations = createAsyncThunk(
    'organizations/fetchOrganizations',
    async ({ page = 1, limit = 100 }: { page?: number, limit?: number } = {}) => {       
        const response = await mainCustomAxios.get('/organizations', { params: { page, limit } })
        console.log('response.data', response.data.data)
        const organizations = response.data.data.map((organization: Organization) => ({
            id: organization.id,
            name: organization.name
        
        }))
        return organizations
    }
)

// ✅ CORRECCIÓN: Usar OrganizationsState en lugar de typeof organizationsSlice
interface createAsyncFetchOrganizationsReducerArgs {
    builder: ActionReducerMapBuilder<OrganizationsState> // ← AQUÍ está el cambio
}

export const createAsyncFetchOrganizationsReducer = ({
    builder,
}: createAsyncFetchOrganizationsReducerArgs) => {
    builder
        .addCase(fetchOrganizations.pending, (state) => { // ✅ No necesitas tipar state aquí
            state.loading = true
            state.error = null
        })
        .addCase(
            fetchOrganizations.fulfilled,
            (state, action: PayloadAction<Organization[]>) => { // ✅ No necesitas tipar state aquí
                state.loading = false
                state.organizations = action.payload
            }
        )
        .addCase(
            fetchOrganizations.rejected,
            (state, action) => { // ✅ No necesitas tipar state aquí
                state.loading = false
                state.error = action.error.message || 'Error al cargar organizaciones'
            }
        )
}