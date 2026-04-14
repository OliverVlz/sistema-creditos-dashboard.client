import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { UsersState } from '../users.slices'
import { User } from '../../models/usersTableConfig'

type FetchUsersParams = {
    page?: number
    limit?: number
    searchTerm?: string
    role?: string
    status?: string
}

type FetchUsersResponse = {
    users: User[]
    pagination: UsersState['pagination']
    query: Required<FetchUsersParams>
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page = 1, limit = 10, searchTerm = '', role = '', status = '' }: FetchUsersParams = {}): Promise<FetchUsersResponse> => {
        const params: Record<string, string | number> = {
            page,
            limit
        }
        
        if (searchTerm) params.terms = searchTerm
        if (role) params.role = role
        if (status) params.isActive = status
        
        const response = await mainCustomAxios.get('users/all', { params })
        const responseData = response.data?.data
        const userList: User[] = Array.isArray(responseData)
            ? responseData
            : Array.isArray(responseData?.data)
                ? responseData.data
                : []

        const pagination = response.data?.pagination
            ?? responseData?.pagination
            ?? {
                currentPage: page,
                totalPages: 1,
                total: userList.length,
                limit,
                hasNextPage: false,
                hasPreviousPage: false,
            }

        return {
            users: userList,
            pagination,
            query: {
                page,
                limit,
                searchTerm,
                role,
                status,
            },
        }
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
            (state: UsersState, action: PayloadAction<FetchUsersResponse>) => {
                state.loading = false
                state.users = action.payload.users
                state.pagination = action.payload.pagination
                state.query = action.payload.query
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
