import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuthUser } from '~entities/auth';

interface AuthRouteProps {
  redirectTo?: string;
}

/**
 * Auth route component that prevents authenticated users from accessing auth pages.
 * Redirects to home page if user is already authenticated.
 */
function AuthRoute({ redirectTo = '/' }: AuthRouteProps): ReactElement {
  const { user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-dark-primary p-4">
        <div className="flex flex-col items-center gap-6">
          {/* Animated key icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute">
              <div className="size-22 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
            </div>

            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-xl" />
            <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
              <svg
                className="h-10 w-10 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-xl font-bold text-white">Checking Session</h2>
            <p className="max-w-xs text-sm text-slate-400">
              Just a moment while we verify your status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export { AuthRoute };

