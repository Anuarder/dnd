import { Plus, SkipForward, Swords, X } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';

import type { Combatant } from '~entities/session';
import { MOCK_COMBATANTS } from '~entities/session';

function CombatantRow({
  combatant,
  onRemove,
}: {
  combatant: Combatant;
  onRemove: (id: string) => void;
}): ReactElement {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        combatant.is_current_turn
          ? 'border-primary/60 bg-primary/10'
          : 'border-white/5 bg-white/5'
      }`}
    >
      {combatant.is_current_turn && (
        <span className="size-2 shrink-0 rounded-full bg-primary animate-pulse" />
      )}
      {!combatant.is_current_turn && (
        <span className="size-2 shrink-0 rounded-full bg-gray-700" />
      )}

      <span className="flex w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 py-1 text-sm font-bold text-white">
        {combatant.initiative}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block truncate text-sm font-medium text-white">{combatant.name}</span>
        {combatant.type === 'npc' && combatant.hp !== undefined && (
          <span className="text-xs text-gray-400">
            HP {combatant.hp}/{combatant.max_hp}
          </span>
        )}
      </span>

      {combatant.type === 'npc' && (
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg text-gray-500 active:bg-white/10 active:text-white"
          onClick={() => onRemove(combatant.id)}
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}

function AddCombatantForm({
  onAdd,
}: {
  onAdd: (c: Omit<Combatant, 'is_current_turn'>) => void;
}): ReactElement {
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [hp, setHp] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !initiative) {
      return;
    }
    onAdd({
      id: `npc-${Date.now()}`,
      name: name.trim(),
      initiative: Number(initiative),
      type: 'npc',
      hp: hp ? Number(hp) : undefined,
      max_hp: hp ? Number(hp) : undefined,
    });
    setName('');
    setInitiative('');
    setHp('');
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          placeholder="NPC name"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          value={initiative}
          placeholder="Init"
          min={0}
          max={30}
          className="w-16 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          onChange={(e) => setInitiative(e.target.value)}
        />
        <input
          type="number"
          value={hp}
          placeholder="HP"
          min={0}
          className="w-16 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          onChange={(e) => setHp(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="flex w-full min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm text-gray-300 active:bg-white/5"
      >
        <Plus size={14} />
        <span>Add Combatant</span>
      </button>
    </form>
  );
}

interface CombatTabProps {
  inCombat: boolean;
  onStartCombat: () => void;
  onEndCombat: () => void;
}

export function CombatTab({ inCombat, onStartCombat, onEndCombat }: CombatTabProps): ReactElement {
  const [combatants, setCombatants] = useState<Combatant[]>(inCombat ? MOCK_COMBATANTS : []);
  const [round, setRound] = useState(inCombat ? 3 : 1);

  function handleAddCombatant(c: Omit<Combatant, 'is_current_turn'>) {
    setCombatants((prev) => {
      const sorted = [...prev, { ...c, is_current_turn: false }].sort(
        (a, b) => b.initiative - a.initiative
      );
      return sorted;
    });
  }

  function handleRemoveCombatant(id: string) {
    setCombatants((prev) => prev.filter((c) => c.id !== id));
  }

  function handleNextTurn() {
    setCombatants((prev) => {
      const currentIndex = prev.findIndex((c) => c.is_current_turn);
      const nextIndex = (currentIndex + 1) % prev.length;
      const updated = prev.map((c, i) => ({ ...c, is_current_turn: i === nextIndex }));
      if (nextIndex === 0) {
        setRound((r) => r + 1);
      }
      return updated;
    });
  }

  function handleEndCombat() {
    setCombatants([]);
    setRound(1);
    onEndCombat();
  }

  function handleStartCombat() {
    setCombatants(MOCK_COMBATANTS);
    setRound(3);
    onStartCombat();
  }

  if (!inCombat) {
    return (
      <div className="flex flex-col items-center py-12 gap-4">
        <p className="text-gray-400 text-sm">No active combat.</p>
        <button
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white active:bg-primary/80"
          onClick={handleStartCombat}
        >
          <Swords size={16} />
          Start Combat
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-300">
          Round <span className="text-white">{round}</span>
        </span>
        <button
          type="button"
          className="flex min-h-9 items-center gap-1.5 rounded-lg bg-red-500/20 px-3 text-xs font-medium text-red-400 active:bg-red-500/30"
          onClick={handleEndCombat}
        >
          End Combat
        </button>
      </div>

      <div className="space-y-2">
        {combatants.map((c) => (
          <CombatantRow key={c.id} combatant={c} onRemove={handleRemoveCombatant} />
        ))}
      </div>

      <button
        type="button"
        className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-primary/80 text-sm font-semibold text-white active:bg-primary"
        onClick={handleNextTurn}
      >
        <SkipForward size={16} />
        Next Turn
      </button>

      <div className="border-t border-white/10 pt-4">
        <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          Add NPC
        </p>
        <AddCombatantForm onAdd={handleAddCombatant} />
      </div>
    </div>
  );
}
