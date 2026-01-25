import { Swords } from 'lucide-react';
import { motion } from 'motion/react';

import type { Character } from '../types';

const DEFAULT_CHARACTER_IMAGE =
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=400&fit=crop';

export function CharacterCard({
  character,
  onClick,
}: {
  character: Character;
  onClick: (id: Character['id']) => void;
}) {
  function handleOnClick() {
    onClick(character.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-surface-dark group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 shadow-lg transition-all duration-200 ease-out active:scale-95"
      onClick={handleOnClick}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={character.image_url || DEFAULT_CHARACTER_IMAGE}
          alt={character.name}
          className="size-full object-cover"
        />
        <div className="from-surface-dark via-surface-dark/70 to-surface-dark/30 absolute inset-0 bg-linear-to-t" />

        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5 rounded-full bg-purple-500/30 px-3 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-sm">
            <Swords size={12} />
            <span>Lvl {character.level}</span>
          </div>
        </div>
      </div>

      <div className="relative p-5">
        <h3 className="text-lg font-bold text-white">{character.name}</h3>

        <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
          <span className="font-medium">{character.class}</span>
          <span className="text-gray-500">•</span>
          <span>{character.race}</span>
        </div>
      </div>
    </motion.div>
  );
}
