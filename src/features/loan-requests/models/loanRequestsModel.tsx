// Modelo para la solicitud de crédito en la lista
export interface LoanRequest {
  id: string;
  loanNumber: string;
  amountRequested: string;
  termMonths: number;
  appliedInterestRate?: string;
  annualRate?: number;
  monthlyRate?: number;
  monthlyPayment: string;
  totalInterest: string;
  totalPayable: string;
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'en_revision' | 'desembolsado';
  rejectionReason: string | null;
  manager: string | null;
  managedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  client: {
    id: string;
    name?: string;
    employmentStatus: string;
    address: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      firstName?: string;
      lastName?: string;
    };
  };
  loanType: {
    id: string;
    name: string;
    description: string;
    interestRate: string;
    minAmount: string;
    maxAmount: string;
    minTerm: number;
    maxTerm: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  organization: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Respuesta de la API con paginación
export interface LoanRequestsApiResponse {
  data: LoanRequest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Modelo para la tabla (datos simplificados)
export interface LoanRequestTableItem {
  id: string;
  loanNumber: string;
  clientName: string;
  organizationName: string;
  status: string;
  amountRequested: number;
  termMonths: number;
  appliedInterestRate: number;
  createdAt: string;
}

// Filtros de búsqueda
export interface LoanRequestFilters {
  loanNumber?: string;
  status?: string;
  page?: number;
  limit?: number;
  clientId?: string; // Para filtrar por cliente específico (usado por rol CLIENTE)
}

// Modelo para el detalle completo de la solicitud
export interface LoanRequestDetail {
  id: string;
  loanNumber: string;
  amountRequested: string;
  termMonths: number;
  appliedInterestRate: string;
  monthlyPayment: string;
  totalInterest: string;
  totalPayable: string;
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'en_revision' | 'desembolsado';
  rejectionReason: string | null;
  manager: string | null;
  managedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  client: {
    id: string;
    employmentStatus: string;
    address: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      phoneNumber?: string;
      identification?: string;
      documentNumber?: string;
    };
  };
  loanType: {
    id: string;
    name: string;
    description: string;
    interestRate: string;
    minAmount: string;
    maxAmount: string;
    minTerm: number;
    maxTerm: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  organization: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  documents: Array<{
    id: string;
    url: string;
    uploadedAt: string;
    documentType: {
      id: string;
      code: string;
      name: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

