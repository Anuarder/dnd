import { useMemo, useState } from 'react';
import { SPELLS, CANTRIP_LIMIT, LEVEL1_LIMIT } from './spells';
import SpellSection from './SpellSection';

type Props = {
  onNext?: (payload?: { spells: string[] }) => void;
};

export function SeventhStepForm({ onNext }: Props) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'cantrips' | 'level1'>('all');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const cantrips = useMemo(() => SPELLS.filter((s) => s.level === 0), []);
  const level1 = useMemo(() => SPELLS.filter((s) => s.level === 1), []);

  const filteredCantrips = useMemo(() => {
    return cantrips.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [cantrips, query]);

  const filteredLevel1 = useMemo(() => {
    return level1.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [level1, query]);

  const cantripsSelected = useMemo(() => Object.entries(selected).filter(([id, v]) => v && cantrips.some((c) => c.id === id)).length, [selected, cantrips]);
  const level1Selected = useMemo(() => Object.entries(selected).filter(([id, v]) => v && level1.some((c) => c.id === id)).length, [selected, level1]);

  function toggle(id: string, level: number) {
    setSelected((prev) => {
      const isSelected = !!prev[id];
      if (isSelected) return { ...prev, [id]: false };
      // enforce per-level limits
      if (level === 0 && cantripsSelected >= CANTRIP_LIMIT) return prev;
      if (level === 1 && level1Selected >= LEVEL1_LIMIT) return prev;
      return { ...prev, [id]: true };
    });
  }

  function handleNext() {
    const picks = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    onNext?.({ spells: picks });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <input
          placeholder="Search spells by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-white"
        />
      </div>

      <div className="flex gap-2">
        <button className={`rounded-full px-3 py-1 ${tab === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-white'}`} onClick={() => setTab('all')}>All</button>
        <button className={`rounded-full px-3 py-1 ${tab === 'cantrips' ? 'bg-primary text-white' : 'bg-white/5 text-white'}`} onClick={() => setTab('cantrips')}>Cantrips</button>
        <button className={`rounded-full px-3 py-1 ${tab === 'level1' ? 'bg-primary text-white' : 'bg-white/5 text-white'}`} onClick={() => setTab('level1')}>Level 1</button>
      </div>

      <div className="flex gap-4">
        <div className="text-sm text-slate-400">Cantrips {cantripsSelected} from {CANTRIP_LIMIT}</div>
        <div className="text-sm text-slate-400">Level 1 {level1Selected} from {LEVEL1_LIMIT}</div>
      </div>

      <div className="space-y-4">
        {(tab === 'all' || tab === 'cantrips') && (
          <SpellSection title="Cantrips" spells={filteredCantrips} selected={selected} toggle={(id) => toggle(id, 0)} />
        )}

        {(tab === 'all' || tab === 'level1') && (
          <SpellSection title="Level 1" spells={filteredLevel1} selected={selected} toggle={(id) => toggle(id, 1)} />
        )}
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

export default SeventhStepForm;
