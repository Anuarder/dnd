import { ArrowLeft } from 'lucide-react';
import type { LobbyTab } from './BottomNav';

type Props = {
  tab: LobbyTab;
  onBack?: () => void;
};

const TITLE_MAP: Record<LobbyTab, string> = {
  lobby: 'Лобби',
  library: 'Библиотека',
  roll: 'Бросок',
  chat: 'Чат',
  settings: 'Настройки',
};

const LobbyHeader: React.FC<Props> = ({ tab, onBack }) => {
  const title = TITLE_MAP[tab] ?? 'Лобби';

  return (
    <header className="w-full py-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="w-10 h-10 rounded-md bg-white/5 text-white flex items-center justify-center hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 text-center text-lg font-semibold">{title}</div>

        <div className="w-10 h-10" aria-hidden />
      </div>
    </header>
  );
};

export default LobbyHeader;
