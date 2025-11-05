import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../../../store/index';
import Form from '../../../components/form/Form';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import Button from '../../../components/ui/button/Button';
import { EyeIcon, EyeCloseIcon, CloseIcon} from '../../../icons';
import { FormUsersProps, UserFormData, FormErrors } from '../models/formUserModel';
import { createUser } from '../slices/operations/createUser.operations';
import { fetchUsers } from '../slices/operations/fetchUsers.operation';
import swal from 'sweetalert2';



const FormUsers: React.FC<FormUsersProps> = ({ 
  initialData, 
  onSuccess,
  onError,
}) => {
  const dispatch = useAppDispatch();
  const { loading: reduxLoading, error: reduxError } = useAppSelector((state: RootState) => state.users);
  const isEditMode = !!initialData;
  // Estados del formulario
  const [formData, setFormData] = useState<UserFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
/*     typedocument: initialData?.typedocument || '',*/    
   documentNumber: initialData?.documentNumber || '',
    phoneNumber: initialData?.phoneNumber || '',
    role: initialData?.role || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Usar el loading de Redux si está disponible, sino usar el estado local
  const isLoadingState = reduxLoading || isLoading;
  const [touched, setTouched] = useState<Record<keyof UserFormData, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
/*     typedocument: false,*/    
    documentNumber: false,
    phoneNumber: false,
    role: false,
  });

  // Opciones para los selects
  const roleOptions = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'ADVISOR', label: 'Asesor' },
  ];


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
      // En modo edición, la contraseña es opcional
      if (isEditMode && !value.trim()) return '';
      if (!value.trim()) return 'La contraseña es requerida';
      if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'La contraseña debe contener mayúsculas, minúsculas y números';
      }
      return '';
    },
    role: (value: string) => {
      if (!value.trim()) return 'El rol es requerido';
      return '';
    },
    /* typedocument: (value: string) => {
      if (!value.trim()) return 'El tipo de documento es requerido';
      return '';
    }, */
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
  }), [isEditMode]);

  // Validar campo individual
  const validateField = useCallback((field: keyof UserFormData, value: string) => {
    const error = validations[field](value);
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, [validations]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(key => {
      const field = key as keyof UserFormData;
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
  const handleInputChange = useCallback((field: keyof UserFormData, value: string) => {
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
  const handleBlur = useCallback((field: keyof UserFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
      // Marcar todos los campos como tocados para mostrar errores
      const allTouched: Record<keyof UserFormData, boolean> = {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
/*         typedocument: true,*/    
        documentNumber: true,
        phoneNumber: true,
      };
      setTouched(allTouched);
  }, []);

  // Submit optimizado - Maneja toda la lógica internamente
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      resetForm();
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const dataToSubmit: UserFormData = { ...formData };
      const finalData = isEditMode && !dataToSubmit.password.trim()
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = dataToSubmit;
            return rest;
          })()
        : dataToSubmit;

      if (isEditMode) {
        // TODO: Implementar actualización de usuario cuando esté disponible
        console.log('Actualizando usuario:', finalData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (onSuccess) {
          await onSuccess(dataToSubmit);
        }
      } else {
        // Crear usuario usando Redux
        // finalData ya incluye password si no está en modo edición
        // @ts-expect-error - Redux Toolkit types issue with React 19
        const createUserResult = await dispatch(createUser(dataToSubmit));
        
        if (createUser.fulfilled.match(createUserResult)) {
          console.log('Usuario creado exitosamente:', createUserResult.payload);
          
          // Refrescar la lista de usuarios después de crear uno nuevo
          // @ts-expect-error - Redux Toolkit types issue with React 19
          await dispatch(fetchUsers({}));
          
          // Mostrar mensaje de éxito
          await swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado exitosamente',
            icon: 'success',
            confirmButtonColor: '#FB6514',
          });
          
          if (onSuccess) {
            await onSuccess(dataToSubmit);
          }
        } else {
          const errorMsg = createUserResult.error ? String(createUserResult.error) : 'Error al crear el usuario';
          throw new Error(errorMsg);
        }
      }

    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : reduxError || 'Error al guardar el usuario. Por favor, intenta nuevamente.';
      
      // Mostrar error al usuario
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
  }, [formData, validateForm, isEditMode, onSuccess, onError, resetForm, dispatch, reduxError]);

  const handleCancel = () => {
    console.log('Cancelar');
    swal.fire({
      title: '¿Estás seguro de querer cancelar?',
      text: 'Todos los cambios realizados se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FB6514',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Cancelar');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
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

          {/* Tercera fila: Tipo de Documento y Número de Documento */}
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
          </div>

          {/* Cuarta fila: Rol y Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="role">Rol *</Label>
              <Select
                options={roleOptions}
                placeholder="Selecciona el rol"
                value={formData.role}
                onChange={(value) => handleInputChange('role', value)}
                className="dark:bg-gray-900"
              />
              {touched.role && errors.role && (
                <p className="mt-1.5 text-xs text-error-500">{errors.role}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                Contraseña {isEditMode ? '(Dejar vacío para no cambiar)' : '*'}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={isEditMode ? 'Dejar vacío para no cambiar' : 'Ingresa la contraseña'}
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
              className={`inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm ${
                isLoadingState 
                  ? 'cursor-not-allowed opacity-50 bg-brand-300 text-white' 
                  : 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300'
              }`}
            >
              <span className="flex items-center">
              </span>
              {isLoadingState ? 'Guardando...' : isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormUsers;