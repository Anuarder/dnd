import { type ReactElement } from 'react';

export function SpellsPanel({
  spells,
}: {
  spells: {
    slots: Record<number, { max: number; used: number }>;
    list: Array<{ level: number; name: string; prepared: boolean }>;
  };
}): ReactElement {
  const slotEntries = Object.entries(spells.slots).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  return (
    <div className="bg-surface-dark rounded-xl border border-white/5 p-5 shadow-lg">
      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Ячейки заклинаний
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {slotEntries.map(([level, data]) => {
          const availableSlots = Math.max(0, data.max - data.used);

          return (
            <div key={level} className="rounded-lg border border-white/5 bg-white/5 p-3">
              <div className="text-xs text-gray-400">Уровень {level}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: data.max }).map((_, index) => (
                  <span
                    key={`${level}-${index}`}
                    className={`h-6 w-6 rounded-md border border-white/10 ${
                      index < availableSlots ? 'bg-primary/60' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-5 h-px w-full bg-white/5" />

      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Заклинания</h2>
      <div className="mt-4 space-y-4">
        {[0, 1, 2].map((level) => {
          const list = spells.list.filter((spell) => spell.level === level);
          if (list.length === 0) {
            return null;
          }

          return (
            <div key={level}>
              <div className="text-xs font-semibold text-gray-400">
                {level === 0 ? 'Заговоры' : `Уровень ${level}`}
              </div>
              <div className="mt-2 space-y-2">
                {list.map((spell) => (
                  <div
                    key={spell.name}
                    className={`flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 ${
                      spell.prepared ? 'bg-primary/10' : 'bg-white/5'
                    }`}
                  >
                    <span className="text-sm text-white">{spell.name}</span>
                    {spell.prepared && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                        Подг.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
