import { useState } from 'react';
import { User, Clover, Crown, Swords } from 'lucide-react';
import RadioClass from './RadioClass';

type Race = {
  id: string;
  name: string;
  description: string;
  bonuses: string[];
  icon: React.ReactNode;
};

const races: Race[] = [
  { id: 'human', name: 'Human', description: 'Versatile and ambitious', bonuses: ['+1 to all abilities'], icon: <User size={18} /> },
  { id: 'elf', name: 'Elf', description: 'Graceful and perceptive', bonuses: ['+2 Dexterity'], icon: <Crown size={18} /> },
  { id: 'dwarf', name: 'Dwarf', description: 'Stout and hardy', bonuses: ['+2 Constitution'], icon: <Swords size={18} /> },
  { id: 'halfling', name: 'Halfling', description: 'Lucky and nimble', bonuses: ['+2 Dexterity'], icon: <Clover size={18} /> },
];

export function SecondStepForm({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string>(races[0]?.id ?? '');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-white text-left">Choose your race</h2>

      <div className="grid gap-3">
        {races.map((r) => (
          <RadioClass
            key={r.id}
            name="race"
            value={r.id}
            label={r.name}
            description={r.description}
            bonuses={r.bonuses}
            selected={selected === r.id}
            onSelect={() => setSelected(r.id)}
            icon={r.icon}
          />
        ))}

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onNext()}
            className="bg-primary active:bg-primary/90 flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondStepForm;
