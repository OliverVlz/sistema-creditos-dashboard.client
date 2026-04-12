import { useEffect, useState } from 'react'
import { Advertisement, AdvertisingPayload } from '../models/advertisingModel'

interface AdvertisingFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: AdvertisingPayload) => void
  initialData?: Advertisement | null
  saving?: boolean
}

const initialFormData: AdvertisingPayload = {
  title: '',
  targetUrl: '',
  isRedirectEnabled: false,
  isActive: true,
  sortOrder: 0,
  startsAt: '',
  endsAt: '',
}

export default function AdvertisingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  saving = false,
}: AdvertisingFormModalProps) {
  const [formData, setFormData] = useState<AdvertisingPayload>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        targetUrl: initialData.targetUrl || '',
        isRedirectEnabled: initialData.isRedirectEnabled,
        isActive: initialData.isActive,
        sortOrder: initialData.sortOrder,
        startsAt: initialData.startsAt
          ? new Date(initialData.startsAt).toISOString().slice(0, 16)
          : '',
        endsAt: initialData.endsAt
          ? new Date(initialData.endsAt).toISOString().slice(0, 16)
          : '',
      })
      setImagePreview(initialData.imageUrl)
    } else {
      setFormData(initialFormData)
      setImagePreview('')
    }
    setErrors({})
  }, [initialData, isOpen])

  const handleChange = <K extends keyof AdvertisingPayload>(
    field: K,
    value: AdvertisingPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageChange = (file?: File) => {
    handleChange('image', file)
    if (!file) {
      return
    }
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      nextErrors.title = 'El título es requerido'
    }
    if (!initialData && !formData.image) {
      nextErrors.image = 'La imagen es requerida'
    }
    if (formData.isRedirectEnabled && !formData.targetUrl.trim()) {
      nextErrors.targetUrl = 'La URL de redirección es requerida'
    }
    if (formData.startsAt && formData.endsAt && formData.startsAt > formData.endsAt) {
      nextErrors.endsAt = 'La fecha final debe ser mayor a la inicial'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      return
    }
    onSubmit(formData)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Editar Publicidad' : 'Nueva Publicidad'}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="pi pi-times" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event.target.files?.[0])}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="h-36 w-full rounded-lg border border-gray-200 object-cover"
              />
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Orden
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(event) =>
                    handleChange('sortOrder', Number(event.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) => handleChange('isActive', event.target.checked)}
                />
                <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                  Publicidad activa
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isRedirectEnabled"
                type="checkbox"
                checked={formData.isRedirectEnabled}
                onChange={(event) =>
                  handleChange('isRedirectEnabled', event.target.checked)
                }
              />
              <label
                htmlFor="isRedirectEnabled"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Habilitar redirección al hacer click
              </label>
            </div>

            {formData.isRedirectEnabled && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL de redirección
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(event) => handleChange('targetUrl', event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                {errors.targetUrl && (
                  <p className="mt-1 text-xs text-red-500">{errors.targetUrl}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inicio de vigencia
                </label>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(event) => handleChange('startsAt', event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fin de vigencia
                </label>
                <input
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(event) => handleChange('endsAt', event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                {errors.endsAt && <p className="mt-1 text-xs text-red-500">{errors.endsAt}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
                disabled={saving}
              >
                {saving ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
