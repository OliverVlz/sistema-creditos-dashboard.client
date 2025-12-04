// Modelo para el tipo de préstamo
export interface LoanType {
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
  requiredDocumentTypes?: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

// Modelo para la tabla (datos simplificados)
export interface LoanTypeTableItem {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  isActive: boolean;
  createdAt: string;
}

// Respuesta de la API con paginación
export interface LoanTypesApiResponse {
  data: LoanType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Filtros de búsqueda
export interface LoanTypeFilters {
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Payload para crear/actualizar tipo de préstamo
export interface LoanTypePayload {
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  isActive: boolean;
  requiredDocumentTypeIds?: string[];
}

// Payload para actualizar (todos los campos opcionales)
export interface UpdateLoanTypePayload {
  id: string;
  name?: string;
  description?: string;
  interestRate?: number;
  minAmount?: number;
  maxAmount?: number;
  minTerm?: number;
  maxTerm?: number;
  isActive?: boolean;
  requiredDocumentTypeIds?: string[];
}

