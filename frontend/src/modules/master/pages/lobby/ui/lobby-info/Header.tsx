import React, { useState } from 'react';
import { Copy, Users } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  playersCount: number;
  maxPlayers: number;
  bannerUrl?: string | null;
  code: string;
};

export const Header: React.FC<Props> = ({ title, description, playersCount, maxPlayers, bannerUrl, code }) => {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div
        className="h-48 w-full bg-cover bg-center"
        style={{
          backgroundImage: bannerUrl
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bannerUrl})`
            : 'linear-gradient(90deg, rgba(127,19,236,0.12), rgba(147,51,234,0.12))',
        }}
      />

      <div className="absolute inset-0 flex items-start justify-between p-4">
        <div className="flex flex-col gap-1 text-left text-white">
          <div className="inline-flex items-center gap-2 rounded-md bg-black/30 px-3 py-1">
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <p className="max-w-[60%] text-sm text-slate-200">{description}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex items-center gap-2 rounded-md bg-black/40 px-3 py-1 text-sm text-slate-100">
            <Users size={14} />
            <span>{playersCount}/{maxPlayers}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-md bg-black/40 px-3 py-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-white hover:bg-white/5"
            >
              <Copy size={14} />
              <span className="font-mono text-xs">{code}</span>
            </button>
            <span className={`text-xs ${copied ? 'text-green-400' : 'text-slate-300'}`}>{copied ? 'Copied' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
