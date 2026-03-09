import { MessageSquare, Moon, StickyNote, Sun, Swords, Users, X } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { type Tab, UiPageHeader, UiTabs } from '~shared/ui';

import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

import { CombatTab } from './combat-tab/CombatTab';
import { MessagesTab } from './messages-tab/MessagesTab';
import { CharacterEditorModal } from './modals/CharacterEditorModal';
import { LongRestModal } from './modals/LongRestModal';
import { ShortRestModal } from './modals/ShortRestModal';
import { NotesTab } from './notes-tab/NotesTab';
import { PlayersTab } from './players-tab/PlayersTab';

type TabId = 'players' | 'combat' | 'notes' | 'messages';

const TABS: Tab[] = [
  { id: 'players', label: 'Players', icon: <Users size={16} /> },
  { id: 'combat', label: 'Combat', icon: <Swords size={16} /> },
  { id: 'notes', label: 'Notes', icon: <StickyNote size={16} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
];

export function MasterSessionActivePage(): ReactElement {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGN_DETAIL;
  const [activeTab, setActiveTab] = useState<TabId>('players');
  const [showShortRest, setShowShortRest] = useState(false);
  const [showLongRest, setShowLongRest] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [inCombat, setInCombat] = useState(false);

  function handleEndSession() {
    toast.success('Session ended');
    navigate(`/master/campaign/${id}`);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 py-6 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between">
          <UiPageHeader title={campaign.name} onBackClick={handleEndSession} />
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
            <span className="size-2 animate-pulse rounded-full bg-green-400" />
            Active
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
        className="mt-5"
      >
        <UiTabs tabs={TABS} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      </motion.div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex-1"
      >
        {activeTab === 'players' && <PlayersTab onCardClick={(pid) => setEditingPlayerId(pid)} />}
        {activeTab === 'combat' && (
          <CombatTab
            inCombat={inCombat}
            onStartCombat={() => setInCombat(true)}
            onEndCombat={() => setInCombat(false)}
          />
        )}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'messages' && <MessagesTab />}
      </motion.div>

      {/* Bottom actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="mt-6 flex gap-2 border-t border-white/10 pt-4"
      >
        {!inCombat ? (
          <button
            type="button"
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 text-xs font-medium text-primary active:bg-primary/20"
            onClick={() => { setInCombat(true); setActiveTab('combat'); }}
          >
            <Swords size={14} />
            Start Combat
          </button>
        ) : (
          <button
            type="button"
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-orange-500/20 bg-orange-500/10 text-xs font-medium text-orange-400 active:bg-orange-500/20"
            onClick={() => setInCombat(false)}
          >
            <X size={14} />
            End Combat
          </button>
        )}
        <button
          type="button"
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 active:bg-white/10"
          onClick={() => setShowShortRest(true)}
        >
          <Sun size={14} />
          Short Rest
        </button>
        <button
          type="button"
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 active:bg-white/10"
          onClick={() => setShowLongRest(true)}
        >
          <Moon size={14} />
          Long Rest
        </button>
        <button
          type="button"
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-medium text-red-400 active:bg-red-500/20"
          onClick={handleEndSession}
        >
          End Session
        </button>
      </motion.div>

      {/* Modals */}
      {showShortRest && <ShortRestModal onClose={() => setShowShortRest(false)} />}
      {showLongRest && <LongRestModal onClose={() => setShowLongRest(false)} />}
      {editingPlayerId && (
        <CharacterEditorModal playerId={editingPlayerId} onClose={() => setEditingPlayerId(null)} />
      )}
    </div>
  );
}
