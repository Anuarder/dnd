import { type ReactElement } from 'react';

export function CombatPanel({
  features,
  speed,
  proficiencyBonus,
}: {
  features: Array<{ name: string; uses?: { current: number; max: number }; description?: string }>;
  speed: number;
  proficiencyBonus: number;
}): ReactElement {
  return (
    <div className="border-white/10 bg-white/5 rounded-xl border p-5 shadow-lg">
      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Классовые способности
      </h2>
      <div className="mt-4 space-y-3">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="rounded-lg border border-white/5 bg-white/5 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white">{feature.name}</span>
              {feature.uses && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  {feature.uses.current}/{feature.uses.max}
                </span>
              )}
            </div>
            {feature.description && (
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="my-5 h-px w-full bg-white/5" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
          <div className="text-xs text-gray-400">Скорость</div>
          <div className="mt-2 text-xl font-semibold text-white">{speed} фт</div>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
          <div className="text-xs text-gray-400">Бонус мастерства</div>
          <div className="mt-2 text-xl font-semibold text-white">+{proficiencyBonus}</div>
        </div>
      </div>
    </div>
  );
}
