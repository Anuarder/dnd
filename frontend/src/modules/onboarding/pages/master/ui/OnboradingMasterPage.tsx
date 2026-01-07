import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import BannerImage from './assets/image.webp';

export function OnboradingMasterPage() {
  const navigate = useNavigate();

  function onContinue() {
    navigate('/onboarding/player');
  }

  return (
    <div className="bg-dark-primary flex min-h-dvh justify-center px-4 pt-16 pb-9 text-center text-pretty text-white">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-5">
        <div className="flex flex-1 flex-col gap-6">
          <div
            className="absolute inset-x-0 top-0 z-0 h-[400px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(127, 19, 236, 0.25) 10%, rgb(25, 16, 34) 100%)',
            }}
          ></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="glow-effect from-dark-secondary to-dark-primary shadow-4xl relative z-[1] overflow-hidden rounded-2xl border-2 border-white/5 bg-linear-to-b"
          >
            <img
              width="400"
              height="400"
              src={BannerImage}
              className="max-w-full object-cover object-center"
              alt="Dungeon Master"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-2"
          >
            <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-white">
              Fate in Your Hands
            </h1>

            <p className="leading-relaxed font-normal text-slate-400">
              Craft your world. Slay the beast. Forget the paperwork—we handle the mechanics so you
              can focus on the magic.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          className="sticky bottom-6 w-full"
        >
          <button
            type="button"
            className="bg-primary active:bg-primary/90 relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium text-white shadow-lg duration-300 active:scale-95"
            onClick={onContinue}
          >
            <span>Continue</span>

            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
