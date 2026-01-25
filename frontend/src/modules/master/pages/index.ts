import { Route } from '~shared/types';

import { MasterMainPage } from './main';

export const MasterRoutes = {
  MainPage: {
    path: '/master',
    Component: MasterMainPage,
  },
} as const satisfies Record<string, Route>;
