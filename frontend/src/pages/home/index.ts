import { Route } from '~shared/types';

import { HomePage } from './ui/HomePage';

export const HomeRoutes = {
  HomePage: {
    path: '/',
    Component: HomePage,
  },
} as const satisfies Record<string, Route>;
