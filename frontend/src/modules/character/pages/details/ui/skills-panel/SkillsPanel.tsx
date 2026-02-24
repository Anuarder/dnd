import { type ReactElement } from 'react';

function StatList({
  items,
}: {
  items: Array<{ name: string; modifier: number; proficient: boolean }>;
}): ReactElement {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            {item.proficient && <span className="h-2 w-2 rounded-full bg-primary" />}
            <span className={item.proficient ? 'text-white' : 'text-gray-400'}>{item.name}</span>
          </div>
          <span className="text-sm font-semibold text-white">
            {item.modifier >= 0 ? `+${item.modifier}` : item.modifier}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SkillsPanel({
  skills,
  savingThrows,
}: {
  skills: Array<{ name: string; modifier: number; proficient: boolean }>;
  savingThrows: Array<{ name: string; modifier: number; proficient: boolean }>;
}): ReactElement {
  return (
    <div className="bg-surface-dark rounded-xl border border-white/5 p-5 shadow-lg">
      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Навыки</h2>
      <div className="mt-4">
        <StatList items={skills} />
      </div>

      <div className="my-5 h-px w-full bg-white/5" />

      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Спасброски
      </h2>
      <div className="mt-4">
        <StatList items={savingThrows} />
      </div>
    </div>
  );
}
