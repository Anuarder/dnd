import SpellItem from './SpellItem';
import { Spell } from './spells';

type Props = {
  title: string;
  spells: Spell[];
  selected: Record<string, boolean>;
  toggle: (id: string) => void;
  limits?: { [level: number]: number };
};

export function SpellSection({ title, spells, selected, toggle }: Props) {
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
            checked={!!selected[sp.id]}
            disabled={false}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  );
}

export default SpellSection;
