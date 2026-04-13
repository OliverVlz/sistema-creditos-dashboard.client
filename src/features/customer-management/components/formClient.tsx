import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../../../store/index';
import Form from '../../../components/form/Form';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import { EyeIcon, EyeCloseIcon, CloseIcon} from '../../../icons';
import { FormClientProps, ClientFormData, FormErrors } from '../models/formClientModel';
import swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from '@/components/form/date-picker';
import { fetchOrganizations } from '../slices/operations/fetchOrganizations.operation';
import { createClient } from '../slices/operations/createClient.operations';
import { editClientById } from '../slices/operations/editClientById.operations';

const FormClient: React.FC<FormClientProps> = ({ 
  initialData, 
  onSuccess,
  onError,
}) => {
  const { loading: reduxLoading, error: reduxError } = useAppSelector((state: RootState) => state.clients);
  const { organizations} = useAppSelector((state: RootState) => state.organizations);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!initialData;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOrganizations({ page: 1, limit: 100 }));
  }, [dispatch]);

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

  // ⬅️ ACTUALIZAR formData cuando cambie initialData
  useEffect(() => {
    console.log('initialData para ver la fecha', initialData);
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        password: '', // No mostrar contraseña en edición
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        address: initialData.address || '',
        birthDate: initialData.birthDate || '',
        documentNumber: initialData.documentNumber || '',
        phoneNumber: initialData.phoneNumber || '',
        employmentStatus: initialData.employmentStatus || '',
        employmentStatusOther: initialData.employmentStatusOther || '',
        organizationId: initialData.organizationId || '',
      });
    }
  }, [initialData]);

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
    { value: 'ACTIVO', label: 'Activo' },
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
  }), [isEditMode]);

  /* const maxBirthDate = useMemo(() => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo.toISOString().split('T')[0];
  }, []); */

/*   const minBirthDate = useMemo(() => {
    const today = new Date();
    const hundredYearsAgo = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    return hundredYearsAgo.toISOString().split('T')[0];
  }, []); */

  const validateField = useCallback((field: keyof ClientFormData, value: string) => {
    if (validations[field]) {
      const error = validations[field](value);
      setErrors(prev => ({ ...prev, [field]: error }));
      return !error;
    }
    return true;
  }, [validations]);

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

  const handleInputChange = useCallback((field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

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
      // Convertir email a minúsculas antes de enviar
      const dataToSubmit: ClientFormData = { ...formData, email: formData.email.toLowerCase() };
      const finalData = isEditMode && !dataToSubmit.password.trim()
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = dataToSubmit;
            return rest;
          })()
        : dataToSubmit;

      if (isEditMode) {
        // ⬅️ EDITAR CLIENTE
        const editClientResult = await dispatch(editClientById({
          clientId: id || '', 
          client: finalData as ClientFormData
        }));
        
        if (editClientById.fulfilled.match(editClientResult)) {
          await swal.fire({
            title: '¡Éxito!',
            text: 'Cliente actualizado exitosamente',
            icon: 'success',
            confirmButtonColor: '#FB6514',
          }).then(() => {
            navigate('/gestion-de-clientes');
          });

          if (onSuccess) {
            await onSuccess(dataToSubmit);
          }
        } else if (editClientById.rejected.match(editClientResult)) {
          const errorMsg = editClientResult.error?.message || 'Error al actualizar el cliente';
          throw new Error(errorMsg);
        }
      } else {
        // CREAR CLIENTE
        const createClientResult = await dispatch(createClient(dataToSubmit));
        
        if (createClient.fulfilled.match(createClientResult)) {
          await swal.fire({
            title: '¡Éxito!',
            text: 'Cliente creado exitosamente',
            icon: 'success',
            confirmButtonColor: '#FB6514',
          }).then(() => {
            navigate('/gestion-de-clientes');
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
  }, [formData, validateForm, isEditMode, onSuccess, onError, resetForm, reduxError, dispatch, initialData, navigate, id]);

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
        navigate('/gestion-de-clientes'); 
      }
    });
  }, [navigate]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          {isEditMode ? 'Editar cliente' : 'Crear nuevo cliente'}
        </h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-error-600 text-sm dark:bg-error-900/20 dark:border-error-800 dark:text-error-400">
            {errors.general}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Primera fila: Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                key={formData.birthDate || 'empty-date'}  // ⬅️ CAMBIAR: usar formData en lugar de initialData
                id="birthDate"
                label="Fecha de Nacimiento *"
                placeholder="Selecciona la fecha de nacimiento"
                defaultDate={formData.birthDate ? new Date(formData.birthDate) : undefined}
                onChange={(_dates, currentDateString) => {
                  handleInputChange('birthDate', currentDateString);
                  handleBlur('birthDate');
                }}
                /* maxDate={maxBirthDate}
                minDate={minBirthDate} */
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

          {/* Sexta fila: Contraseña - SOLO EN MODO CREAR */}
          {!isEditMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
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
          )}

          {/* Botones de acción */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm font-medium bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
            >
              <CloseIcon className="size-5" />
              Cancelar
            </button>

            {/* Botón de ACTUALIZAR - SOLO en modo edición */}
            {isEditMode && (
              <button
                type="submit"
                disabled={isLoadingState}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm font-medium ${
                  isLoadingState 
                    ? 'cursor-not-allowed opacity-50 bg-brand-300 text-white' 
                    : 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300'
                }`}
              >
                {isLoadingState ? 'Actualizando...' : 'Actualizar Cliente'}
              </button>
            )}

            {/* Botón de CREAR - SOLO cuando NO está editando */}
            {!isEditMode && (
              <button
                type="submit"
                disabled={isLoadingState}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm font-medium ${
                  isLoadingState 
                    ? 'cursor-not-allowed opacity-50 bg-brand-300 text-white' 
                    : 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300'
                }`}
              >
                {isLoadingState ? 'Guardando...' : 'Crear Cliente'}
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormClient;
