import { RouteObject } from 'react-router';

import { AuthCallbackPage } from './pages/auth-callback';
import { SignInPage } from './pages/sign-in';

type Route = RouteObject & { path: string; Component: React.ComponentType };

export const AuthRoutes = {
  SignInPage: {
    path: '/sign-in',
    Component: SignInPage,
  },
  AuthCallbackPage: {
    path: '/auth/callback',
    Component: AuthCallbackPage,
  },
} as const satisfies Record<string, Route>;
