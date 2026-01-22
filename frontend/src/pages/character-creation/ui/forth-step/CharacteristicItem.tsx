type CharacteristicItemProps = {
  name: string;
  description?: string;
  value: number;
  bonus: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disableIncrement?: boolean;
  disableDecrement?: boolean;
};

export function CharacteristicItem({
  name,
  description,
  value,
  bonus,
  onIncrement,
  onDecrement,
  disableIncrement,
  disableDecrement,
}: CharacteristicItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-[12px] border border-white/10 bg-transparent">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/3 text-white">{name.charAt(0)}</div>
        <div className="text-left">
          <div className="font-medium text-white">{name}</div>
          {description && <div className="text-xs text-slate-400">{description}</div>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={disableDecrement}
          className="h-9 w-9 flex items-center justify-center rounded-md bg-white/6 text-white disabled:opacity-40"
        >
          -
        </button>

        <div className="flex flex-col items-center min-w-[56px]">
          <div className="text-lg font-medium text-white">{value}</div>
          <div className="text-xs text-slate-300">{bonus >= 0 ? `+${bonus}` : `${bonus}`}</div>
        </div>

        <button
          type="button"
          onClick={onIncrement}
          disabled={disableIncrement}
          className="h-9 w-9 flex items-center justify-center rounded-md bg-primary text-white disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CharacteristicItem;
