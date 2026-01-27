import React from 'react';
import PlayerItem from './PlayerItem';

type Player = {
  id: string;
  name: string;
  avatar?: string | null;
  className?: string;
  level?: number;
};

type Props = {
  players: Player[];
};

export const PlayersList: React.FC<Props> = ({ players }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {players.map((p) => (
        <PlayerItem key={p.id} avatar={p.avatar} name={p.name} className={p.className} level={p.level} />
      ))}
    </div>
  );
};

export default PlayersList;
