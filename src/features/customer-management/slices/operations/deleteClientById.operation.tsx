import { createAsyncThunk } from "@reduxjs/toolkit";
import { mainCustomAxios } from "@/config/axios.config";

export const deleteClientById = createAsyncThunk(
  "clients/deleteClientById",
  async (userId: string) => {
    await mainCustomAxios.delete(`/clients/${userId}`);
    return userId;
  }
);
