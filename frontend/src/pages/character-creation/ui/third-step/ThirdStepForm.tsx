import React, { useState } from 'react';
import ClassCard from './ClassCard';
import { BookOpen, Music, Zap, Feather, ArrowRight } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

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

  function handleNextClick() {
    if (classes[index]) onNext?.({ class: classes[index].id });
  }

  return (
    <div className="w-full p-4">
      <div className="relative">
        <div className="swiper-box overflow-hidden">
          <Swiper
            spaceBetween={25}
            slidesPerView={1}
            onSlideChange={(e) => setIndex(e.activeIndex)}
            centeredSlides
          >
            {classes.map((c, i) => (
              <SwiperSlide
                key={c.id}
                data-index={i}
                style={{ display: 'flex' }}
                className='items-center justify-center'
              >
                <ClassCard
                  title={c.name}
                  description={c.description}
                  features={c.features}
                  hitDie={c.hitDie}
                  primary={c.primary}
                  bg={c.bg}
                />
              </SwiperSlide>
            ))}
          </Swiper>
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