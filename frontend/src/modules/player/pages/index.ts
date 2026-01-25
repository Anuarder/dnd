import type { Route } from '~shared/types';

import { PlayerArchivePage } from './archive';
import { PlayerMainPage } from './main';

export const PlayerRoutes = {
  MainPage: {
    path: '/player',
    Component: PlayerMainPage,
  },
  ArchivePage: {
    path: '/player/archive',
    Component: PlayerArchivePage,
  },
} as const satisfies Record<string, Route>;
