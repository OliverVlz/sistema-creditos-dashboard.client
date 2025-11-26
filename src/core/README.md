# Core - Interceptors y Guards

Esta carpeta contiene la lógica central para manejar autenticación, interceptors y guards en la aplicación React.

## Estructura

```
core/
├── interceptors/
│   └── auth.interceptor.ts    # Interceptors de Axios para autenticación
└── services/
    └── auth.service.ts         # Servicio para manejar token y usuario
```

## Interceptors (Equivalente a Angular Interceptors)

Los interceptors se encuentran en `core/interceptors/auth.interceptor.ts` y se configuran en `config/axios.config.ts`.

### ¿Qué hacen?

1. **Request Interceptor**: Agrega automáticamente el token JWT a todas las peticiones HTTP
2. **Response Interceptor**: Maneja errores 401 (Unauthorized) y redirige al login automáticamente

### Uso

Los interceptors se configuran automáticamente al importar `mainCustomAxios`. No necesitas hacer nada adicional:

```typescript
import { mainCustomAxios } from '@/config/axios.config';

// El token se agrega automáticamente a esta petición
const response = await mainCustomAxios.get('/api/users');
```

## Guards (Equivalente a Angular Guards)

Los guards se encuentran en `routes/components/PrivateRoute.tsx`.

### ¿Qué hacen?

Protegen rutas privadas verificando si el usuario está autenticado. Si no lo está, redirigen al login.

### Uso en App.tsx

Envuelve las rutas privadas con el componente `PrivateRoute`:

```tsx
import { PrivateRoute } from './routes/components/PrivateRoute';

// Rutas públicas (sin protección)
<Route element={<LandingLayout />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/registro" element={<RegisterPage />} />
</Route>

// Rutas privadas (protegidas)
<Route element={<AppLayout />}>
  <Route path="/dashboard" element={
    <PrivateRoute>
      <RebuiltDashboard />
    </PrivateRoute>
  } />
  
  <Route path="/dashboard/gestion-de-usuarios" element={
    <PrivateRoute>
      <UserManagementComponent />
    </PrivateRoute>
  } />
</Route>
```

## Servicio de Autenticación

El servicio `auth.service.ts` proporciona funciones para manejar el token y usuario:

### Funciones disponibles

```typescript
import { 
  saveAuthData,    // Guarda token y usuario
  getToken,        // Obtiene el token
  getUser,         // Obtiene el usuario
  isAuthenticated, // Verifica si hay sesión activa
  clearAuthData    // Limpia todos los datos
} from '@/core/services/auth.service';
```

### Ejemplo de uso

```typescript
// Después de un login exitoso
const authData = {
  token: "eyJhbGci...",
  user: { id: "123", email: "user@example.com", ... }
};

saveAuthData(authData);

// Verificar autenticación
if (isAuthenticated()) {
  const user = getUser();
  const token = getToken();
}

// Cerrar sesión
clearAuthData();
```

## Hook useAuth

El hook `useAuth` proporciona acceso al estado de autenticación en componentes:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, logout, updateUser } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido, {user?.firstName}</p>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
```

## Flujo completo

1. **Login**: El usuario inicia sesión → se guarda token y usuario → se redirige al dashboard
2. **Peticiones HTTP**: Los interceptors agregan automáticamente el token a cada petición
3. **Protección de rutas**: `PrivateRoute` verifica autenticación antes de mostrar contenido
4. **Logout**: Se limpian los datos → se redirige al login
5. **Token expirado**: El interceptor detecta 401 → limpia datos → redirige al login

