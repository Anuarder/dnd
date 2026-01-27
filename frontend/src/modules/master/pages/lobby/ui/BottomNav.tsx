import React from 'react';
import { Home, BookOpen, Dice1, MessageSquare, Settings } from 'lucide-react';

export type LobbyTab = 'lobby' | 'library' | 'roll' | 'chat' | 'settings';

type Props = {
  selected: LobbyTab;
  onChange: (tab: LobbyTab) => void;
};

export const BottomNav: React.FC<Props> = ({ selected, onChange }) => {
  const items: { key: LobbyTab; label: string; icon: React.ReactNode }[] = [
  { key: 'lobby', label: 'Лобби', icon: <Home size={18} /> },
  { key: 'library', label: 'Библиотека', icon: <BookOpen size={18} /> },
  { key: 'roll', label: 'Roll', icon: <Dice1 size={18} /> },
  { key: 'chat', label: 'Чат', icon: <MessageSquare size={18} /> },
  { key: 'settings', label: 'Настройки', icon: <Settings size={18} /> },
  ];

  return (
    <nav aria-label="Lobby navigation" className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div className="w-full max-w-[760px] px-4">
        <div className="mx-auto flex h-14 items-center justify-between rounded-xl bg-black/40 px-3 py-2 shadow-lg backdrop-blur-sm">
          {items.map((it) => {
            const active = it.key === selected;

            if (it.key === 'roll') {
              return (
                <button
                  key={it.key}
                  onClick={() => onChange(it.key)}
                  aria-label={it.label}
                  className={`-mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transform transition ${
                    active ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {it.icon}
                </button>
              );
            }

            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                aria-label={it.label}
                className={`flex flex-1 flex-col items-center justify-center gap-1 px-2 py-1 text-xs text-slate-300 transition-all ${
                  active ? 'text-white' : 'text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center`}>{it.icon}</div>
                <div className="mt-1 leading-none text-[11px]">{it.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
