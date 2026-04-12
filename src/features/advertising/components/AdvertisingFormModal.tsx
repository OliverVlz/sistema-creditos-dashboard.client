import { useEffect, useId, useState } from 'react'
import { Advertisement, AdvertisingPayload } from '../models/advertisingModel'

interface AdvertisingFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: AdvertisingPayload) => void
  initialData?: Advertisement | null
  saving?: boolean
}

const CheckMark = () => (
  <svg
    viewBox="0 0 12 10"
    className="h-2.5 w-2.5 shrink-0 opacity-0 transition-opacity"
    fill="none"
    aria-hidden
  >
    <path
      d="M1 5.2L4.5 8.7L11 1.2"
      className="stroke-white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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
  const imageInputId = useId()
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
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl max-h-[85vh] overflow-visible rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between overflow-hidden rounded-t-xl border-b border-gray-200 dark:border-gray-700 p-5">
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

          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(85vh-78px)] space-y-4 overflow-x-visible overflow-y-auto p-5"
          >
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
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagen
              </span>
              <label
                htmlFor={imageInputId}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 px-5 py-9 transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-brand-600/80 dark:bg-brand-500/10 dark:hover:border-brand-400 dark:hover:bg-brand-500/15"
              >
                <input
                  id={imageInputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => handleImageChange(event.target.files?.[0])}
                />
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/25 dark:text-brand-400">
                  <i className="pi pi-cloud-upload text-xl" />
                </span>
                <span className="text-center text-sm font-medium text-gray-800 dark:text-gray-100">
                  Arrastra una imagen aquí
                </span>
                <span className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                  o haz clic para elegir archivo · JPG, PNG o WEBP
                </span>
              </label>
              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt=""
                className="h-36 w-full rounded-lg border border-gray-200 object-cover dark:border-gray-600"
              />
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <label
                    htmlFor="advertising-sort-order"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Orden
                  </label>
                  <span className="group relative z-10 inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-gray-400 text-[10px] font-bold leading-none text-gray-500 dark:border-gray-500 dark:text-gray-400">
                    ?
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 z-[100] ml-2 w-56 -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-normal leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-gray-700"
                    >
                      Número de orden en el carrusel de la landing. El menor aparece primero; si hay empate, se usa la fecha de creación.
                    </span>
                  </span>
                </div>
                <input
                  id="advertising-sort-order"
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(event) =>
                    handleChange('sortOrder', Number(event.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 pt-6">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) => handleChange('isActive', event.target.checked)}
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 peer-checked:[&>svg]:opacity-100 dark:border-gray-600 dark:bg-gray-900">
                  <CheckMark />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Publicidad activa</span>
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                id="isRedirectEnabled"
                type="checkbox"
                checked={formData.isRedirectEnabled}
                onChange={(event) =>
                  handleChange('isRedirectEnabled', event.target.checked)
                }
                className="peer sr-only"
              />
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 peer-checked:[&>svg]:opacity-100 dark:border-gray-600 dark:bg-gray-900">
                <CheckMark />
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Habilitar redirección al hacer click
              </span>
            </label>

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

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Vigencia <span className="font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
              </p>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Si las dejas vacías, el anuncio puede mostrarse sin límite de fechas (según esté activo).
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Inicio
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(event) => handleChange('startsAt', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Fin
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(event) => handleChange('endsAt', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                  />
                  {errors.endsAt && <p className="mt-1 text-xs text-red-500">{errors.endsAt}</p>}
                </div>
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
