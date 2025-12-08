import { useEffect } from 'react';
import FormUsers from '../components/formUsers';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../slices/operations/fetchUserById.operations';
import { useAppDispatch, useAppSelector, RootState } from '../../../store/index';
import { clearSelectedUser } from '../slices/users.slices';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const FormEditUser = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selectedUser } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    // Limpiar el usuario seleccionado cuando cambia el ID
    dispatch(clearSelectedUser());
    
    if (id) {
      // @ts-expect-error - Redux Toolkit types issue with React 19
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  const handleSuccess = () => {};
  const handleError = () => {};
  
  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Editar Usuario</h1>
    <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },
            { label: "Gestión de Usuarios", path: "/dashboard/gestion-de-usuarios" },
            {label: "Editar Usuario"}
          ]}
        />
      <FormUsers
        initialData={selectedUser || undefined}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default FormEditUser;
