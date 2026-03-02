import { ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import type { Attributes } from '~modules/character/model/types';

interface AttributesStepProps {
  onNext: (data: { attributes: Attributes }) => void;
}

const POINT_BUY_INITIAL = 8;
const POINT_BUY_MIN = 8;
const POINT_BUY_MAX = 15;
const POINT_BUY_TOTAL = 27;

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

const ATTRIBUTE_ORDER: Array<keyof Attributes> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function AttributesStep({ onNext }: AttributesStepProps): ReactElement {
  const { t } = useTranslation('characterCreateAttributes');
  const [pointBuyValues, setPointBuyValues] = useState<Attributes>({
    str: POINT_BUY_INITIAL,
    dex: POINT_BUY_INITIAL,
    con: POINT_BUY_INITIAL,
    int: POINT_BUY_INITIAL,
    wis: POINT_BUY_INITIAL,
    cha: POINT_BUY_INITIAL,
  });

  const attributes = useMemo(() => {
    const data = t('attributes', { returnObjects: true }) as Record<keyof Attributes, { name: string; description: string }>;
    return ATTRIBUTE_ORDER.map((key) => ({
      key,
      name: data[key]?.name ?? key,
      description: data[key]?.description ?? '',
    }));
  }, [t]);

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
        toast.error(t('toast.maxTitle'), {
          description: t('toast.maxDescription', { max: POINT_BUY_MAX }),
        });
        return;
      }

      const costIncrease = current >= 13 ? 2 : 1;
      if (pointsRemaining < costIncrease) {
        toast.error(t('toast.insufficientTitle'), {
          description: t('toast.insufficientDescription'),
        });
        return;
      }

      setPointBuyValues((prev) => ({
        ...prev,
        [attrKey]: current + 1,
      }));
    },
    [pointBuyValues, pointsRemaining, t]
  );

  const decrementPointBuy = useCallback(
    (attrKey: keyof Attributes) => {
      const current = pointBuyValues[attrKey];

      if (current <= POINT_BUY_MIN) {
        toast.error(t('toast.minTitle'), {
          description: t('toast.minDescription', { min: POINT_BUY_MIN }),
        });
        return;
      }

      setPointBuyValues((prev) => ({
        ...prev,
        [attrKey]: current - 1,
      }));
    },
    [pointBuyValues, t]
  );

  function handleContinue(): void {
    toast.dismiss();
    if (pointsRemaining > 0) {
      toast.error(t('toast.incompleteTitle'), {
        description: t('toast.incompleteDescription', { count: pointsRemaining }),
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
          <span>{t('titleLine1')}</span>
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            {t('titleLine2')}
          </span>
        </h2>

        <p className="font-display mt-3 font-thin text-white/50">
          {t('description', { total: POINT_BUY_TOTAL })}
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
            <p className="text-sm text-white/60">{t('pointsRemainingLabel')}</p>
            <p className="text-2xl font-bold text-white">{pointsRemaining}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">{t('totalBudgetLabel')}</p>
            <p className="text-sm text-white/80">{t('totalBudgetValue', { total: POINT_BUY_TOTAL })}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="mt-6 space-y-3"
      >
        {attributes.map((attr, index) => {
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
                  <p className="font-display mt-1 text-xs text-white/40">
                    {t('costLabel', { cost })}
                  </p>
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
          <span>{t('continue')}</span>
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </motion.button>
    </div>
  );
}
