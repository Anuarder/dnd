import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuthStateListener } from '~entities/auth';

import { HomeRoutes } from '~/pages/home';
import { AuthRoutes } from '~auth';
import { AuthRoute, ProtectedRoute } from './guards';

const router = createBrowserRouter([
  // Protected routes (require authentication)
  {
    Component: ProtectedRoute,
    children: [
      {
        ...HomeRoutes.HomePage,
      },
      // Add more protected routes here
    ],
  },
  // Auth routes (redirect to home if already authenticated)
  {
    Component: AuthRoute,
    children: [
      {
        ...AuthRoutes.SignInPage,
      },
    ],
  },
  // Public routes (no authentication required)
  {
    ...AuthRoutes.AuthCallbackPage,
  },
  // Example with loader:
  // loader: async () => {
  //   const data = await fetchData();
  //   return data;
  // },
  // Add more routes here, for example:
  // {
  //   path: '/about',
  //   element: <AboutPage />,
  //   loader: aboutLoader,
  // },
  // {
  //   path: '/users/:id',
  //   element: <UserPage />,
  //   loader: userLoader,
  //   action: userAction,
  // },
]);

function RoutesProvider() {
  // Listen to auth state changes and sync with TanStack Query cache
  useAuthStateListener();

  return <RouterProvider router={router} />;
}

export { RoutesProvider };
