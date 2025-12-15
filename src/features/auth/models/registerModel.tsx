// Tipos para mejor type safety
export interface RegisterFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    birthDate: string;
    documentNumber: string;
    phoneNumber: string;
    employmentStatus: string;
    organizationId: string;
    confirmPassword?: string; // Solo para validación del frontend
  }
  
  export interface FormErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    birthDate?: string;
    documentNumber?: string;
    phoneNumber?: string;
    employmentStatus?: string;
    organizationId?: string;
    confirmPassword?: string;
    general?: string;
  }

export interface RegisterSliceState {
    isLoggedIn: boolean;
    isRegistered: boolean;
    loading: boolean;
    error: string | null;
}
