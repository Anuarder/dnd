import React from 'react';

type RadioClassProps = {
  name?: string;
  value: string;
  label: string;
  description?: string;
  bonuses?: string[];
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
};

export function RadioClass({
  name,
  value,
  label,
  description,
  bonuses,
  selected,
  onSelect,
  icon,
}: RadioClassProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex items-center gap-4 rounded-[12px] bg-transparent p-3 focus:outline-none ${
        selected ? 'border-primary text-primary border' : 'border border-white/10 text-slate-300'
      }`}
    >
      {/* radio/icon area */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/3">
        {icon}
      </div>

      {/* name + description */}
      <div className="flex-1 text-left">
        <div className={`font-medium ${selected ? 'text-primary' : 'text-white'}`}>{label}</div>
        {description && <div className="mt-1 text-xs text-slate-400">{description}</div>}
      </div>

      {/* bonuses */}
      <div className="ml-2">
        <div className="rounded bg-white/6 px-2 py-1 text-xs text-slate-200">
          {bonuses?.join(', ') ?? ''}
        </div>
      </div>

      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        readOnly
      />
    </button>
  );
}

export default RadioClass;
