import { AuthProvider } from "../context/auth/auth-context.provider";
import { NotificationsProvider } from "../context/NotificationsContext";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/common/ErrorFallback";

interface IAppProviders {
  children: React.ReactNode;
}

export function AppProviders({ children }: IAppProviders) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <NotificationsProvider>{children}</NotificationsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
