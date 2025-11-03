import { Link } from "react-router";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  pageTitle?: string;
  items?: BreadcrumbItem[];
  showTitle?: boolean;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  pageTitle, 
  items,
  showTitle = true 
}) => {
  // Si se proporcionan items personalizados, usar esos; si no, usar pageTitle para compatibilidad
  const breadcrumbItems: BreadcrumbItem[] = items || [
    { label: "Home", path: "/dashboard" },
    { label: pageTitle || "Página actual", path: undefined }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {showTitle && pageTitle && (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {pageTitle}
        </h2>
      )}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <li key={index} className="flex items-center gap-1.5">
                {item.path && !isLast ? (
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    to={item.path}
                  >
                    {item.label}
                    <ChevronIcon />
                  </Link>
                ) : (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

const ChevronIcon: React.FC = () => (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PageBreadcrumb;
