import React, { useMemo, useState } from 'react';
import Header from './Header';
import PlayersList from './PlayersList';
import StartSessionButton from './StartSessionButton';

type Player = {
  id: string;
  name: string;
  avatar?: string | null;
  className?: string;
  level?: number;
};

export const LobbyInfo: React.FC = () => {
  const [code] = useState(() => generateCode());

  const lobby = useMemo(() => ({
    title: 'Evening of Mystery',
    description: 'A short one-shot for new players. Bring your wits and a torch.',
    maxPlayers: 6,
    bannerUrl: null as string | null,
  }), []);

  const [players] = useState<Player[]>([
    { id: 'p1', name: 'Lina', avatar: null, className: 'Wizard', level: 3 },
    { id: 'p2', name: 'Gor', avatar: null, className: 'Fighter', level: 2 },
    { id: 'p3', name: 'Miri', avatar: null, className: 'Rogue', level: 4 },
  ]);

  function handleStart() {
    console.log('Start session');
  }

  const bgUrl =
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="relative" style={{ paddingTop: 64 }}>
      <div
        className="absolute left-1/2 top-0 z-0"
        style={{
          width: '100vw',
          height: 200,
          transform: 'translateX(-50%)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.12), var(--color-dark-primary) 90%), url(${bgUrl})`,
        }}
      />

      <div className="relative z-10 space-y-4 px-4 py-6 rounded-lg overflow-hidden">
        <Header
          title={lobby.title}
          description={lobby.description}
          playersCount={players.length}
          maxPlayers={lobby.maxPlayers}
          bannerUrl={lobby.bannerUrl}
          code={code}
        />

        <div className="rounded-lg bg-white/3 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Players</h3>
          <PlayersList players={players} />
        </div>

        <div className="px-0">
          <StartSessionButton onStart={handleStart} />
        </div>
      </div>
    </div>
  );
};

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default LobbyInfo;
