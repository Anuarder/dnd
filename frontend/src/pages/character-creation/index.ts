import { Route } from '~shared/types';

import { CharacterCreationPage } from './ui/CharacterCreationPage';

export const CharacterCreationRoutes = {
  CharacterCreationPage: {
    path: '/character-creation',
    Component: CharacterCreationPage,
  },
} as const satisfies Record<string, Route>;
