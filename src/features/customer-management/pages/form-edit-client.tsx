import { useEffect } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { fetchClientById } from '../slices/operations/fetchClientById.operations';
import { useParams } from 'react-router-dom';
import FormClient from '../components/formClient';
import { useAppDispatch, useAppSelector, RootState } from '@/store';

const FormEditClient = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { selectedClient } = useAppSelector((state: RootState) => state.clients);
    useEffect(() => {
        if (id) {
            dispatch(fetchClientById(id));
        }
    }, [dispatch, id]);
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Editar cliente</h1>
      <PageBreadcrumb 
        showTitle={false}
        items={[
          { label: "Inicio", path: "/dashboard/inicio" },  
          { label: "Gestión de clientes", path: "/gestion-de-clientes" },
          { label: "Editar cliente" }
        ]}
      />
      <FormClient
        initialData={selectedClient || undefined}
        /* onSuccess={handleSuccess}
        onError={handleError} */
      />
    </div>
  )
}

export default FormEditClient
