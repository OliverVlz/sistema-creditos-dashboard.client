import { LoginFormData } from "../../models/loginModel";
import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { mainCustomAxios } from "../../../../config/axios.config";
import { LoginSliceState } from "../../models/loginModel";

export const login = createAsyncThunk(
  "login/loginUser",
  async (body: LoginFormData) => {
    const response = await mainCustomAxios.post("/users/login", body);
    return response.data;
  }
);

interface createAsyncLoginReducerArgs {
  builder: ActionReducerMapBuilder<LoginSliceState>;
}

export const createAsyncLoginReducer = ({
  builder,
}: createAsyncLoginReducerArgs) => {
  builder
    .addCase(login.pending, (state: LoginSliceState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state: LoginSliceState) => {
      state.loading = false;
      state.isLoggedIn = true;
    })
    .addCase(
      login.rejected,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: LoginSliceState, action: any) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.error.message;
      }
    );
};
