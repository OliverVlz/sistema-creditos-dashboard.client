import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { EyeCloseIcon, EyeIcon } from '../../../icons';
import { resetPassword } from '../slices/operations/resetPasswordOperations';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError('El enlace de recuperación es inválido.');
      setMessage('');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Debes completar todos los campos.');
      setMessage('');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setMessage('');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y la confirmación deben coincidir.');
      setMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resetPassword({
        token,
        newPassword,
      });
      setMessage(response?.message || 'Contraseña restablecida exitosamente.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(
        apiError?.response?.data?.message ||
          'No fue posible restablecer la contraseña. Solicita un nuevo enlace.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center py-8">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Restablecer contraseña</h1>
          <p className="text-sm text-gray-600 mt-2">
            Define una nueva contraseña para acceder a tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF8546] focus:border-[#FF8546]"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeCloseIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                  ) : (
                    <EyeIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF8546] focus:border-[#FF8546]"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeCloseIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                  ) : (
                    <EyeIcon className="w-4 h-4 fill-gray-400 hover:fill-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-600">{message}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-[#FF8546] text-white font-semibold py-2.5 hover:bg-[#e46f35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>

          <div className="mt-5 text-sm text-center">
            <Link to="/login" className="text-[#FF8546] hover:underline font-medium">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
