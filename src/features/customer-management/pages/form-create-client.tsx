import FormClient from '../components/formClient';

export default function FormCreateClient() {
  const handleSuccess = () => {
    console.log('Cliente creado exitosamente');
  }

  const handleError = (error: Error) => {
    console.error('Error al crear cliente:', error);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Crear Cliente</h1>
    <FormClient 
      onSuccess={handleSuccess}
      onError={handleError}
    />
    </div>
  );
}