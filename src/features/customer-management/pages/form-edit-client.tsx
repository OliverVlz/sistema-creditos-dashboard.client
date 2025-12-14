import { useEffect } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { fetchClientById } from '../slices/operations/fetchClientById.operations';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import FormClient from '../components/formClient';
import { useAppSelector, RootState } from '@/store';

const FormEditClient = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { selectedClient } = useAppSelector((state: RootState) => state.clients);
    useEffect(() => {
        if (id) {
            dispatch(fetchClientById(id));
        }
    }, [dispatch, id]);
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Editar Cliente</h1>
      <PageBreadcrumb 
        showTitle={false}
        items={[
          { label: "Home", path: "/dashboard/home" },  
          { label: "Gestión de Clientes", path: "/gestion-de-clientes" },
          { label: "Editar Cliente" }
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