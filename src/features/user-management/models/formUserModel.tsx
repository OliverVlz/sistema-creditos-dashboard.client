export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /*     typedocument: string;
   */ documentNumber: string;
  phoneNumber: string;
  role: string;
  isActive?: boolean;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  /* typedocument?: string; */
  documentNumber?: string;
  phoneNumber?: string;
  role?: string;
  general?: string;
}

export interface FormUsersProps {
  initialData?: Partial<UserFormData> & { id?: string };
  onSuccess?: (data: UserFormData) => void | Promise<void>;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  onSubmit?: () => void;
}

export interface FormCreateUserProps {
  initialData?: Partial<UserFormData>;
}
