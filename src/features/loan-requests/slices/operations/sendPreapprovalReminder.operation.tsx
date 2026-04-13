import { createAsyncThunk } from '@reduxjs/toolkit'
import { mainCustomAxios } from '../../../../config/axios.config'

export const sendPreapprovalReminder = createAsyncThunk(
  'loanRequests/sendPreapprovalReminder',
  async (loanId: string) => {
    const response = await mainCustomAxios.patch(
      `/loans/${loanId}/send-preapproval-reminder`,
    )
    return response.data
  },
)
