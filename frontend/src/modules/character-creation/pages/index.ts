import { CharacterCreationPage } from './ui/CharacterCreationPage';
import { Route } from '~shared/types';

export const CharacterCreationRoutes = {
  CharacterCreationPage: {
    path: '/character-creation',
    Component: CharacterCreationPage,
  }
} as const satisfies Record<string, Route>;

