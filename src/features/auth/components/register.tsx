import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import EditText from '../../../components/ui/EditText';
import Dropdown, { DropdownOption } from '../../../components/ui/Dropdown';
import DatePicker from '../../../components/form/date-picker';
import logoColor from '../../../assets_landing/images/ui/logo-color.png';
import { EyeIcon, EyeCloseIcon } from '../../../icons';
import { RegisterFormData, FormErrors } from '../models/registerModel';
import { register } from '../slices/operations/registerOperations';
import { useAppDispatch, useAppSelector, RootState } from '../../../store';
import { fetchOrganizations } from '../../customer-management/slices/operations/fetchOrganizations.operation';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error: reduxError, isRegistered } = useAppSelector((state: RootState) => state.auth);
  const { organizations } = useAppSelector((state: RootState) => state.organizations);

  // Estados del formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    birthDate: '',
    documentNumber: '',
    phoneNumber: '',
    employmentStatus: '',
    organizationId: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<keyof RegisterFormData, boolean>>({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    address: false,
    birthDate: false,
    documentNumber: false,
    phoneNumber: false,
    employmentStatus: false,
    organizationId: false,
    confirmPassword: false
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Cargar organizaciones al montar el componente
  useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchOrganizations({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Redirigir si el registro fue exitoso
  useEffect(() => {
    if (isRegistered) {
      navigate('/login');
    }
  }, [isRegistered, navigate]);

  // Opciones para los selects
  const employmentStatusOptions: DropdownOption[] = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'JUBILADO', label: 'Jubilado' }
  ];

  const organizationOptions: DropdownOption[] = organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }));

  // Validaciones con useMemo para optimización
  const validations = useMemo(() => ({
    firstName: (value: string) => {
      if (!value) return 'El nombre es requerido';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value)) return 'El nombre solo puede contener letras y espacios';
      return '';
    },
    lastName: (value: string) => {
      if (!value) return 'El apellido es requerido';
      if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value)) return 'El apellido solo puede contener letras y espacios';
      return '';
    },
    email: (value: string) => {
      if (!value) return 'El correo electrónico es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
      return '';
    },
    phoneNumber: (value: string) => {
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
    },
    address: (value: string) => {
      if (!value) return 'La dirección es requerida';
      if (value.length < 5) return 'La dirección debe tener al menos 5 caracteres';
      return '';
    },
    birthDate: (value: string) => {
      if (!value) return 'La fecha de nacimiento es requerida';
      const date = new Date(value);
      const today = new Date();
      if (date > today) return 'La fecha de nacimiento no puede ser futura';
      const age = today.getFullYear() - date.getFullYear();
      if (age < 18) return 'Debes ser mayor de 18 años';
      return '';
    },
    documentNumber: (value: string) => {
      if (!value) return 'El número de documento es requerido';
      if (value.length < 5) return 'El número de documento debe tener al menos 5 caracteres';
      return '';
    },
    employmentStatus: (value: string) => {
      if (!value) return 'El estado laboral es requerido';
      return '';
    },
    organizationId: (value: string) => {
      if (!value) return 'La organización es requerida';
      return '';
    }
  }), [formData.password]);

  const validateField = useCallback((field: keyof RegisterFormData, value: string) => {
    const error = validations[field](value);
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, [validations]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(key => {
      const field = key as keyof RegisterFormData;
      const value = formData[field] || '';
      const error = validations[field](value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validations]);

  const handleInputChange = useCallback((field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleSelectChange = useCallback((field: keyof RegisterFormData) => {
    return (value: string | number | null | undefined) => {
      if (value !== null && value !== undefined) {
        handleInputChange(field, String(value));
      }
    };
  }, [handleInputChange]);

  const handleDateChange = useCallback((selectedDates: Date[]) => {
    if (selectedDates && selectedDates.length > 0) {
      const date = selectedDates[0];
      const formattedDate = date.toISOString().split('T')[0];
      handleInputChange('birthDate', formattedDate);
    }
  }, [handleInputChange]);

  const handleBlur = useCallback((field: keyof RegisterFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field] || '';
    validateField(field, value);
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar aceptación de términos y políticas
    if (!acceptTerms || !acceptPrivacy) {
      setTermsError('Debes aceptar los Términos y Condiciones para crear tu cuenta.');
      return;
    }
    setTermsError('');

    // Marcar todos los campos como touched
    const allFields: (keyof RegisterFormData)[] = [
      'email', 'password', 'firstName', 'lastName', 'address',
      'birthDate', 'documentNumber', 'phoneNumber', 'employmentStatus',
      'organizationId', 'confirmPassword'
    ];
    const touchedState: Record<keyof RegisterFormData, boolean> = {} as Record<keyof RegisterFormData, boolean>;
    allFields.forEach(field => {
      touchedState[field] = true;
    });
    setTouched(touchedState);

    if (!validateForm()) {
      return;
    }

    setErrors({});

    try {
      // @ts-expect-error - Redux Toolkit types issue with React 19
      await dispatch(register(formData)).unwrap();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse. Intenta nuevamente.';
      setErrors({
        general: errorMessage
      });
    }
  }, [formData, validateForm, dispatch, acceptTerms, acceptPrivacy]);

  const isLoading = loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex flex-col">
      {/* Formulario principal */}
      <section className="w-full py-4 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Columna del texto (Izquierda en desktop) */}
            <div className="order-2 lg:order-1 flex items-center justify-center lg:h-full lg:sticky lg:top-8">
              <div className="space-y-8 w-full">
                {/* Indicador de paso */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#FF8546] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                          1
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Registro</span>
                      </div>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center opacity-60">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-500 hidden sm:inline">Verificación</span>
                      </div>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center opacity-60">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                      Crea tu cuenta
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto text-base md:text-lg">
                      Únete hoy y accede a nuestros servicios de crédito por libranza de manera rápida y segura.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna del formulario (Derecha en desktop) */}
            {/* CAMBIO 1: Aumentamos max-w-lg a max-w-2xl para dar espacio a las 2 columnas */}
            <div className="order-1 lg:order-2 w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/40">
              <div className="text-center mb-6">
                <img
                  src={logoColor}
                  alt="Logo Sistema de Créditos"
                  className="w-16 h-16 mx-auto mb-3 object-contain"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Formulario de Registro
                </h2>
              </div>

              {/* Error general */}
              {(errors.general || reduxError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{errors.general || reduxError}</p>
                  </div>
                </div>
              )}

              {/* CAMBIO 2: Grid system aplicado al formulario */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Nombre
                  </label>
                  <EditText
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    onBlur={() => handleBlur('firstName')}
                    className={`w-full ${errors.firstName && touched.firstName ? 'border-red-300 focus:border-red-500 ring-red-100' : ''}`}
                    disabled={isLoading}
                    placeholder="Tu nombre"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Apellido
                  </label>
                  <EditText
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    onBlur={() => handleBlur('lastName')}
                    className={`w-full ${errors.lastName && touched.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                    placeholder="Tu apellido"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Correo electrónico */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Correo electrónico
                  </label>
                  <EditText
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full ${errors.email && touched.email ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.email}</p>
                  )}
                </div>

                {/* Número de teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Teléfono celular
                  </label>
                  <EditText
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                    onBlur={() => handleBlur('phoneNumber')}
                    className={`w-full ${errors.phoneNumber && touched.phoneNumber ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                    placeholder="300 000 0000"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Dirección - CAMBIO 3: Ocupa 2 columnas (full width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Dirección de residencia
                  </label>
                  <EditText
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    onBlur={() => handleBlur('address')}
                    className={`w-full ${errors.address && touched.address ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                    placeholder="Calle 123 # 45 - 67"
                  />
                  {errors.address && touched.address && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.address}</p>
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Fecha de nacimiento
                  </label>
                  <DatePicker
                    id="birthDate"
                    mode="single"
                    onChange={handleDateChange}
                    placeholder="Seleccionar fecha"
                    maxDate={new Date().toISOString().split('T')[0]}
                  />
                  {errors.birthDate && touched.birthDate && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.birthDate}</p>
                  )}
                </div>

                {/* Número de documento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    No. Documento
                  </label>
                  <EditText
                    value={formData.documentNumber}
                    onChange={(value) => handleInputChange('documentNumber', value)}
                    onBlur={() => handleBlur('documentNumber')}
                    className={`w-full ${errors.documentNumber && touched.documentNumber ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                    placeholder="1234567890"
                  />
                  {errors.documentNumber && touched.documentNumber && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.documentNumber}</p>
                  )}
                </div>

                {/* Estado laboral */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Estado laboral
                  </label>
                  <Dropdown
                    placeholder="Seleccionar..."
                    options={employmentStatusOptions}
                    value={formData.employmentStatus || undefined}
                    onChange={handleSelectChange('employmentStatus')}
                    disabled={isLoading}
                    className={errors.employmentStatus && touched.employmentStatus ? 'border-red-300' : ''}
                  />
                  {errors.employmentStatus && touched.employmentStatus && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.employmentStatus}</p>
                  )}
                </div>

                {/* Organización */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Organización
                  </label>
                  <Dropdown
                    placeholder="Seleccionar empresa"
                    options={organizationOptions}
                    value={formData.organizationId || undefined}
                    onChange={handleSelectChange('organizationId')}
                    disabled={isLoading}
                    className={errors.organizationId && touched.organizationId ? 'border-red-300' : ''}
                  />
                  {errors.organizationId && touched.organizationId && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.organizationId}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
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
                      placeholder="••••••••"
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
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Confirmar
                  </label>
                  <div className="relative">
                    <EditText
                      value={formData.confirmPassword || ''}
                      onChange={(value) => handleInputChange('confirmPassword', value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`w-full pr-12 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      className="absolute z-30 top-1/2 -translate-y-1/2 right-3 cursor-pointer outline-none focus:outline-none hover:opacity-70 transition-opacity flex items-center justify-center w-6 h-6"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5 pointer-events-none" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5 pointer-events-none" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.confirmPassword}</p>
                  )}

                </div>

                {/* Aceptación de términos y políticas */}
                <div className="md:col-span-2 mt-1">
                  <div className="flex items-start gap-2">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (e.target.checked && acceptPrivacy) {
                          setTermsError('');
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#FF8546] focus:ring-[#FF8546]"
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-xs md:text-sm text-gray-500 leading-snug"
                    >
                      Acepto los{' '}
                      <Link
                        to="/terminos-y-condiciones"
                        className="text-[#FF8546] font-semibold hover:text-[#E64A2E] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Términos y Condiciones
                      </Link>
                      
                      .
                    </label>
                  </div>

                  <div className="flex items-start gap-2 mt-2">
                    <input
                      id="acceptPrivacy"
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={(e) => {
                        setAcceptPrivacy(e.target.checked);
                        if (e.target.checked && acceptTerms) {
                          setTermsError('');
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#FF8546] focus:ring-[#FF8546]"
                    />
                    <label
                      htmlFor="acceptPrivacy"
                      className="text-xs md:text-sm text-gray-500 leading-snug"
                    >
                      Autorizo el tratamiento de mis datos personales conforme a la{' '}
                      <Link
                        to="/politica-de-privacidad"
                        className="text-[#FF8546] font-semibold hover:text-[#E64A2E] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Política de Privacidad
                      </Link>
                      .
                    </label>
                  </div>

                  {termsError && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{termsError}</p>
                  )}
                </div>

                {/* Botón Submit - CAMBIO 4: Full width en grid */}
                <div className="md:col-span-2 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    disabled={isLoading || !acceptTerms || !acceptPrivacy}
                    className="bg-gradient-to-r from-[#FF8546] to-[#FF6B35] hover:from-[#E64A2E] hover:to-[#FF5722] shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold rounded-xl"
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
                      'Crear cuenta ahora'
                    )}
                  </Button>
                </div>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  ¿Ya tienes una cuenta registrada?{' '}
                  <Link to="/login" className="text-[#FF8546] font-bold hover:text-[#E64A2E] transition-colors ml-1">
                    Inicia sesión
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