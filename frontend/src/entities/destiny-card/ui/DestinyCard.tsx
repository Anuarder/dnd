import { BookOpen, Crown, Swords, User } from "lucide-react";
import classNames from 'classnames';

const MASTER = {
  logo: Crown,
  title: 'Dungeon Master',
  description:
    'Build worlds, manage campaigns, and guide the story. You hold the keys to the universe.',
  buttonLabel: 'I am the Master',
};

const PLAYER = {
  logo: User,
  title: 'Player',
  description: 'Track stats, roll dice, and survive the adventure. Your fate is in your hands.',
  buttonLabel: 'I am a Gamer',
};

export function DestinyCard(props: { type: 'master' | 'player', events: {
  onClick: () => void;
} }) {
  const isMaster = props.type === 'master';
  const cardData = isMaster ? MASTER : PLAYER;

  const Logo = cardData.logo;
  const title = cardData.title;
  const description = cardData.description;
  const buttonLabel = cardData.buttonLabel;

  return (
    <div className="relative text-left">
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

        <button
          type="button"
          className={classNames(
            'mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold text-white transition-all duration-200 ease-out',
            isMaster
              ? 'bg-primary border-primary active:bg-primary/90 lg:hover:border-primary/80 active:scale-95 lg:hover:scale-105'
              : 'bg-surface-dark border-white/10 active:scale-95 active:bg-white/20 lg:hover:scale-105 lg:hover:border-white/20'
          )}
          onClick={() => props.events.onClick()}
        >
          {buttonLabel}
        </button>
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
