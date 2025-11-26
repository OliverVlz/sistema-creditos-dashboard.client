import { useState, useEffect } from 'react';
import { getUser, isAuthenticated, clearAuthData } from '../core/services/auth.service';
import { AuthUser } from '../core/models/loginResponseModel';

/**
 * Hook para manejar la autenticación
 * Proporciona acceso al usuario actual y estado de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al montar el componente
    const loadUser = () => {
      const savedUser = getUser();
      setUser(savedUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const updateUser = (newUser: AuthUser | null) => {
    setUser(newUser);
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    loading,
    logout,
    updateUser,
  };
};

