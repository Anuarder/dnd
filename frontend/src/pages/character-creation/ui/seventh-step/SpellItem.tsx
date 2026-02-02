// React import not required directly in newer JSX runtimes
import {
  BookOpen,
  ChevronDown,
  Cloud,
  Eye,
  Feather,
  Search,
  Shield,
  Skull,
  Star,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

type Props = {
  id: string;
  name: string;
  school: string;
  level: number;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: (id: string) => void;
};

export function SpellItem({
  id,
  name,
  school,
  level,
  description,
  checked,
  disabled,
  onToggle,
}: Props) {
  const [open, setOpen] = useState(false);

  // pick an icon based on spell school
  const Icon = (() => {
    switch ((school || '').toLowerCase()) {
      case 'evocation':
        return Zap;
      case 'conjuration':
        return Cloud;
      case 'transmutation':
        return Feather;
      case 'illusion':
        return Eye;
      case 'necromancy':
        return Skull;
      case 'divination':
        return Search;
      case 'abjuration':
        return Shield;
      case 'enchantment':
        return Star;
      default:
        return level === 0 ? Zap : BookOpen;
    }
  })();

  function onLabelClick() {
    if (disabled && !checked) {
      return;
    }
    onToggle(id);
  }

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 transition ${
          checked ? 'bg-primary/20' : 'bg-white/5'
        } ${disabled && !checked ? 'cursor-not-allowed opacity-60' : ''}`}
        onClick={onLabelClick}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded ${checked ? 'bg-primary' : 'bg-white/5'}`}
          >
            <Icon size={16} className={checked ? 'text-white' : 'text-white'} />
          </span>

          <div className="flex flex-col text-left">
            <div className="font-medium text-white">{name}</div>
            <div className="text-sm text-slate-400">
              {school} • {level === 0 ? 'Cantrip' : `Level ${level}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-expanded={open}
            className={`rounded p-1 transition-transform duration-200 hover:bg-white/5 ${open ? 'rotate-180' : 'rotate-0'}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
          >
            <ChevronDown size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div
        className={`mt-2 overflow-hidden transition-all duration-200 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {description ? (
          <div className="rounded-md border border-white/6 bg-white/3 p-3 text-sm text-slate-200">
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SpellItem;
