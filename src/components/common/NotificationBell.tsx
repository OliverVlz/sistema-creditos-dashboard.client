import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationsContext';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace unos segundos';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return notificationDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'loan:created':
        return '📝';
      case 'loan:approved':
        return '✅';
      case 'loan:rejected':
        return '❌';
      case 'loan:modified_by_client':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'loan:approved':
        return 'bg-green-50 border-green-200';
      case 'loan:rejected':
        return 'bg-red-50 border-red-200';
      case 'loan:modified_by_client':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-gray-100 text-gray-600 hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
            <span className="absolute -top-1 -right-1 z-1 h-4 w-4 rounded-full bg-meta-1 flex items-center justify-center">
              <span className="text-[10px] font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}

          {!isConnected && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-meta-7 border border-white dark:border-boxdark"></span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute -right-16 sm:right-0 mt-2.5 flex h-90 w-75 sm:w-80 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark z-50">
          <div className="flex items-center justify-between px-4.5 py-3 border-b border-stroke dark:border-strokedark">
            <h5 className="text-sm font-medium text-bodydark2">
              Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </h5>
            {isConnected ? (
              <span className="flex items-center text-xs text-meta-3">
                <span className="h-2 w-2 rounded-full bg-meta-3 mr-1.5"></span>
                Conectado
              </span>
            ) : (
              <span className="flex items-center text-xs text-meta-7">
                <span className="h-2 w-2 rounded-full bg-meta-7 mr-1.5"></span>
                Desconectado
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <svg
                  className="mb-3 h-12 w-12 text-bodydark2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-sm text-bodydark2">No hay notificaciones</p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {notifications.slice(0, 10).map((notification, index) => (
                  <li key={index}>
                    <Link
                      to={`/loans/${notification.data.loanId}`}
                      className={`flex gap-3 border-b border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 ${getNotificationColor(notification.type)}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-black dark:text-white">
                          {notification.message}
                        </p>
                        <p className="text-xs text-bodydark2 mt-1">
                          Préstamo: {notification.data.loanNumber}
                        </p>
                        {notification.data.rejectionReason && (
                          <p className="text-xs text-meta-1 mt-1 italic">
                            {notification.data.rejectionReason}
                          </p>
                        )}
                        <p className="text-xs text-bodydark2 mt-1.5">
                          {formatTimestamp(notification.data.timestamp)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-stroke dark:border-strokedark">
              <Link
                to="/notifications"
                className="flex items-center justify-center py-3 text-sm font-medium text-primary hover:bg-gray-2 dark:hover:bg-meta-4"
                onClick={() => setIsOpen(false)}
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
