import type { Route } from '~shared/types';

import { PlayerArchivePage } from './archive';
import { PlayerMainPage } from './main';
import { PlayerCampaignDetailPage } from './campaign-detail';
import { JoinCampaignPage } from './join-campaign';
import { PlayerSessionLobbyPage } from './session-lobby';
import { PlayerSessionActivePage } from './session-active';

export const PlayerRoutes = {
  MainPage: {
    path: '/player',
    Component: PlayerMainPage,
  },
  ArchivePage: {
    path: '/player/archive',
    Component: PlayerArchivePage,
  },
  JoinCampaignPage: {
    path: '/player/join',
    Component: JoinCampaignPage,
  },
  CampaignDetailPage: {
    path: '/player/campaign/:id',
    Component: PlayerCampaignDetailPage,
  },
  SessionLobbyPage: {
    path: '/player/campaign/:id/session',
    Component: PlayerSessionLobbyPage,
  },
  SessionActivePage: {
    path: '/player/session/:id',
    Component: PlayerSessionActivePage,
  },
} as const satisfies Record<string, Route>;
