import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuthStateListener } from '~entities/auth';

import { CharacterRoutes } from '~modules/character';

import { MasterRoutes } from '~/modules/master';
import { OnboardingRoutes } from '~/modules/onboarding/pages';
import { PlayerRoutes } from '~/modules/player/pages';
import { HomeRoutes } from '~/pages/home';
import { AuthRoutes } from '~auth';

import { AuthRoute, OnboardingRoute, ProtectedRoute, RootGuard } from './guards';

const router = createBrowserRouter([
  {
    Component: RootGuard,
    children: [
      {
        ...AuthRoutes.AuthCallbackPage,
      },
      {
        Component: AuthRoute,
        children: [
          {
            ...AuthRoutes.SignInPage,
          },
        ],
      },
      {
        Component: OnboardingRoute,
        children: [
          {
            ...OnboardingRoutes.StartPage,
          },
          {
            ...OnboardingRoutes.PlayerPage,
          },
          {
            ...OnboardingRoutes.MasterPage,
          },
          {
            ...OnboardingRoutes.FinishPage,
          },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            ...HomeRoutes.HomePage,
          },
          {
            ...MasterRoutes.MainPage,
          },
          {
            ...PlayerRoutes.MainPage,
          },
          {
            ...PlayerRoutes.ArchivePage,
          },
          {
            ...CharacterRoutes.CharacterCreatePage,
          },
          {
            ...CharacterRoutes.CharacterDetailsPage,
          },
        ],
      },
    ],
  },
]);

function RoutesProvider() {
  // Listen to auth state changes and sync with TanStack Query cache
  useAuthStateListener();

  return <RouterProvider router={router} />;
}

export { RoutesProvider };
