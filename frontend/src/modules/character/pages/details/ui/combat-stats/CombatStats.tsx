import { Heart, Shield, Zap } from 'lucide-react';
import { type ReactElement } from 'react';

export function CombatStats({
  hp,
  ac,
  initiative,
}: {
  hp: { current: number; max: number; temp: number };
  ac: number;
  initiative: number;
}): ReactElement {
  const hpPercent = Math.min(100, Math.max(0, (hp.current / hp.max) * 100));
  const hpText = hp.temp > 0 ? `${hp.current}/${hp.max} (+${hp.temp})` : `${hp.current}/${hp.max}`;

  return (
    <div className="grid gap-4 grid-cols-3">
      <div className="border-white/10 bg-white/5 rounded-xl border p-4 shadow-lg">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
          <Heart className="h-5 w-5 text-red-400 md:h-7 md:w-7" />
          ХП
        </div>
        <div className="mt-2 text-2xl font-semibold text-white text-center">{hpText}</div>
        <div className="mt-3 h-2 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-red-500 transition-all"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      <div className="border-white/10 bg-white/5 rounded-xl border p-4 shadow-lg">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
          <Shield className="h-5 w-5 text-blue-400 md:h-7 md:w-7" />
          КБ
        </div>
        <div className="mt-2 text-2xl font-semibold text-white text-center">{ac}</div>
      </div>

      <div className="border-white/10 bg-white/5 rounded-xl border p-4 shadow-lg">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
          <Zap className="h-5 w-5 text-yellow-400 md:h-7 md:w-7" />
          Инициатива
        </div>
        <div className="mt-2 text-2xl font-semibold text-white text-center">
          {initiative >= 0 ? `+${initiative}` : initiative}
        </div>
      </div>
    </div>
  );
}
