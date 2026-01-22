import React from 'react';

type Props = {
  avatar?: string | null;
  name: string;
  className?: string;
  level?: number;
};

export const PlayerItem: React.FC<Props> = ({ avatar, name, className = 'Adventurer', level = 1 }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/2 p-3">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white/5">
        {avatar ? (
          <img src={avatar} alt="player avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-300">{name[0]}</div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-between">
        <div className="text-left">
          <div className="font-medium text-white">{name}</div>
          <div className="text-xs text-slate-300">{className} • lvl {level}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerItem;
