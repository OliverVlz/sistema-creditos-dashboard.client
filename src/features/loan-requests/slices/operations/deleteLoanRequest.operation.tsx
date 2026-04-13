import { createAsyncThunk } from "@reduxjs/toolkit";
import { mainCustomAxios } from "@/config/axios.config";

export const deleteLoanRequest = createAsyncThunk(
  "loanRequests/deleteLoanRequest",
  async (loanId: string) => {
    await mainCustomAxios.delete(`/loans/${loanId}`);
    return loanId;
  }
);
