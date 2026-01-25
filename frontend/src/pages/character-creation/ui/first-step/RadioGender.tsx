import React from 'react';

type RadioGenderProps = {
  name?: string;
  value: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
};

export function RadioGender({ name, value, label, selected, onSelect, icon }: RadioGenderProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 rounded-[16px] bg-transparent p-3 focus:outline-none ${
        selected ? 'border-primary text-primary border' : 'border border-white/10 text-slate-400'
      }`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className={`text-sm ${selected ? 'text-primary' : 'text-slate-400'}`}>{label}</span>

      {/* Hidden native input for forms/accessibility */}
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

export default RadioGender;
