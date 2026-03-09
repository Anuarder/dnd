import { Shield, Swords } from 'lucide-react';
import { type ReactElement } from 'react';

import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

function HpBar({ current, max }: { current: number; max: number }): ReactElement {
  const pct = Math.min(100, Math.round((current / max) * 100));
  const color = pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PlayersTab({
  onCardClick,
}: {
  onCardClick: (playerId: string) => void;
}): ReactElement {
  const players = MOCK_CAMPAIGN_DETAIL.players;

  return (
    <div className="space-y-3">
      {players.map((player) => (
        <button
          key={player.id}
          type="button"
          className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left active:bg-white/10"
          onClick={() => onCardClick(player.id)}
        >
          <span className="flex items-start justify-between gap-3">
            <span className="flex flex-1 flex-col gap-2">
              <span className="flex items-center gap-2">
                <span className="font-semibold text-white">{player.character_name}</span>
                <span className="rounded-full bg-primary/30 px-2 py-0.5 text-xs text-purple-300">
                  Lv.{player.character_level}
                </span>
              </span>
              <span className="text-xs text-gray-400">
                {player.character_class} · {player.player_name}
              </span>
              {/* Mock HP bar */}
              <span className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">HP 32/45</span>
                <HpBar current={32} max={45} />
              </span>
              <span className="flex gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Shield size={12} />
                  AC 16
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Swords size={12} />
                  +3 init
                </span>
              </span>
            </span>
            <span className="text-gray-500">›</span>
          </span>
        </button>
      ))}
    </div>
  );
}
