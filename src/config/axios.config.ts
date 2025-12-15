import axios from 'axios'
import  { appConfig } from './app.config'
import { authRequestInterceptor, authResponseInterceptor } from '../core/interceptors/auth.interceptor'

const getBaseUrl = () => {
    if (appConfig.apiUrl) return appConfig.apiUrl;
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return 'https://prestamos-backend-xpe7lm-c0f02b-72-61-79-221.traefik.me';
    }
    return 'http://localhost:3000';
};

export const mainCustomAxios = axios.create({
    baseURL: getBaseUrl(),
})

// Agregar interceptor de request para incluir el token automáticamente
mainCustomAxios.interceptors.request.use(
    authRequestInterceptor,
    (error) => Promise.reject(error)
)

// Agregar interceptor de response para manejar errores de autenticación
mainCustomAxios.interceptors.response.use(
    authResponseInterceptor.onFulfilled,
    authResponseInterceptor.onRejected
)
