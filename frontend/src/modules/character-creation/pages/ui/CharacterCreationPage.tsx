import { motion } from 'motion/react';
import { StepHeader } from './StepHeader';
import { FirstStepForm } from './FirstStep/FirstStepForm';
import { SecondStepForm } from './SecondStep/SecondStepForm';
import { ThirdStepForm } from './ThirdStep/ThirdStepForm';
import { useState } from 'react';

export function CharacterCreationPage() {
  const steps = ['Basics', 'Race', 'Class', 'Finish'];
  const [current, setCurrent] = useState<number>(0);

  function goNext() {
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
          <StepHeader steps={steps} current={current} />
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

          {current > 2 && (
            <div>
              <p>Step {current + 1} content placeholder</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
