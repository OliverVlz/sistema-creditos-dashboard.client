export interface Organization {
  id: string;
  name: string;
  baseInterestRate: string;
  discountRate: string;
  taxRate: string;
  updatedBy: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInfo {
  id: string;
  employmentStatus: string;
  address: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
  updater: string | null;
  loans: unknown[];
}

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  clientInfo: ClientInfo;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  employmentStatus?: string;
}

export interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

