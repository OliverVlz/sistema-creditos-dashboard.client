import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken } from '../services/auth.service';
import { AuthResponse, LoginResponseModel } from '../models/loginResponseModel';

/**
 * Interceptor de request: agrega el token a los headers
 */
export const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getToken();
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

/**
 * Interceptor de response: maneja errores de autenticación
 */
export const authResponseInterceptor = {
  onFulfilled: (response: AxiosResponse<LoginResponseModel>) => response,
  onRejected: (error: AxiosError<AuthResponse>) => {
    // Si el error es 401 (Unauthorized), limpiar datos y redirigir al login
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url ?? '';

      // Excepción: si el 401 viene del endpoint de cambio de contraseña,
      // dejamos que el componente lo maneje sin cerrar sesión ni redirigir.
      if (requestUrl.includes('/users/me/password')) {
        return Promise.reject(error);
      }

      // Importar dinámicamente para evitar dependencias circulares
      import('../services/auth.service').then(({ clearAuthData }) => {
        clearAuthData();
        // Redirigir al login solo si no estamos ya en la página de login
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/login2'
        ) {
          window.location.href = '/login';
        }
      });
    }
    return Promise.reject(error);
  }
};

