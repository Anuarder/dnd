import { motion } from 'motion/react';
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
      className={`bg-surface-dark mb-6 flex gap-2 rounded-lg border border-white/5 p-1 ${className ?? ''}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out active:scale-95 ${
            activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && tab.icon}
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">{tab.count}</span>
          )}
        </button>
      ))}
    </motion.div>
  );
}

export { UiTabs };
export type { Tab };
