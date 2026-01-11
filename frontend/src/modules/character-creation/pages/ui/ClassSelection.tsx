import React, { useEffect, useRef, useState } from 'react';
import { motion, PanInfo, useAnimation } from 'motion/react';
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

export default function ClassSelection({ onNext }: { onNext: (id?: string) => void }) {

	const controls = useAnimation()

  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  function handleDragEnd(
		_e: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) {
		const offset = info.offset.x;
		const threshold = 80;
		let ind = index

		if (offset < -threshold && index < classes.length - 1) {
			ind = Math.min(classes.length - 1, index + 1)
		} else if (offset > threshold && index > 0) {
			ind = Math.max(0, index - 1)
		}

		setIndex(ind)

		controls.start({
			x: -ind * containerWidth,
		});

	}


  useEffect(() => {
    function updateWidth() {
      const w = containerRef.current?.offsetWidth ?? 0;
      setContainerWidth(w);
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);


  function handleNextClick() {
    if (classes[index]) onNext(classes[index].id);
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="overflow-hidden" ref={containerRef}>
          <motion.div
            className="flex"
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            animate={controls}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={containerWidth ? { width: `${classes.length * containerWidth}px` } : { width: `${classes.length * 100}%` }}
          >
            {classes.map((c) => (
              <div key={c.id} style={containerWidth ? { width: `${containerWidth}px` } : { width: `${100 / classes.length}%` }}>
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
          </motion.div>
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
