import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { UsersState } from '../users.slices'
import { User } from '../../models/usersTableConfig'
import { UserFormData } from '../../models/formUserModel'

export const editUserById = createAsyncThunk(
    'users/editUserById',
    async ({userId, user}: {userId: string, user: Partial<UserFormData>}) => {
        const response = await mainCustomAxios.patch(`/users/${userId}`, user)
        return response.data
    }
)

interface createAsyncEditUserByIdReducerArgs {
    builder: ActionReducerMapBuilder<UsersState>
}

export const createAsyncEditUserByIdReducer = ({
    builder,
    }: createAsyncEditUserByIdReducerArgs) => {
    builder
        .addCase(editUserById.pending, (state: UsersState) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                editUserById.fulfilled,
            (state: UsersState, action: PayloadAction<User>) => {
                state.loading = false
                state.selectedUser = action.payload
            }
        )
        .addCase(
            editUserById.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state: UsersState, action: any) => {
                state.loading = false
                state.error = action.error.message
            }
        )
}
