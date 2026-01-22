import { useState } from 'react';
import BackgroundCard from './BackgroundCard';
import hermitImg from './assets/path-hermit.png';
import soldierImg from './assets/path-warior.png';
import criminalImg from './assets/path-rob.png';
import { ArrowRight } from 'lucide-react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

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

  function handleNextClick() {
    if (backgrounds[index]) onNext?.({ background: backgrounds[index].id });
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="swiper-box overflow-hidden">
          <Swiper
            spaceBetween={25}
            slidesPerView={1}
            onSlideChange={(e) => setIndex(e.activeIndex)}
            centeredSlides
          >
            {backgrounds.map((b, i) => (
              <SwiperSlide
                key={b.id}
                data-index={i}
                style={{ display: 'flex' }}
                className='items-center justify-center'
              >
                <BackgroundCard title={b.name} description={b.description} bg={b.bg} />
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
