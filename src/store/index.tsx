import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkAction, AnyAction } from "@reduxjs/toolkit";
import usersReducer from "../features/user-management/slices/users.slices";
import clientsReducer from "../features/customer-management/slices/client.slices";
import organizationsReducer from "../features/customer-management/slices/organizationsSlice";
import authReducer from "../features/auth/slices/authSlice";
import creditManagementReducer from "../features/credit-management/slices/creditManagement";
import profileReducer from "../features/profile/slices/profile.slices";
import loanRequestsReducer from "../features/loan-requests/slices/loanRequests.slices";
import loanTypesReducer from "../features/loan-types/slices/loanTypes.slices";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    clients: clientsReducer,
    organizations: organizationsReducer,
    auth: authReducer,
    creditManagement: creditManagementReducer,
    profile: profileReducer,
    loanRequests: loanRequestsReducer,
    loanTypes: loanTypesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
