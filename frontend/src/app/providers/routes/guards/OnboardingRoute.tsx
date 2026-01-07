import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router';
import { onboardingManager } from '~shared/lib/onboarding';

/**
 * OnboardingRoute component
 * Redirects to home page if user has already completed onboarding
 * Otherwise, renders the onboarding page
 */
export function OnboardingRoute(): ReactElement {
  const isOnboardingCompleted = onboardingManager.hasCompleted();

  if (isOnboardingCompleted) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

