import {
    ActionReducerMapBuilder,
    PayloadAction,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { mainCustomAxios } from "../../../../config/axios.config"
import { LoanRequestsState } from '../loanRequests.slices'
import { LoanRequestDetail } from '../../models/loanRequestsModel'

// ============================================
// PAYLOAD Y RESPONSE PARA ASESOR/ADMIN
// Endpoint: /loans/{id}/manage
// ============================================
export interface ManageLoanPayload {
    loanId: string
    status: 'pendiente' | 'aprobado' | 'rechazado' | 'desembolsado'
    rejectionReason?: string
    managerId?: string
    // Para documentos nuevos
    newDocumentTypeCodes?: string[]
    // IDs de documentos a reemplazar
    replaceDocumentIds?: string[]
    // Archivos
    files?: File[]
}

// ============================================
// PAYLOAD PARA CLIENTE
// Endpoint: /loans/{id}/documents
// ============================================
export interface UpdateClientDocumentsPayload {
    loanId: string
    // Para documentos nuevos
    newDocumentTypeCodes?: string[]
    // IDs de documentos a reemplazar
    replaceDocumentIds?: string[]
    // Archivos
    files?: File[]
}

// Mantener compatibilidad con código existente
export type UpdateLoanWithDocumentsPayload = ManageLoanPayload

export interface UpdateLoanWithDocumentsResponse {
    loan: LoanRequestDetail
    message: string
}

// ============================================
// THUNK PARA ASESOR/ADMIN - /loans/{id}/manage
// ============================================
export const manageLoan = createAsyncThunk(
    'loanRequests/manageLoan',
    async (payload: ManageLoanPayload): Promise<UpdateLoanWithDocumentsResponse> => {
        const formData = new FormData()
        
        // Agregar el status (requerido)
        formData.append('status', payload.status)
        
        // Agregar razón de rechazo si existe
        if (payload.rejectionReason) {
            formData.append('rejectionReason', payload.rejectionReason)
        }
        
        // Agregar ID del gestor si existe
        if (payload.managerId) {
            formData.append('managerId', payload.managerId)
        }
        
        // Agregar códigos de tipo de documento nuevos como JSON string
        if (payload.newDocumentTypeCodes && payload.newDocumentTypeCodes.length > 0) {
            formData.append('newDocumentTypeCodes', JSON.stringify(payload.newDocumentTypeCodes))
        }
        
        // Agregar IDs de documentos a reemplazar como JSON string
        if (payload.replaceDocumentIds && payload.replaceDocumentIds.length > 0) {
            formData.append('replaceDocumentIds', JSON.stringify(payload.replaceDocumentIds))
        }
        
        // Agregar archivos
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file) => {
                formData.append('files', file)
            })
        }
        
        const response = await mainCustomAxios.patch(
            `/loans/${payload.loanId}/manage`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        
        console.log('Loan managed (admin/asesor):', response.data)
        return response.data
    }
)

// ============================================
// THUNK PARA CLIENTE - /loans/{id}/documents
// ============================================
export const updateClientDocuments = createAsyncThunk(
    'loanRequests/updateClientDocuments',
    async (payload: UpdateClientDocumentsPayload): Promise<UpdateLoanWithDocumentsResponse> => {
        const formData = new FormData()
        
        // Agregar códigos de tipo de documento nuevos como JSON string
        if (payload.newDocumentTypeCodes && payload.newDocumentTypeCodes.length > 0) {
            formData.append('newDocumentTypeCodes', JSON.stringify(payload.newDocumentTypeCodes))
        }
        
        // Agregar IDs de documentos a reemplazar como JSON string
        if (payload.replaceDocumentIds && payload.replaceDocumentIds.length > 0) {
            formData.append('replaceDocumentIds', JSON.stringify(payload.replaceDocumentIds))
        }
        
        // Agregar archivos
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file) => {
                formData.append('files', file)
            })
        }
        
        const response = await mainCustomAxios.patch(
            `/loans/${payload.loanId}/documents`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        
        console.log('Documents updated (client):', response.data)
        return response.data
    }
)

// Alias para compatibilidad con código existente (usa manageLoan por defecto)
export const updateLoanWithDocuments = manageLoan

interface CreateAsyncUpdateLoanWithDocumentsReducerArgs {
    builder: ActionReducerMapBuilder<LoanRequestsState>
}

// Helper para manejar el fulfilled de ambos thunks
const handleFulfilled = (state: LoanRequestsState, action: PayloadAction<UpdateLoanWithDocumentsResponse>) => {
    state.updating = false
    state.updateError = null
    // Actualizar la solicitud seleccionada con los nuevos datos
    if (action.payload.loan) {
        state.selectedLoanRequest = action.payload.loan
    }
    // También actualizar en la lista si existe
    const index = state.loanRequests.findIndex(
        (lr) => lr.id === action.payload.loan?.id
    )
    if (index !== -1 && action.payload.loan) {
        state.loanRequests[index] = {
            ...state.loanRequests[index],
            status: action.payload.loan.status,
        }
    }
}

// Helper para manejar el rejected de ambos thunks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRejected = (state: LoanRequestsState, action: any) => {
    state.updating = false
    state.updateError = action.error.message || 'Error al actualizar la solicitud'
}

export const createAsyncUpdateLoanWithDocumentsReducer = ({
    builder,
}: CreateAsyncUpdateLoanWithDocumentsReducerArgs) => {
    // Reducers para manageLoan (ASESOR/ADMIN)
    builder
        .addCase(manageLoan.pending, (state: LoanRequestsState) => {
            state.updating = true
            state.updateError = null
        })
        .addCase(manageLoan.fulfilled, handleFulfilled)
        .addCase(manageLoan.rejected, handleRejected)
    
    // Reducers para updateClientDocuments (CLIENTE)
    builder
        .addCase(updateClientDocuments.pending, (state: LoanRequestsState) => {
            state.updating = true
            state.updateError = null
        })
        .addCase(updateClientDocuments.fulfilled, handleFulfilled)
        .addCase(updateClientDocuments.rejected, handleRejected)
}

