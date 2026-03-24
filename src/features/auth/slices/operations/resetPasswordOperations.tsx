import { mainCustomAxios } from '../../../../config/axios.config';

type ResetPasswordBody = {
  token: string;
  newPassword: string;
};

export const resetPassword = async (body: ResetPasswordBody) => {
  const response = await mainCustomAxios.post('/users/reset-password', body);
  return response.data;
};
