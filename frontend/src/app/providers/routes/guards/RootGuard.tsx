import { ReactElement, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { onboardingManager } from '~shared/lib/onboarding';

/**
 * RootGuard component
 * Checks if user needs to see onboarding before accessing any route
 * Redirects to onboarding start page if not completed
 */
function RootGuard(): ReactElement {
  const { pathname } = useLocation();
  const isOnboardingCompleted = onboardingManager.hasCompleted();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Allow access to onboarding pages without redirect
  const isOnboardingPage = pathname.startsWith('/onboarding');

  if (!isOnboardingCompleted && !isOnboardingPage) {
    return <Navigate to="/onboarding/start" replace />;
  }

  return <Outlet />;
}

export { RootGuard };
