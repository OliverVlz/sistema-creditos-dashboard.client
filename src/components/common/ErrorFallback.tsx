import Button from '../ui/Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Ups! Algo salió mal
        </h2>
        
        <p className="text-gray-600 mb-4">
          Se ha producido un error inesperado. Por favor, intenta nuevamente.
        </p>
        
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Detalles del error
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto text-red-600">
            {error.message}
          </pre>
        </details>
        
        <Button 
          onClick={resetErrorBoundary}
          variant="primary"
          className="w-full"
        >
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
