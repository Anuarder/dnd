import { Moon, X } from 'lucide-react';
import { type ReactElement } from 'react';
import { toast } from 'sonner';

import { UiButton } from '~shared/ui';
import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

interface LongRestModalProps {
  onClose: () => void;
}

export function LongRestModal({ onClose }: LongRestModalProps): ReactElement {
  const players = MOCK_CAMPAIGN_DETAIL.players;

  function handleConfirm() {
    toast.success('Long rest complete — HP, spell slots, and Hit Dice restored');
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-dark-primary p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Long Rest</h2>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-xl text-gray-400 active:bg-white/10"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <Moon size={20} className="shrink-0 text-blue-400 mt-0.5" />
          <p className="text-sm text-blue-200">
            This will restore HP, spell slots, and Hit Dice for all party members.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">Affected characters</p>
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium text-white">{player.character_name}</span>
                <span className="text-xs text-gray-500">{player.character_class}</span>
              </span>
              <span className="text-sm text-gray-400">
                <span className="text-yellow-400">32</span>
                <span className="text-gray-600"> → </span>
                <span className="text-green-400">45</span>
                <span className="text-gray-500 text-xs"> HP</span>
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex flex-1 min-h-11 items-center justify-center rounded-xl border border-white/10 text-sm text-gray-400 active:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="flex-1">
            <UiButton fullWidth onClick={handleConfirm}>
              Confirm Long Rest
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
