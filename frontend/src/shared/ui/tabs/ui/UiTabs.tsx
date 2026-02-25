import { AnimatePresence, motion } from 'motion/react';
import { type ReactElement, type ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

function UiTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
      className={`border-white/10 bg-white/5 mb-6 flex gap-2 rounded-lg border p-1 ${className ?? ''}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
        <motion.button
          key={tab.id}
          type="button"
          layout
          transition={{ layout: { duration: 0.25, ease: 'easeOut' } }}
          className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out active:scale-95 ${
            isActive ? 'flex-1 bg-primary text-white' : 'flex-none text-gray-400'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="flex items-center">{tab.icon}</span>}
          <AnimatePresence initial={false}>
            {isActive ? (
              <motion.span
                key={`${tab.id}-label`}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex items-center overflow-hidden whitespace-nowrap"
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                )}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.button>
        );
      })}
    </motion.div>
  );
}

export { UiTabs };
export type { Tab };
