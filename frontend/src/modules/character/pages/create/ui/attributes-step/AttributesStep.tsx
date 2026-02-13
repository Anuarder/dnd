import { type ReactElement, useCallback, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import type { Attributes } from '~modules/character/model/types';

interface AttributesStepProps {
  onNext: (data: { attributes: Attributes }) => void;
}

const POINT_BUY_INITIAL = 8;
const POINT_BUY_MIN = 8;
const POINT_BUY_MAX = 15;
const POINT_BUY_TOTAL = 27;

const ATTRIBUTE_NAMES: { key: keyof Attributes; name: string; description: string }[] = [
  { key: 'str', name: 'Strength', description: 'Physical power' },
  { key: 'dex', name: 'Dexterity', description: 'Agility and reflexes' },
  { key: 'con', name: 'Constitution', description: 'Health and stamina' },
  { key: 'int', name: 'Intelligence', description: 'Reason and memory' },
  { key: 'wis', name: 'Wisdom', description: 'Perception and will' },
  { key: 'cha', name: 'Charisma', description: 'Force of personality' },
];

// Hoist pure calculation functions outside component (js-cache-function-results)
function calculateModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

function calculatePointCost(value: number): number {
  if (value <= 13) {
    return value - 8;
  }
  return value - 8 + (value - 13);
}

const gradientStyle = {
  backgroundImage: 'linear-gradient(152deg,rgba(127, 19, 236, 1) 18%, rgba(216, 180, 254, 1) 49%)',
};

export function AttributesStep({ onNext }: AttributesStepProps): ReactElement {
  const [pointBuyValues, setPointBuyValues] = useState<Attributes>({
    str: POINT_BUY_INITIAL,
    dex: POINT_BUY_INITIAL,
    con: POINT_BUY_INITIAL,
    int: POINT_BUY_INITIAL,
    wis: POINT_BUY_INITIAL,
    cha: POINT_BUY_INITIAL,
  });

  // Memoize expensive calculation (rerender-derived-state)
  const pointsSpent = useMemo(() => {
    return Object.values(pointBuyValues).reduce((sum, val) => {
      return sum + calculatePointCost(val);
    }, 0);
  }, [pointBuyValues]);

  const pointsRemaining = POINT_BUY_TOTAL - pointsSpent;

  const incrementPointBuy = useCallback(
    (attrKey: keyof Attributes) => {
      const current = pointBuyValues[attrKey];

      if (current >= POINT_BUY_MAX) {
        toast.error('Maximum Reached', {
          description: 'The maximum value for an attribute is 15.',
        });
        return;
      }

      const costIncrease = current >= 13 ? 2 : 1;
      if (pointsRemaining < costIncrease) {
        toast.error('Insufficient Points', {
          description: "You don't have enough points left for this increase.",
        });
        return;
      }

      setPointBuyValues((prev) => ({
        ...prev,
        [attrKey]: current + 1,
      }));
    },
    [pointBuyValues, pointsRemaining]
  );

  const decrementPointBuy = useCallback(
    (attrKey: keyof Attributes) => {
      const current = pointBuyValues[attrKey];

      if (current <= POINT_BUY_MIN) {
        toast.error('Minimum Reached', {
          description: 'The minimum value for an attribute is 8.',
        });
        return;
      }

      setPointBuyValues((prev) => ({
        ...prev,
        [attrKey]: current - 1,
      }));
    },
    [pointBuyValues]
  );

  function handleContinue(): void {
    toast.dismiss();
    if (pointsRemaining > 0) {
      toast.error('Incomplete Allocation', {
        description: `You have ${pointsRemaining} ${pointsRemaining === 1 ? 'point' : 'points'} remaining to distribute.`,
      });
      return;
    }

    onNext({ attributes: pointBuyValues });
  }

  return (
    <div className="flex max-w-full flex-1 flex-col px-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2 className="font-display flex flex-col text-3xl font-bold">
          <span>Assign Your</span>
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            Attributes
          </span>
        </h2>

        <p className="font-display mt-3 font-thin text-white/50">
          Distribute 27 points across your abilities
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Points Remaining</p>
            <p className="text-2xl font-bold text-white">{pointsRemaining}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Total Budget</p>
            <p className="text-sm text-white/80">{POINT_BUY_TOTAL} points</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="mt-6 space-y-3"
      >
        {ATTRIBUTE_NAMES.map((attr, index) => {
          const value = pointBuyValues[attr.key];
          const cost = calculatePointCost(value);

          return (
            <motion.div
              key={attr.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-white">{attr.name}</h3>
                  <p className="font-display text-xs text-white/50">{attr.description}</p>
                  <p className="font-display mt-1 text-xs text-white/40">Cost: {cost} points</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white/10 text-white transition-all duration-200 active:scale-95"
                    onClick={() => {
                      decrementPointBuy(attr.key);
                    }}
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex min-w-[60px] flex-col items-center">
                    <span className="font-display text-2xl font-bold text-white">{value}</span>
                    <span className="font-display text-xs text-white/50">
                      {calculateModifier(value) >= 0 ? '+' : ''}
                      {calculateModifier(value)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white/10 text-white transition-all duration-200 active:scale-95"
                    onClick={() => {
                      incrementPointBuy(attr.key);
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="sticky bottom-6 group bg-primary shadow-primary/30 mt-6 w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleContinue}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span>Continue</span>
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </motion.button>
    </div>
  );
}
