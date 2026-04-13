import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth/auth-context.provider";
import Swal from "sweetalert2";
import { mainCustomAxios } from "../config/axios.config";

const MAX_NOTIFICATIONS = 30;

interface LoanNotificationData {
  loanId: string;
  loanNumber: string;
  clientId: string;
  clientName: string;
  status: string;
  amountRequested: number;
  rejectionReason?: string;
  managerId?: string;
  managerName?: string;
  timestamp: Date;
}

export interface Notification {
  id?: string;
  type: string;
  title?: string;
  message: string;
  data: LoanNotificationData;
  isRead?: boolean;
  createdAt?: string;
}

interface NotificationsContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: () => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && token) {
      fetchNotifications();
    }
  }, [user, token]);

  const fetchNotifications = async () => {
    try {
      const response = await mainCustomAxios.get("/notifications", {
        params: {
          page: 1,
          limit: MAX_NOTIFICATIONS,
        },
      });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    console.log("🔍 NotificationsContext - Estado:", {
      user: user?.email || user?.name,
      hasToken: !!token,
    });

    if (!user || !token) {
      // Si no hay usuario autenticado, desconectar socket
      if (socket) {
        console.log("⚠️ No hay usuario/token, desconectando socket...");
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log("🚀 Iniciando conexión WebSocket...");

    // Crear conexión WebSocket
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const socketUrl = apiUrl.replace(/\/api$/, ""); // Remove /api if present

    console.log("🌐 URL del socket:", `${socketUrl}/notifications`);
    console.log("🔑 Token:", token?.substring(0, 20) + "...");

    const newSocket = io(`${socketUrl}/notifications`, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ WebSocket CONECTADO exitosamente");
      console.log("Socket ID:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ WebSocket DESCONECTADO");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Error de conexión WebSocket:", error);
      console.error("Error details:", error.message);
    });

    // Listen for loan notifications
    newSocket.on("loan:created", (notification: Notification) => {
      console.log("📬 Evento loan:created recibido:", notification);
      handleNotification(notification);
      showInfoNotification(notification.message);
    });

    newSocket.on("loan:approved", (notification: Notification) => {
      console.log("📬 Evento loan:approved recibido:", notification);
      handleNotification(notification);
      showSuccessNotification(notification.message);
    });

    newSocket.on("loan:preapproved", (notification: Notification) => {
      console.log("📬 Evento loan:preapproved recibido:", notification);
      handleNotification(notification);
      showInfoNotification(notification.message);
    });

    newSocket.on("loan:rejected", (notification: Notification) => {
      console.log("📬 Evento loan:rejected recibido:", notification);
      handleNotification(notification);
      showWarningNotification(
        notification.message,
        notification.data.rejectionReason
      );
    });

    newSocket.on("loan:updated", (notification: Notification) => {
      console.log("📬 Evento loan:updated recibido:", notification);
      handleNotification(notification);
    });

    newSocket.on("loan:modified_by_client", (notification: Notification) => {
      console.log("📬 Evento loan:modified_by_client recibido:", notification);
      handleNotification(notification);
      showInfoNotification(notification.message);
    });

    // Listen to ANY event for debugging
    newSocket.onAny((eventName, ...args) => {
      console.log("📡 Evento WebSocket recibido:", eventName, args);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const handleNotification = (notification: Notification) => {
    // Add temporary ID if missing for key prop
    const notificationWithId = {
      ...notification,
      id: notification.id || `temp-${Date.now()}`,
      createdAt: notification.createdAt || new Date().toISOString(),
    };

    setNotifications((prev) => [notificationWithId, ...prev].slice(0, MAX_NOTIFICATIONS));
    setUnreadCount((prev) => prev + 1);

    // Play notification sound (optional)
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {
        // Ignore if sound fails to play
      });
    } catch {
      // Ignore sound errors
    }
  };

  const showSuccessNotification = (message: string) => {
    Swal.fire({
      icon: "success",
      title: "¡Buenas noticias!",
      text: message,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonColor: "#10b981",
      toast: true,
      position: "top-end",
    });
  };

  const showInfoNotification = (message: string) => {
    Swal.fire({
      icon: "info",
      title: "Nueva actividad",
      text: message,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonColor: "#3b82f6",
      toast: true,
      position: "top-end",
    });
  };

  const showWarningNotification = (message: string, reason?: string) => {
    Swal.fire({
      icon: "warning",
      title: "Notificación",
      text: message,
      html: reason
        ? `${message}<br><br><strong>Razón:</strong> ${reason}`
        : message,
      timer: 7000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonColor: "#f59e0b",
      toast: true,
      position: "top-end",
    });
  };

  const markAsRead = async () => {
    try {
      await mainCustomAxios.patch("/notifications/read-all");
      setUnreadCount(0);
      // Update local state to mark all as read
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
