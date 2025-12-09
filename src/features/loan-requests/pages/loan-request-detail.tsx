import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchLoanRequestDetail } from "../slices/operations/fetchLoanRequestDetail.operation";
import { updateClientDocuments } from "../slices/operations/updateLoanWithDocuments.operation";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ApplicationDataCard from "../components/ApplicationDataCard";
import AttachedDocumentsCard, {
  DocumentChanges,
} from "../components/AttachedDocumentsCard";
import ApprovalPanelCard from "../components/ApprovalPanelCard";
import StatusMessageBanner from "../components/StatusMessageBanner";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../context/NotificationsContext";

const LoanRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { selectedLoanRequest, loading, error, updating } = useAppSelector(
    (state) => state.loanRequests
  );
  const { socket } = useNotifications();

  // Estado para manejar cambios en documentos
  const [documentChanges, setDocumentChanges] =
    useState<DocumentChanges | null>(null);

  // Estado para modo edición de documentos
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchLoanRequestDetail(id));
    }
  }, [id, dispatch]);

  // Escuchar notificaciones de WebSocket para refrescar el detalle
  useEffect(() => {
    if (!socket || !id) return;

    const handleLoanNotification = (notification: { data?: { loanId?: string } }) => {
      // Solo refrescar si la notificación es para este préstamo
      if (notification.data?.loanId === id) {
        console.log(
          "🔄 Notificación recibida para este préstamo, refrescando..."
        );
        dispatch(fetchLoanRequestDetail(id));
      }
    };

    // Escuchar todos los eventos de préstamos
    socket.on("loan:approved", handleLoanNotification);
    socket.on("loan:rejected", handleLoanNotification);
    socket.on("loan:updated", handleLoanNotification);
    socket.on("loan:modified_by_client", handleLoanNotification);

    return () => {
      socket.off("loan:approved", handleLoanNotification);
      socket.off("loan:rejected", handleLoanNotification);
      socket.off("loan:updated", handleLoanNotification);
      socket.off("loan:modified_by_client", handleLoanNotification);
    };
  }, [socket, id, dispatch]);

  // Determinar si el usuario es asesor/admin (roles que pueden aprobar/rechazar)
  const isManagerOrAdmin = user?.role === "ASESOR" || user?.role === "ADMIN";

  // Determinar si el usuario es el dueño de la solicitud
  const isOwner = selectedLoanRequest?.client?.user?.email === user?.email;

  // Determinar si el usuario actual puede editar documentos
  const canEditDocuments = () => {
    if (!selectedLoanRequest || !user) return false;

    // Asesor/Admin puede editar solicitudes pendientes
    if (isManagerOrAdmin && selectedLoanRequest.status === "pendiente") {
      return true;
    }

    // Cliente puede editar si fue rechazada (para corregir documentos)
    if (isOwner && selectedLoanRequest.status === "rechazado") {
      return true;
    }

    return false;
  };

  // Manejar cambios en documentos
  const handleDocumentsChange = (changes: DocumentChanges) => {
    setDocumentChanges(changes);
  };

  // Callback cuando se actualiza exitosamente
  const handleUpdateSuccess = () => {
    setDocumentChanges(null);
    setIsEditingDocuments(false);
    // Recargar los datos
    if (id) {
      dispatch(fetchLoanRequestDetail(id));
    }
  };

  // Enviar corrección (para clientes) - usa endpoint /loans/{id}/documents
  const handleSendCorrection = async () => {
    if (
      !selectedLoanRequest ||
      !documentChanges ||
      documentChanges.documentsToReplace.length === 0
    )
      return;

    // Confirmar acción
    const confirmResult = await Swal.fire({
      title: "¿Enviar documentos corregidos?",
      html: `
        <p>Estás a punto de enviar <strong>${documentChanges.documentsToReplace.length}</strong> documento(s) actualizado(s).</p>
        <p class="text-sm text-gray-600 mt-2">Tu solicitud será revisada nuevamente por nuestro equipo.</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FF8546",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      // Preparar payload para CLIENTE - endpoint /loans/{id}/documents
      // Solo documentos, NO status, rejectionReason ni managerId
      const replaceDocumentIds: string[] = [];
      const files: File[] = [];

      documentChanges.documentsToReplace.forEach((change) => {
        replaceDocumentIds.push(change.documentId);
        files.push(change.file);
        files.push(change.file);
      });

      await dispatch(
        updateClientDocuments({
          loanId: selectedLoanRequest.id,
          replaceDocumentIds,
          files,
        })
      ).unwrap();
      // Mostrar mensaje de éxito
      await Swal.fire({
        title: "¡Documentos enviados!",
        text: "Tu solicitud ha sido enviada para revisión. Te notificaremos cuando haya una actualización.",
        icon: "success",
        confirmButtonColor: "#FF8546",
      });

      handleUpdateSuccess();
    } catch (error) {
      console.error("Error al enviar corrección:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudieron enviar los documentos. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const clientName = selectedLoanRequest?.client?.user
    ? `${selectedLoanRequest.client.user.firstName || ""} ${
        selectedLoanRequest.client.user.lastName || ""
      }`.trim()
    : "Cliente";

  // Contar documentos pendientes de cambio
  const pendingChangesCount = documentChanges?.documentsToReplace.length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando información de la solicitud...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },
            { label: "Gestión de Solicitudes", path: "/gestion-solicitudes" },
            { label: "Detalle de Solicitud" },
          ]}
        />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <i className="pi pi-exclamation-triangle text-red-600 text-xl"></i>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                Error al cargar la solicitud
              </h3>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/gestion-solicitudes")}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Volver a Solicitudes
          </button>
        </div>
      </div>
    );
  }

  if (!selectedLoanRequest) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },
            { label: "Gestión de Solicitudes", path: "/gestion-solicitudes" },
            { label: "Detalle de Solicitud" },
          ]}
        />
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <p className="text-yellow-800 dark:text-yellow-400">
            No se encontró la solicitud solicitada.
          </p>
          <button
            onClick={() => navigate("/gestion-solicitudes")}
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Volver a Solicitudes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header con Título y Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Detalle de Solicitud Crédito: #{selectedLoanRequest.loanNumber}
          </h1>
          <PageBreadcrumb
            showTitle={false}
            items={[
              { label: "Home", path: "/dashboard/home" },
              { label: "Gestión de Solicitudes", path: "/gestion-solicitudes" },
              {
                label: `Detalle: ${selectedLoanRequest.loanNumber} (Cliente: ${clientName})`,
              },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Botón para activar/desactivar modo edición */}
          {canEditDocuments() && (
            <button
              onClick={() => {
                setIsEditingDocuments(!isEditingDocuments);
                if (isEditingDocuments) {
                  setDocumentChanges(null);
                }
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors shrink-0 ${
                isEditingDocuments
                  ? "bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700"
                  : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
              }`}
            >
              <i
                className={`pi ${
                  isEditingDocuments ? "pi-times" : "pi-pencil"
                }`}
              ></i>
              {isEditingDocuments ? "Cancelar Edición" : "Editar Documentos"}
            </button>
          )}
          <button
            onClick={() => navigate("/gestion-solicitudes")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors shrink-0"
          >
            <i className="pi pi-arrow-left"></i>
            Volver
          </button>
        </div>
      </div>

      {/* Banner de Estado (Rechazo/Aprobación) */}
      <StatusMessageBanner loanRequest={selectedLoanRequest} />

      {/* Layout principal: 3 columnas en desktop (siempre mostrar panel de aprobación para gestores) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Panel Izquierdo: Datos de la Solicitud */}
        <div className={isManagerOrAdmin ? "xl:col-span-5" : "xl:col-span-6"}>
          <ApplicationDataCard loanRequest={selectedLoanRequest} />
        </div>

        {/* Panel Central: Documentos Adjuntos */}
        <div className={isManagerOrAdmin ? "xl:col-span-4" : "xl:col-span-6"}>
          <AttachedDocumentsCard
            loanRequest={selectedLoanRequest}
            isEditable={isEditingDocuments}
            onDocumentsChange={handleDocumentsChange}
          />
        </div>

        {/* Panel Derecho: Panel de Aprobación (solo para gestores/admins) */}
        {isManagerOrAdmin && (
          <div className="xl:col-span-3">
            <ApprovalPanelCard
              loanRequest={selectedLoanRequest}
              documentChanges={documentChanges}
              onSuccess={handleUpdateSuccess}
            />
          </div>
        )}
      </div>

      {/* Panel de envío de corrección para CLIENTES cuando la solicitud fue rechazada */}
      {!isManagerOrAdmin && selectedLoanRequest.status === "rechazado" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <i className="pi pi-file-edit text-orange-600 dark:text-orange-400 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Corregir y Reenviar Solicitud
              </h3>

              {!isEditingDocuments ? (
                // Modo normal - mostrar instrucciones
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Tu solicitud fue rechazada. Puedes corregir los documentos
                    indicados y enviarla nuevamente para revisión.
                  </p>
                  <button
                    onClick={() => setIsEditingDocuments(true)}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <i className="pi pi-pencil"></i>
                    Comenzar a Editar Documentos
                  </button>
                </div>
              ) : (
                // Modo edición - mostrar estado de cambios
                <div>
                  {pendingChangesCount === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Haz clic en el botón{" "}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        <i className="pi pi-refresh"></i> Reemplazar
                      </span>{" "}
                      en cada documento que deseas cambiar.
                    </p>
                  ) : (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <i className="pi pi-check-circle text-green-600"></i>
                        <span className="text-sm text-green-700 dark:text-green-300">
                          <strong>{pendingChangesCount}</strong> documento(s)
                          listo(s) para enviar
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSendCorrection}
                      disabled={updating || pendingChangesCount === 0}
                      className="px-6 py-3 bg-gradient-to-r from-[#FF8546] to-[#FF6B35] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                    >
                      {updating ? (
                        <i className="pi pi-spin pi-spinner"></i>
                      ) : (
                        <i className="pi pi-send"></i>
                      )}
                      Enviar Corrección
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDocuments(false);
                        setDocumentChanges(null);
                      }}
                      disabled={updating}
                      className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanRequestDetailPage;
