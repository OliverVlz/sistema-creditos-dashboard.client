export default function ReviewSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Revisar y Enviar Solicitud
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Resumen de la Solicitud</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Monto:</span>
              <span className="ml-2 font-medium">$50,000,000</span>
            </div>
            <div>
              <span className="text-gray-600">Plazo:</span>
              <span className="ml-2 font-medium">36 meses</span>
            </div>
            <div>
              <span className="text-gray-600">Tipo:</span>
              <span className="ml-2 font-medium">Libranza</span>
            </div>
            <div>
              <span className="text-gray-600">Cuota estimada:</span>
              <span className="ml-2 font-medium">$1,850,000</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Información importante
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Al enviar esta solicitud, acepta nuestros términos y condiciones. 
                  Su solicitud será revisada en un plazo de 2-3 días hábiles.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            Acepto los{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              términos y condiciones
            </a>
          </label>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Guardar Borrador
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Enviar Solicitud
          </button>
        </div>
      </div>
    </div>
  );
}
