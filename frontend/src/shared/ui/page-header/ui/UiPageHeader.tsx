import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement } from 'react';

function UiPageHeader({
  title,
  description,
  onBackClick,
}: {
  title: string;
  description: string;
  onBackClick: () => void;
}): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-8 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white transition-all duration-200 ease-out active:scale-95 active:bg-white/10"
          aria-label="Go back to home"
          onClick={onBackClick}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-pretty">
          <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export { UiPageHeader };
