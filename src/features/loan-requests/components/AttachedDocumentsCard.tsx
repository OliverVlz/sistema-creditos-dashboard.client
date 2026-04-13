import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { LoanRequestDetail } from '../models/loanRequestsModel'

interface AttachedDocumentsCardProps {
  loanRequest: LoanRequestDetail
  isEditable?: boolean
  onDocumentsChange?: (changes: DocumentChanges) => void
}

// Estructura para manejar cambios en documentos
export interface DocumentChanges {
  documentsToReplace: { documentId: string; file: File; documentTypeCode: string }[]
  documentsToDelete: string[]
}

// Iconos SVG
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

const PdfFileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#FEF2F2" stroke="currentColor" />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" />
    <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const ReplaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6"></path>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M3 22v-6h6"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
  </svg>
)

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
)

// Componente de tarjeta compacta de documento
interface DocumentCardProps {
  doc: { 
    id: string
    url: string
    documentType: { 
      id: string
      code: string
      name: string 
    } 
  }
  isEditable?: boolean
  replacementFile?: File | null
  onReplace?: (file: File) => void
  onCancelReplace?: () => void
}

const DocumentCard = ({ doc, isEditable, replacementFile, onReplace, onCancelReplace }: DocumentCardProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && onReplace) {
      onReplace(acceptedFiles[0])
    }
  }, [onReplace])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf']
    },
    noClick: true,
    noKeyboard: true,
  })

  // Si hay un archivo de reemplazo, mostrar ese en lugar del original
  if (replacementFile) {
    return (
      <div className="flex items-center p-3 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700">
          <PdfFileIcon />
        </div>
        <div className="ml-3 grow min-w-0">
          <p className="text-sm font-medium text-orange-700 dark:text-orange-300 truncate">
            {doc.documentType.name}
          </p>
          <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium truncate">
            <span className="font-semibold">Nuevo:</span> {replacementFile.name}
          </p>
        </div>
        <button
          onClick={onCancelReplace}
          className="ml-2 p-2 text-orange-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
          title="Cancelar reemplazo"
        >
          <TrashIcon />
        </button>
      </div>
    )
  }

  // Vista normal o editable
  // Si NO es editable, toda la tarjeta es clickeable
  if (!isEditable) {
    return (
      <div
        onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && window.open(doc.url, '_blank', 'noopener,noreferrer')}
        className="group flex items-center p-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:bg-blue-50/50 dark:hover:bg-blue-900/20 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
        title="Clic para ver documento"
      >
        {/* Icono PDF con fondo suave */}
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors pointer-events-none">
          <PdfFileIcon />
        </div>

        {/* Información del archivo */}
        <div className="ml-3 grow min-w-0 pointer-events-none">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            {doc.documentType.name}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1.5">
            <span>PDF</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
            <span className="text-green-600 dark:text-green-400 font-semibold">Adjuntado</span>
          </p>
        </div>

        {/* Indicador visual */}
        <div className="ml-2 shrink-0 pointer-events-none">
          <div className="group-hover:hidden text-green-500 dark:text-green-400">
            <CheckCircleIcon />
          </div>
          <div className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400">
            <ExternalLinkIcon />
          </div>
        </div>
      </div>
    )
  }

  // Vista editable con dropzone
  return (
    <div
      {...getRootProps()}
      className={`group flex items-center p-3 rounded-lg border transition-all duration-200
        ${isDragActive 
          ? 'border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
        }
      `}
    >
      <input {...getInputProps()} />
      
      {/* Icono PDF con fondo suave */}
      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
        <PdfFileIcon />
      </div>

      {/* Información del archivo */}
      <div className="ml-3 grow min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {doc.documentType.name}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1.5">
          <span>PDF</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          <span className="text-green-600 dark:text-green-400 font-semibold">Adjuntado</span>
        </p>
      </div>

      {/* Acciones para modo editable */}
      <div className="ml-2 shrink-0 flex items-center gap-1">
        {/* Botón para reemplazar */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            open()
          }}
          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
          title="Reemplazar documento"
        >
          <ReplaceIcon />
        </button>
        {/* Botón para ver */}
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
          title="Ver documento"
        >
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  )
}

export default function AttachedDocumentsCard({ 
  loanRequest, 
  isEditable = false,
  onDocumentsChange 
}: AttachedDocumentsCardProps) {
  const documents = loanRequest.documents || []
  
  // Estado para archivos de reemplazo: { documentId: File }
  const [replacementFiles, setReplacementFiles] = useState<Record<string, File>>({})

  // Manejar reemplazo de documento
  const handleReplaceDocument = (documentId: string, file: File) => {
    const newReplacements = { ...replacementFiles, [documentId]: file }
    setReplacementFiles(newReplacements)
    
    // Notificar cambios al padre
    if (onDocumentsChange) {
      const changes: DocumentChanges = {
        documentsToReplace: Object.entries(newReplacements).map(([docId, f]) => {
          const originalDoc = documents.find(d => d.id === docId)
          return {
            documentId: docId,
            file: f,
            documentTypeCode: originalDoc?.documentType.code || ''
          }
        }),
        documentsToDelete: []
      }
      onDocumentsChange(changes)
    }
  }

  // Cancelar reemplazo
  const handleCancelReplace = (documentId: string) => {
    const newReplacements = { ...replacementFiles }
    delete newReplacements[documentId]
    setReplacementFiles(newReplacements)
    
    // Notificar cambios al padre
    if (onDocumentsChange) {
      const changes: DocumentChanges = {
        documentsToReplace: Object.entries(newReplacements).map(([docId, f]) => {
          const originalDoc = documents.find(d => d.id === docId)
          return {
            documentId: docId,
            file: f,
            documentTypeCode: originalDoc?.documentType.code || ''
          }
        }),
        documentsToDelete: []
      }
      onDocumentsChange(changes)
    }
  }

  // Contar cambios pendientes
  const pendingChangesCount = Object.keys(replacementFiles).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Documentos adjuntos
          </h2>
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {documents.length}
          </span>
        </div>
        
        {isEditable && pendingChangesCount > 0 && (
          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <UploadIcon />
            {pendingChangesCount} cambio{pendingChangesCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {isEditable && (
        <div className="mb-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
            <i className="pi pi-info-circle"></i>
            <span>Haz clic en <ReplaceIcon /> para reemplazar un documento</span>
          </p>
        </div>
      )}
      
      <div className="flex-1">
        {documents.length > 0 ? (
          <div className="space-y-2.5">
            {documents.map((doc) => (
              <DocumentCard 
                key={doc.id} 
                doc={doc}
                isEditable={isEditable}
                replacementFile={replacementFiles[doc.id] || null}
                onReplace={(file) => handleReplaceDocument(doc.id, file)}
                onCancelReplace={() => handleCancelReplace(doc.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50/50 dark:bg-gray-900/20 h-full flex items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              No hay documentos adjuntos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Exportar también la interfaz para uso externo
export type { AttachedDocumentsCardProps }
