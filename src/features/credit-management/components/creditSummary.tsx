import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, RootState } from "@/store";
import { ViewDocumentPreviewComponent } from "./creditSummary/viewDocumentPreview";
import {
  previousStep,
  resetCreditManagement,
} from "../slices/creditManagement";
import { submitLoanRequest } from "../slices/operations/submitLoanRequest.operation";
import Swal from "sweetalert2";

// Loan Type Name (debe coincidir con el usado en LoanCalculator)
const LOAN_TYPE_NAME = "Libranza";

// Mapeo de tipos de documentos a códigos del backend
// Según el backend: CEDULA, NOMINA, CONSTANCIA_TIEMPO, MESADA
const DOCUMENT_TYPE_MAP: Record<string, string> = {
  cedula: "CEDULA",
  nomina: "NOMINA",
  mesada: "MESADA",
  constancia: "CONSTANCIA_TIEMPO",
};

// --- HELPER PARA DINERO ---
const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const CreditSummaryComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener datos de Redux
  const {
    clientInformation,
    creditRequest,
    uploadedDocuments,
    loanCalculation,
    loading,
  } = useAppSelector((state: RootState) => state.creditManagement);

  // Preparar datos del cliente (toda la información disponible)
  const clientData = clientInformation
    ? {
        name: `${clientInformation.firstName} ${clientInformation.lastName}`,
        firstName: clientInformation.firstName,
        lastName: clientInformation.lastName,
        document: clientInformation.documentNumber,
        email: clientInformation.email,
        phone: clientInformation.phoneNumber,
        organization: clientInformation.clientInfo?.organization?.name || "---",
        employmentStatus:
          clientInformation.clientInfo?.employmentStatus || "---",
        address: clientInformation.clientInfo?.address || "---",
        birthDate: clientInformation.clientInfo?.birthDate || "---",
      }
    : null;

  // Preparar datos del crédito
  const creditData = creditRequest
    ? {
        amount: creditRequest.amount,
        months: creditRequest.months,
      }
    : null;

  // Preparar lista de documentos
  const handleSendRequest = async () => {
    // Validar que tenemos todos los datos necesarios
    if (!clientInformation?.clientInfo?.id) {
      Swal.fire({
        title: "Error",
        text: "No se encontró la información del cliente",
        icon: "error",
        confirmButtonColor: "#FF8546",
      });
      return;
    }

    if (!clientInformation?.clientInfo?.organization?.id) {
      Swal.fire({
        title: "Error",
        text: "No se encontró la información de la organización",
        icon: "error",
        confirmButtonColor: "#FF8546",
      });
      return;
    }

    if (!loanCalculation) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el cálculo del préstamo",
        icon: "error",
        confirmButtonColor: "#FF8546",
      });
      return;
    }

    if (!creditRequest) {
      Swal.fire({
        title: "Error",
        text: "No se encontró la información del crédito",
        icon: "error",
        confirmButtonColor: "#FF8546",
      });
      return;
    }

    if (uploadedDocuments.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Debes subir al menos un documento",
        icon: "error",
        confirmButtonColor: "#FF8546",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar archivos y códigos en el mismo orden
      const files: File[] = [];
      const documentTypeCodes: string[] = [];

      uploadedDocuments.forEach((doc) => {
        files.push(doc.file);
        documentTypeCodes.push(
          DOCUMENT_TYPE_MAP[doc.type] || doc.type.toUpperCase()
        );
      });

      // Enviar solicitud al backend y obtener respuesta (loanId, loanNumber)
      // @ts-expect-error - Redux Toolkit types issue with React 19
      const response = (await dispatch(
        submitLoanRequest({
          clientId: clientInformation.clientInfo.id,
          loanTypeName: LOAN_TYPE_NAME,
          organizationName: clientInformation.clientInfo.organization.name,
          amountRequested: creditRequest.amount,
          termMonths: creditRequest.months,
          monthlyPayment: loanCalculation.monthlyPayment,
          totalInterest: loanCalculation.totalInterest,
          totalPayable: loanCalculation.totalPayable,
          documentTypeCodes,
          files,
        })
      ).unwrap()) as { loanId?: string; loanNumber?: string };

      const loanNumber = response?.loanNumber ?? "---";

      // Mostrar mensaje de éxito con el número de solicitud
      await Swal.fire({
        title: "¡Éxito!",
        html: `
          <p style="margin-bottom: 8px;">Tu solicitud de crédito ha sido enviada correctamente.</p>
          <p style="font-size: 14px; color: #475467;">
            <strong>Número de solicitud:</strong> ${loanNumber}
          </p>
        `,
        icon: "success",
        confirmButtonColor: "#FF8546",
        confirmButtonText: "Ir a mis solicitudes",
      });

      // Redirigir a la gestión de solicitudes y limpiar estado
      navigate("/gestion-solicitudes", { replace: true });
      dispatch(resetCreditManagement());
    } catch (error: unknown) {
      console.error("Error al enviar la solicitud:", error);

      // Intentar extraer el mensaje del error de la respuesta del backend
      let errorMessage =
        "Error al enviar la solicitud. Por favor, intenta nuevamente.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#FF8546",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente de Fila Simple
  const SimpleRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">
        {value}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight font-plus-jakarta mb-8 text-center">
        Información de crédito
      </h2>

      {/* --- SECCIÓN SUPERIOR: DATOS (2 COLUMNAS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* COLUMNA 1: DATOS DEL CLIENTE */}
        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
            Datos del Cliente
          </h3>
          {clientData ? (
            <div className="space-y-1">
              <SimpleRow label="Nombre completo" value={clientData.name} />
              <SimpleRow label="Cédula" value={clientData.document} />
              <SimpleRow label="Correo electrónico" value={clientData.email} />
              <SimpleRow label="Teléfono" value={clientData.phone} />
              <SimpleRow
                label="Entidad / Organización"
                value={clientData.organization}
              />
              <SimpleRow
                label="Estado Laboral"
                value={clientData.employmentStatus}
              />
              {/* <SimpleRow label="Dirección" value={clientData.address} /> */}
              <SimpleRow
                label="Fecha de nacimiento"
                value={
                  clientData.birthDate
                    ? new Date(clientData.birthDate).toLocaleDateString("es-CO")
                    : "---"
                }
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No hay información del cliente disponible
            </p>
          )}
        </div>

        {/* COLUMNA 2: DATOS DEL CRÉDITO */}
        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
            Detalles de Solicitud
          </h3>
          {creditData && loanCalculation ? (
            <div className="space-y-4">
              {/* Cuota mensual destacada */}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Cuota mensual estimada
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatMoney(loanCalculation.monthlyPayment)}
                  </div>
                </div>
              </div>

              {/* Detalles del crédito */}
              <div className="space-y-2">
                <SimpleRow
                  label="Valor del crédito"
                  value={formatMoney(loanCalculation.amountRequested)}
                />
                <SimpleRow label="Plazo" value={`${creditData.months} Meses`} />
                <SimpleRow
                  label="Tasa de interés anual"
                  value={`${loanCalculation.annualInterestRate}%`}
                />
                <SimpleRow
                  label="Tasa de interés mensual"
                  value={`${(loanCalculation.monthlyRate * 100).toFixed(4)}%`}
                />
                <div className="flex justify-between items-center py-2 border-b border-gray-100 bg-blue-50/30 px-2 -mx-2 rounded">
                  <span className="text-sm text-blue-800 font-medium">
                    Total de intereses
                  </span>
                  <span className="text-sm text-blue-800 font-bold">
                    {formatMoney(loanCalculation.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2">
                  <span className="text-base font-bold text-gray-800">
                    Total a pagar aproximado
                  </span>
                  <span className="text-lg font-bold text-[#FF8546]">
                    {formatMoney(loanCalculation.totalPayable)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No hay información de crédito disponible
            </p>
          )}
        </div>
      </div>

      {/* --- NUEVA SECCIÓN: PREVIEW DE DOCUMENTOS --- */}
      <ViewDocumentPreviewComponent documents={uploadedDocuments} />

      {/* BOTONES DE NAVEGACIÓN */}
      <div className="flex justify-between gap-4 pt-2 border-t border-gray-100 mt-6">
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
          onClick={handleSendRequest}
          disabled={isSubmitting || loading}
          className="
            flex-1 py-3 rounded-xl font-bold text-white text-lg shadow-lg transition-transform hover:-translate-y-0.5
            bg-gradient-to-r from-[#FF8546] to-[#FF6B35]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          "
        >
          {isSubmitting || loading ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </div>
    </div>
  );
};
