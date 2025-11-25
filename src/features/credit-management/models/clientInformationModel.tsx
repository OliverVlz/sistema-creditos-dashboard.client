
export interface ClientInformation {
  id: string;
  name: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: string;
  documentTypeOther: string;
  organization: string;
}

export interface ClientInformationResponse {
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
    clientInfo: {
      id: string;
      employmentStatus: string;
      address: string;
      birthDate: string;
      createdAt: string;
      updatedAt: string;
      organization: {
        id: string;
        name: string;
        baseInterestRate: string;
        discountRate: string;
        taxRate: string;
        updatedBy: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      };
      updater: string;
      loans: [];
    }
  }