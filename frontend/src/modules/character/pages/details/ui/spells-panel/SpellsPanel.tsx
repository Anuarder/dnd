import { type ReactElement, useState } from 'react';

interface SpellSlotLevel {
  level: number;
  total: number;
  used: number;
}

interface Spell {
  level: number;
  name: string;
  prepared: boolean;
}

export function SpellsPanel({
  spells,
}: {
  spells: {
    slots: Record<number, { max: number; used: number }>;
    list: Array<{ level: number; name: string; prepared: boolean }>;
  };
}): ReactElement {
  const initialSlots: SpellSlotLevel[] = Object.entries(spells.slots)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([level, data]) => ({
      level: Number(level),
      total: data.max,
      used: data.used,
    }));

  const [slots, setSlots] = useState<SpellSlotLevel[]>(initialSlots);
  const [spellList, setSpellList] = useState<Spell[]>(spells.list);

  function handleToggleSlot(level: number, slotIndex: number) {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.level !== level) {
          return s;
        }
        const available = s.total - s.used;
        // Clicking an available slot marks it used; clicking used slot marks it available
        if (slotIndex < available) {
          // It's available, mark used
          return { ...s, used: s.used + 1 };
        } else {
          // It's used, restore
          return { ...s, used: Math.max(0, s.used - 1) };
        }
      })
    );
  }

  function handleTogglePrepared(spellName: string) {
    setSpellList((prev) =>
      prev.map((spell) =>
        spell.name === spellName ? { ...spell, prepared: !spell.prepared } : spell
      )
    );
  }

  const cantrips = spellList.filter((s) => s.level === 0);
  const leveldSpells = spellList.filter((s) => s.level > 0);
  const uniqueLevels = [...new Set(leveldSpells.map((s) => s.level))].sort((a, b) => a - b);

  return (
    <div className="space-y-5">
      {/* Spell slots */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Spell Slots</p>
        {slots.map((s) => {
          const available = s.total - s.used;
          return (
            <div key={s.level} className="flex items-center gap-3">
              <span className="w-16 text-xs text-gray-400 shrink-0">Level {s.level}</span>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: s.total }, (_, i) => {
                  const isAvailable = i < available;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`size-7 rounded-full border transition-colors ${
                        isAvailable
                          ? 'border-primary bg-primary/40 active:bg-primary/60'
                          : 'border-white/20 bg-white/5 active:bg-white/10'
                      }`}
                      title={isAvailable ? 'Mark as used' : 'Restore slot'}
                      onClick={() => handleToggleSlot(s.level, i)}
                    />
                  );
                })}
              </div>
              <span className="ml-auto text-xs text-gray-500">
                {available}/{s.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cantrips */}
      {cantrips.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Cantrips</p>
          {cantrips.map((spell) => (
            <div
              key={spell.name}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
            >
              <span className="text-sm text-white">{spell.name}</span>
              <span className="text-xs text-gray-500">Always available</span>
            </div>
          ))}
        </div>
      )}

      {/* Leveled spells */}
      {uniqueLevels.map((level) => {
        const spellsAtLevel = leveldSpells.filter((s) => s.level === level);
        return (
          <div key={level} className="space-y-2">
            <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Level {level} Spells
            </p>
            {spellsAtLevel.map((spell) => (
              <button
                key={spell.name}
                type="button"
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left active:opacity-80 ${
                  spell.prepared
                    ? 'border-primary/30 bg-primary/10'
                    : 'border-white/5 bg-white/5'
                }`}
                onClick={() => handleTogglePrepared(spell.name)}
              >
                <span className="text-sm text-white">{spell.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    spell.prepared
                      ? 'bg-primary/20 text-purple-300'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {spell.prepared ? 'Prepared' : 'Not prepared'}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
