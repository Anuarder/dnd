import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { getRaceById } from '~modules/character/model/mock-data';
import type { Subrace } from '~modules/character/model/types';

interface SubraceSelectionFormProps {
  raceId: string;
  onNext: (data: { subraceId: string }) => void;
}

const gradientStyle = {
  backgroundImage: 'linear-gradient(152deg,rgba(127, 19, 236, 1) 18%, rgba(216, 180, 254, 1) 49%)',
};

export function SubraceSelectionForm({ raceId, onNext }: SubraceSelectionFormProps) {
  const [selectedSubrace, setSelectedSubrace] = useState<Subrace | null>(null);

  const race = getRaceById(raceId);
  const subraces = race?.subraces ?? [];

  function handleSubraceSelect(subrace: Subrace): void {
    setSelectedSubrace(subrace);
  }

  function handleContinue(): void {
    if (!selectedSubrace) {
      toast.error('Please select a subrace', {
        description: 'Choose your subrace to continue.',
      });
      return;
    }

    onNext({
      subraceId: selectedSubrace.id,
    });
  }

  if (subraces.length === 0) {
    return (
      <div className="px-4 text-center text-white">
        <p>No subraces available for this race.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <h2 className="font-display flex flex-col text-3xl font-bold">
          <span>Choose Your</span>
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            Subrace
          </span>
        </h2>
        <p className="mt-2 text-white/60">
          Select a subrace for your {race?.name ?? 'character'}
        </p>
      </motion.div>

      {/* Subrace Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="space-y-3"
      >
        {subraces.map((subrace, index) => (
          <motion.button
            key={subrace.id}
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ease-out active:scale-[0.98] ${
              selectedSubrace?.id === subrace.id
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
            }`}
            onClick={() => handleSubraceSelect(subrace)}
          >
            <span className="flex items-start justify-between">
              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{subrace.name}</span>
                  {selectedSubrace?.id === subrace.id && (
                    <Check size={20} className="text-primary" />
                  )}
                </span>
                <span className="mt-1 text-sm text-white/60">{subrace.description}</span>

                <span className="mt-2 block">
                  <span className="text-xs font-semibold text-white/50 uppercase">
                    Additional Traits
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {subrace.traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded border border-primary/30 bg-[#332442]/80 px-2 py-0.5 text-xs text-white"
                      >
                        {trait}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="group bg-primary shadow-primary/30 sticky bottom-6 w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleContinue}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Continue
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </motion.button>
    </div>
  );
}
