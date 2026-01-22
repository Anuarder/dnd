import React, { useState } from 'react';
import DicePicker from './DicePicker';
import DiceDisplay from './DiceDisplay';
import RollHistory from './RollHistory';

type HistoryEntry = { id: string; die: string; result: number | [number, number]; time: string };

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export const LobbyRoll: React.FC = () => {
  const [selected, setSelected] = useState<string>('1d20');
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | [number, number] | undefined>(undefined);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  function doRoll() {
    if (rolling) return;
    setRolling(true);
    setResult(undefined);

    setTimeout(() => {
      let res: number | [number, number];
      if (selected === '1d100') {
        const ones = rollDie(10) - 1;
        const tens = (rollDie(10) - 1) * 10;
        res = [tens, ones];
      } else {
        const match = selected.match(/1d(\d+)/);
        const sides = match ? Number(match[1]) : 20;
        res = rollDie(sides);
      }

      setResult(res);
      const entry: HistoryEntry = {
        id: String(Date.now()),
        die: selected,
        result: res,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((h) => [entry, ...h]);
      setRolling(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <DiceDisplay die={selected} rolling={rolling} result={result} onRoll={doRoll} />
        <div className="w-full max-w-[420px]">
          <DicePicker
            value={selected}
            onChange={(v) => {
              setSelected(v);
              setResult(undefined);
            }}
          />
        </div>
      </div>

      <div className="">
        <h3 className="mb-3 text-lg font-semibold">Roll history</h3>
        <RollHistory history={history} />
      </div>
    </div>
  );
};

export default LobbyRoll;
