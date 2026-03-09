import { ChevronDown, ChevronUp, Coins, Plus, Trash2 } from 'lucide-react';
import { type ReactElement, useState } from 'react';

interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description?: string;
  equipped: boolean;
}

const MOCK_EQUIPMENT: EquipmentItem[] = [
  { id: '1', name: 'Longsword +1', quantity: 1, weight: 3, equipped: true, description: 'A finely crafted sword with a magical enhancement.' },
  { id: '2', name: 'Chain Mail', quantity: 1, weight: 55, equipped: true, description: 'Heavy interlocked rings provide excellent protection.' },
  { id: '3', name: 'Hemp Rope (50ft)', quantity: 1, weight: 10, equipped: false },
  { id: '4', name: 'Torches', quantity: 5, weight: 1, equipped: false },
  { id: '5', name: 'Rations (1 day)', quantity: 3, weight: 2, description: 'Dried food and hardtack.', equipped: false },
  { id: '6', name: 'Healing Potion', quantity: 2, weight: 0.5, description: 'Restores 2d4+2 HP.', equipped: false },
];

const CARRYING_CAPACITY = 120; // lbs

interface MoneyState {
  gold: number;
  silver: number;
  copper: number;
}

function MoneyCounter({
  label,
  color,
  value,
  onChange,
}: {
  label: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`min-w-14 text-sm font-semibold ${color}`}>{label}</span>
      <div className="flex flex-1 items-center justify-end gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white active:bg-white/20"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          −
        </button>
        <span className="min-w-10 text-center text-base font-bold text-white">{value}</span>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white active:bg-white/20"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function EquipmentPanel(): ReactElement {
  const [items, setItems] = useState<EquipmentItem[]>(MOCK_EQUIPMENT);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('1');
  const [newWeight, setNewWeight] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [money, setMoney] = useState<MoneyState>({ gold: 45, silver: 12, copper: 30 });

  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const weightPct = Math.min(100, Math.round((totalWeight / CARRYING_CAPACITY) * 100));
  const weightColor = weightPct > 80 ? 'bg-red-500' : weightPct > 60 ? 'bg-yellow-500' : 'bg-green-500';

  function handleToggleEquipped(id: string) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, equipped: !item.equipped } : item));
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: newName.trim(),
        quantity: Number(newQty) || 1,
        weight: Number(newWeight) || 0,
        description: newDesc.trim() || undefined,
        equipped: false,
      },
    ]);
    setNewName('');
    setNewQty('1');
    setNewWeight('');
    setNewDesc('');
    setShowAddForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Weight bar */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Carrying weight</span>
          <span className="font-medium text-white">
            {totalWeight} / {CARRYING_CAPACITY} lbs
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className={`h-full rounded-full transition-all ${weightColor}`} style={{ width: `${weightPct}%` }} />
        </div>
      </div>

      {/* Item list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Items</p>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-primary active:opacity-70"
            onClick={() => setShowAddForm((v) => !v)}
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>

        {showAddForm && (
          <form className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2" onSubmit={handleAddItem}>
            <input
              type="text"
              value={newName}
              placeholder="Item name *"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newQty}
                placeholder="Qty"
                min={1}
                className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                onChange={(e) => setNewQty(e.target.value)}
              />
              <input
                type="number"
                value={newWeight}
                placeholder="Weight (lbs)"
                min={0}
                step={0.5}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            <input
              type="text"
              value={newDesc}
              placeholder="Description (optional)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm text-gray-400 active:bg-white/5"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white active:bg-primary/80"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-3">
              {/* Equipped checkbox */}
              <button
                type="button"
                className={`flex size-5 shrink-0 items-center justify-center rounded border ${
                  item.equipped ? 'border-primary bg-primary text-white' : 'border-white/20 bg-transparent'
                }`}
                onClick={() => handleToggleEquipped(item.id)}
              >
                {item.equipped && <span className="text-xs">✓</span>}
              </button>

              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-white">{item.name}</span>
                <span className="text-xs text-gray-500">
                  Qty: {item.quantity} · {item.weight * item.quantity} lbs
                </span>
              </span>

              <button
                type="button"
                className="flex size-8 items-center justify-center text-gray-500 active:text-white"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                {expandedId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedId === item.id && (
              <div className="border-t border-white/5 px-3 py-3 space-y-2">
                {item.description && (
                  <p className="text-sm text-gray-400">{item.description}</p>
                )}
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-red-400 active:opacity-70"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={12} />
                  Remove item
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Money */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Coins size={14} className="text-yellow-400" />
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Money</p>
        </div>
        <div className="space-y-3">
          <MoneyCounter
            label="Gold"
            color="text-yellow-400"
            value={money.gold}
            onChange={(v) => setMoney((m) => ({ ...m, gold: v }))}
          />
          <MoneyCounter
            label="Silver"
            color="text-gray-300"
            value={money.silver}
            onChange={(v) => setMoney((m) => ({ ...m, silver: v }))}
          />
          <MoneyCounter
            label="Copper"
            color="text-orange-400"
            value={money.copper}
            onChange={(v) => setMoney((m) => ({ ...m, copper: v }))}
          />
        </div>
      </div>
    </div>
  );
}
