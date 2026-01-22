import React from 'react';

type Entry = { id: string; die: string; result: number | [number, number]; time: string };

type Props = { history: Entry[] };

export const RollHistory: React.FC<Props> = ({ history }) => {
  if (!history.length) return <div className="text-slate-400">No rolls yet</div>;

  return (
    <div className="flex flex-col gap-2">
      {history.map((h) => (
        <div key={h.id} className="flex items-center justify-between rounded-md bg-white/3 px-3 py-2">
          <div>
            <div className="font-medium text-white">{h.die}</div>
            <div className="text-xs text-slate-300">{h.time}</div>
          </div>
          <div className="font-mono text-lg text-white">
            {Array.isArray(h.result) ? `${h.result[0] === 0 ? '00' : String(h.result[0])} + ${h.result[1]}` : h.result}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RollHistory;
