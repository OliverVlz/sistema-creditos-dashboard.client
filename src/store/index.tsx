import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import usersReducer from "../features/user-management/slices/users.slices";
import clientsReducer from "../features/customer-management/slices/client.slices";
import organizationsReducer from "../features/customer-management/slices/organizationsSlice";
import authReducer from "../features/auth/slices/authSlice";
import creditManagementReducer from "../features/credit-management/slices/creditManagement";
import profileReducer from "../features/profile/slices/profile.slices";
import loanRequestsReducer from "../features/loan-requests/slices/loanRequests.slices";
import loanTypesReducer from "../features/loan-types/slices/loanTypes.slices";
import advertisingReducer from "../features/advertising/slices/advertising.slices";

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
    advertising: advertisingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
