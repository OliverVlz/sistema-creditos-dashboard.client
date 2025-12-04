// Modelo para la respuesta del cálculo del préstamo
export interface LoanCalculationResponse {
  amountRequested: number;
  termMonths: number;
  annualInterestRate: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
  loanType: {
    id: string;
    name: string;
  };
}

// Modelo para la petición del cálculo del préstamo
export interface LoanCalculationRequest {
  loanTypeName: string;
  amountRequested: number;
  termMonths: number;
}

