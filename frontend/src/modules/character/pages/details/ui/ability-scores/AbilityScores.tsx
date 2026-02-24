import { type ReactElement } from 'react';

export function AbilityScores({
  abilities,
}: {
  abilities: Array<{ name: string; short: string; score: number; modifier: number }>;
}): ReactElement {
  return (
    <div className="bg-surface-dark rounded-xl border border-white/5 p-5 shadow-lg">
      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Характеристики
      </h2>
      <div className="mt-4 grid gap-3 grid-cols-3">
        {abilities.map((ability) => (
          <div
            key={ability.short}
            className="rounded-lg border border-white/5 bg-white/5 p-3 text-center"
          >
            <div className="text-xs font-semibold text-gray-400 uppercase">{ability.short}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{ability.score}</div>
            <div className="mt-2 text-sm text-gray-300">
              {ability.modifier >= 0 ? `+${ability.modifier}` : ability.modifier}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
