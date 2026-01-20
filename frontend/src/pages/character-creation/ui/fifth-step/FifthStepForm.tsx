import { useEffect, useRef, useState } from 'react';
import BackgroundCard from './BackgroundCard';
import hermitImg from './assets/path-hermit.png';
import soldierImg from './assets/path-warior.png';
import criminalImg from './assets/path-rob.png';
import { ArrowRight } from 'lucide-react';

type BackgroundDef = {
  id: string;
  name: string;
  description: string;
  bg: string;
};

const backgrounds: BackgroundDef[] = [
  {
    id: 'hermit',
    name: 'Hermit',
    description:
      'You lived in seclusion — far from the guidance of friends and family — whether in a sheltered community, alone in the wilderness, or in some location apart from society.',
    bg: hermitImg,
  },
  {
    id: 'soldier',
    name: 'Soldier',
    description:
      'You served in an army or militia. You understand military structure, tactics, and hierarchy. You might have served as a grunt, a scout, or an officer.',
    bg: soldierImg,
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description:
      'You have a history of breaking the law — running contraband, pulling heists, or handling dirty work for a criminal organization.',
    bg: criminalImg,
  },
];

export function FifthStepForm({ onNext }: { onNext?: (payload?: { background?: string }) => void }) {
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
    }, 120);
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;

        entries.forEach((entry) => {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        });

        if (bestEntry && (bestEntry as IntersectionObserverEntry).isIntersecting) {
          const i = Number(((bestEntry as IntersectionObserverEntry).target as HTMLElement).dataset.index);
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
    if (backgrounds[index]) onNext?.({ background: backgrounds[index].id });
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="overflow-hidden" ref={containerRef}>
          <div ref={scrollRef} className="flex gap-4 snap-x snap-mandatory overflow-x-auto no-scrollbar">
            <div className="shrink-0 snap-center" />
            {backgrounds.map((b, i) => (
              <div key={b.id} ref={(el) => { cardRefs.current[i] = el; }} data-index={i} className="shrink-0 snap-center">
                <BackgroundCard title={b.name} description={b.description} bg={b.bg} />
              </div>
            ))}
            <div className="shrink-0 snap-center" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[400px] px-4 pointer-events-auto">
          <button
            type="button"
            onClick={handleNextClick}
            className={
              `relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium shadow-lg duration-300 active:scale-95 ` +
              'bg-primary text-white active:bg-primary/90'
            }
          >
            <span>Choose background</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FifthStepForm;
