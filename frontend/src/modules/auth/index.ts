import { AuthCallbackPage } from './pages/auth-callback';
import { SignInPage } from './pages/sign-in';
import { Route } from '~shared/types';

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
