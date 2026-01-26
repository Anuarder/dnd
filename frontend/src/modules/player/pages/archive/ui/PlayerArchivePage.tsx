import { motion } from 'motion/react';
import { type ReactElement, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import logoSvg from '~shared/assets/logo.svg';
import { UiPageHeader } from '~shared/ui';

import { type Character, CharacterCard, MOCK_CHARACTERS } from '~entities/character';

function EmptyArchiveState(): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <img src={logoSvg} alt="D&D Logo" className="mb-4 size-24 opacity-50" />

      <h2 className="font-display mb-2 text-xl font-bold text-white">No Archived Legends</h2>
      <p className="max-w-md text-sm text-gray-400">
        Your archived characters will appear here. You can restore them or permanently remove them
        from your collection.
      </p>
    </motion.div>
  );
}

export function PlayerArchivePage() {
  // TODO: Replace with API calls using TanStack Query
  const navigate = useNavigate();
  const [characters] = useState<Character[]>(MOCK_CHARACTERS);

  const archivedCharacters = useMemo(
    () => characters.filter((character) => character.status === 'archive'),
    [characters]
  );

  const hasArchivedCharacters = archivedCharacters.length > 0;

  function onCharacterClick(characterId: Character['id']) {
    navigate(`/character/${characterId}`);
  }

  function onBackClick() {
    navigate('/player');
  }

  return (
    <div className="mesh-gradient min-h-dvh px-4 py-6 text-white">
      <div className="mx-auto max-w-4xl">
        <UiPageHeader
          title="Archived Legends"
          description="View your archived characters"
          onBackClick={onBackClick}
        />

        {!hasArchivedCharacters ? (
          <EmptyArchiveState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
            className="space-y-4"
          >
            {archivedCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} onClick={onCharacterClick} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
