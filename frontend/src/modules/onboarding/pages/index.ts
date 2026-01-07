import { OnboradingStartPage } from './start';
import { OnboradingPlayerPage } from './player';
import { OnboradingMasterPage } from './master';
import { OnboradingFinishPage } from './finish';
import { Route } from '~shared/types';

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

