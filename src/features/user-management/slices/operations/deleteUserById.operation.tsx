import { createAsyncThunk } from "@reduxjs/toolkit";
import { mainCustomAxios } from "@/config/axios.config";

export const deleteUserById = createAsyncThunk(
  "users/deleteUserById",
  async (userId: string) => {
    await mainCustomAxios.delete(`/users/${userId}`);
    return userId;
  }
);
