import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { UsersState } from '../users.slices'
import { User } from '../../models/usersTableConfig'

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page = 1, limit = 100, searchTerm = '', role = '' }: { page?: number, limit?: number, searchTerm?: string, role?: string } = {}) => {
        // Construir parámetros dinámicamente
        const params: Record<string, string | number> = {
            page,
            limit
        }
        
        // Solo agregar searchTerm y role si tienen valores
        if (searchTerm) params.terms = searchTerm
        if (role) params.role = role
        
        const response = await mainCustomAxios.get('users', { params })
        console.log('response.data', response.data.data)
        return response.data.data
    }
)

interface createAsyncFetchUsersReducerArgs {
    builder: ActionReducerMapBuilder<UsersState>
}

export const createAsyncFetchUsersReducer = ({
    builder,
}: createAsyncFetchUsersReducerArgs) => {
    builder
        .addCase(fetchUsers.pending, (state: UsersState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
            fetchUsers.fulfilled,
            (state: UsersState, action: PayloadAction<User[]>) => {
                state.loading = false
                state.users = action.payload
            }
        )
        .addCase(
            fetchUsers.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: UsersState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
