import classNames from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRightIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import { BACKGROUNDS } from '~modules/character/model/mock-data';
import { UiButton } from '~shared/ui';

interface BackgroundStepProps {
  onNext: (data: { backgroundId: string }) => void;
}

const gradientStyle = {
  backgroundImage: 'linear-gradient(152deg,rgba(127, 19, 236, 1) 18%, rgba(216, 180, 254, 1) 49%)',
};

export function BackgroundStep({ onNext }: BackgroundStepProps) {
  const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState(0);
  const [emblaREF, emblaAPI] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (!emblaAPI) {
      return;
    }

    function onSelect() {
      if (emblaAPI) {
        setSelectedBackgroundIndex(emblaAPI.selectedScrollSnap());
      }
    }

    emblaAPI.on('select', onSelect);

    return () => {
      emblaAPI.off('select', onSelect);
    };
  }, [emblaAPI]);

  const selectedBackground = useMemo(
    () => BACKGROUNDS[selectedBackgroundIndex],
    [selectedBackgroundIndex]
  );

  function onSlideClick(index: number): void {
    emblaAPI?.scrollTo(index);
  }

  function handleContinue(): void {
    if (selectedBackground) {
      onNext({ backgroundId: selectedBackground.id });
    }
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
            Background
          </span>
        </h2>

        <p className="font-display mt-3 font-thin text-white/50">
          Your past defines your skills and connections
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-4 flex flex-1 flex-col overflow-hidden px-4"
        ref={emblaREF}
      >
        <div className="flex flex-1 touch-pan-y touch-pinch-zoom gap-3">
          {BACKGROUNDS.map((background, index) => (
            <div
              className={classNames(
                'flex min-w-0 flex-[0_0_90%] flex-col justify-end overflow-hidden rounded-3xl border-2 bg-linear-to-b from-gray-800 to-gray-900 duration-200',
                {
                  'border-surface-dark': selectedBackgroundIndex !== index,
                  'border-primary': selectedBackgroundIndex === index,
                }
              )}
              key={background.id}
              onClick={() => onSlideClick(index)}
            >
              <div className="flex h-full w-full flex-col justify-end p-6">
                <div>
                  <strong className="font-display text-2xl font-semibold tracking-[.5px]">
                    {background.name}
                  </strong>

                  <p className="font-display mt-5 text-sm text-white/70">
                    {background.description}
                  </p>

                  <div className="mt-4">
                    <label className="font-display text-xs font-semibold text-white/70 uppercase">
                      Skill Proficiencies
                    </label>

                    <ul className="mt-2 flex flex-wrap gap-2">
                      {background.skillProficiencies.map((skill) => (
                        <li
                          key={skill}
                          className="border-primary/30 font-display w-fit rounded border bg-[#332442]/80 px-4 py-1 text-left text-xs font-medium capitalize"
                        >
                          {skill.replace('-', ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {background.toolProficiencies.length > 0 && (
                    <div className="mt-4">
                      <label className="font-display text-xs font-semibold text-white/70 uppercase">
                        Tool Proficiencies
                      </label>

                      <ul className="mt-2 flex flex-wrap gap-2">
                        {background.toolProficiencies.map((tool) => (
                          <li
                            key={tool}
                            className="font-display w-fit rounded border border-white/20 bg-white/10 px-4 py-1 text-left text-xs font-medium"
                          >
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-5 border-t border-white/30 pt-5">
                    <div className="font-display flex flex-col">
                      <label className="text-xs font-semibold text-white/50 uppercase">
                        Feature
                      </label>

                      <span className="mt-1 text-sm font-medium text-white/80">
                        {background.feature}
                      </span>
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
        <UiButton className="w-full" onClick={handleContinue}>
          Select{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedBackground?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {selectedBackground?.name}
            </motion.span>
          </AnimatePresence>{' '}
          <ArrowRightIcon size={20} />
        </UiButton>
      </motion.div>
    </div>
  );
}
