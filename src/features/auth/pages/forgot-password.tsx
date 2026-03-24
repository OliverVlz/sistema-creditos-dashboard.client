import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../slices/operations/forgotPasswordOperations';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('El correo electrónico es requerido');
      setMessage('');
      return;
    }

    if (!isEmailValid) {
      setError('Ingresa un correo electrónico válido');
      setMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword({ email: email.trim().toLowerCase() });
      setMessage(
        response?.message ||
          'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.',
      );
      setEmail('');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(
        apiError?.response?.data?.message ||
          'No fue posible procesar tu solicitud en este momento.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center py-8">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
          <p className="text-sm text-gray-600 mt-2">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8546] focus:border-[#FF8546]"
                disabled={loading}
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-600">{message}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-[#FF8546] text-white font-semibold py-2.5 hover:bg-[#e46f35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
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
