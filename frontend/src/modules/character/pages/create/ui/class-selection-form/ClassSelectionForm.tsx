import classNames from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRightIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import { UiButton } from '~shared/ui';

import BarbarianFemaleImage from './assets/barbarian-female.webp';
import BarbarianMaleImage from './assets/barbarian-male.webp';
import BardFemaleImage from './assets/bard-female.webp';
import BardMaleImage from './assets/bard-male.webp';
import ClericFemaleImage from './assets/cleric-female.webp';
import ClericMaleImage from './assets/cleric-male.webp';
import DruidFemaleImage from './assets/druid-female.webp';
import DruidMaleImage from './assets/druid-male.webp';
import FighterFemaleImage from './assets/fighter-female.webp';
import FighterMaleImage from './assets/fighter-male.webp';

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  images: {
    male: string;
    female: string;
  };
  keyTraits: string[];
  hitDie: string;
  primaryAbility: string;
  combatType: 'Melee' | 'Ranged' | 'Magic' | 'Hybrid';
}

const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'barbarian',
    name: 'Barbarian',
    description: 'Unleash primal fury. Channel rage into unstoppable devastation.',
    images: {
      male: BarbarianMaleImage,
      female: BarbarianFemaleImage,
    },
    keyTraits: ['Rage', 'Unarmored Defense'],
    hitDie: 'd12',
    primaryAbility: 'Strength',
    combatType: 'Melee',
  },
  {
    id: 'bard',
    name: 'Bard',
    description: 'Weave magic through music. Inspire allies, deceive foes.',
    images: {
      male: BardMaleImage,
      female: BardFemaleImage,
    },
    keyTraits: ['Jack of All Trades', 'Bardic Inspiration'],
    hitDie: 'd8',
    primaryAbility: 'Charisma',
    combatType: 'Magic',
  },
  {
    id: 'cleric',
    name: 'Cleric',
    description: 'Wield divine power. Heal the wounded, smite the unholy.',
    images: {
      male: ClericMaleImage,
      female: ClericFemaleImage,
    },
    keyTraits: ['Divine Magic', 'Channel Divinity'],
    hitDie: 'd8',
    primaryAbility: 'Wisdom',
    combatType: 'Magic',
  },
  {
    id: 'druid',
    name: 'Druid',
    description: 'Command nature itself. Shapeshift into beasts at will.',
    images: {
      male: DruidMaleImage,
      female: DruidFemaleImage,
    },
    keyTraits: ['Wild Shape', 'Nature Magic'],
    hitDie: 'd8',
    primaryAbility: 'Wisdom',
    combatType: 'Hybrid',
  },
  {
    id: 'fighter',
    name: 'Fighter',
    description: 'Master every weapon. Dominate the battlefield with skill.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Action Surge', 'Extra Attack'],
    hitDie: 'd10',
    primaryAbility: 'Strength',
    combatType: 'Melee',
  },
  // {
  //   id: 'monk',
  //   name: 'Monk',
  //   description: 'Strike like lightning. Your body is the ultimate weapon.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Martial Arts', 'Ki'],
  //   hitDie: 'd8',
  //   primaryAbility: 'Dexterity',
  //   combatType: 'Melee',
  // },
  // {
  //   id: 'paladin',
  //   name: 'Paladin',
  //   description: 'Sworn to a sacred oath. Crush evil with divine wrath.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Divine Smite', 'Lay on Hands'],
  //   hitDie: 'd10',
  //   primaryAbility: 'Strength',
  //   combatType: 'Hybrid',
  // },
  // {
  //   id: 'ranger',
  //   name: 'Ranger',
  //   description: 'Hunt your prey. No creature escapes your deadly pursuit.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Favored Enemy', 'Natural Explorer'],
  //   hitDie: 'd10',
  //   primaryAbility: 'Dexterity',
  //   combatType: 'Ranged',
  // },
  // {
  //   id: 'rogue',
  //   name: 'Rogue',
  //   description: 'Strike from shadows. One precise blow ends everything.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Sneak Attack', 'Cunning Action'],
  //   hitDie: 'd8',
  //   primaryAbility: 'Dexterity',
  //   combatType: 'Melee',
  // },
  // {
  //   id: 'sorcerer',
  //   name: 'Sorcerer',
  //   description: 'Magic flows in your blood. Bend reality to your will.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Metamagic', 'Sorcery Points'],
  //   hitDie: 'd6',
  //   primaryAbility: 'Charisma',
  //   combatType: 'Magic',
  // },
  // {
  //   id: 'warlock',
  //   name: 'Warlock',
  //   description: 'Power has a price. Your patron grants forbidden secrets.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Eldritch Invocations', 'Pact Magic'],
  //   hitDie: 'd8',
  //   primaryAbility: 'Charisma',
  //   combatType: 'Magic',
  // },
  // {
  //   id: 'wizard',
  //   name: 'Wizard',
  //   description: 'Knowledge is power. Master the arcane through study.',
  //   images: {
  //     male: '',
  //     female: '',
  //   },
  //   keyTraits: ['Spellbook', 'Arcane Recovery'],
  //   hitDie: 'd6',
  //   primaryAbility: 'Intelligence',
  //   combatType: 'Magic',
  // },
];

const gradientStyle = {
  backgroundImage: 'linear-gradient(152deg,rgba(127, 19, 236, 1) 18%, rgba(216, 180, 254, 1) 49%)',
};

interface ClassSelectionFormProps {
  gender: 'male' | 'female' | 'other';
  onNext: (classId: string) => void;
}

export function ClassSelectionForm({ gender, onNext }: ClassSelectionFormProps) {
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [emblaREF, emblaAPI] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (!emblaAPI) {
      return;
    }

    function onSelect() {
      if (emblaAPI) {
        setSelectedClassIndex(emblaAPI.selectedScrollSnap());
      }
    }

    emblaAPI.on('select', onSelect);

    return () => {
      emblaAPI.off('select', onSelect);
    };
  }, [emblaAPI]);

  const selectedClass = useMemo(() => CHARACTER_CLASSES[selectedClassIndex], [selectedClassIndex]);

  const mappedClasses = useMemo(
    () =>
      CHARACTER_CLASSES.map((item) => ({
        ...item,
        image: gender === 'female' ? item.images.female : item.images.male,
      })),
    [gender]
  );

  function onSlideClick(index: number): void {
    emblaAPI?.scrollTo(index);
  }

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="px-4"
      >
        <h2 className="font-display flex flex-col text-3xl font-bold">
          <span>Choose Your</span>
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            Path
          </span>
        </h2>

        <p className="font-display mt-3 font-thin text-white/50">
          Select a class to define your combat style and abilities
        </p>
      </motion.div>

      <motion.div
        ref={emblaREF}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-4 flex flex-1 flex-col overflow-hidden px-4"
      >
        <div className="flex flex-1 touch-pan-y touch-pinch-zoom gap-3">
          {mappedClasses.map((item, index) => (
            <div
              key={item.id}
              className={classNames(
                'flex min-w-0 flex-[0_0_90%] flex-col justify-end overflow-hidden rounded-3xl border-2 bg-cover bg-top bg-no-repeat duration-200',
                {
                  'border-surface-dark': selectedClassIndex !== index,
                  'border-primary': selectedClassIndex === index,
                }
              )}
              style={{
                backgroundImage: `url(${item.image})`,
              }}
              onClick={() => onSlideClick(index)}
            >
              <div className="flex h-full w-full flex-col justify-end p-6 backdrop-brightness-30">
                <div>
                  <strong className="font-display text-2xl font-semibold tracking-[.5px]">
                    {item.name}
                  </strong>

                  <p className="font-display mt-5 text-sm text-white/70">{item.description}</p>

                  <div className="mt-4">
                    <label className="font-display mt-5 text-xs font-semibold text-white/70 uppercase">
                      Key traits
                    </label>

                    <ul className="mt-2 flex flex-col gap-2">
                      {item.keyTraits.map((trait) => (
                        <li
                          key={trait}
                          className="border-primary/30 font-display w-fit rounded border bg-[#332442]/80 px-4 py-1 text-left text-xs font-medium"
                        >
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-start gap-4 border-t border-white/30 pt-5">
                    <div className="font-display flex flex-col">
                      <label className="text-xs font-semibold text-white/50 uppercase">
                        Hit Die
                      </label>

                      <span className="text-lg font-bold">{item.hitDie}</span>
                    </div>

                    <div className="font-display flex flex-col">
                      <label className="text-xs font-semibold text-white/50 uppercase">
                        Primary Ability
                      </label>

                      <span className="text-lg font-bold">{item.primaryAbility}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="mt-6 px-4 pb-6"
      >
        <UiButton
          className="w-full"
          onClick={() => {
            if (selectedClass) {
              onNext(selectedClass.id);
            }
          }}
        >
          Select{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedClass?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {selectedClass?.name}
            </motion.span>
          </AnimatePresence>{' '}
          <ArrowRightIcon size={20} />
        </UiButton>
      </motion.div>
    </div>
  );
}
