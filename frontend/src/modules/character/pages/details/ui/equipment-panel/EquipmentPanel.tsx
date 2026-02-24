import { type ReactElement } from 'react';

export function EquipmentPanel({
  equipment,
}: {
  equipment: string[];
}): ReactElement {
  return (
    <div className="bg-surface-dark rounded-xl border border-white/5 p-5 shadow-lg">
      <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Снаряжение
      </h2>
      <div className="mt-4 space-y-2">
        {equipment.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
