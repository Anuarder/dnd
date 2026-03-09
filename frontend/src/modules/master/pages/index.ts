import type { Route } from '~shared/types';

import { MasterMainPage } from './main';
import { CampaignCreatePage } from './campaign-create';
import { MasterCampaignDetailPage } from './campaign-detail';
import { MasterSessionLobbyPage } from './session-lobby';
import { MasterSessionActivePage } from './session-active';

export const MasterRoutes = {
  MainPage: {
    path: '/master',
    Component: MasterMainPage,
  },
  CampaignCreatePage: {
    path: '/master/campaign/create',
    Component: CampaignCreatePage,
  },
  CampaignDetailPage: {
    path: '/master/campaign/:id',
    Component: MasterCampaignDetailPage,
  },
  SessionLobbyPage: {
    path: '/master/campaign/:id/session',
    Component: MasterSessionLobbyPage,
  },
  SessionActivePage: {
    path: '/master/session/:id',
    Component: MasterSessionActivePage,
  },
} as const satisfies Record<string, Route>;
