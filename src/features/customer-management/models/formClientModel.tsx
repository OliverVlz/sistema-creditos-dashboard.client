export interface ClientFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    birthDate: string;
    documentNumber: string;
    phoneNumber: string;
    employmentStatus: string;
    employmentStatusOther: string;
    organizationId: string;
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
    employmentStatusOther?: string;
    organizationId?: string;
    general?: string;
  }
  
  export interface FormClientProps {
    initialData?: Partial<ClientFormData>;
    onSuccess?: (data: ClientFormData) => void | Promise<void>;
    onError?: (error: Error) => void;
    onCancel?: () => void;
    onSubmit?: () => void;
  }

  export interface FormCreateClientProps {
    initialData?: Partial<ClientFormData>;
  }

  export interface Organization {
    id: string;
    name: string;
  }