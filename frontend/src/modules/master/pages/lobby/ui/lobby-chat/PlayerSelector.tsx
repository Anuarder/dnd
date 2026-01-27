import React from 'react';

type Player = { id: string; name: string; avatar?: string | null };

type Props = {
  players: Player[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

export const PlayerSelector: React.FC<Props> = ({ players, selectedId, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {players.map((p) => {
        const active = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex min-w-[120px] items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
              active ? 'bg-white/5' : 'bg-white/2'
            }`}
          >
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white/5">
              {p.avatar ? <img src={p.avatar} alt="avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm text-slate-300">{p.name[0]}</div>}
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium text-white">{p.name}</span>
              <span className="text-xs text-slate-300">Player</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PlayerSelector;
