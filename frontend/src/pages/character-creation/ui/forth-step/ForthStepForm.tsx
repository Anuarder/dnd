import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import CharacteristicItem from './CharacteristicItem';

type Stat = {
  key: string;
  name: string;
  description?: string;
  value: number;
};

const INITIAL_VALUE = 8;
const MIN_VALUE = 1;
const MAX_VALUE = 20;
const TOTAL_POINTS = 27;

const initialStats: Stat[] = [
  { key: 'str', name: 'Strength', description: 'Physical power', value: INITIAL_VALUE },
  { key: 'dex', name: 'Dexterity', description: 'Agility and reflexes', value: INITIAL_VALUE },
  { key: 'con', name: 'Constitution', description: 'Health and stamina', value: INITIAL_VALUE },
  { key: 'int', name: 'Intelligence', description: 'Reason and memory', value: INITIAL_VALUE },
  { key: 'wis', name: 'Wisdom', description: 'Perception and will', value: INITIAL_VALUE },
  { key: 'cha', name: 'Charisma', description: 'Force of personality', value: INITIAL_VALUE },
];

function computeBonus(value: number) {
  return Math.floor(value / 2) - 5;
}

export function ForthStepForm({
  onNext,
}: {
  onNext?: (payload?: { stats: Record<string, number> }) => void;
}) {
  const [stats, setStats] = useState<Record<string, number>>(
    Object.fromEntries(initialStats.map((s) => [s.key, s.value]))
  );

  const defaultTotal = INITIAL_VALUE * initialStats.length;

  const pointsSpent = useMemo(() => {
    const sum = Object.values(stats).reduce((a, b) => a + b, 0);
    return sum - defaultTotal;
  }, [stats]);

  const pointsRemaining = TOTAL_POINTS - pointsSpent;

  function increment(key: string) {
    setStats((prev) => {
      const curr = prev[key] ?? INITIAL_VALUE;
      if (curr >= MAX_VALUE || pointsRemaining <= 0) {
        return prev;
      }
      return { ...prev, [key]: curr + 1 };
    });
  }

  function decrement(key: string) {
    setStats((prev) => {
      const curr = prev[key] ?? INITIAL_VALUE;
      if (curr <= MIN_VALUE) {
        return prev;
      }
      return { ...prev, [key]: curr - 1 };
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">Points remaining</div>
          <div className="text-2xl font-bold text-white">{pointsRemaining}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-400">Budget</div>
          <div className="text-sm text-slate-300">{TOTAL_POINTS} pts</div>
        </div>
      </div>

      <div className="grid gap-3 pb-28">
        {initialStats.map((s) => {
          const val = stats[s.key] ?? INITIAL_VALUE;
          return (
            <CharacteristicItem
              key={s.key}
              name={s.name}
              description={s.description}
              value={val}
              bonus={computeBonus(val)}
              onIncrement={() => increment(s.key)}
              onDecrement={() => decrement(s.key)}
              disableIncrement={val >= MAX_VALUE || pointsRemaining <= 0}
              disableDecrement={val <= MIN_VALUE}
            />
          );
        })}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <div className="pointer-events-auto w-full max-w-[400px] px-4">
          <button
            type="button"
            onClick={() => onNext?.({ stats })}
            className={`bg-primary active:bg-primary/90 relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium text-white shadow-lg duration-300 active:scale-95`}
          >
            <span>Next</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForthStepForm;
