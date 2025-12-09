import { useState, useEffect, useCallback } from 'react';
import { getUser, isAuthenticated, clearAuthData } from '../core/services/auth.service';
import { AuthUser } from '../core/models/loginResponseModel';

/**
 * Hook para manejar la autenticación
 * Proporciona acceso al usuario actual y estado de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al montar el componente
    const savedUser = getUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
  }, []);

  const updateUser = useCallback((newUser: AuthUser | null) => {
    setUser(newUser);
    // Cuando se actualiza el usuario, asegurar que loading sea false
    setLoading(false);
  }, []);

  // Refrescar usuario desde localStorage (útil después de login)
  const refreshUser = useCallback(() => {
    const savedUser = getUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    loading,
    logout,
    updateUser,
    refreshUser,
  };
};

