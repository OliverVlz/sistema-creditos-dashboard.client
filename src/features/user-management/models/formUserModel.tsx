export interface UserFormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    typedocument: string;
    numberdocument: string;
    phone: string;
  }
  
  export interface FormErrors {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    role?: string;
    typedocument?: string;
    numberdocument?: string;
    phone?: string;
    general?: string;
  }
  
  export interface FormUsersProps {
    initialData?: Partial<UserFormData>;
    onSuccess?: (data: UserFormData) => void | Promise<void>;
    onError?: (error: Error) => void;
    onCancel?: () => void;
    onSubmit?: () => void;
  }

  export interface FormCreateUserProps {
    initialData?: Partial<UserFormData>;
  }