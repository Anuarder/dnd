import classNames from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRightIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
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
    name: 'Варвар',
    description: 'Дикий воин, полагающийся на ярость и физическую мощь. В бою впадает в ярость, получая сопротивление урону и усиливая атаки.',
    images: {
      male: BarbarianMaleImage,
      female: BarbarianFemaleImage,
    },
    keyTraits: ['Ярость', 'Защита без доспехов'],
    hitDie: 'd12',
    primaryAbility: 'Сила, Телосложение',
    combatType: 'Melee',
  },
  {
    id: 'bard',
    name: 'Бард',
    description: 'Универсальный заклинатель и мастер поддержки. Использует музыку и вдохновение для усиления союзников и ослабления врагов.',
    images: {
      male: BardMaleImage,
      female: BardFemaleImage,
    },
    keyTraits: ['Мастер на все руки', 'Вдохновление барда'],
    hitDie: 'd8',
    primaryAbility: 'Харизма',
    combatType: 'Magic',
  },
  {
    id: 'cleric',
    name: 'Жрец',
    description: 'Божественный заклинатель, получающий силу от божества. Может лечить, усиливать союзников или наносить урон в зависимости от домена.',
    images: {
      male: ClericMaleImage,
      female: ClericFemaleImage,
    },
    keyTraits: ['Божественный домен', 'Божественны канал'],
    hitDie: 'd8',
    primaryAbility: 'Мудрость',
    combatType: 'Magic',
  },
  {
    id: 'druid',
    name: 'Друид',
    description: 'Хранитель природы с доступом к природной магии. Может превращаться в животных (Дикая форма).',
    images: {
      male: DruidMaleImage,
      female: DruidFemaleImage,
    },
    keyTraits: ['Дикий облик', 'Природная магия'],
    hitDie: 'd8',
    primaryAbility: 'Мудрость',
    combatType: 'Hybrid',
  },
  {
    id: 'fighter',
    name: 'Воин',
    description: 'Мастер оружия и тактики. Обладает высокой выживаемостью и множеством боевых стилей.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Боевой стиль', 'Второе дыхание'],
    hitDie: 'd10',
    primaryAbility: 'Сила или Ловкость',
    combatType: 'Melee',
  },
  {
    id: 'monk',
    name: 'Монах',
    description: 'Боевой мастер восточных искусств, использующий ци. Быстрый, мобильный и опасный в ближнем бою без доспехов.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Мастер боевых исскуств', 'Ци'],
    hitDie: 'd8',
    primaryAbility: 'Ловкость, Мудрость',
    combatType: 'Melee',
  },
  {
    id: 'paladin',
    name: 'Паладин',
    description: 'Святой воин, сочетающий бой и божественную магию.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Божественная кара', 'Возложение рук'],
    hitDie: 'd10',
    primaryAbility: 'Сила, Харизма',
    combatType: 'Hybrid',
  },
  {
    id: 'ranger',
    name: 'Следопыт',
    description: 'Охотник и выживальщик, мастер дальнего боя и природы.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Избранный враг', 'Иследователь природы'],
    hitDie: 'd10',
    primaryAbility: 'Ловкость, Мудрость',
    combatType: 'Ranged',
  },
  {
    id: 'rogue',
    name: 'Плут',
    description: 'Специалист по скрытности и точечному урону.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Скрытая атака', 'Хитрое действие'],
    hitDie: 'd8',
    primaryAbility: 'Ловкость',
    combatType: 'Melee',
  },
  {
    id: 'sorcerer',
    name: 'Чародей',
    description: 'Заклинатель с врождённой магической силой. Использует метамагию для изменения заклинаний.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Метамагия', 'Источник магии'],
    hitDie: 'd6',
    primaryAbility: 'Харизма',
    combatType: 'Magic',
  },
  {
    id: 'warlock',
    name: 'Колдун',
    description: 'Заклинатель, заключивший пакт с могущественным существом.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Таинственные воззвания', 'Магия договора'],
    hitDie: 'd8',
    primaryAbility: 'Харизма',
    combatType: 'Magic',
  },
  {
    id: 'wizard',
    name: 'Волшебник',
    description: 'Мастер арканной магии, изучающий заклинания из книг.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Книга заклинаний', 'Магическое восстановление'],
    hitDie: 'd6',
    primaryAbility: 'Интелект',
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
            toast.dismiss();
            if (selectedClass) {
              onNext(selectedClass.id);
            } else {
              toast.error('Selection Required', {
                description: 'Please select a class to define your path.',
              });
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
