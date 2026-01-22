import React from 'react';
import d4Url from './assets/d4-purple.svg';
import d6Url from './assets/d6-purple.svg';
import d8Url from './assets/d8-purple.svg';
import d10Url from './assets/d10-purple.svg';
import d12Url from './assets/d12-purple.svg';
import d20Url from './assets/d20-purple.svg';

type Props = {
  die: string;
  rolling: boolean;
  result?: number | [number, number];
  onRoll: () => void;
};

const RAW_MAP: Record<string, string> = {
  '1d4': d4Url,
  '1d6': d6Url,
  '1d8': d8Url,
  '1d10': d10Url,
  '1d12': d12Url,
  '1d20': d20Url,
};

export const DiceDisplay: React.FC<Props> = ({ die, rolling, result, onRoll }) => {
  const renderFace = () => {
    if (rolling) return <div className="text-4xl text-white font-bold">...</div>;
    if (result === undefined) return null;
    if (Array.isArray(result)) {
      return (
        <>
          <div className="text-4xl text-white font-bold w-[160px]">{`${result[0]}`}</div>
          <div className="text-4xl text-white font-bold w-[160px]">{`${result[1]}`}</div>
        </>
      );
    }
    return <div className="text-4xl text-white font-bold">{result}</div>;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={onRoll}
        disabled={rolling}
        className="w-full relative flex items-center justify-center rounded-2xl p-0 hover:scale-105 active:scale-95 bg-gradient-to-br from-purple-600/10 to-purple-400/6 overflow-hidden"
        style={{ height: 160 }}
      >
        {die === '1d100' ? (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            <img src={RAW_MAP['1d10']} className='h-full w-auto' alt="" />
            <img src={RAW_MAP['1d10']} className='h-full w-auto' alt="" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={RAW_MAP[die]} className='h-full w-auto' alt="" />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-center w-full h-full">{renderFace()}</div>
      </button>

      <div className="text-sm text-slate-300">Click the die to roll (2s animation)</div>
    </div>
  );
};

export default DiceDisplay;
