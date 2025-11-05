import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { UsersState } from '../users.slices'
import { User } from '../../models/usersTableConfig'
import { UserFormData } from '../../models/formUserModel'

export const createUser = createAsyncThunk(
    'users/createUser',
    async (user: UserFormData) => {
        const response = await mainCustomAxios.post('/users/admin/staff', user)
        return response.data
    }
)

interface createAsyncFetchUsersReducerArgs {
    builder: ActionReducerMapBuilder<UsersState>
}

export const createAsyncFetchUsersReducer = ({
    builder,
}: createAsyncFetchUsersReducerArgs) => {
    builder
        .addCase(createUser.pending, (state: UsersState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                createUser.fulfilled,
            (state: UsersState, action: PayloadAction<User[]>) => {
                state.loading = false
                state.users = action.payload
            }
        )
        .addCase(
            createUser.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: UsersState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
