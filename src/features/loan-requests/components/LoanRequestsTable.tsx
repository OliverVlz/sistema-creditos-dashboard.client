import { useEffect } from "react";
import DataTable from "@share/components/table/DataTable";
import {
  loanRequestColumns,
  getLoanRequestActions,
} from "../constants/loanRequestsTable";
import { useAppSelector, useAppDispatch } from "../../../store/index";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../context/NotificationsContext";
import { fetchLoanRequests } from "../slices/operations/fetchLoanRequests.operation";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { deleteLoanRequest } from "../slices/operations/deleteLoanRequest.operation";
import { removeLoanRequestById } from "../slices/loanRequests.slices";
import { sendPreapprovalReminder } from "../slices/operations/sendPreapprovalReminder.operation";

export default function LoanRequestsTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { loanRequests, loading, pagination, query } = useAppSelector(
    (state) => state.loanRequests
  );
  const { socket } = useNotifications();
  const isAdmin = user?.role === "ADMIN";
  const canManage = user?.role === "ADMIN" || user?.role === "ASESOR";

  const handlePageChange = (page: number) => {
    dispatch(fetchLoanRequests({
      page,
      limit: query.limit,
      loanNumber: query.loanNumber,
      status: query.status,
      clientId: query.clientId,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    dispatch(fetchLoanRequests({
      page: 1,
      limit,
      loanNumber: query.loanNumber,
      status: query.status,
      clientId: query.clientId,
    }));
  };

  const handleDeleteLoan = async (loanId: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar solicitud?",
      text: "Esta acción eliminará la solicitud seleccionada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await dispatch(deleteLoanRequest(loanId)).unwrap();
      dispatch(removeLoanRequestById(loanId));
      await Swal.fire({
        title: "Solicitud eliminada",
        icon: "success",
        confirmButtonColor: "#FF8546",
      });
    } catch {
      await Swal.fire({
        title: "No se pudo eliminar",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleSendReminder = async (loanId: string) => {
    const result = await Swal.fire({
      title: "¿Enviar recordatorio?",
      text: "Se enviará un correo de recordatorio al cliente preaprobado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#f59e0b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await dispatch(sendPreapprovalReminder(loanId)).unwrap();
      await Swal.fire({
        title: "Recordatorio enviado",
        icon: "success",
        confirmButtonColor: "#FF8546",
      });
    } catch {
      await Swal.fire({
        title: "No se pudo enviar el recordatorio",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Escuchar notificaciones de WebSocket para refrescar la tabla
  useEffect(() => {
    if (!socket) return;

    const handleLoanNotification = () => {
      console.log(
        "🔄 Notificación recibida, refrescando tabla de préstamos..."
      );
      dispatch(fetchLoanRequests({}));
    };

    // Escuchar todos los eventos de préstamos
    socket.on("loan:created", handleLoanNotification);
    socket.on("loan:approved", handleLoanNotification);
    socket.on("loan:preapproved", handleLoanNotification);
    socket.on("loan:rejected", handleLoanNotification);
    socket.on("loan:updated", handleLoanNotification);
    socket.on("loan:modified_by_client", handleLoanNotification);

    return () => {
      socket.off("loan:created", handleLoanNotification);
      socket.off("loan:approved", handleLoanNotification);
      socket.off("loan:preapproved", handleLoanNotification);
      socket.off("loan:rejected", handleLoanNotification);
      socket.off("loan:updated", handleLoanNotification);
      socket.off("loan:modified_by_client", handleLoanNotification);
    };
  }, [socket, dispatch]);

  return (
    <DataTable
      data={loanRequests}
      columns={loanRequestColumns}
      actions={getLoanRequestActions(
        navigate,
        (loan) => handleDeleteLoan(loan.id),
        (loan) => handleSendReminder(loan.id),
        canManage,
        isAdmin
      )}
      itemsPerPage={10}
      serverSidePagination
      currentPage={pagination?.currentPage ?? query.page}
      totalPages={pagination?.totalPages ?? 1}
      totalItems={pagination?.total ?? loanRequests.length}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      defaultSortField="loanNumber"
      defaultSortOrder="desc"
      emptyMessage="No se encontraron solicitudes de crédito"
      emptyIcon="pi pi-file"
      loading={loading}
      onSelectionChange={() => {}}
      selectable={false}
    />
  );
}
