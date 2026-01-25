import { Check } from 'lucide-react';

const ABILITIES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

type Props = {
  id: string;
  name: string;
  ability: string; // short code like 'str'
  bonus: number;
  checked: boolean;
  disabled?: boolean;
  onToggle: (id: string) => void;
};

export function SkillItem({ id, name, ability, bonus, checked, disabled, onToggle }: Props) {
  const abilityLabel = `${ABILITIES[ability] ?? ability} - ${ability.toUpperCase()}`;

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 transition ${
        checked ? 'bg-primary/20' : 'bg-white/5'
      } ${disabled && !checked ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={() => onToggle(id)}
          className="sr-only"
        />

        <span
          aria-hidden
          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border transition-colors ${
            checked ? 'bg-primary border-primary' : 'border-white/20 bg-transparent'
          }`}
        >
          {checked ? <Check size={14} className="text-white" /> : null}
        </span>

        <div className="flex flex-col text-left">
          <div className="font-medium text-white">{name}</div>
          <div className="text-sm text-slate-400">{abilityLabel}</div>
        </div>
      </div>

      <div className="text-sm font-medium text-white">{bonus >= 0 ? `+${bonus}` : bonus}</div>
    </label>
  );
}

export default SkillItem;
