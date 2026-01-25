import { useMemo, useState } from 'react';

import SpellSection from './SpellSection';
import { CANTRIP_LIMIT, LEVEL1_LIMIT, SPELLS } from './spells';

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

  const cantripsSelected = useMemo(
    () =>
      Object.entries(selected).filter(([id, v]) => v && cantrips.some((c) => c.id === id)).length,
    [selected, cantrips]
  );
  const level1Selected = useMemo(
    () => Object.entries(selected).filter(([id, v]) => v && level1.some((c) => c.id === id)).length,
    [selected, level1]
  );

  // compute which ids should be disabled (not selectable) because the level limit is reached
  const disabledIds = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (cantripsSelected >= CANTRIP_LIMIT) {
      cantrips.forEach((c) => {
        if (!selected[c.id]) {
          map[c.id] = true;
        }
      });
    }
    if (level1Selected >= LEVEL1_LIMIT) {
      level1.forEach((c) => {
        if (!selected[c.id]) {
          map[c.id] = true;
        }
      });
    }
    return map;
  }, [cantrips, level1, cantripsSelected, level1Selected, selected]);

  function toggle(id: string) {
    setSelected((prev) => {
      const isSelected = !!prev[id];
      if (isSelected) {
        return { ...prev, [id]: false };
      }
      // if disabled by limits, ignore
      const isDisabled = disabledIds[id];
      if (isDisabled) {
        return prev;
      }
      return { ...prev, [id]: true };
    });
  }

  function handleNext() {
    const picks = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    onNext?.({ spells: picks });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <input
          placeholder="Search spells by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[16px] border border-white/10 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(127,19,236,0.2) 0%, rgba(147,51,234,0.2) 100%)',
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          className={`rounded-full px-3 py-1 ${tab === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-white'}`}
          onClick={() => setTab('all')}
        >
          All
        </button>
        <button
          className={`rounded-full px-3 py-1 ${tab === 'cantrips' ? 'bg-primary text-white' : 'bg-white/5 text-white'}`}
          onClick={() => setTab('cantrips')}
        >
          Cantrips
        </button>
        <button
          className={`rounded-full px-3 py-1 ${tab === 'level1' ? 'bg-primary text-white' : 'bg-white/5 text-white'}`}
          onClick={() => setTab('level1')}
        >
          Level 1
        </button>
      </div>

      <div className="flex gap-4">
        <div className="text-sm text-slate-400">
          Cantrips {cantripsSelected} from {CANTRIP_LIMIT}
        </div>
        <div className="text-sm text-slate-400">
          Level 1 {level1Selected} from {LEVEL1_LIMIT}
        </div>
      </div>

      <div className="space-y-4 pb-28">
        {(tab === 'all' || tab === 'cantrips') && (
          <SpellSection
            title="Cantrips"
            spells={filteredCantrips}
            selected={selected}
            toggle={(id) => toggle(id)}
            disabledIds={disabledIds}
          />
        )}

        {(tab === 'all' || tab === 'level1') && (
          <SpellSection
            title="Level 1"
            spells={filteredLevel1}
            selected={selected}
            toggle={(id) => toggle(id)}
            disabledIds={disabledIds}
          />
        )}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <div className="pointer-events-auto w-full max-w-[400px] px-4">
          <button
            type="button"
            onClick={handleNext}
            disabled={Object.values(selected).filter(Boolean).length === 0}
            aria-disabled={Object.values(selected).filter(Boolean).length === 0}
            className={
              `relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium shadow-lg duration-300 active:scale-95 ` +
              (Object.values(selected).filter(Boolean).length === 0
                ? 'cursor-not-allowed bg-purple-950 text-slate-400'
                : 'bg-primary active:bg-primary/90 text-white')
            }
          >
            <span>Finish</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeventhStepForm;
