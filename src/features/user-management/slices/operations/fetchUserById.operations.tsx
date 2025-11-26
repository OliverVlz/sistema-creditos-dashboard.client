import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { UsersState } from '../users.slices'
import { User } from '../../models/usersTableConfig'

export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (userId: string) => {
        const response = await mainCustomAxios.get(`/users/${userId}`)
        return response.data
    }
)

interface createAsyncFetchUserByIdReducerArgs {
    builder: ActionReducerMapBuilder<UsersState>
}

export const createAsyncFetchUserByIdReducer = ({
    builder,
}: createAsyncFetchUserByIdReducerArgs) => {
    builder
        .addCase(fetchUserById.pending, (state: UsersState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                fetchUserById.fulfilled,
            (state: UsersState, action: PayloadAction<User>) => {
                state.loading = false
                state.selectedUser = action.payload
            }
        )
        .addCase(
            fetchUserById.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: UsersState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
