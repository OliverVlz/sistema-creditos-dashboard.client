import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LoanSimulation, LoanApplication, InterestRate } from '../types/loan.types'
import type { LoanSimulationForm } from '../schemas/loan.schemas'

// Simulaciones de API (reemplazar con llamadas reales al backend)
const loanAPI = {
  async calculateLoanSimulation(data: LoanSimulationForm): Promise<LoanSimulation> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simular tasa de interés (2.5% mensual)
    const monthlyRate = 0.025
    const { amount, termInMonths } = data
    
    // Calcular cuota mensual usando fórmula de amortización
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                          (Math.pow(1 + monthlyRate, termInMonths) - 1)
    
    const totalPayment = monthlyPayment * termInMonths
    const totalInterest = totalPayment - amount
    
    return {
      amount,
      termInMonths,
      interestRate: monthlyRate * 100, // Convertir a porcentaje
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    }
  },

  async getCurrentInterestRate(): Promise<InterestRate> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id: '1',
      rate: 2.5,
      effectiveDate: new Date().toISOString(),
      isActive: true,
    }
  },

  async submitLoanApplication(data: LoanApplication): Promise<LoanApplication> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
      applicationDate: new Date().toISOString(),
    }
  },

  async getLoanApplications(): Promise<LoanApplication[]> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock data
    return [
      {
        id: '1',
        clientId: '1',
        amount: 5000000,
        termInMonths: 24,
        monthlyPayment: 253125,
        totalPayment: 6075000,
        status: 'pending',
        applicationDate: '2024-01-15T10:30:00Z',
        documents: {},
      },
      {
        id: '2',
        clientId: '2',
        amount: 8000000,
        termInMonths: 36,
        monthlyPayment: 304000,
        totalPayment: 10944000,
        status: 'approved',
        applicationDate: '2024-01-10T14:20:00Z',
        approvalDate: '2024-01-12T09:15:00Z',
        documents: {
          idCard: 'cedula_maria_gonzalez.pdf',
          payslip: 'desprendible_maria_gonzalez.pdf',
        },
      },
    ]
  },
}

// React Query Hooks
export const useLoanSimulation = () => {
  return useMutation({
    mutationFn: loanAPI.calculateLoanSimulation,
    onError: (error) => {
      console.error('Error en simulación de préstamo:', error)
    },
  })
}

export const useInterestRate = () => {
  return useQuery({
    queryKey: ['interestRate', 'current'],
    queryFn: loanAPI.getCurrentInterestRate,
    staleTime: 30 * 60 * 1000, // 30 minutos
  })
}

export const useSubmitLoanApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: loanAPI.submitLoanApplication,
    onSuccess: () => {
      // Invalidar cache de solicitudes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['loanApplications'] })
    },
    onError: (error) => {
      console.error('Error al enviar solicitud:', error)
    },
  })
}

export const useLoanApplications = () => {
  return useQuery({
    queryKey: ['loanApplications'],
    queryFn: loanAPI.getLoanApplications,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}
