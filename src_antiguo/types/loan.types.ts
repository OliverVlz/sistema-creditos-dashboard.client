export interface LoanSimulation {
  amount: number
  termInMonths: number
  interestRate: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
}

export interface LoanApplication {
  id: string
  clientId: string
  amount: number
  termInMonths: number
  monthlyPayment: number
  totalPayment: number
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'in_progress'
  applicationDate: string
  approvalDate?: string
  disbursementDate?: string
  rejectionReason?: string
  documents: {
    idCard?: string
    payslip?: string
    signedPromissoryNote?: string
  }
}

export interface InterestRate {
  id: string
  rate: number
  effectiveDate: string
  isActive: boolean
}

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: 'CC' | 'CE' | 'PA'
  documentNumber: string
  branch: 'ejercito' | 'armada' | 'fuerza_aerea' | 'policia' | 'pensionado'
  rank: string
  status: 'active' | 'inactive' | 'suspended'
  registrationDate: string
}

