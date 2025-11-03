import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { Slider } from 'primereact/slider'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { useState } from 'react'

import { loanSimulationSchema, type LoanSimulationForm } from '../../../../../../schemas/loan.schemas'
import { useLoanSimulation, useInterestRate } from '../../../../../../hooks/useLoanQueries'
import type { LoanSimulation } from '../../../../../../types/loan.types'

export default function LoanSimulator() {
  const [simulationResult, setSimulationResult] = useState<LoanSimulation | null>(null)
  
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoanSimulationForm>({
    resolver: zodResolver(loanSimulationSchema),
    defaultValues: {
      amount: 5000000,
      termInMonths: 24,
    },
  })

  const simulationMutation = useLoanSimulation()
  const { data: interestRate, isLoading: isLoadingRate } = useInterestRate()

  const watchedAmount = watch('amount')
  const watchedTerm = watch('termInMonths')

  const onSubmit = async (data: LoanSimulationForm) => {
    try {
      const result = await simulationMutation.mutateAsync(data)
      setSimulationResult(result)
    } catch (error) {
      console.error('Error en simulación:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulario de Simulación */}
      <div className="space-y-6">
        <Card className="shadow-lg border border-gray-100">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              <i className="pi pi-calculator mr-2 text-blue-600"></i>
              Simulador de Préstamo
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto del Préstamo
                </label>
                <InputNumber
                  value={watchedAmount}
                  onValueChange={(e) => setValue('amount', e.value || 0)}
                  mode="currency"
                  currency="COP"
                  locale="es-CO"
                  min={500000}
                  max={50000000}
                  step={100000}
                  className="w-full"
                  placeholder="Ingrese el monto"
                />
                <Slider
                  value={watchedAmount}
                  onChange={(e) => setValue('amount', e.value as number)}
                  min={500000}
                  max={50000000}
                  step={100000}
                  className="w-full mt-3"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$500,000</span>
                  <span>$50,000,000</span>
                </div>
                {errors.amount && (
                  <Message 
                    severity="error" 
                    text={errors.amount.message}
                    className="mt-2 w-full"
                  />
                )}
              </div>

              {/* Plazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo en Meses
                </label>
                <InputNumber
                  value={watchedTerm}
                  onValueChange={(e) => setValue('termInMonths', e.value || 0)}
                  min={6}
                  max={60}
                  step={1}
                  className="w-full"
                  placeholder="Número de meses"
                />
                <Slider
                  value={watchedTerm}
                  onChange={(e) => setValue('termInMonths', e.value as number)}
                  min={6}
                  max={60}
                  step={1}
                  className="w-full mt-3"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>6 meses</span>
                  <span>60 meses</span>
                </div>
                {errors.termInMonths && (
                  <Message 
                    severity="error" 
                    text={errors.termInMonths.message}
                    className="mt-2 w-full"
                  />
                )}
              </div>

              {/* Tasa de Interés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de Interés Mensual
                </label>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {isLoadingRate ? (
                    <div className="flex items-center gap-2">
                      <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                      <span className="text-blue-700">Cargando tasa actual...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">
                        Tasa Vigente: {formatPercentage(interestRate?.rate || 2.5)}
                      </span>
                      <i className="pi pi-info-circle text-blue-600"></i>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Simular */}
              <Button
                type="submit"
                label="Simular Préstamo"
                icon="pi pi-calculator"
                className="w-full"
                size="large"
                loading={simulationMutation.isPending}
                disabled={!watchedAmount || !watchedTerm}
              />

              {simulationMutation.isError && (
                <Message 
                  severity="error" 
                  text="Error al calcular la simulación. Intente nuevamente."
                  className="w-full"
                />
              )}
            </form>
          </div>
        </Card>
      </div>

      {/* Resultados de la Simulación */}
      <div className="space-y-6">
        {simulationResult ? (
          <Card className="shadow-lg border border-gray-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="pi pi-chart-line mr-2 text-green-600"></i>
                Resultado de la Simulación
              </h3>

              <div className="space-y-4">
                {/* Cuota Mensual - Destacada */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="text-center">
                    <p className="text-green-100 text-sm uppercase tracking-wide">
                      Cuota Mensual
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {formatCurrency(simulationResult.monthlyPayment)}
                    </p>
                  </div>
                </div>

                <Divider />

                {/* Detalles */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Monto Solicitado:</span>
                    <span className="text-gray-900 font-semibold">
                      {formatCurrency(simulationResult.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Plazo:</span>
                    <span className="text-gray-900 font-semibold">
                      {simulationResult.termInMonths} meses
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Tasa de Interés:</span>
                    <span className="text-gray-900 font-semibold">
                      {formatPercentage(simulationResult.interestRate)} mensual
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-blue-700 font-medium">Total a Pagar:</span>
                    <span className="text-blue-900 font-bold">
                      {formatCurrency(simulationResult.totalPayment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-orange-700 font-medium">Total Intereses:</span>
                    <span className="text-orange-900 font-bold">
                      {formatCurrency(simulationResult.totalInterest)}
                    </span>
                  </div>
                </div>

                <Divider />

                {/* Botón de Solicitar */}
                <div className="space-y-3">
                  <Button
                    label="Solicitar Este Préstamo"
                    icon="pi pi-send"
                    className="w-full"
                    size="large"
                    severity="success"
                    onClick={() => console.log('Navegar a solicitud de préstamo')}
                  />
                  
                  <p className="text-xs text-gray-500 text-center">
                    * Esta es una simulación. Los valores pueden variar según la evaluación crediticia.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="shadow-lg border border-gray-100">
            <div className="p-6">
              <div className="text-center py-12">
                <i className="pi pi-calculator text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Realiza una simulación
                </h3>
                <p className="text-gray-400">
                  Ingresa el monto y plazo para ver tu cuota mensual estimada
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Información Adicional */}
        <Card className="shadow-lg border border-gray-100">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="pi pi-info-circle mr-2 text-blue-600"></i>
              Información Importante
            </h4>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-0.5"></i>
                <span>Préstamos disponibles para personal activo y pensionado de las Fuerzas Armadas</span>
              </div>
              
              <div className="flex items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-0.5"></i>
                <span>Descuento directo de nómina o pensión</span>
              </div>
              
              <div className="flex items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-0.5"></i>
                <span>Documentación mínima requerida</span>
              </div>
              
              <div className="flex items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-0.5"></i>
                <span>Proceso 100% digital</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
