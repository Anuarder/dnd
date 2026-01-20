import { motion } from 'motion/react';
import { StepHeader } from './ui/StepHeader';
import { FirstStepForm } from './ui/first-step/FirstStepForm';
import { SecondStepForm } from './ui/second-step/SecondStepForm';
import { ThirdStepForm } from './ui/third-step/ThirdStepForm';
import { ForthStepForm } from './ui/forth-step/ForthStepForm';
import { FifthStepForm } from './ui/fifth-step/FifthStepForm';
import { SixthStepForm } from './ui/sixth-step/SixthStepForm';
import { SeventhStepForm } from './ui/seventh-step/SeventhStepForm';
import { useState } from 'react';

export function CharacterCreationPage() {
  const steps = ['Basics', 'Race', 'Class', 'Stats', 'Background', 'Skills', 'Spells'];
  const [current, setCurrent] = useState<number>(0);

  const [character, setCharacter] = useState<Record<string, any>>({});

  function goNext(payload?: any) {
    // Accept structured payloads from steps (e.g. { stats }, { background }, { skills })
    // Use functional updater so we merge with the latest state and can log the merged object immediately.
    setCharacter((prev) => {
      const merged = payload ? ({ ...prev, ...(payload as object) } as Record<string, any>) : prev;
      return merged;
    });

    setCurrent((c) => Math.min(c + 1, steps.length - 1));
    
  }

  // goBack intentionally omitted until a back button is added

  return (
    <div className="bg-dark-primary flex min-h-dvh justify-center px-2 pt-2 pb-9 text-center text-pretty text-white">
      <div className="flex w-full max-w-[640px] flex-col items-center gap-5 pa-2">
        <div
          className="absolute inset-x-0 top-0 z-0 h-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(127, 19, 236, 0.25) 10%, rgb(25, 16, 34) 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-[1] w-full rounded-2xl"
        >
          <StepHeader steps={steps} current={current} onBack={() => setCurrent((c) => Math.max(c - 1, 0))} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          className="w-full z-[1] pa-2"
        >
          {current === 0 && <FirstStepForm onNext={goNext} />}

          {current === 1 && <SecondStepForm onNext={goNext} />}

          {current === 2 && <ThirdStepForm onNext={goNext} />}

          {current === 3 && <ForthStepForm onNext={goNext} />}

          {current === 4 && <FifthStepForm onNext={goNext} />}

          {current === 5 && (
            <SixthStepForm
              stats={character.stats ?? {}}
              onNext={(p: any) => goNext(p)}
            />
          )}

          {current === 6 && (
            <SeventhStepForm
              onNext={(p: any) => goNext(p)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
