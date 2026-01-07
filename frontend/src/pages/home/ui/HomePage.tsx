import classNames from 'classnames';
import { BookOpen, Crown, Swords, User } from 'lucide-react';
import { Link } from 'react-router';

import LogoSVG from '~shared/assets/logo.svg';

const MASTER = {
  logo: Crown,
  title: 'Dungeon Master',
  description:
    'Build worlds, manage campaigns, and guide the story. You hold the keys to the universe.',
  href: '/master',
  buttonLabel: 'I am the Master',
};

const PLAYER = {
  logo: User,
  title: 'Player',
  description: 'Track stats, roll dice, and survive the adventure. Your fate is in your hands.',
  href: '/player',
  buttonLabel: 'I am a Gamer',
};

function DestinyCard(props: { type: 'master' | 'player' }) {
  const isMaster = props.type === 'master';
  const cardData = isMaster ? MASTER : PLAYER;

  const Logo = cardData.logo;
  const title = cardData.title;
  const description = cardData.description;
  const href = cardData.href;
  const buttonLabel = cardData.buttonLabel;

  return (
    <div className="relative">
      <div className="font-display group bg-surface-dark relative cursor-pointer overflow-hidden rounded-xl border border-white/5 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className={classNames(
              'flex size-10 items-center justify-center rounded-full',
              isMaster ? 'text-primary bg-primary/30' : 'bg-blue-500/30 text-blue-500'
            )}
          >
            <Logo />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-400">{description}</p>

        <Link
          to={href}
          className={classNames(
            'mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold text-white transition-all duration-200 ease-out',
            isMaster
              ? 'bg-primary border-primary active:bg-primary/90 lg:hover:border-primary/80 active:scale-95 lg:hover:scale-105'
              : 'bg-surface-dark border-white/10 active:scale-95 active:bg-white/20 lg:hover:scale-105 lg:hover:border-white/20'
          )}
        >
          {buttonLabel}
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end p-10 opacity-10">
        {isMaster ? (
          <BookOpen size={100} className="text-primary" />
        ) : (
          <Swords size={100} className="text-blue-500" />
        )}
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="mesh-gradient flex min-h-dvh flex-col items-center justify-center p-4 text-white">
      <img width="200" height="200" src={LogoSVG} alt="Logo" />

      <div className="font-display mt-6 flex flex-col gap-2">
        <h1 className="text-center text-3xl leading-tight font-bold tracking-tight text-white">
          Choose Your Destiny
        </h1>

        <p className="text-center text-white/60">
          Are you here to weave the tale or live the adventure?
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <DestinyCard type="master" />

        <DestinyCard type="player" />
      </div>
    </div>
  );
}
