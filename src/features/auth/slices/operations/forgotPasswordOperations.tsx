import { mainCustomAxios } from '../../../../config/axios.config';

type ForgotPasswordBody = {
  email: string;
};

export const forgotPassword = async (body: ForgotPasswordBody) => {
  const response = await mainCustomAxios.post('/users/forgot-password', body);
  return response.data;
};
