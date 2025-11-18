import { createSlice } from "@reduxjs/toolkit"
import { User } from "../models/usersTableConfig"
import { createAsyncFetchUsersReducer } from "./operations/fetchUsers.operation"
import { createAsyncFetchUsersReducer as createAsyncCreateUserReducer } from "./operations/createUser.operations"
import { createAsyncFetchUserByIdReducer } from "./operations/fetchUserById.operations"


export interface UsersState {
    users: User[]
    selectedUser: User | null
    loading: boolean
    error: string | null
}

const initialState: UsersState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchUsersReducer({ builder })
        createAsyncCreateUserReducer({ builder })
        createAsyncFetchUserByIdReducer({ builder })
    }
})

export const { setUsers, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer