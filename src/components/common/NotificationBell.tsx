import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../context/NotificationsContext";
import { Link } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        markAsRead();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, markAsRead]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      markAsRead();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInSeconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Hace unos segundos";
    if (diffInSeconds < 3600)
      return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400)
      return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return notificationDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "loan:created":
        return "📝";
      case "loan:approved":
        return "✅";
      case "loan:rejected":
        return "❌";
      case "loan:modified_by_client":
        return "🔄";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <span className="relative">
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 1.875C7.58594 1.875 5.625 3.83594 5.625 6.25V9.6875C5.625 10.0781 5.49219 10.4375 5.25781 10.7188L3.71094 12.5781C3.47656 12.8594 3.32031 13.2188 3.32031 13.6094C3.32031 14.4844 4.02344 15.1875 4.89844 15.1875H15.1016C15.9766 15.1875 16.6797 14.4844 16.6797 13.6094C16.6797 13.2188 16.5234 12.8594 16.2891 12.5781L14.7422 10.7188C14.5078 10.4375 14.375 10.0781 14.375 9.6875V6.25C14.375 3.83594 12.4141 1.875 10 1.875Z"
              fill="currentColor"
            />
            <path
              d="M11.25 16.5625H8.75C8.33594 16.5625 8 16.8984 8 17.3125C8 18.2266 8.75 18.9375 9.6875 18.9375H10.3125C11.25 18.9375 12 18.2266 12 17.3125C12 16.8984 11.6641 16.5625 11.25 16.5625Z"
              fill="currentColor"
            />
          </svg>

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
          )}

        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-[1000]">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notificaciones
            </h5>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-sm text-gray-500">No hay notificaciones</p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {notifications.slice(0, 10).map((notification, index) => (
                  <li key={index}>
                    <Link
                      to={`/gestion-solicitudes/detalle/${notification.data.loanId}`}
                      className="flex gap-3 border-b border-gray-100 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="text-lg shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white leading-snug">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.data.timestamp)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
