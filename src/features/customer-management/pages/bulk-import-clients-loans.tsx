import { useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { mainCustomAxios } from "@/config/axios.config";

type ImportRowResult = {
  rowNumber: number;
  status: "SUCCESS" | "ERROR";
  email: string;
  documentNumber: string;
  clientId?: string;
  loanId?: string;
  loanNumber?: string;
  errorCode?: string;
  errorMessage?: string;
};

type ImportResponse = {
  fileName: string;
  totalRows: number;
  processedRows: number;
  successRows: number;
  errorRows: number;
  results: ImportRowResult[];
};

export default function BulkImportClientsLoansPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const chunkSize = 20;

  const canSubmit = useMemo(() => {
    return !!file && !loading;
  }, [file, loading]);

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    setError(null);

    try {
      const response = await mainCustomAxios.get(
        "/clients/import/clients-loans/template",
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "plantilla-clientes-solicitudes.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo descargar la plantilla");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError("Debes seleccionar un archivo .xlsx");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chunkSize", String(chunkSize));

      const response = await mainCustomAxios.post<ImportResponse>(
        "/clients/import/clients-loans",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (requestError: unknown) {
      const requestErrorTyped = requestError as {
        response?: { data?: { message?: string | string[] } };
      };
      const backendMessage =
        requestErrorTyped?.response?.data?.message || "No se pudo procesar el archivo";
      setError(Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
        Carga Masiva de Clientes y Solicitudes
      </h1>

      <PageBreadcrumb
        showTitle={false}
        items={[
          { label: "Home", path: "/dashboard/home" },
          { label: "Gestión de Clientes", path: "/gestion-de-clientes" },
          { label: "Carga Masiva" },
        ]}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Archivo Excel (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] || null;
                setFile(selectedFile);
              }}
              className="block w-full text-sm text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-700"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={downloadingTemplate}
            className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-60"
          >
            {downloadingTemplate ? "Descargando..." : "Descargar plantilla"}
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Procesando..." : "Subir y procesar"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Resultado de importación
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <StatCard label="Filas" value={result.totalRows} />
            <StatCard label="Procesadas" value={result.processedRows} />
            <StatCard label="Exitosas" value={result.successRows} />
            <StatCard label="Con error" value={result.errorRows} />
            <StatCard label="Archivo" value={result.fileName} />
          </div>

          <div className="mt-4 overflow-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Fila
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Estado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Documento
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {result.results.map((row) => (
                  <tr key={`${row.rowNumber}-${row.documentNumber}-${row.status}`}>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {row.rowNumber}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          row.status === "SUCCESS"
                            ? "inline-flex rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 text-xs font-semibold"
                            : "inline-flex rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2 py-1 text-xs font-semibold"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.email}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {row.documentNumber}
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {row.status === "SUCCESS"
                        ? `Cliente ${row.clientId} / Solicitud ${row.loanNumber}`
                        : `${row.errorCode || ""} ${row.errorMessage || ""}`.trim()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
