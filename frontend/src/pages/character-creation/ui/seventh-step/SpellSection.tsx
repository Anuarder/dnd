import SpellItem from './SpellItem';
import { Spell } from './spells';

type Props = {
  title: string;
  spells: Spell[];
  selected: Record<string, boolean>;
  toggle: (id: string) => void;
  disabledIds?: Record<string, boolean>;
};

export function SpellSection({ title, spells, selected, toggle, disabledIds }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="grid gap-2">
        {spells.map((sp) => (
          <SpellItem
            key={sp.id}
            id={sp.id}
            name={sp.name}
            school={sp.school}
            level={sp.level}
            description={sp.description}
            checked={!!selected[sp.id]}
            disabled={!!(disabledIds && disabledIds[sp.id])}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  );
}

export default SpellSection;
