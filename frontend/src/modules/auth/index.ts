import { RouteObject } from 'react-router';
import { SignInPage } from './pages/sign-in';

type Route = RouteObject & { path: string; Component: React.ComponentType };

export const AuthRoutes = {
  SignInPage: {
    path: '/sign-in',
    Component: SignInPage,
  },
} as const satisfies Record<string, Route>;
