import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (loanRequest.status === 'rechazado') {
      setComments(loanRequest.rejectionReason?.trim() || '')
    }
  }, [loanRequest.status, loanRequest.rejectionReason])

  // Determinar si hay cambios de documentos pendientes
  const hasDocumentChanges = documentChanges && documentChanges.documentsToReplace.length > 0

  const handleUpdateLoan = async (status: 'preaprobado' | 'aprobado' | 'rechazado' | 'pendiente') => {
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
    const actionText = status === 'preaprobado'
      ? 'preaprobar'
      : status === 'aprobado'
        ? 'aprobar'
        : status === 'rechazado'
          ? 'rechazar'
          : 'actualizar'
    const actionTitle = status === 'preaprobado'
      ? 'Preaprobar'
      : status === 'aprobado'
        ? 'Aprobar'
        : status === 'rechazado'
          ? 'Rechazar'
          : 'Actualizar'
    const confirmResult = await Swal.fire({
      title: `¿${actionTitle} solicitud?`,
      html: `
        <p>Estás a punto de <strong>${actionText}</strong> la solicitud <strong>#${loanRequest.loanNumber}</strong>.</p>
        ${hasDocumentChanges ? '<p class="text-sm text-orange-600 mt-2">También se actualizarán los documentos modificados.</p>' : ''}
        <p class="text-sm text-blue-600 mt-2">Se enviará notificación por email al cliente.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'preaprobado' ? '#2563eb' : status === 'aprobado' ? '#10b981' : status === 'rechazado' ? '#ef4444' : '#3b82f6',
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
        text: `La solicitud ha sido ${status === 'preaprobado' ? 'preaprobada' : status === 'aprobado' ? 'aprobada' : status === 'rechazado' ? 'rechazada' : 'actualizada'} exitosamente.`,
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

  const handlePreapprove = () => handleUpdateLoan('preaprobado')
  const handleApprove = () => handleUpdateLoan('aprobado')
  const handleReject = () => handleUpdateLoan('rechazado')

  // Determinar si los botones de aprobar/rechazar deben estar habilitados
  const isActionDisabled = updating || loanRequest.status === 'desembolsado'
  const isFinalized = loanRequest.status === 'aprobado' || loanRequest.status === 'rechazado'
  const canApproveFinal =
    loanRequest.status === 'preaprobado' || loanRequest.status === 'aprobado'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
        Panel de aprobación
      </h2>

      <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
        {/* Estado actual */}
        {isFinalized && (
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
        {loanRequest.status === 'preaprobado' && (
          <div className="p-3 rounded-lg text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <i className="pi pi-info-circle text-base"></i>
              <span className="font-medium">
                Solicitud preaprobada. Puedes usar Aprobar final cuando corresponda.
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
            onClick={handlePreapprove}
            disabled={isActionDisabled}
            className="w-full px-3 py-2 sm:py-2.5 bg-orange-100 hover:bg-orange-200 active:bg-orange-200 text-orange-800 border border-orange-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <i className="pi pi-spin pi-spinner text-xs"></i>
            ) : (
              <i className="pi pi-send text-xs"></i>
            )}
            {loanRequest.status === 'preaprobado' ? 'Ya preaprobada' : 'Preaprobar'}
          </button>
          <button
            onClick={handleApprove}
            disabled={isActionDisabled || !canApproveFinal}
            className="w-full px-3 py-2 sm:py-2.5 bg-green-100 hover:bg-green-200 active:bg-green-200 text-green-800 border border-green-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <i className="pi pi-spin pi-spinner text-xs"></i>
            ) : (
              <i className="pi pi-check text-xs"></i>
            )}
            {loanRequest.status === 'aprobado' ? 'Ya aprobada' : 'Aprobar final'}
          </button>
          <button
            onClick={handleReject}
            disabled={isActionDisabled}
            className="w-full px-3 py-2 sm:py-2.5 bg-red-100 hover:bg-red-200 active:bg-red-200 text-red-700 border border-red-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <i className="pi pi-spin pi-spinner text-xs"></i>
            ) : (
              <i className="pi pi-times text-xs"></i>
            )}
            {loanRequest.status === 'rechazado' ? 'Ya rechazada' : 'Rechazar'}
          </button>
        </div>

        {/* Comentarios */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Comentarios
          </label>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
            (justificación de la decisión)
          </p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={loanRequest.status === 'rechazado' 
              ? 'Escribe la razón del rechazo...' 
              : 'Escribe aquí la decisión...'}
            className={`w-full flex-1 min-h-[100px] px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:border-transparent resize-none text-sm ${
              loanRequest.status === 'rechazado'
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
          />
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            El correo al cliente se envía automáticamente al cambiar el estado.
          </p>
        </div>

        {/* Botón solo documentos (si hay cambios pero la solicitud ya fue procesada) */}
        {hasDocumentChanges && isFinalized && (
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
            Actualizar solo documentos
          </button>
        )}
      </div>
    </div>
  )
}
