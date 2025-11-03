import { useCallback, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../types/user.interfaces';
import { AuthContext } from './auth-context';
import type { ILoginForm } from './auth-context.interfaces';

const LOCAL_STORAGE_TOKEN = 'token';
const LOCAL_STORAGE_USER = 'user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [pendingRedirect] = useState<string | null>(null);

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
      localStorage.setItem(LOCAL_STORAGE_TOKEN, 'mock-token');
      
      navigate('/dashboard', { replace: true });
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
