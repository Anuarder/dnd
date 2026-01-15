// React import not required directly in newer JSX runtimes
import { Check } from 'lucide-react';

type Props = {
  id: string;
  name: string;
  school: string;
  level: number;
  checked: boolean;
  disabled?: boolean;
  onToggle: (id: string) => void;
};

export function SpellItem({ id, name, school, level, checked, disabled, onToggle }: Props) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 transition ${
        checked ? 'bg-primary/20' : 'bg-white/5'
      } ${disabled && !checked ? 'opacity-60 cursor-not-allowed' : ''}`}
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
            checked ? 'bg-primary border-primary' : 'bg-transparent border-white/20'
          }`}
        >
          {checked ? <Check size={14} className="text-white" /> : null}
        </span>

        <div className="flex flex-col text-left">
          <div className="font-medium text-white">{name}</div>
          <div className="text-sm text-slate-400">{school} • {level === 0 ? 'Cantrip' : `Level ${level}`}</div>
        </div>
      </div>
    </label>
  );
}

export default SpellItem;
