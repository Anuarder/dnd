import { Route } from '~shared/types';

import { CharacterCreatePage } from './create';
import { CharacterDetailsPage } from './details';

export const CharacterRoutes = {
  CharacterCreatePage: {
    path: '/character/create',
    Component: CharacterCreatePage,
  },
  CharacterDetailsPage: {
    path: '/character/:id',
    Component: CharacterDetailsPage,
  },
} as const satisfies Record<string, Route>;
