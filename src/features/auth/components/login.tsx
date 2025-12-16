import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import EditText from '../../../components/ui/EditText';
import logoColor from '../../../assets_landing/images/ui/logo-color.png';   
import { EyeIcon, EyeCloseIcon } from '../../../icons';
import { LoginFormData, FormErrors } from '../models/loginModel';
import { login } from '../slices/operations/loginOperations';
import { useAppDispatch } from '../../../store';
import { saveAuthData } from '../../../core/services/auth.service';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { updateUser } = useAuth();

  // Estados del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<keyof LoginFormData, boolean>>({
    email: false,
    password: false
  });

  // Validaciones con useMemo para optimización
  const validations = useMemo(() => ({
    email: (value: string) => {
      if (!value) return 'El correo electrónico es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
      return '';
    },
    password: (value: string) => {
      if (!value) return 'La contraseña es requerida';
      if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
      return '';
    }
  }), []);

  // Validar campo individual
  const validateField = useCallback((field: keyof LoginFormData, value: string) => {
    const error = validations[field](value);
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, [validations]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(key => {
      const field = key as keyof LoginFormData;
      const error = validations[field](formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validations]);

  // Manejador optimizado con useCallback
  const handleInputChange = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Manejador de blur para validación en tiempo real
  const handleBlur = useCallback((field: keyof LoginFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  // Submit optimizado
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Ejecutar la operación de login (email en minúsculas)
      // @ts-expect-error - Redux Toolkit types issue with React 19
      const result = await dispatch(login({ ...formData, email: formData.email.toLowerCase() })).unwrap();
      
      // Guardar token y usuario en localStorage
      saveAuthData(result);
      updateUser(result.user);
      

      
      // Redirigir a la ruta desde la que se intentó acceder o al dashboard por defecto
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard/home';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión. Verifica tus credenciales.';
      console.error('Error en login:', error);
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, navigate, dispatch, location, updateUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex flex-col py-2 sm:py-6 lg:py-8">
        <section className="w-full flex-1 flex items-start sm:items-center pt-4 sm:pt-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start sm:items-center">
              {/* Columna del formulario */}
              <div className="order-2 lg:order-2 max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">

                <div className="text-center mb-4 sm:mb-5">
                <img
                  src={logoColor}
                  alt="Logo Sistema de Créditos"
                  className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2"
                />
                <h2 className="font-plus-jakarta text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  Iniciar Sesión
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  Accede a tu cuenta para continuar con tu solicitud
                </p>
              </div>

              {/* Error general */}
              {errors.general && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                  <div className="flex items-start sm:items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico
              </label>
              <EditText
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full ${errors.email && touched.email ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
            </div>

            <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <EditText
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  onBlur={() => handleBlur('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pr-12 ${errors.password && touched.password ? 'border-red-300 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute z-30 top-1/2 -translate-y-1/2 right-3 cursor-pointer outline-none focus:outline-none hover:opacity-70 transition-opacity flex items-center justify-center w-6 h-6"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5 pointer-events-none" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5 pointer-events-none" />
                  )}
                </button>
              </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm">
              <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF8546] focus:ring-[#FF8546] rounded border-gray-300"
                      disabled={isLoading}
                    />
                    <span className={`text-gray-600 ${isLoading ? 'opacity-50' : ''}`}>Recordarme</span>
              </label>
                  <a
                    href="#"
                    className={`text-[#FF8546] hover:underline transition-colors font-medium ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
                  disabled={isLoading}
                  className="mt-4 bg-gradient-to-r from-[#FF8546] to-[#FF6B35] hover:from-[#E64A2E] hover:to-[#FF5722] shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
            </Button>
          </form>

          <div className="text-center mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="text-[#FF8546] font-semibold hover:underline transition-colors">
                Regístrate aquí
                  </Link>
                </p>
              </div>
              </div>

            
              {/* Columna con pasos */}
            <div className="order-1 lg:order-1 flex items-center">
              <div className="w-full">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className="flex items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FF8546] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                          1
                        </div>
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700">Acceso</span>
                      </div>
                      <div className="w-4 sm:w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                          2
                        </div>
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">Solicitud</span>
                      </div>
                      <div className="w-4 sm:w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                          3
                        </div>
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">Aprobación</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Paso 1: Accede a tu cuenta
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
                      Para solicitar tu crédito por libranza, necesitas tener una cuenta activa.
                      Inicia sesión o regístrate si aún no lo has hecho.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>

    </div>
  );
}








