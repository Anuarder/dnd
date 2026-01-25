import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

import logoSvg from '~shared/assets/logo.svg';
import { UiButton } from '~shared/ui';

export function CharacterBanner({ onCreateCharacter }: { onCreateCharacter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <img src={logoSvg} alt="D&D Logo" className="mb-4 size-24" />

      <h2 className="font-display mb-2 text-xl font-bold text-white">No Legends Yet</h2>
      <p className="mb-6 max-w-md text-sm text-gray-400">
        Create your first character and begin your adventure. Build your legend, forge your destiny,
        and embark on epic quests.
      </p>
      <UiButton onClick={onCreateCharacter} icon={<Plus size={20} />}>
        Create Your First Legend
      </UiButton>
    </motion.div>
  );
}
