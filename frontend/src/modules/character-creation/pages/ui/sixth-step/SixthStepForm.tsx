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
      if (!already && selectedCount >= maxSelection) return prev; // don't allow more than max
      return { ...prev, [id]: !already };
    });
  }

  function handleNext() {
    const picks = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    onNext?.({ skills: picks });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm text-slate-400">Choose up to {maxSelection} skills</div>
        <div className="text-2xl font-bold text-white">Skills</div>
      </div>

      <div className="grid gap-2">
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

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="bg-primary active:bg-primary/90 flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-white"
        >
          Finish
        </button>
      </div>
    </div>
  );
}

export default SixthStepForm;
