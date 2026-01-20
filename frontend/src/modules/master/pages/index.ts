import { LobbyCreatePage } from './lobby-create/index';
import { Route } from '~shared/types';

export const MasterRoutes = {
  LobbyCreatePage: {
    path: '/lobby-create',
    Component: LobbyCreatePage,
  }
} as const satisfies Record<string, Route>;

