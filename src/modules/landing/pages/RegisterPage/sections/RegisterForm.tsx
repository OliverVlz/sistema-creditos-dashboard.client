import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../../../components/ui/Button';
import EditText from '../../../../../components/ui/EditText';
import logoColor from '../../../../../assets_landing/images/ui/logo-color.png';

// Tipos para mejor type safety
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterForm() {
  // Estados del formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Record<keyof RegisterFormData, boolean>>({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });

  // Validaciones con useMemo para optimización
  const validations = useMemo(() => ({
    name: (value: string) => {
      if (!value) return 'El nombre completo es requerido';
      if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value)) return 'El nombre solo puede contener letras y espacios';
      return '';
    },
    email: (value: string) => {
      if (!value) return 'El correo electrónico es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
      return '';
    },
    phone: (value: string) => {
      if (!value) return 'El número de teléfono es requerido';
      if (!/^[0-9+\-\s()]+$/.test(value)) return 'Ingresa un número de teléfono válido';
      if (value.replace(/\D/g, '').length < 10) return 'El número debe tener al menos 10 dígitos';
      return '';
    },
    password: (value: string) => {
      if (!value) return 'La contraseña es requerida';
      if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'La contraseña debe contener mayúsculas, minúsculas y números';
      }
      return '';
    },
    confirmPassword: (value: string) => {
      if (!value) return 'La confirmación de contraseña es requerida';
      if (value !== formData.password) return 'Las contraseñas no coinciden';
      return '';
    }
  }), [formData.password]);

  // Validar campo individual
  const validateField = useCallback((field: keyof RegisterFormData, value: string) => {
    const error = validations[field](value);
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, [validations]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(key => {
      const field = key as keyof RegisterFormData;
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
  const handleInputChange = useCallback((field: keyof RegisterFormData, value: string) => {
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
  const handleBlur = useCallback((field: keyof RegisterFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  // Submit optimizado
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Registro exitoso:', formData);
      alert('¡Registro exitoso! Serás redirigido al login.');

    } catch {
      setErrors({
        general: 'Error al registrarse. Intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex flex-col">

        {/* Formulario principal */}
        <section className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Columna del texto */}
              <div className="order-2 lg:order-1 flex items-center">
                <div className="space-y-8">
                  {/* Indicador de paso */}
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#FF8546] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">Registro</span>
                        </div>
                        <div className="w-8 h-px bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-500">Verificación</span>
                        </div>
                        <div className="w-8 h-px bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                            3
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-500">Solicitud</span>
                        </div>
                        <div className="w-8 h-px bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                            4
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-500">Crédito</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Paso 1: Crea tu cuenta
                      </h1>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Para acceder a nuestros créditos por libranza, necesitas crear una cuenta.
                        Completa tus datos y comienza tu proceso de solicitud.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna del formulario */}
              <div className="order-1 max-w-lg mx-auto lg:order-2 bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-4">
                <img
                  src={logoColor}
                  alt="Logo Sistema de Créditos"
                  className="w-14 h-14 mx-auto mb-2"
                />
                <h2 className="font-plus-jakarta text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  Crear cuenta
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Regístrate para acceder a nuestros servicios de crédito
                </p>
              </div>

              {/* Error general */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <EditText
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full ${errors.name && touched.name ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Número de teléfono
                  </label>
                  <EditText
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full ${errors.phone && touched.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <EditText
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
                    onBlur={() => handleBlur('password')}
                    type="password"
                    className={`w-full ${errors.password && touched.password ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirmar contraseña
                  </label>
                  <EditText
                    value={formData.confirmPassword}
                    onChange={(value) => handleInputChange('confirmPassword', value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    type="password"
                    className={`w-full ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
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
                      Creando cuenta...
                    </div>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </form>

                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-[#FF8546] font-semibold hover:underline transition-colors">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      
    </div>
  );
}








