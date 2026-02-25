import classNames from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRightIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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

interface CharacterClassBase {
  id: string;
  images: {
    male: string;
    female: string;
  };
  hitDie: string;
  combatType: 'Melee' | 'Ranged' | 'Magic' | 'Hybrid';
}

interface CharacterClass extends CharacterClassBase {
  name: string;
  description: string;
  keyTraits: string[];
  primaryAbility: string;
}

const CHARACTER_CLASSES: CharacterClassBase[] = [
  {
    id: 'barbarian',
    images: {
      male: BarbarianMaleImage,
      female: BarbarianFemaleImage,
    },
    hitDie: 'd12',
    combatType: 'Melee',
  },
  {
    id: 'bard',
    images: {
      male: BardMaleImage,
      female: BardFemaleImage,
    },
    hitDie: 'd8',
    combatType: 'Magic',
  },
  {
    id: 'cleric',
    images: {
      male: ClericMaleImage,
      female: ClericFemaleImage,
    },
    hitDie: 'd8',
    combatType: 'Magic',
  },
  {
    id: 'druid',
    images: {
      male: DruidMaleImage,
      female: DruidFemaleImage,
    },
    hitDie: 'd8',
    combatType: 'Hybrid',
  },
  {
    id: 'fighter',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd10',
    combatType: 'Melee',
  },
  {
    id: 'monk',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd8',
    combatType: 'Melee',
  },
  {
    id: 'paladin',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd10',
    combatType: 'Hybrid',
  },
  {
    id: 'ranger',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd10',
    combatType: 'Ranged',
  },
  {
    id: 'rogue',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd8',
    combatType: 'Melee',
  },
  {
    id: 'sorcerer',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd6',
    combatType: 'Magic',
  },
  {
    id: 'warlock',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd8',
    combatType: 'Magic',
  },
  {
    id: 'wizard',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    hitDie: 'd6',
    combatType: 'Magic',
  },
];

const gradientStyle = {
  backgroundImage: 'linear-gradient(152deg,rgba(127, 19, 236, 1) 18%, rgba(216, 180, 254, 1) 49%)',
};

interface ClassSelectionFormProps {
  gender: 'male' | 'female' | 'other';
  onNext: (classId: string) => void;
}

export function ClassSelectionForm({ gender, onNext }: ClassSelectionFormProps) {
  const { t } = useTranslation('characterCreateClassSelection');
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

  const classContent = useMemo(
    () => t('classes', { returnObjects: true }) as Record<string, Omit<CharacterClass, keyof CharacterClassBase>>,
    [t]
  );

  const mappedClasses = useMemo(
    () =>
      CHARACTER_CLASSES.map((item) => ({
        ...item,
        image: gender === 'female' ? item.images.female : item.images.male,
        name: classContent[item.id]?.name ?? item.id,
        description: classContent[item.id]?.description ?? '',
        keyTraits: classContent[item.id]?.keyTraits ?? [],
        primaryAbility: classContent[item.id]?.primaryAbility ?? '',
      })),
    [classContent, gender]
  );

  const selectedClass = mappedClasses[selectedClassIndex];

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
          <span>{t('titleLine1')}</span>
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            {t('titleLine2')}
          </span>
        </h2>

        <p className="font-display mt-3 font-thin text-white/50">{t('description')}</p>
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
                      {t('keyTraitsLabel')}
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
                        {t('hitDieLabel')}
                      </label>

                      <span className="text-lg font-bold">{item.hitDie}</span>
                    </div>

                    <div className="font-display flex flex-col">
                      <label className="text-xs font-semibold text-white/50 uppercase">
                        {t('primaryAbilityLabel')}
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
            toast.dismiss();
            if (selectedClass) {
              onNext(selectedClass.id);
            } else {
              toast.error(t('toast.selectionTitle'), {
                description: t('toast.selectionDescription'),
              });
            }
          }}
        >
          {t('selectPrefix')}{' '}
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
