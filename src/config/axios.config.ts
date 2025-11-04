import axios from 'axios'
import  { appConfig } from './app.config'

export const mainCustomAxios = axios.create({
    baseURL: appConfig.apiUrl || 'http://localhost:3000',
})
