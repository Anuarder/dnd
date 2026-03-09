import { type ReactElement, useState } from 'react';

type ChangeType = 'Player Edit' | 'DM Override' | 'Rest' | 'Combat';

interface ChangeLogEntry {
  id: string;
  timestamp: string;
  changed_by: string;
  field: string;
  from: string;
  to: string;
  type: ChangeType;
}

const MOCK_CHANGE_LOG: ChangeLogEntry[] = [
  { id: '1', timestamp: '2026-03-09 18:05', changed_by: 'DM (Dana)', field: 'HP', from: '45', to: '32', type: 'DM Override' },
  { id: '2', timestamp: '2026-03-09 18:02', changed_by: 'You', field: 'HP', from: '32', to: '45', type: 'Rest' },
  { id: '3', timestamp: '2026-03-09 17:55', changed_by: 'DM (Dana)', field: 'Conditions', from: 'None', to: 'Poisoned', type: 'DM Override' },
  { id: '4', timestamp: '2026-03-09 17:40', changed_by: 'You', field: 'HP', from: '42', to: '32', type: 'Combat' },
  { id: '5', timestamp: '2026-03-09 17:30', changed_by: 'DM (Dana)', field: 'Strength', from: '14', to: '16', type: 'DM Override' },
  { id: '6', timestamp: '2026-03-08 20:10', changed_by: 'You', field: 'Spell Slots L1', from: '4/4', to: '2/4', type: 'Player Edit' },
  { id: '7', timestamp: '2026-03-08 20:00', changed_by: 'You', field: 'HP', from: '28', to: '48', type: 'Rest' },
  { id: '8', timestamp: '2026-03-08 19:45', changed_by: 'DM (Dana)', field: 'Temp HP', from: '0', to: '5', type: 'DM Override' },
  { id: '9', timestamp: '2026-03-08 19:30', changed_by: 'You', field: 'HP', from: '45', to: '28', type: 'Combat' },
  { id: '10', timestamp: '2026-03-08 19:00', changed_by: 'You', field: 'AC', from: '16', to: '18', type: 'Player Edit' },
  { id: '11', timestamp: '2026-03-07 15:20', changed_by: 'You', field: 'Level', from: '4', to: '5', type: 'Player Edit' },
  { id: '12', timestamp: '2026-03-06 21:00', changed_by: 'You', field: 'HP', from: '20', to: '45', type: 'Rest' },
];

const CHANGE_TYPE_COLORS: Record<ChangeType, string> = {
  'Player Edit': 'bg-blue-500/20 text-blue-300',
  'DM Override': 'bg-orange-500/20 text-orange-300',
  'Rest': 'bg-green-500/20 text-green-300',
  'Combat': 'bg-red-500/20 text-red-300',
};

const ALL_TYPES: Array<ChangeType | 'All'> = ['All', 'Player Edit', 'DM Override', 'Rest', 'Combat'];

export function HistoryPanel(): ReactElement {
  const [filter, setFilter] = useState<ChangeType | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = MOCK_CHANGE_LOG.filter(
    (entry) => filter === 'All' || entry.type === filter
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === type
                ? 'bg-primary text-white'
                : 'bg-white/10 text-gray-400 active:bg-white/20'
            }`}
            onClick={() => {
              setFilter(type as ChangeType | 'All');
              setVisibleCount(8);
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-2">
        {visible.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500">{entry.timestamp}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CHANGE_TYPE_COLORS[entry.type]}`}>
                {entry.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{entry.field}</span>
              <span className="text-sm text-gray-400">
                <span className="text-red-400">{entry.from}</span>
                <span className="text-gray-600"> → </span>
                <span className="text-green-400">{entry.to}</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">By {entry.changed_by}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="w-full rounded-xl border border-white/10 py-3 text-sm text-gray-400 active:bg-white/5"
          onClick={() => setVisibleCount((n) => n + 8)}
        >
          Load more
        </button>
      )}

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No history entries.</p>
      )}
    </div>
  );
}
