import type { ReactElement } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuthStateListener } from '~entities/auth';

import { HomeRoutes } from '~/pages/home';
import { AuthRoutes } from '~auth';

const router = createBrowserRouter([
  {
    ...HomeRoutes.HomePage,
  },
  {
    ...AuthRoutes.SignInPage,
  },
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

function RoutesProvider(): ReactElement {
  // Listen to auth state changes and sync with TanStack Query cache
  useAuthStateListener();

  return <RouterProvider router={router} />;
}

export { RoutesProvider };
