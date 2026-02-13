import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuthUser } from '~entities/auth';

interface ProtectedRouteProps {
  redirectTo?: string;
}

/**
 * Protected route component that guards routes requiring authentication.
 * Redirects to sign-in page if user is not authenticated.
 */
function ProtectedRoute({ redirectTo = '/sign-in' }: ProtectedRouteProps): ReactElement {
  const { user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="bg-dark-primary flex min-h-dvh items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          {/* Animated shield icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute">
              <div className="size-22 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />
            </div>

            <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20 blur-xl" />
            <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
              <svg
                className="h-10 w-10 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-xl font-bold text-white">Verifying Access</h2>
            <p className="max-w-xs text-sm text-slate-400">Checking your credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };
