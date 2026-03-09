import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { UiPageHeader } from '~shared/ui';
import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

function WaitingDots(): ReactElement {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.span
          key={i}
          className="inline-block size-2 rounded-full bg-gray-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, delay, repeat: Infinity }}
        />
      ))}
    </span>
  );
}

export function PlayerSessionLobbyPage(): ReactElement {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGN_DETAIL;
  const [isReady, setIsReady] = useState(false);

  const currentPlayerId = 'p1'; // Mock current player
  const otherPlayers = campaign.players.filter((p) => p.id !== currentPlayerId);

  function handleToggleReady() {
    setIsReady((r) => !r);
  }

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <UiPageHeader
          title="Waiting for DM"
          description={campaign.name}
          onBackClick={() => navigate(`/player/campaign/${id}`)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 space-y-6"
      >
        {/* Waiting indicator */}
        <div className="flex flex-col items-center py-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4 flex size-20 items-center justify-center rounded-full border-2 border-white/10 bg-white/5"
          >
            <WaitingDots />
          </motion.div>
          <p className="text-lg font-semibold text-white">Waiting for DM to start</p>
          <p className="mt-1 text-sm text-gray-400">The session will begin when the DM is ready</p>
        </div>

        {/* Ready toggle */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="font-medium text-white">Your readiness</p>
            <p className="text-sm text-gray-400">
              {isReady ? "You're ready!" : 'Let the DM know you are set.'}
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

        {/* Party ready status */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Party</h3>
          {otherPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <div
                className={`size-3 shrink-0 rounded-full ${
                  player.is_ready ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{player.player_name}</p>
                <p className="truncate text-xs text-gray-400">
                  {player.character_name} · {player.character_class}
                </p>
              </div>
              <span
                className={`text-xs ${player.is_ready ? 'text-green-400' : 'text-gray-500'}`}
              >
                {player.is_ready ? 'Ready' : 'Waiting'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
