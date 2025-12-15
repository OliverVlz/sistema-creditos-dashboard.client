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

export default function LoanRequestsTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loanRequests, loading } = useAppSelector(
    (state) => state.loanRequests
  );
  const { socket } = useNotifications();

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
    socket.on("loan:rejected", handleLoanNotification);
    socket.on("loan:updated", handleLoanNotification);
    socket.on("loan:modified_by_client", handleLoanNotification);

    return () => {
      socket.off("loan:created", handleLoanNotification);
      socket.off("loan:approved", handleLoanNotification);
      socket.off("loan:rejected", handleLoanNotification);
      socket.off("loan:updated", handleLoanNotification);
      socket.off("loan:modified_by_client", handleLoanNotification);
    };
  }, [socket, dispatch]);

  return (
    <DataTable
      data={loanRequests}
      columns={loanRequestColumns}
      actions={getLoanRequestActions(navigate)}
      itemsPerPage={10}
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
