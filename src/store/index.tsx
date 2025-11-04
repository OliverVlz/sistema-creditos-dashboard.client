import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import usersReducer from '../features/user-management/slices/users.slices'

export const store = configureStore({
    reducer: {
        users: usersReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    UnknownAction
>

// Hooks tipados - Usar estos hooks en lugar de los de react-redux
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector