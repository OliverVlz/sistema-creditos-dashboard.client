import { useState } from 'react'
import Swal from 'sweetalert2'
import { LoanRequestDetail } from '../models/loanRequestsModel'
import { useAppDispatch, useAppSelector } from '../../../store'
import { manageLoan, ManageLoanPayload } from '../slices/operations/updateLoanWithDocuments.operation'
import { DocumentChanges } from './AttachedDocumentsCard'
import { useAuth } from '../../../hooks/useAuth'

interface ApprovalPanelCardProps {
  loanRequest: LoanRequestDetail
  documentChanges?: DocumentChanges | null
  onSuccess?: () => void
}

export default function ApprovalPanelCard({ 
  loanRequest, 
  documentChanges,
  onSuccess 
}: ApprovalPanelCardProps) {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { updating } = useAppSelector((state) => state.loanRequests)
  
  const [comments, setComments] = useState('')
  const [notifyEmail, setNotifyEmail] = useState(true)

  // Determinar si hay cambios de documentos pendientes
  const hasDocumentChanges = documentChanges && documentChanges.documentsToReplace.length > 0

  const handleUpdateLoan = async (status: 'aprobado' | 'rechazado' | 'pendiente') => {
    // Validar que haya comentarios si se rechaza
    if (status === 'rechazado' && !comments.trim()) {
      await Swal.fire({
        title: 'Comentario requerido',
        text: 'Por favor, proporciona una razón para el rechazo de la solicitud.',
        icon: 'warning',
        confirmButtonColor: '#FF8546',
      })
      return
    }

    // Confirmar acción
    const actionText = status === 'aprobado' ? 'aprobar' : status === 'rechazado' ? 'rechazar' : 'actualizar'
    const confirmResult = await Swal.fire({
      title: `¿${status === 'aprobado' ? 'Aprobar' : status === 'rechazado' ? 'Rechazar' : 'Actualizar'} solicitud?`,
      html: `
        <p>Estás a punto de <strong>${actionText}</strong> la solicitud <strong>#${loanRequest.loanNumber}</strong>.</p>
        ${hasDocumentChanges ? '<p class="text-sm text-orange-600 mt-2">También se actualizarán los documentos modificados.</p>' : ''}
        ${notifyEmail ? '<p class="text-sm text-blue-600 mt-2">Se enviará notificación por email al cliente.</p>' : ''}
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'aprobado' ? '#10b981' : status === 'rechazado' ? '#ef4444' : '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar',
    })

    if (!confirmResult.isConfirmed) return

    try {
      // Preparar payload para ASESOR/ADMIN - endpoint /loans/{id}/manage
      const payload: ManageLoanPayload = {
        loanId: loanRequest.id,
        status: status,
        managerId: user?.id,
      }

      // Agregar razón de rechazo o comentarios
      if (status === 'rechazado' || comments.trim()) {
        payload.rejectionReason = comments.trim()
      }

      // Agregar cambios de documentos si existen
      if (hasDocumentChanges && documentChanges) {
        const replaceDocumentIds: string[] = []
        const files: File[] = []

        documentChanges.documentsToReplace.forEach((change) => {
          replaceDocumentIds.push(change.documentId)
          files.push(change.file)
        })

        payload.replaceDocumentIds = replaceDocumentIds
        payload.files = files
      }

      // Ejecutar actualización - usa endpoint /loans/{id}/manage
      await dispatch(manageLoan(payload)).unwrap()

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '¡Actualizado!',
        text: `La solicitud ha sido ${status === 'aprobado' ? 'aprobada' : status === 'rechazado' ? 'rechazada' : 'actualizada'} exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#FF8546',
      })

      // Limpiar comentarios
      setComments('')
      
      // Callback de éxito
      if (onSuccess) {
        onSuccess()
      }

    } catch (error) {
      console.error('Error al actualizar la solicitud:', error)
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la solicitud. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  const handleApprove = () => handleUpdateLoan('aprobado')
  const handleReject = () => handleUpdateLoan('rechazado')

  // Determinar si los botones de aprobar/rechazar deben estar habilitados
  const isActionDisabled = updating || loanRequest.status === 'desembolsado'
  const isAlreadyProcessed = loanRequest.status === 'aprobado' || loanRequest.status === 'rechazado'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
        Panel de Aprobación
      </h2>

      <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
        {/* Estado actual */}
        {isAlreadyProcessed && (
          <div className={`p-3 rounded-lg text-sm ${
            loanRequest.status === 'aprobado' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <i className={`pi ${loanRequest.status === 'aprobado' ? 'pi-check-circle' : 'pi-times-circle'} text-lg`}></i>
              <span className="font-medium">
                Esta solicitud ya fue {loanRequest.status === 'aprobado' ? 'aprobada' : 'rechazada'}
              </span>
            </div>
          </div>
        )}

        {/* Indicador de cambios en documentos */}
        {hasDocumentChanges && (
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-sm">
            <div className="flex items-center gap-2">
              <i className="pi pi-file-edit text-lg"></i>
              <span className="font-medium">
                {documentChanges!.documentsToReplace.length} documento(s) para actualizar
              </span>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleApprove}
            disabled={isActionDisabled}
            className="w-full px-3 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <i className="pi pi-spin pi-spinner text-xs"></i>
            ) : (
              <i className="pi pi-check text-xs"></i>
            )}
            {isAlreadyProcessed && loanRequest.status === 'aprobado' ? 'Ya Aprobada' : 'Aprobar'}
          </button>
          <button
            onClick={handleReject}
            disabled={isActionDisabled}
            className="w-full px-3 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <i className="pi pi-spin pi-spinner text-xs"></i>
            ) : (
              <i className="pi pi-times text-xs"></i>
            )}
            {isAlreadyProcessed && loanRequest.status === 'rechazado' ? 'Ya Rechazada' : 'Rechazar'}
          </button>
        </div>

        {/* Comentarios */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Comentarios
          </label>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
            (Justificación de la decisión)
          </p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={loanRequest.status === 'rechazado' 
              ? 'Escribe la razón del rechazo...' 
              : 'Escribe aquí la decisión...'}
            className="w-full flex-1 min-h-[100px] px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
        </div>

        {/* Notificar */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            id="notify-email"
            checked={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 shrink-0"
          />
          <label htmlFor="notify-email" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
            Notificar al cliente por email
          </label>
        </div>

        {/* Botón solo documentos (si hay cambios pero la solicitud ya fue procesada) */}
        {hasDocumentChanges && isAlreadyProcessed && (
          <button
            onClick={() => handleUpdateLoan(loanRequest.status as 'aprobado' | 'rechazado')}
            disabled={updating}
            className="w-full px-3 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <i className="pi pi-spin pi-spinner text-xs"></i>
            ) : (
              <i className="pi pi-upload text-xs"></i>
            )}
            Actualizar Solo Documentos
          </button>
        )}
      </div>
    </div>
  )
}
