import { X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { toast } from 'sonner';

import { UiButton } from '~shared/ui';

interface ShortRestModalProps {
  onClose: () => void;
}

export function ShortRestModal({ onClose }: ShortRestModalProps): ReactElement {
  const maxDice = 5;
  const diceType = 10;
  const [diceToSpend, setDiceToSpend] = useState(0);
  const avgRoll = Math.ceil((diceType + 1) / 2);
  const estimatedHp = diceToSpend * (avgRoll + 2); // +2 constitution modifier

  function handleConfirm() {
    toast.success(`Short rest taken — party gains ~${estimatedHp} HP`);
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
          <h2 className="text-lg font-bold text-white">Short Rest</h2>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-xl text-gray-400 active:bg-white/10"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-sm text-gray-400">Available Hit Dice</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {maxDice - diceToSpend}
            <span className="text-gray-400 text-base"> / {maxDice} d{diceType}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Dice to spend</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setDiceToSpend((d) => Math.max(0, d - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center text-2xl font-bold text-white">{diceToSpend}</span>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setDiceToSpend((d) => Math.min(maxDice, d + 1))}
            >
              +
            </button>
          </div>
        </div>

        {diceToSpend > 0 && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-center">
            <p className="text-sm text-yellow-300">
              Estimated HP gain: <span className="font-bold">~{estimatedHp}</span>
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            className="flex flex-1 min-h-11 items-center justify-center rounded-xl border border-white/10 text-sm text-gray-400 active:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="flex-1">
            <UiButton fullWidth disabled={diceToSpend === 0} onClick={handleConfirm}>
              Take Short Rest
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
