import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

import type { Campaign } from '../types';

const DEFAULT_CAMPAIGN_IMAGE =
  'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=300&fit=crop';

export function CampaignCard({
  campaign,
  onClick,
}: {
  campaign: Campaign;
  onClick: (id: Campaign['id']) => void;
}) {
  const isActive = campaign.status === 'active';

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  function handleOnClick() {
    onClick(campaign.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-surface-dark relative cursor-pointer overflow-hidden rounded-xl border border-white/5 shadow-lg transition-all duration-200 ease-out active:scale-95"
      onClick={handleOnClick}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={campaign.image_url || DEFAULT_CAMPAIGN_IMAGE}
          alt={campaign.name}
          className="size-full object-cover"
        />
        <div className="from-surface-dark via-surface-dark/70 to-surface-dark/30 absolute inset-0 bg-linear-to-t" />

        <div className="absolute top-3 right-3">
          <div
            className={`flex items-center rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
              isActive ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/40 text-gray-300'
            }`}
          >
            {isActive ? 'Active' : 'Archived'}
          </div>
        </div>
      </div>

      <div className="relative z-10 p-5">
        <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} />
          <span>Created {formatDate(campaign.created_at)}</span>
        </div>

        {campaign.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {campaign.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
