import { AdvertisementHistoryItem } from '../models/advertisingModel'

interface AdvertisingHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  history: AdvertisementHistoryItem[]
  loading: boolean
  onRecycle: (historyId: string) => void
}

export default function AdvertisingHistoryModal({
  isOpen,
  onClose,
  history,
  loading,
  onRecycle,
}: AdvertisingHistoryModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-xl bg-white p-5 shadow-xl dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Histórico de Publicidad
            </h3>
            <button onClick={onClose} type="button" className="text-gray-500">
              <i className="pi pi-times" />
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center">
              <i className="pi pi-spin pi-spinner text-2xl text-brand-500" />
            </div>
          ) : (
            <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-16 w-28 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Acción: {item.action} |{' '}
                        {new Date(item.createdAt).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRecycle(item.id)}
                    className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white"
                  >
                    Reciclar versión
                  </button>
                </div>
              ))}

              {!history.length && (
                <p className="py-8 text-center text-sm text-gray-500">
                  No hay histórico disponible.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
