import { Dices } from 'lucide-react';
import { type ReactElement } from 'react';

export function CharacterHeader({
  name,
  race,
  characterClass,
  level,
  background,
  alignment,
}: {
  name: string;
  race: string;
  characterClass: string;
  level: number;
  background: string;
  alignment: string;
}): ReactElement {
  return (
    <div className="bg-surface-dark rounded-xl border border-white/5 p-5 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <p className="text-sm text-gray-400">
            {race} · {characterClass} · {level} уровень
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          <Dices size={14} />
          Уровень {level}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        {background} · {alignment}
      </p>
    </div>
  );
}
