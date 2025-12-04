import { useState } from 'react';
import Swal from 'sweetalert2';
import { mainCustomAxios } from '../../../config/axios.config';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { EyeIcon, EyeCloseIcon } from '../../../icons';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.',
        icon: 'warning',
        confirmButtonColor: '#FF8546',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Contraseñas no coinciden',
        text: 'La nueva contraseña y su confirmación deben ser iguales.',
        icon: 'warning',
        confirmButtonColor: '#FF8546',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await mainCustomAxios.patch('/users/me/password', {
        currentPassword,
        newPassword,
      });

      const message =
        response?.data?.message || 'Contraseña actualizada exitosamente';

      await Swal.fire({
        title: '¡Contraseña actualizada!',
        text: message,
        icon: 'success',
        confirmButtonColor: '#FF8546',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const backendMessage =
        axiosError?.response?.data?.message ||
        'Ocurrió un error al actualizar la contraseña.';

      await Swal.fire({
        title:
          axiosError?.response?.status === 401
            ? 'Contraseña incorrecta'
            : 'Error',
        text: backendMessage,
        icon: 'error',
        confirmButtonColor: '#FF8546',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        showTitle={false}
        items={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Seguridad' },
          { label: 'Cambiar contraseña' },
        ]}
      />

      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cambiar contraseña
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Por seguridad, utiliza una contraseña que combine letras mayúsculas,
          minúsculas, números y caracteres especiales.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF8546] focus:border-[#FF8546]"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? (
                  <EyeCloseIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF8546] focus:border-[#FF8546]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showNew ? (
                  <EyeCloseIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF8546] focus:border-[#FF8546]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? (
                  <EyeCloseIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#FF8546] rounded-lg shadow-sm hover:bg-[#e46f35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;


