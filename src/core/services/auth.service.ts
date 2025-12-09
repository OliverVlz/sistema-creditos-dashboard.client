/**
 * Servicio de autenticación
 * Maneja el almacenamiento y recuperación del token y datos del usuario
 */

import { AuthUser } from "../models/loginResponseModel";
import { AuthResponse } from "../models/loginResponseModel";

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';


/**
 * Guarda el token en localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Obtiene el token del localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Elimina el token del localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Guarda los datos del usuario en localStorage
 */
export const saveUser = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Obtiene los datos del usuario del localStorage
 */
export const getUser = (): AuthUser | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as AuthUser;
  } catch {
    return null;
  }
};

/**
 * Elimina los datos del usuario del localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Guarda tanto el token como el usuario
 */
export const saveAuthData = (authData: AuthResponse): void => {
  saveToken(authData.token);
  saveUser(authData.user);
};

/**
 * Limpia todos los datos de autenticación del localStorage
 * Elimina todas las posibles claves usadas para auth
 */
export const clearAuthData = (): void => {
  // Limpiar claves del servicio
  removeToken();
  removeUser();
  // Limpiar claves alternativas (usadas en loginOperations)
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica si hay un usuario autenticado
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null && getUser() !== null;
};

