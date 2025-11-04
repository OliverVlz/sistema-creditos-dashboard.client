import { createSlice } from "@reduxjs/toolkit"
import { User } from "../models/usersTableConfig"
import { createAsyncFetchUsersReducer } from "./operations/fetchUsers.operation"


export interface UsersState {
    users: User[]
    loading: boolean
    error: string | null
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        }
    },
    extraReducers: (builder) => {
        createAsyncFetchUsersReducer({ builder })
    }
})

export const { setUsers } = usersSlice.actions
export default usersSlice.reducer