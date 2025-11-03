import { AuthProvider } from '../context/auth/auth-context.provider';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/common/ErrorFallback';

interface IAppProviders {
  children: React.ReactNode;
}

export function AppProviders({ children }: IAppProviders) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}
