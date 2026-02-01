import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import LogoSVG from '~shared/assets/logo.svg';

import { DestinyCard } from '~entities/destiny-card';

export function HomePage() {
  const navigate = useNavigate();

  function handleMasterClick() {
    navigate('/master');
  }

  function handlePlayerClick() {
    navigate('/player');
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4 py-6 text-white">
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        width="120"
        height="120"
        src={LogoSVG}
        alt="Logo"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="font-display mt-6 flex flex-col gap-2"
      >
        <h1 className="text-center text-3xl leading-tight font-bold tracking-tight text-white">
          Choose Your Destiny
        </h1>

        <p className="text-center text-white/60">
          Are you here to weave the tale or live the adventure?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        className="mt-5 flex flex-col gap-3"
      >
        <DestinyCard type="master" events={{ onClick: handleMasterClick }} />

        <DestinyCard type="player" events={{ onClick: handlePlayerClick }} />
      </motion.div>
    </div>
  );
}
