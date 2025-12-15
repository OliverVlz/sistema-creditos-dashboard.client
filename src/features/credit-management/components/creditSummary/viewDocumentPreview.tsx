import React, { useEffect, useState } from 'react';
import { UploadedDocument } from '../../models/creditRequestModel';

// --- ICONOS ---
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const PdfFileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#FEF2F2" stroke="currentColor" />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" />
    <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

// --- COMPONENTE TARJETA COMPACTA ---
const DocumentCardCompact = ({ doc }: { doc: UploadedDocument }) => {
  const [fileUrl, setFileUrl] = useState<string>('#');

  useEffect(() => {
    let url = '#';
    if (doc.file instanceof File) {
      url = URL.createObjectURL(doc.file);
      setFileUrl(url);
    }

    return () => {
      if (doc.file instanceof File) URL.revokeObjectURL(url);
    };
  }, [doc]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileUrl && fileUrl !== '#') {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e as unknown as React.MouseEvent<HTMLDivElement>)}
      className="group flex items-center p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg hover:bg-blue-50/50 active:scale-[0.98] transition-all duration-200 cursor-pointer text-left select-none"
      title="Clic para ver documento"
    >
      {/* Icono PDF con fondo suave */}
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 border border-red-100 group-hover:bg-white group-hover:border-red-200 transition-colors pointer-events-none">
        <PdfFileIcon />
      </div>

      {/* Información del archivo */}
      <div className="ml-3 flex-grow min-w-0 pointer-events-none">
        <p className="text-xs font-bold text-gray-700 truncate group-hover:text-blue-700 transition-colors">
          {doc.name}
        </p>
        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
          <span>PDF</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="text-green-600">Adjuntado</span>
        </p>
      </div>

      {/* Indicadores (Check o Flecha al hover) */}
      <div className="ml-2 flex-shrink-0 pointer-events-none">
        {/* Por defecto muestra el Check verde */}
        <div className="group-hover:hidden text-green-500">
           <CheckCircleIcon />
        </div>
        {/* Al pasar el mouse muestra icono de "Abrir" */}
        <div className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 animate-in fade-in zoom-in duration-200">
           <ExternalLinkIcon />
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const ViewDocumentPreviewComponent: React.FC<{ documents: UploadedDocument[] }> = ({ documents }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <h3 className="text-lg font-bold text-gray-800">
          Documentos Adjuntos
        </h3>
        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200">
          {documents.length}
        </span>
      </div>
      
      {documents.length > 0 ? (
        // Grid adaptativo: 1 columna en móvil, 2 en tablet, 3 en escritorio
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {documents.map((doc, index) => (
            <DocumentCardCompact key={doc.id || index} doc={doc} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50">
          <p className="text-sm text-gray-400 font-medium">
            No has adjuntado documentos todavía.
          </p>
        </div>
      )}
    </div>
  );
};
