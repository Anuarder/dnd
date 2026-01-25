import { Route } from '~shared/types';

import { OnboradingFinishPage } from './finish';
import { OnboradingMasterPage } from './master';
import { OnboradingPlayerPage } from './player';
import { OnboradingStartPage } from './start';

export const OnboardingRoutes = {
  StartPage: {
    path: '/onboarding/start',
    Component: OnboradingStartPage,
  },
  PlayerPage: {
    path: '/onboarding/player',
    Component: OnboradingPlayerPage,
  },
  MasterPage: {
    path: '/onboarding/master',
    Component: OnboradingMasterPage,
  },
  FinishPage: {
    path: '/onboarding/finish',
    Component: OnboradingFinishPage,
  },
} as const satisfies Record<string, Route>;
