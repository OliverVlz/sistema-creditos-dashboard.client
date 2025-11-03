import LoanSimulator from '../components/loan-simulator/LoanSimulator'

export default function SimulationPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-theme-primary">Simulación de Préstamo</h1>
        <p className="text-theme-muted mt-2">
          Calcula tu cuota mensual y conoce las condiciones de tu préstamo
        </p>
      </div>
      
      <LoanSimulator />
    </div>
  )
}

