import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
  ariaLabel?: string;
};

export const MaxPlayersSelect: React.FC<Props> = ({ value, onChange, options = [2, 3, 4, 5, 6, 7, 8], ariaLabel = 'Max players' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="sr-only">{ariaLabel}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 w-full flex items-center justify-between rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-left text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value} players</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-5000 mt-2 max-h-44 overflow-auto rounded-lg border border-white/6 bg-dark-primary p-1">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                onChange(n);
                setOpen(false);
              }}
              className={
                `block w-full text-left px-3 py-2 text-white hover:bg-white/5 ` + (n === value ? 'bg-white/5 font-semibold' : '')
              }
            >
              {n} players
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaxPlayersSelect;
