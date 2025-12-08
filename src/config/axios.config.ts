import axios from 'axios'
import  { appConfig } from './app.config'
import { authRequestInterceptor, authResponseInterceptor } from '../core/interceptors/auth.interceptor'

export const mainCustomAxios = axios.create({
    // Si apiUrl está vacío (producción), axios usará rutas relativas
    // Si tiene valor (desarrollo), usará esa URL completa
    baseURL: appConfig.apiUrl || 'http://localhost:3000',
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
