import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { RootState, useAppSelector } from '@/store';
import { SingleDocumentUploadProps } from '../models/DocumentUploadModel';
import { addDocument, nextStep, previousStep, removeDocument } from '../slices/creditManagement';
import { UploadedDocument } from '../models/creditRequestModel';

// --- ICONOS ---
const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M10 17v-8"></path>
    <path d="M14 13l-4 4-4-4"></path>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);



const SingleDocumentUpload: React.FC<SingleDocumentUploadProps> = ({ label, file, setFile }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'] // SOLO PDF
    },
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el selector de archivos al dar click en borrar
    setFile(null);
  };

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>
      
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full p-4 transition-all border-2 border-dashed rounded-xl cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}
          ${file ? 'border-green-200 bg-green-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          // ESTADO: Archivo cargado
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <PdfIcon />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate pr-2">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            
            <button 
              onClick={removeFile}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
              title="Eliminar archivo"
            >
              <TrashIcon />
            </button>
          </div>
        ) : (
          // ESTADO: Sin archivo (Dropzone pequeño)
          <div className="flex items-center gap-3 text-gray-500 py-1">
            <UploadIcon />
            <span className="text-sm">
              {isDragActive ? "Suelta el PDF aquí" : "Clic o arrastra tu PDF aquí"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const UploadDocumentsComponent: React.FC = () => {
  const dispatch = useDispatch();
  
  // Obtener información del cliente desde Redux
  const { clientInformation, uploadedDocuments } = useAppSelector(
    (state: RootState) => state.creditManagement
  );

  // Determinar si es pensionado basado en el estado laboral
  const isPensioner = useMemo(() => {
    const employmentStatus = clientInformation?.clientInfo?.employmentStatus;
    return employmentStatus === 'JUBILADO';
  }, [clientInformation]);

  // Estados locales para los archivos
  const [cedulaFile, setCedulaFile] = useState<File | null>(null);
  const [extraFile1, setExtraFile1] = useState<File | null>(null); // Nómina o Mesada
  const [extraFile2, setExtraFile2] = useState<File | null>(null); // Constancia tiempo (solo para no pensionados)

  // Sincronizar archivos locales con Redux al cargar
  React.useEffect(() => {
    const cedulaDoc = uploadedDocuments.find(doc => doc.type === 'cedula');
    const nominaDoc = uploadedDocuments.find(doc => doc.type === 'nomina');
    const mesadaDoc = uploadedDocuments.find(doc => doc.type === 'mesada');
    const constanciaDoc = uploadedDocuments.find(doc => doc.type === 'constancia');

    // Solo actualizar si no hay archivos locales ya cargados
    if (!cedulaFile && cedulaDoc?.file) setCedulaFile(cedulaDoc.file);
    if (!extraFile1) {
      if (nominaDoc?.file) setExtraFile1(nominaDoc.file);
      if (mesadaDoc?.file) setExtraFile1(mesadaDoc.file);
    }
    if (!extraFile2 && constanciaDoc?.file) setExtraFile2(constanciaDoc.file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Función para guardar documento en Redux
  const saveDocumentToRedux = (file: File, type: UploadedDocument['type']) => {
    const document: UploadedDocument = {
      id: `${type}-${Date.now()}`,
      name: file.name,
      file: file,
      type: type,
      uploadedAt: new Date(),
    };
    dispatch(addDocument(document));
  };

  // Función para eliminar documento de Redux
  const removeDocumentFromRedux = (type: UploadedDocument['type']) => {
    const docToRemove = uploadedDocuments.find(doc => doc.type === type);
    if (docToRemove) {
      dispatch(removeDocument(docToRemove.id));
    }
  };

  const handleCedulaChange = (file: File | null) => {
    setCedulaFile(file);
    if (file) {
      saveDocumentToRedux(file, 'cedula');
    } else {
      removeDocumentFromRedux('cedula');
    }
  };

  const handleExtraFile1Change = (file: File | null) => {
    setExtraFile1(file);
    if (file) {
      // Eliminar el tipo opuesto si existe
      if (isPensioner) {
        removeDocumentFromRedux('nomina');
        saveDocumentToRedux(file, 'mesada');
      } else {
        removeDocumentFromRedux('mesada');
        saveDocumentToRedux(file, 'nomina');
      }
    } else {
      removeDocumentFromRedux(isPensioner ? 'mesada' : 'nomina');
    }
  };

  const handleExtraFile2Change = (file: File | null) => {
    setExtraFile2(file);
    if (file) {
      saveDocumentToRedux(file, 'constancia');
    } else {
      removeDocumentFromRedux('constancia');
    }
  };

  // Validar si el botón debe estar habilitado
  const isFormValid = isPensioner 
    ? (cedulaFile && extraFile1) 
    : (cedulaFile && extraFile1 && extraFile2);

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight font-plus-jakarta mb-6 text-center">
        Adjuntar documentos
      </h2>

     

      <div className="space-y-4">
        {/* Documento Común: Cédula (siempre requerido) */}
        <div>
          <SingleDocumentUpload 
            label="Copia de Cédula (Ambos lados) PDF *" 
            file={cedulaFile} 
            setFile={handleCedulaChange} 
          />
        </div>

        {/* Lógica Condicional según tipo de usuario */}
        {isPensioner ? (
          /* CASO: PENSIONADO - Solo necesita 2 documentos */
          <div>
            <SingleDocumentUpload 
              label="Comprobante pago de mesada PDF *" 
              file={extraFile1} 
              setFile={handleExtraFile1Change} 
            />
          </div>
        ) : (
          /* CASO: NO PENSIONADO (EMPLEADO) - Necesita 3 documentos */
          <>
            <div>
              <SingleDocumentUpload 
                label="Comprobante de pago de nómina PDF *" 
                file={extraFile1} 
                setFile={handleExtraFile1Change} 
              />
            </div>
            <div>
              <SingleDocumentUpload 
                label="Constancia de tiempo laborado PDF *" 
                file={extraFile2} 
                setFile={handleExtraFile2Change} 
              />
            </div>
          </>
        )}
      </div>

      

      <div className="mt-8 flex justify-between gap-4">
        <button
          onClick={() => dispatch(previousStep())}
          className="
            px-6 py-3 rounded-xl font-semibold transition-all duration-300
            bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm
          "
        >
          Atrás
        </button>
        <button
          onClick={() => {
            if (isFormValid) {
              dispatch(nextStep());
            }
          }}
          disabled={!isFormValid}
          className="
            px-8 py-3 rounded-xl font-semibold transition-all duration-300
            bg-gradient-to-r from-[#FF8546] to-[#FF6B35] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0
          "
        >
          Continuar
        </button>
      </div>
    </div>
  );
};