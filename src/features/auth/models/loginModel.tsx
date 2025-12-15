// Tipos para mejor type safety
export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
  }

export interface LoginSliceState {
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
}
