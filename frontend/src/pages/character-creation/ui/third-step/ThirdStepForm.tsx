import React, { useEffect, useRef, useState } from 'react';
import ClassCard from './ClassCard';
import { BookOpen, Music, Zap, Feather, ArrowRight } from 'lucide-react';

type ClassDef = {
  id: string;
  name: string;
  description: string;
  features: { label: string; icon?: React.ReactNode }[];
  hitDie: string;
  primary: string;
  bg: string;
};

import bardBg from './assets/class-bard.png';
import wizardBg from './assets/class-wizard.png';
import barbarianBg from './assets/class-barbarian.png';

const classes: ClassDef[] = [
  {
    id: 'bard',
    name: 'Bard',
    description: 'Versatile performers and spellcasters who inspire allies.',
    features: [
      { label: 'Spellcasting', icon: <BookOpen size={14} /> },
      { label: "Bardic Inspiration", icon: <Music size={14} /> },
    ],
    hitDie: 'd8',
    primary: 'Charisma',
    bg: bardBg,
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'Masters of arcane knowledge and powerful spells.',
    features: [
      { label: 'Spellbook', icon: <BookOpen size={14} /> },
      { label: 'Arcane Recovery', icon: <Zap size={14} /> },
    ],
    hitDie: 'd6',
    primary: 'Intelligence',
    bg: wizardBg,
  },
  {
    id: 'barbarian',
    name: 'Barbarian',
    description: 'Fierce warriors tapping primal rage to devastate foes.',
    features: [
      { label: 'Rage', icon: <Feather size={14} /> },
      { label: 'Unarmored Defense', icon: <Zap size={14} /> },
    ],
    hitDie: 'd12',
    primary: 'Strength',
    bg: barbarianBg,
  },
];

export function ThirdStepForm({ onNext }: { onNext: (payload?: { class?: string }) => void }) {


  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceRef = useRef<number | null>(null);

  const setIndexDebounced = (i: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setIndex(i);
    }, 120); // ← задержка (100–200мс идеально)
  };


  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // выбираем карточку с наибольшим intersectionRatio
        let bestEntry: IntersectionObserverEntry | null = null;

        entries.forEach((entry) => {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        });

        if (bestEntry && (bestEntry as IntersectionObserverEntry).isIntersecting) {
          const i = Number(
            ((bestEntry as IntersectionObserverEntry).target as HTMLElement).dataset.index
          );
          setIndexDebounced(i);
        }
      },
      {
        root: scrollRef.current,
        threshold: [0.5, 0.6, 0.7, 0.8, 0.9],
      }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);


  function handleNextClick() {
    if (classes[index]) onNext?.({ class: classes[index].id });
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="overflow-hidden" ref={containerRef}>
          <div
            ref={scrollRef}
            className="flex gap-4 snap-x snap-mandatory overflow-x-auto no-scrollbar"
          >
            <div className='shrink-0 snap-center'></div>
            {classes.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => {cardRefs.current[i] = el}}
                data-index={i}
                className='shrink-0 snap-center'
              >
                <ClassCard
                  title={c.name}
                  description={c.description}
                  features={c.features}
                  hitDie={c.hitDie}
                  primary={c.primary}
                  bg={c.bg}
                />
              </div>
            ))}
            <div className='shrink-0 snap-center'></div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[400px] px-4 pointer-events-auto">
          <button
            type="button"
            onClick={handleNextClick}
            className="bg-primary active:bg-primary/90 relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium text-white shadow-lg duration-300 active:scale-95"
          >
            <span>Next</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}