import { Radio, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { UiButton, UiPageHeader } from '~shared/ui';
import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

export function PlayerCampaignDetailPage(): ReactElement {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGN_DETAIL;
  const [isReady, setIsReady] = useState(false);

  const sessionActive = false; // Mock: session is not live
  const partyMembers = campaign.players.slice(1); // Other members (not current user)

  function handleToggleReady() {
    setIsReady((r) => !r);
  }

  function handleJoinSession() {
    navigate(`/player/campaign/${id}/session`);
  }

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <UiPageHeader title="Campaign" onBackClick={() => navigate('/player')} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
        className="mt-6 space-y-5"
      >
        {/* Banner */}
        {campaign.image_url && (
          <div className="relative h-44 w-full overflow-hidden rounded-xl">
            <img src={campaign.image_url} alt={campaign.name} className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            </div>
          </div>
        )}

        {campaign.description && (
          <p className="text-sm text-gray-400">{campaign.description}</p>
        )}

        {/* Session indicator */}
        {sessionActive && (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <Radio size={18} className="text-green-400 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-300">Session is live!</p>
              <p className="text-xs text-green-400/70">The DM has started a session</p>
            </div>
            <UiButton size="sm" onClick={handleJoinSession}>
              Join
            </UiButton>
          </div>
        )}

        {/* Ready toggle */}
        {!sessionActive && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="font-medium text-white">Ready status</p>
              <p className="text-sm text-gray-400">
                {isReady ? 'You are ready!' : 'Mark yourself ready when set.'}
              </p>
            </div>
            <button
              type="button"
              className={`min-h-11 rounded-xl px-5 text-sm font-semibold transition-colors ${
                isReady
                  ? 'bg-green-500 text-white active:bg-green-600'
                  : 'bg-white/10 text-gray-300 active:bg-white/20'
              }`}
              onClick={handleToggleReady}
            >
              {isReady ? '✓ Ready' : 'Ready Up'}
            </button>
          </div>
        )}

        {/* Party members */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
              Party
            </h3>
          </div>
          {partyMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <div
                className={`size-3 shrink-0 rounded-full ${member.is_ready ? 'bg-green-400' : 'bg-gray-600'}`}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{member.character_name}</p>
                <p className="truncate text-xs text-gray-400">
                  {member.character_class} Lv.{member.character_level} · {member.player_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
