import { useState, useEffect } from 'react'
import { LoanTypePayload, LoanTypeTableItem } from '../models/loanTypesModel'

interface LoanTypeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LoanTypePayload) => void
  initialData?: LoanTypeTableItem | null
  saving?: boolean
}

export default function LoanTypeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  saving = false
}: LoanTypeFormModalProps) {
  const [formData, setFormData] = useState<LoanTypePayload>({
    name: '',
    description: '',
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    minTerm: 1,
    maxTerm: 12,
    isActive: true,
    requiredDocumentTypeIds: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        interestRate: initialData.interestRate,
        minAmount: initialData.minAmount,
        maxAmount: initialData.maxAmount,
        minTerm: initialData.minTerm,
        maxTerm: initialData.maxTerm,
        isActive: initialData.isActive,
        requiredDocumentTypeIds: []
      })
    } else {
      setFormData({
        name: '',
        description: '',
        interestRate: 0,
        minAmount: 0,
        maxAmount: 0,
        minTerm: 1,
        maxTerm: 12,
        isActive: true,
        requiredDocumentTypeIds: []
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    if (formData.interestRate <= 0) {
      newErrors.interestRate = 'La tasa de interés debe ser mayor a 0'
    }
    if (formData.minAmount <= 0) {
      newErrors.minAmount = 'El monto mínimo debe ser mayor a 0'
    }
    if (formData.maxAmount <= formData.minAmount) {
      newErrors.maxAmount = 'El monto máximo debe ser mayor al mínimo'
    }
    if (formData.minTerm < 1) {
      newErrors.minTerm = 'El plazo mínimo debe ser al menos 1 mes'
    }
    if (formData.maxTerm <= formData.minTerm) {
      newErrors.maxTerm = 'El plazo máximo debe ser mayor al mínimo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof LoanTypePayload, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando cambia
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatMoneyInput = (value: string): number => {
    const numericValue = value.replace(/[^0-9]/g, '')
    return parseInt(numericValue) || 0
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-start sm:items-center justify-center p-3 sm:p-4 py-8 sm:py-8">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl my-15">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Editar tipo de préstamo' : 'Nuevo tipo de préstamo'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <i className="pi pi-times text-lg"></i>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Nombre */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ej: Libranza"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Descripción del tipo de préstamo..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Tasa de interés */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tasa de Interés Anual (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.interestRate || ''}
                  onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-12 sm:pr-14 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.interestRate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="25"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  % E.A.
                </span>
              </div>
              {errors.interestRate && <p className="mt-1 text-xs text-red-500">{errors.interestRate}</p>}
            </div>

            {/* Montos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Monto Mínimo *
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    value={formData.minAmount ? formData.minAmount.toLocaleString('es-CO') : ''}
                    onChange={(e) => handleChange('minAmount', formatMoneyInput(e.target.value))}
                    className={`w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.minAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="500.000"
                  />
                </div>
                {errors.minAmount && <p className="mt-1 text-xs text-red-500">{errors.minAmount}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Monto Máximo *
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    value={formData.maxAmount ? formData.maxAmount.toLocaleString('es-CO') : ''}
                    onChange={(e) => handleChange('maxAmount', formatMoneyInput(e.target.value))}
                    className={`w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.maxAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="20.000.000"
                  />
                </div>
                {errors.maxAmount && <p className="mt-1 text-xs text-red-500">{errors.maxAmount}</p>}
              </div>
            </div>

            {/* Plazos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Plazo Mínimo (meses) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.minTerm || ''}
                  onChange={(e) => handleChange('minTerm', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.minTerm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="6"
                />
                {errors.minTerm && <p className="mt-1 text-xs text-red-500">{errors.minTerm}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Plazo Máximo (meses) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxTerm || ''}
                  onChange={(e) => handleChange('maxTerm', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.maxTerm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="60"
                />
                {errors.maxTerm && <p className="mt-1 text-xs text-red-500">{errors.maxTerm}</p>}
              </div>
            </div>

            {/* Estado activo */}
            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de préstamo activo
              </span>
            </div>
          </form>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <i className="pi pi-spin pi-spinner"></i>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="pi pi-check"></i>
                  {initialData ? 'Actualizar' : 'Crear'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

