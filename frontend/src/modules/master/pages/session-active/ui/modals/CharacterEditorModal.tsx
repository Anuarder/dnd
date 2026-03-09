import { Minus, Plus, X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { toast } from 'sonner';

import { UiButton } from '~shared/ui';
import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

const CONDITIONS = ['Poisoned', 'Blinded', 'Stunned', 'Prone', 'Frightened', 'Paralyzed'];

const MOCK_SPELL_SLOTS = [
  { level: 1, max: 4 },
  { level: 2, max: 3 },
  { level: 3, max: 2 },
];

interface CharacterEditorModalProps {
  playerId: string;
  onClose: () => void;
}

export function CharacterEditorModal({ playerId, onClose }: CharacterEditorModalProps): ReactElement {
  const player = MOCK_CAMPAIGN_DETAIL.players.find((p) => p.id === playerId) ?? MOCK_CAMPAIGN_DETAIL.players[0];

  const [hp, setHp] = useState(32);
  const [maxHp] = useState(45);
  const [tempHp, setTempHp] = useState(0);
  const [conditions, setConditions] = useState<string[]>([]);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [spellSlots, setSpellSlots] = useState<Record<number, number>>(
    () => Object.fromEntries(MOCK_SPELL_SLOTS.map((s) => [s.level, s.max])),
  );

  const originalHp = 32;
  const hpChanged = hp !== originalHp;

  function toggleCondition(cond: string) {
    setConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  }

  function handleSave() {
    toast.success('Changes saved');
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
          <div>
            <h2 className="text-lg font-bold text-white">{player?.character_name}</h2>
            <p className="text-sm text-gray-400">{player?.character_class} · {player?.player_name}</p>
          </div>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-xl text-gray-400 active:bg-white/10"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* HP editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300">Hit Points</p>
            {hpChanged && (
              <span className="text-xs text-orange-400">
                {originalHp} → {hp} (DM override)
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setHp((h) => Math.max(0, h - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="min-w-16 text-center text-2xl font-bold text-white">
              {hp}<span className="text-gray-500 text-base">/{maxHp}</span>
            </span>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setHp((h) => Math.min(maxHp, h + 1))}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Temp HP */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Temp HP</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setTempHp((h) => Math.max(0, h - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="min-w-8 text-center text-xl font-bold text-blue-300">{tempHp}</span>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setTempHp((h) => h + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Conditions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300">Conditions</p>
            <button
              type="button"
              className="text-xs text-primary active:opacity-70"
              onClick={() => setShowConditionPicker((v) => !v)}
            >
              {showConditionPicker ? 'Done' : 'Add'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 active:bg-red-500/30"
                onClick={() => toggleCondition(c)}
              >
                {c} <X size={10} />
              </button>
            ))}
            {conditions.length === 0 && !showConditionPicker && (
              <p className="text-xs text-gray-600">None</p>
            )}
          </div>
          {showConditionPicker && (
            <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              {CONDITIONS.filter((c) => !conditions.includes(c)).map((c) => (
                <button
                  key={c}
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 active:bg-white/10"
                  onClick={() => toggleCondition(c)}
                >
                  + {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spell slots */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Spell Slots</p>
          <div className="space-y-3">
            {MOCK_SPELL_SLOTS.map((slot) => {
              const used = slot.max - (spellSlots[slot.level] ?? slot.max);
              return (
                <div key={slot.level} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-xs text-gray-400">Level {slot.level}</span>
                  <div className="flex gap-2">
                    {Array.from({ length: slot.max }, (_, i) => {
                      const isAvailable = i >= used;
                      return (
                        <button
                          key={i}
                          type="button"
                          className={`size-8 rounded-full border-2 transition-colors ${
                            isAvailable
                              ? 'border-primary bg-primary/30 active:bg-primary/50'
                              : 'border-white/20 bg-transparent active:bg-white/10'
                          }`}
                          onClick={() =>
                            setSpellSlots((prev) => ({
                              ...prev,
                              [slot.level]: isAvailable
                                ? Math.max(0, (prev[slot.level] ?? slot.max) - 1)
                                : Math.min(slot.max, (prev[slot.level] ?? slot.max) + 1),
                            }))
                          }
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-500">
                    {spellSlots[slot.level]}/{slot.max}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <UiButton fullWidth onClick={handleSave}>
          Save Changes
        </UiButton>
      </div>
    </div>
  );
}
