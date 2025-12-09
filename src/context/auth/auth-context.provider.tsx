import { useCallback, useState, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../types/user.interfaces';
import { AuthContext } from './auth-context';
import type { ILoginForm } from './auth-context.interfaces';

// Usar las mismas constantes que auth.service.ts para evitar duplicación
const LOCAL_STORAGE_TOKEN = 'auth_token';
const LOCAL_STORAGE_USER = 'auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN);
  });
  const [pendingRedirect] = useState<string | null>(null);

  // Effect to sync token changes from localStorage (for Redux login)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
      const newUser = localStorage.getItem(LOCAL_STORAGE_USER);
      
      if (newToken !== token) {
        setToken(newToken);
      }
      
      if (newUser) {
        const parsedUser = JSON.parse(newUser);
        if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
          setUser(parsedUser);
        }
      } else if (user) {
        setUser(null);
      }
    };

    // Check every second for changes (for Redux updates)
    const interval = setInterval(handleStorageChange, 1000);

    // Also listen for storage events (for multi-tab sync)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token, user]);

  const updateLoggedUser = useCallback((user: IUser | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_USER);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    navigate('/login', { replace: true });
  }, [navigate]);

  const login = async ({ email, password }: ILoginForm) => {
    try {
      setIsLoggingIn(true);
      // TODO: Implementar llamada a la API
      console.log('Login:', { email, password });
      
      // Mock de respuesta exitosa
      const mockUser: IUser = {
        id: '1',
        email,
        name: 'Usuario Demo',
        role: 'user'
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(mockUser));
      const mockToken = 'mock-token';
      localStorage.setItem(LOCAL_STORAGE_TOKEN, mockToken);
      setToken(mockToken);
      
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Error en login:', error);
      setUser(null);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateLoggedUser,
        isLoggingIn,
        pendingRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
