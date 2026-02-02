import { useMemo, useState } from 'react';

import SkillItem from './SkillItem';

type Props = {
  stats: Record<string, number>;
  onNext?: (payload?: { skills: string[] }) => void;
  maxSelection?: number;
};

const SKILLS: { id: string; name: string; ability: string }[] = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'animal_handling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'sleight_of_hand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
];

function computeBonus(value: number) {
  return Math.floor(value / 2) - 5;
}

export function SixthStepForm({ stats, onNext, maxSelection = 4 }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);

  function toggle(id: string) {
    setSelected((prev) => {
      const already = !!prev[id];
      if (!already && selectedCount >= maxSelection) {
        return prev;
      }
      return { ...prev, [id]: !already };
    });
  }

  function handleNext() {
    const picks = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    onNext?.({ skills: picks });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm text-slate-400">Choose up to {maxSelection} skills</div>
        <div className="text-2xl font-bold text-white">Skills</div>
      </div>

      <div className="grid gap-2 pb-28">
        {SKILLS.map((s) => {
          const abilityValue = stats[s.ability] ?? 8;
          const bonus = computeBonus(abilityValue);
          const isSelected = !!selected[s.id];
          const disabled = !isSelected && selectedCount >= maxSelection;

          return (
            <SkillItem
              key={s.id}
              id={s.id}
              name={s.name}
              ability={s.ability}
              bonus={bonus}
              checked={isSelected}
              disabled={disabled}
              onToggle={toggle}
            />
          );
        })}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <div className="pointer-events-auto w-full max-w-[400px] px-4">
          <button
            type="button"
            disabled={selectedCount === 0}
            aria-disabled={selectedCount === 0}
            className={
              `relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium shadow-lg duration-300 active:scale-95 ` +
              (selectedCount === 0
                ? 'cursor-not-allowed bg-purple-950 text-slate-400'
                : 'bg-primary active:bg-primary/90 text-white')
            }
            onClick={handleNext}
          >
            <span>Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SixthStepForm;
