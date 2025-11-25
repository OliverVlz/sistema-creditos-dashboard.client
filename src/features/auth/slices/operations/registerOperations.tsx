import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { mainCustomAxios } from '../../../../config/axios.config';
import { RegisterFormData, RegisterSliceState } from '../../models/registerModel';

export const register = createAsyncThunk(
  'register/registerUser',
  async (body: RegisterFormData) => {
    // Excluir confirmPassword del body (solo es para validación frontend)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...requestBody } = body;
    const response = await mainCustomAxios.post('/clients/register', requestBody);   
    return response.data;
  }
);

interface createAsyncRegisterReducerArgs {
    builder: ActionReducerMapBuilder<RegisterSliceState>
}

export const createAsyncRegisterReducer = ({
    builder,
}: createAsyncRegisterReducerArgs) => {
    builder
        .addCase(register.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(
                register.fulfilled,
            (state) => {
                state.loading = false
                state.isLoggedIn = true
                state.isRegistered = true
            }
        )
        .addCase(
            register.rejected,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state, action: any) => {
                state.loading = false
                state.isLoggedIn = false
                state.isRegistered = false
                state.error = action.error.message
            }
        )
}
