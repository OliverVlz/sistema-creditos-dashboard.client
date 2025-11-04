import React, { useState, useCallback, useMemo } from 'react';
import Form from '../../../components/form/Form';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import Button from '../../../components/ui/button/Button';
import { EyeIcon, EyeCloseIcon, CloseIcon} from '../../../icons';
import { FormUsersProps, UserFormData, FormErrors } from '../models/formUserModel';



const FormUsers: React.FC<FormUsersProps> = ({ 
  initialData, 
  onSuccess,
  onError,
  onCancel
}) => {
  const isEditMode = !!initialData;

  // Estados del formulario
  const [formData, setFormData] = useState<UserFormData>({
    firstname: initialData?.firstname || '',
    lastname: initialData?.lastname || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || '',
    typedocument: initialData?.typedocument || '',
    numberdocument: initialData?.numberdocument || '',
    phone: initialData?.phone || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<keyof UserFormData, boolean>>({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    role: false,
    typedocument: false,
    numberdocument: false,
    phone: false,
  });

  // Opciones para los selects
  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
    { value: 'manager', label: 'Gerente' },
    { value: 'analyst', label: 'Analista' },
  ];

  const documentTypeOptions = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' },
  ];

  // Validaciones con useMemo para optimización
  const validations = useMemo(() => ({
    firstname: (value: string) => {
      if (!value.trim()) return 'El nombre es requerido';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value)) return 'El nombre solo puede contener letras y espacios';
      return '';
    },
    lastname: (value: string) => {
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
    typedocument: (value: string) => {
      if (!value.trim()) return 'El tipo de documento es requerido';
      return '';
    },
    numberdocument: (value: string) => {
      if (!value.trim()) return 'El número de documento es requerido';
      if (!/^[0-9]+$/.test(value)) return 'El número de documento solo puede contener números';
      if (value.length < 5) return 'El número de documento debe tener al menos 5 dígitos';
      return '';
    },
    phone: (value: string) => {
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

  // Submit optimizado - Maneja toda la lógica internamente
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submit');
    
    if (!validateForm()) {
      // Marcar todos los campos como tocados para mostrar errores
      const allTouched: Record<keyof UserFormData, boolean> = {
        firstname: true,
        lastname: true,
        email: true,
        password: true,
        role: true,
        typedocument: true,
        numberdocument: true,
        phone: true,
      };
      setTouched(allTouched);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Preparar datos para enviar
      const dataToSubmit: UserFormData = { ...formData };
      
      // Si es modo edición y la contraseña está vacía, crear objeto sin password
      const finalData = isEditMode && !dataToSubmit.password.trim()
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = dataToSubmit;
            return rest;
          })()
        : dataToSubmit;

      // TODO: Implementar llamada a la API aquí
      // Ejemplo:
      // const response = isEditMode 
      //   ? await updateUser(initialData?.id, finalData)
      //   : await createUser(finalData);
      
      console.log(isEditMode ? 'Actualizando usuario:' : 'Creando usuario:', finalData);

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Si hay callback de éxito, ejecutarlo
      if (onSuccess) {
        await onSuccess(dataToSubmit);
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      // Si hay callback de error, ejecutarlo
      if (onError) {
        onError(error as Error);
      } else {
        // Mostrar error general si no hay callback
        setErrors({
          general: 'Error al guardar el usuario. Por favor, intenta nuevamente.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, isEditMode, onSuccess, onError]);

  const handleCancel = () => {
    console.log('Cancelar');
    if (onCancel) {
      onCancel();
    }
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
              <Label htmlFor="firstname">Nombre *</Label>
              <Input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Ingresa el nombre"
                value={formData.firstname}
                onChange={(e) => handleInputChange('firstname', e.target.value)}
                onBlur={() => handleBlur('firstname')}
                error={!!errors.firstname && touched.firstname}
                hint={touched.firstname ? errors.firstname : ''}
              />
            </div>

            <div>
              <Label htmlFor="lastname">Apellido *</Label>
              <Input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Ingresa el apellido"
                value={formData.lastname}
                onChange={(e) => handleInputChange('lastname', e.target.value)}
                onBlur={() => handleBlur('lastname')}
                error={!!errors.lastname && touched.lastname}
                hint={touched.lastname ? errors.lastname : ''}
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
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="300 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={!!errors.phone && touched.phone}
                hint={touched.phone ? errors.phone : ''}
              />
            </div>
          </div>

          {/* Tercera fila: Tipo de Documento y Número de Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="typedocument">Tipo de Documento *</Label>
              <Select
                options={documentTypeOptions}
                placeholder="Selecciona el tipo de documento"
                value={formData.typedocument}
                onChange={(value) => handleInputChange('typedocument', value)}
                className="dark:bg-gray-900"
              />
              {touched.typedocument && errors.typedocument && (
                <p className="mt-1.5 text-xs text-error-500">{errors.typedocument}</p>
              )}
            </div>

            <div>
              <Label htmlFor="numberdocument">Número de Documento *</Label>
              <Input
                type="text"
                id="numberdocument"
                name="numberdocument"
                placeholder="1234567890"
                value={formData.numberdocument}
                onChange={(e) => handleInputChange('numberdocument', e.target.value)}
                onBlur={() => handleBlur('numberdocument')}
                error={!!errors.numberdocument && touched.numberdocument}
                hint={touched.numberdocument ? errors.numberdocument : ''}
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
              disabled={isLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm ${
                isLoading 
                  ? 'cursor-not-allowed opacity-50 bg-brand-300 text-white' 
                  : 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300'
              }`}
            >
              <span className="flex items-center">
              </span>
              {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormUsers;