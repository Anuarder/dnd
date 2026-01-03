import { ReactElement } from 'react';

import Image from '~shared/assets/image.jpg';

export function SignInPage(): ReactElement {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#191022] p-4 text-center text-pretty text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="glow-effect relative max-w-[400px] overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-[#2a1f36] to-[#191022] shadow-2xl">
          <img
            width="400"
            height="400"
            src={Image}
            className="max-w-full"
            alt="Mystical purple hooded figure holding a glowing magical die in a dark fantasy setting"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-white">
            Master the Realm
          </h1>

          <p className="text-lg leading-relaxed font-normal text-slate-400">
            As a Dungeon Master, you hold the keys to the universe.
          </p>
        </div>
      </div>
    </div>
  );
}
