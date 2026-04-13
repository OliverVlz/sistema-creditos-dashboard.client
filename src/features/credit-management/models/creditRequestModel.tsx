// Modelo para la solicitud de crédito
export interface CreditRequest {
  amount: number; // Monto en número (sin formato)
  months: number; // Plazo en meses
}

// Modelo para documentos subidos
export interface UploadedDocument {
  id: string;
  name: string;
  type: 'cedula' | 'nomina' | 'mesada' | 'constancia';
  uploadedAt: string;
}

