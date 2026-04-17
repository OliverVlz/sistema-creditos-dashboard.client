import { LoanRequestDetail } from '../models/loanRequestsModel'
import { appConfig } from '../../../config/app.config'

interface StatusMessageBannerProps {
  loanRequest: LoanRequestDetail
  hidePreapprovedBanner?: boolean
  hideRejectedBanner?: boolean
}

// Iconos SVG
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
    <path d="M3 7l9 6 9-6"></path>
  </svg>
)

const getStatusConfig = (status: string, rejectionReason: string | null) => {
  const rejectionDetail = rejectionReason?.trim() || 'No se registró un motivo de rechazo.'
  switch (status) {
    case 'rechazado':
      return {
        icon: <XCircleIcon />,
        title: 'Solicitud Rechazada',
        message: `Motivo de rechazo: ${rejectionDetail}`,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        titleColor: 'text-red-800 dark:text-red-300',
        messageColor: 'text-red-700 dark:text-red-400',
        showAction: true,
        actionText: 'Puedes actualizar tus documentos y enviar nuevamente tu solicitud.',
      }
    case 'aprobado':
      return {
        icon: <CheckIcon />,
        title: '¡Solicitud Aprobada!',
        message: rejectionReason || 'Tu solicitud de crédito ha sido aprobada. Pronto nos pondremos en contacto contigo.',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        iconColor: 'text-green-600 dark:text-green-400',
        titleColor: 'text-green-800 dark:text-green-300',
        messageColor: 'text-green-700 dark:text-green-400',
        showAction: false,
        actionText: '',
      }
    case 'preaprobado':
      return {
        icon: <MailIcon />,
        title: 'Solicitud preaprobada',
        message: 'Tu solicitud fue preaprobada. Revisa el correo y completa los pasos finales para aprobarla.',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        titleColor: 'text-blue-800 dark:text-blue-300',
        messageColor: 'text-blue-700 dark:text-blue-400',
        showAction: true,
        actionText: 'Debes enviar el formato firmado físicamente para completar el proceso.',
      }
    case 'pendiente':
      return {
        icon: <ClockIcon />,
        title: 'Solicitud en Revisión',
        message: 'Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando haya una actualización.',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        titleColor: 'text-yellow-800 dark:text-yellow-300',
        messageColor: 'text-yellow-700 dark:text-yellow-400',
        showAction: false,
        actionText: '',
      }
    case 'desembolsado':
      return {
        icon: <DollarIcon />,
        title: '¡Crédito Desembolsado!',
        message: 'El monto de tu crédito ha sido desembolsado exitosamente.',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        titleColor: 'text-blue-800 dark:text-blue-300',
        messageColor: 'text-blue-700 dark:text-blue-400',
        showAction: false,
        actionText: '',
      }
    default:
      return {
        icon: <AlertIcon />,
        title: 'Estado de Solicitud',
        message: 'Revisa el estado de tu solicitud.',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        borderColor: 'border-gray-200 dark:border-gray-700',
        iconColor: 'text-gray-600 dark:text-gray-400',
        titleColor: 'text-gray-800 dark:text-gray-300',
        messageColor: 'text-gray-700 dark:text-gray-400',
        showAction: false,
        actionText: '',
      }
  }
}

export default function StatusMessageBanner({
  loanRequest,
  hidePreapprovedBanner = false,
  hideRejectedBanner = false,
}: StatusMessageBannerProps) {
  const config = getStatusConfig(loanRequest.status, loanRequest.rejectionReason)
  const showPreapprovalFile =
    loanRequest.status === 'preaprobado' &&
    !hidePreapprovedBanner &&
    Boolean(appConfig.loanContractTemplateUrl)

  // Solo mostrar el banner si hay un mensaje de rechazo o si el status es aprobado/desembolsado
  const shouldShowBanner = 
    (loanRequest.status === 'rechazado' && !hideRejectedBanner) || 
    (loanRequest.status === 'preaprobado' && !hidePreapprovedBanner) || 
    loanRequest.status === 'aprobado' || 
    loanRequest.status === 'desembolsado'

  if (!shouldShowBanner) {
    return null
  }

  return (
    <div className={`rounded-xl border-2 ${config.bgColor} ${config.borderColor} p-4 mb-5`}>
      <div className="flex items-start gap-4">
        {/* Icono */}
        <div className={`shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {showPreapprovalFile ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className={`text-lg font-semibold ${config.titleColor} mb-1`}>
                  {config.title}
                </h3>
                <p className={`text-sm ${config.messageColor} leading-relaxed`}>
                  {config.message}
                </p>
                {config.showAction && config.actionText && (
                  <p className={`text-xs ${config.messageColor} mt-2 font-medium opacity-80`}>
                    <i className="pi pi-info-circle mr-1"></i>
                    {config.actionText}
                  </p>
                )}
              </div>
              <div className="md:w-[360px] shrink-0">
                <a
                  href={appConfig.loanContractTemplateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-full min-h-80px w-full block rounded-lg border border-blue-300 dark:border-blue-700 bg-white/70 dark:bg-blue-950/30 p-3 hover:bg-white dark:hover:bg-blue-900/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <i className="pi pi-file-pdf text-red-600 text-xl mt-0.5"></i>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        Formato para firma
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Descarga el PDF, fírmalo y envíalo en físico.
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-200 mt-2">
                        <i className="pi pi-download"></i>
                        Descargar PDF
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ) : (
            <>
              <h3 className={`text-lg font-semibold ${config.titleColor} mb-1`}>
                {config.title}
              </h3>
              <p className={`text-sm ${config.messageColor} leading-relaxed`}>
                {config.message}
              </p>
              {config.showAction && config.actionText && (
                <p className={`text-xs ${config.messageColor} mt-2 font-medium opacity-80`}>
                  <i className="pi pi-info-circle mr-1"></i>
                  {config.actionText}
                </p>
              )}
            </>
          )}
        </div>

        {/* Fecha de gestión si existe */}
        {loanRequest.managedAt && !showPreapprovalFile && (
          <div className="shrink-0 text-right">
            <p className={`text-xs ${config.messageColor} opacity-70`}>
              Gestionado el
            </p>
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {new Date(loanRequest.managedAt).toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

