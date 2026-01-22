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

export function SecondStepForm({ onNext }: { onNext: (payload?: { race: string }) => void }) {
  const [selected, setSelected] = useState<string>(races[0]?.id ?? '');
  const isNextDisabled = !selected;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-semibold text-white text-left">Choose your race</h2>

      <div className="grid gap-3 pb-28">
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
      </div>

      <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[400px] px-4 pointer-events-auto">
          <button
            type="button"
            onClick={() => onNext({ race: selected })}
            disabled={isNextDisabled}
            aria-disabled={isNextDisabled}
            className={
              `relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium shadow-lg duration-300 active:scale-95 ` +
              (isNextDisabled
                ? 'bg-primary/40 text-white cursor-not-allowed opacity-60'
                : 'bg-primary text-white active:bg-primary/90')
            }
          >
            <span>Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondStepForm;
