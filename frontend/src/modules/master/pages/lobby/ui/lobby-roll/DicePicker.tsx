import React from 'react';
import D4 from './assets/d4.svg';
import D6 from './assets/d6.svg';
import D8 from './assets/d8.svg';
import D10 from './assets/d10.svg';
import D12 from './assets/d12.svg';
import D20 from './assets/d20.svg';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const OPTIONS = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d100', '1d20'];

const DESCRIPTIONS: Record<string, string> = {
  '1d4': '1d4',
  '1d6': '1d6',
  '1d8': '1d8',
  '1d10': '1d10',
  '1d12': '1d12',
  '1d100': '1d100',
  '1d20': '1d20',
};

export const DicePicker: React.FC<Props> = ({ value, onChange }) => {
  const ICON_MAP: Record<string, string> = {
    '1d4': D4,
    '1d6': D6,
    '1d8': D8,
    '1d10': D10,
    '1d12': D12,
    '1d20': D20,
  };

  const visible = OPTIONS;

  return (
    <div className="flex justify-center gap-3 w-full flex-wrap">
      {visible.map((opt) => {
        const selected = value === opt;
        const icon = ICON_MAP[opt];
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={selected}
            aria-label={opt}
            className={`w-[30%] aspect-square w-32 rounded-md p-3 flex flex-col items-center justify-center transition-all focus:outline-none ${
              selected ? 'bg-primary ring-2 ring-primary/60 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/8'
            }`}
          >
            {opt === '1d100' ? (
              <div className="flex items-center gap-1">
                <img src={D10} alt="d100 tens" className="h-14 w-10 object-contain" style={{ filter: 'invert(1)' }} />
                <img src={D10} alt="d100 ones" className="h-14 w-10 object-contain" style={{ filter: 'invert(1)' }} />
              </div>
            ) : (
              <img src={icon} alt={DESCRIPTIONS[opt] || opt} className="h-16 w-16 object-contain" style={{ filter: 'invert(1)' }} />
            )}

            <div className="mt-2 text-xs text-center text-slate-300">{DESCRIPTIONS[opt]}</div>
          </button>
        );
      })}
    </div>
  );

};

export default DicePicker;
