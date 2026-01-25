import type { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { onboardingManager } from '~shared/lib/onboarding';

/**
 * RootGuard component
 * Checks if user needs to see onboarding before accessing any route
 * Redirects to onboarding start page if not completed
 */
function RootGuard(): ReactElement {
  const location = useLocation();
  const isOnboardingCompleted = onboardingManager.hasCompleted();

  // Allow access to onboarding pages without redirect
  const isOnboardingPage = location.pathname.startsWith('/onboarding');

  if (!isOnboardingCompleted && !isOnboardingPage) {
    return <Navigate to="/onboarding/start" replace />;
  }

  return <Outlet />;
}

export { RootGuard };
