import { motion } from 'motion/react';
import { useState } from 'react';
import BottomNav, { type LobbyTab } from './ui/BottomNav';
import LobbyInfo from './ui/lobby-info';
import LobbySettings from './ui/lobby-settings';
import LobbyChat from './ui/lobby-chat';
import LobbyRoll from './ui/lobby-roll';
import LobbyHeader from './ui/LobbyHeader';

export function LobbyPage() {
  const [tab, setTab] = useState<LobbyTab>('lobby');

  return (
    <div className="bg-dark-primary flex min-h-dvh justify-center px-6 pb-20 text-pretty text-white">
      <div className="w-full max-w-[980px]">
        <LobbyHeader tab={tab} />
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="min-h-[78vh] rounded-lg flex flex-col"
        >
          {tab === 'lobby' && <LobbyInfo />}
          {tab === 'library' && <h2 className="text-2xl font-semibold">Библиотека</h2>}
          {tab === 'roll' && <LobbyRoll />}
          {tab === 'chat' && <LobbyChat />}
          {tab === 'settings' && <LobbySettings />}
        </motion.div>

        <BottomNav selected={tab} onChange={(t) => setTab(t)} />
      </div>
    </div>
  );
}

export default LobbyPage;
