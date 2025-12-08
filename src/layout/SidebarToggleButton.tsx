import { useSidebar } from "../context/SidebarContext";

const SidebarToggleButton: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // En móvil, ocultar cuando el sidebar está abierto (el botón de cerrar está dentro del sidebar)
  if (isMobileOpen) {
    return null;
  }

  return (
    <button
      className="absolute top-4 right-4 lg:right-auto lg:left-4 z-50 flex items-center justify-center w-10 h-10 text-gray-500 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 lg:w-11 lg:h-11 transition-all duration-200"
      onClick={handleToggle}
      aria-label="Toggle Sidebar"
    >
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export default SidebarToggleButton;

