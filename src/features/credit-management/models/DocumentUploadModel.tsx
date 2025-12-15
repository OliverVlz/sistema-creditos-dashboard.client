// --- COMPONENTE PEQUEÑO REUTILIZABLE ---
export interface SingleDocumentUploadProps {
    label: string;
    file: File | null;
    setFile: (file: File | null) => void;
  }
