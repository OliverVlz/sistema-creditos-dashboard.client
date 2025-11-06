import React, { useState, useCallback, useMemo, useEffect } from 'react';
/* import { useAppDispatch, useAppSelector, RootState } from '../../../store/index';
 */
import { useAppSelector, RootState } from '../../../store/index';
import Form from '../../../components/form/Form';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import Button from '../../../components/ui/button/Button';
import { EyeIcon, EyeCloseIcon, CloseIcon} from '../../../icons';
import { FormClientProps, ClientFormData, FormErrors } from '../models/formClientModel';
/* import { createClient } from '../slices/operations/createClient.operations';
import { fetchClients } from '../slices/operations/fetchClients.operation'; */
import swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DatePicker from '@/components/form/date-picker';

import { useDispatch } from 'react-redux';
import { fetchOrganizations } from '../slices/operations/fetchOrganizations.operation';
import { createClient } from '../slices/operations/createClient.operations';

const FormClient: React.FC<FormClientProps> = ({ 
  initialData, 
  onSuccess,
  onError,
}) => {
  /* const dispatch = useAppDispatch(); */
  const { loading: reduxLoading, error: reduxError } = useAppSelector((state: RootState) => state.clients);
  const { organizations} = useAppSelector((state: RootState) => state.organizations);
  const navigate = useNavigate();
  const isEditMode = !!initialData;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrganizations({ page: 1, limit: 100 }));
}, [dispatch]);


  // Estados del formulario
  const [formData, setFormData] = useState<ClientFormData>({
    email: initialData?.email || '',
    password: initialData?.password || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    address: initialData?.address || '',
    birthDate: initialData?.birthDate || '',
    documentNumber: initialData?.documentNumber || '',
    phoneNumber: initialData?.phoneNumber || '',
    employmentStatus: initialData?.employmentStatus || '',
    employmentStatusOther: initialData?.employmentStatusOther || '',
    organizationId: initialData?.organizationId || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isLoadingState = reduxLoading || isLoading;
  
  const [touched, setTouched] = useState<Record<keyof ClientFormData, boolean>>({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    address: false,
    birthDate: false,
    documentNumber: false,
    phoneNumber: false,
    employmentStatus: false,
    employmentStatusOther: false,
    organizationId: false,
  });

  // Opciones para los selects
  const employmentStatusOptions = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'JUBILADO', label: 'Jubilado' }
  ];

  const organizationOptions = organizations.map((organization) => ({
    value: organization.id,
    label: organization.name,
  }));

  // Validaciones con useMemo para optimización
  const validations = useMemo(() => ({
    firstName: (value: string) => {
      if (!value.trim()) return 'El nombre es requerido';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value)) return 'El nombre solo puede contener letras y espacios';
      return '';
    },
    lastName: (value: string) => {
      if (!value.trim()) return 'El apellido es requerido';
      if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value)) return 'El apellido solo puede contener letras y espacios';
      return '';
    },
    email: (value: string) => {
      if (!value.trim()) return 'El correo electrónico es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
      return '';
    },
    password: (value: string) => {
      if (isEditMode && !value.trim()) return '';
      if (!value.trim()) return 'La contraseña es requerida';
      if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'La contraseña debe contener mayúsculas, minúsculas y números';
      }
      return '';
    },
    employmentStatus: (value: string) => {
      if (!value.trim()) return 'El estado laboral es requerido';
      return '';
    },
    employmentStatusOther: (value: string) => {
      // Solo validar si employmentStatus es "OTRO"
      if (!value.trim()) return '';
      return '';
    },
    documentNumber: (value: string) => {
      if (!value.trim()) return 'El número de documento es requerido';
      if (!/^[0-9]+$/.test(value)) return 'El número de documento solo puede contener números';
      if (value.length < 5) return 'El número de documento debe tener al menos 5 dígitos';
      return '';
    },
    phoneNumber: (value: string) => {
      if (!value.trim()) return 'El teléfono es requerido';
      if (!/^[0-9+\-\s()]+$/.test(value)) return 'Ingresa un número de teléfono válido';
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10) return 'El número debe tener al menos 10 dígitos';
      return '';
    },
    address: (value: string) => {
      if (!value.trim()) return 'La dirección es requerida';
      if (value.length < 5) return 'La dirección debe tener al menos 5 caracteres';
      return '';
    },
    birthDate: (value: string) => {
      if (!value.trim()) return 'La fecha de nacimiento es requerida';
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) return 'Debes ser mayor de 18 años';
      if (age > 100) return 'Por favor verifica la fecha de nacimiento';
      return '';
    },
    organizationId: (value: string) => {
      if (!value.trim()) return 'La organización es requerida';
      return '';
    },
  }), [isEditMode, formData.employmentStatus]);

  const maxBirthDate = useMemo(() => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  }, []);

  // Fecha mínima (100 años atrás)
  const minBirthDate = useMemo(() => {
    const today = new Date();
    const hundredYearsAgo = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    return hundredYearsAgo.toISOString().split('T')[0];
  }, []);

  // Validar campo individual
  const validateField = useCallback((field: keyof ClientFormData, value: string) => {
    if (validations[field]) {
      const error = validations[field](value);
      setErrors(prev => ({ ...prev, [field]: error }));
      return !error;
    }
    return true;
  }, [validations]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(key => {
      const field = key as keyof ClientFormData;
      if (validations[field]) {
        const error = validations[field](formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validations]);

  // Manejador optimizado con useCallback
  const handleInputChange = useCallback((field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Manejador de blur para validación en tiempo real
  const handleBlur = useCallback((field: keyof ClientFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    const allTouched: Record<keyof ClientFormData, boolean> = {
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      address: true,
      birthDate: true,
      documentNumber: true,
      phoneNumber: true,
      employmentStatus: true,
      employmentStatusOther: true,
      organizationId: true,
    };
    setTouched(allTouched);
  }, []);


  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    
    if (!validateForm()) {
      resetForm();
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('try');
      const dataToSubmit: ClientFormData = { ...formData };
      const finalData = isEditMode && !dataToSubmit.password.trim()
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = dataToSubmit;
            return rest;
          })()
        : dataToSubmit;

      if (isEditMode) {
        console.log('Actualizando cliente:', finalData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (onSuccess) {
          await onSuccess(dataToSubmit);
        }
      } else {
        // Crear cliente usando Redux
        const createClientResult = await dispatch(createClient(dataToSubmit));
        if (createClient.fulfilled.match(createClientResult)) {
            // Mostrar mensaje de éxito
            await swal.fire({
              title: '¡Éxito!',
              text: 'Cliente creado exitosamente',
              icon: 'success',
              confirmButtonColor: '#FB6514',
            });
            
            if (onSuccess) {
              await onSuccess(dataToSubmit);
            }
          } else if (createClient.rejected.match(createClientResult)) {
            const errorMsg = createClientResult.error?.message || 'Error al crear el cliente';
            throw new Error(errorMsg);
          }
      }

    } catch (error) {
      console.error('Error al guardar cliente:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : reduxError || 'Error al guardar el cliente. Por favor, intenta nuevamente.';
      
      await swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#FB6514',
      });
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      } else {
        setErrors({
          general: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, isEditMode, onSuccess, onError, resetForm, reduxError]);

  const handleCancel = useCallback(() => {  
    swal.fire({
      title: '¿Estás seguro de querer cancelar?',
      text: 'Todos los cambios realizados se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FB6514',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar editando',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard/gestion-de-clientes');
      }
    });
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
        </h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-error-600 text-sm dark:bg-error-900/20 dark:border-error-800 dark:text-error-400">
            {errors.general}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="space-y-6">
          {/* Primera fila: Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Ingresa el nombre"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                error={!!errors.firstName && touched.firstName}
                hint={touched.firstName ? errors.firstName : ''}
              />
            </div>

            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Ingresa el apellido"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                error={!!errors.lastName && touched.lastName}
                hint={touched.lastName ? errors.lastName : ''}
              />
            </div>
          </div>

          {/* Segunda fila: Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={!!errors.email && touched.email}
                hint={touched.email ? errors.email : ''}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Teléfono *</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="300 123 4567"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                error={!!errors.phoneNumber && touched.phoneNumber}
                hint={touched.phoneNumber ? errors.phoneNumber : ''}
              />
            </div>
          </div>

          {/* Tercera fila: Número de Documento y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="documentNumber">Número de Documento *</Label>
              <Input
                type="text"
                id="documentNumber"
                name="documentNumber"
                placeholder="1234567890"
                value={formData.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                onBlur={() => handleBlur('documentNumber')}
                error={!!errors.documentNumber && touched.documentNumber}
                hint={touched.documentNumber ? errors.documentNumber : ''}
              />
            </div>

            <div>
               <DatePicker
                    id="birthDate"
                    label="Fecha de Nacimiento *"
                    placeholder="Selecciona la fecha de nacimiento"
                    onChange={(_dates, currentDateString) => {
                    handleInputChange('birthDate', currentDateString);
                    handleBlur('birthDate');
                    }}
                    maxDate={maxBirthDate}
                    minDate={minBirthDate}
                />
            </div>
          </div>

          {/* Cuarta fila: Dirección */}
          <div>
            <Label htmlFor="address">Dirección *</Label>
            <Input
              type="text"
              id="address"
              name="address"
              placeholder="Calle 123 #45-67, Ciudad"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              error={!!errors.address && touched.address}
              hint={touched.address ? errors.address : ''}
            />
          </div>

          {/* Quinta fila: Estado Laboral y Campo Condicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employmentStatus">Estado Laboral *</Label>
              <Select
                options={employmentStatusOptions}
                placeholder="Selecciona el estado laboral"
                value={formData.employmentStatus}
                onChange={(value) => handleInputChange('employmentStatus', value)}
                className="dark:bg-gray-900"
              />
              {touched.employmentStatus && errors.employmentStatus && (
                <p className="mt-1.5 text-xs text-error-500">{errors.employmentStatus}</p>
              )}
            </div>

            {formData.employmentStatus === 'OTRO' && (
              <div>
                <Label htmlFor="employmentStatusOther">Especifica el Estado Laboral *</Label>
                <Input
                  type="text"
                  id="employmentStatusOther"
                  name="employmentStatusOther"
                  placeholder="Describe tu situación laboral"
                  value={formData.employmentStatusOther}
                  onChange={(e) => handleInputChange('employmentStatusOther', e.target.value)}
                  onBlur={() => handleBlur('employmentStatusOther')}
                  error={!!errors.employmentStatusOther && touched.employmentStatusOther}
                  hint={touched.employmentStatusOther ? errors.employmentStatusOther : ''}
                />
              </div>
            )}

            {formData.employmentStatus !== 'OTRO' && (
              <div>
                <Label htmlFor="organizationId">Organización *</Label>
                <Select
                  options={organizationOptions}
                  placeholder="Selecciona la organización"
                  value={formData.organizationId}
                  onChange={(value) => handleInputChange('organizationId', value)}
                  className="dark:bg-gray-900"
                />
              </div>
            )}
          </div>

          {/* Sexta fila: Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="password">
                Contraseña {isEditMode ? '(Dejar vacío para no cambiar)' : '*'}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={isEditMode ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={!!errors.password && touched.password}
                  hint={touched.password ? errors.password : ''}
                  className="pr-12"
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
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline"
              size="md"
              startIcon={<CloseIcon className="size-5" />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <button
              type="submit"
              disabled={isLoadingState}
              className={`inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm font-medium ${
                isLoadingState 
                  ? 'cursor-not-allowed opacity-50 bg-brand-300 text-white' 
                  : 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300'
              }`}
            >
              {isLoadingState ? 'Guardando...' : isEditMode ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormClient;