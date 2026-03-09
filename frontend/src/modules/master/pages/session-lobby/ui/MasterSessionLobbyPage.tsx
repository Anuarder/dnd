import { Swords, X } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { UiButton, UiPageHeader } from '~shared/ui';
import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

export function MasterSessionLobbyPage(): ReactElement {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGN_DETAIL;
  const [players, setPlayers] = useState(campaign.players);

  const readyCount = players.filter((p) => p.is_ready).length;
  const canBegin = readyCount >= 1;

  function handleToggleReady(playerId: string) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, is_ready: !p.is_ready } : p))
    );
  }

  function handleBeginSession() {
    navigate(`/master/session/${id}`);
  }

  function handleCancel() {
    navigate(`/master/campaign/${id}`);
  }

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <UiPageHeader
          title="Session Lobby"
          description={campaign.name}
          onBackClick={handleCancel}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 space-y-6"
      >
        {/* Ready status summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-3xl font-bold text-white">
            {readyCount}
            <span className="text-gray-400">/{players.length}</span>
          </p>
          <p className="mt-1 text-sm text-gray-400">players ready</p>
        </div>

        {/* Player list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Players</h3>
          {players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
            >
              <div
                className={`size-3 shrink-0 rounded-full transition-colors ${
                  player.is_ready ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
              <div className="flex-1">
                <p className="font-medium text-white">{player.player_name}</p>
                <p className="text-xs text-gray-400">
                  {player.character_name} · {player.character_class} Lv.{player.character_level}
                </p>
              </div>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  player.is_ready
                    ? 'bg-green-500/20 text-green-400 active:bg-green-500/30'
                    : 'bg-white/10 text-gray-400 active:bg-white/20'
                }`}
                onClick={() => handleToggleReady(player.id)}
              >
                {player.is_ready ? 'Ready' : 'Not ready'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <UiButton fullWidth icon={<Swords size={18} />} disabled={!canBegin} onClick={handleBeginSession}>
            Begin Session
          </UiButton>
          <button
            type="button"
            className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm text-gray-400 active:bg-white/5"
            onClick={handleCancel}
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
