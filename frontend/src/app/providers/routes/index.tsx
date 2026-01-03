import type { ReactElement } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AuthRoutes } from '~modules/auth';

const router = createBrowserRouter([
  { // Temp solution, add guards later
    path: '/',
    element: <Navigate to={AuthRoutes.SignInPage.path} replace />,
  },
  {
    ...AuthRoutes.SignInPage,
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
  return <RouterProvider router={router} />;
}

export { RoutesProvider };
