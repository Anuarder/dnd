import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SPELLS } from '~modules/character/model/mock-data';
import type { Spell } from '~modules/character/model/types';

const spellsSchema = z.object({
  cantrips: z.array(z.string()).min(1, 'Please select at least one cantrip'),
  level1Spells: z.array(z.string()).min(1, 'Please select at least one level 1 spell'),
});

type SpellsFormData = z.infer<typeof spellsSchema>;

interface SpellsStepProps {
  classId: string;
  onNext: (data: { selectedCantrips: string[]; selectedLevel1Spells: string[] }) => void;
}

const CANTRIP_COUNT = 2;
const LEVEL1_SPELL_COUNT = 2;

export function SpellsStep({ classId, onNext }: SpellsStepProps) {
  const [selectedCantrips, setSelectedCantrips] = useState<string[]>([]);
  const [selectedLevel1Spells, setSelectedLevel1Spells] = useState<string[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SpellsFormData>({
    resolver: zodResolver(spellsSchema),
    defaultValues: {
      cantrips: [],
      level1Spells: [],
    },
  });

  const classSpells = SPELLS[classId];

  if (!classSpells) {
    return (
      <div className="px-4 text-center text-white">
        <p>No spells available for this class.</p>
      </div>
    );
  }

  function toggleCantrip(spellId: string): void {
    setSelectedCantrips((prev) => {
      if (prev.includes(spellId)) {
        const newCantrips = prev.filter((id) => id !== spellId);
        setValue('cantrips', newCantrips);
        return newCantrips;
      }

      if (prev.length >= CANTRIP_COUNT) {
        return prev;
      }

      const newCantrips = [...prev, spellId];
      setValue('cantrips', newCantrips);
      return newCantrips;
    });
  }

  function toggleLevel1Spell(spellId: string): void {
    setSelectedLevel1Spells((prev) => {
      if (prev.includes(spellId)) {
        const newSpells = prev.filter((id) => id !== spellId);
        setValue('level1Spells', newSpells);
        return newSpells;
      }

      if (prev.length >= LEVEL1_SPELL_COUNT) {
        return prev;
      }

      const newSpells = [...prev, spellId];
      setValue('level1Spells', newSpells);
      return newSpells;
    });
  }

  function onSubmit(data: SpellsFormData): void {
    if (data.cantrips.length !== CANTRIP_COUNT) {
      alert(`Please select exactly ${CANTRIP_COUNT} cantrips`);
      return;
    }
    if (data.level1Spells.length !== LEVEL1_SPELL_COUNT) {
      alert(`Please select exactly ${LEVEL1_SPELL_COUNT} level 1 spells`);
      return;
    }
    onNext({
      selectedCantrips: data.cantrips,
      selectedLevel1Spells: data.level1Spells,
    });
  }

  function renderSpellCard(
    spell: Spell,
    isSelected: boolean,
    isDisabled: boolean,
    onToggle: () => void,
    index: number
  ): JSX.Element {
    return (
      <motion.button
        key={spell.id}
        type="button"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
        disabled={isDisabled}
        className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
          isSelected
            ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
            : 'border-white/10 bg-white/5 backdrop-blur-sm'
        }`}
        onClick={onToggle}
      >
        <span className="flex items-start justify-between">
          <span className="flex flex-1 flex-col">
            <span className="flex items-center gap-2">
              <span className="font-bold text-white">{spell.name}</span>
              {isSelected && <Check size={18} className="text-primary" />}
            </span>
            <span className="mt-1 text-sm text-white/60">{spell.description}</span>
            <span className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {spell.school}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {spell.castingTime}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {spell.range}
              </span>
            </span>
          </span>
        </span>
      </motion.button>
    );
  }

  return (
    <form className="space-y-6 px-4 pb-6" onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">Choose Spells</h2>
        <p className="mt-2 text-white/60">Select your starting magical abilities</p>
      </motion.div>

      {/* Cantrips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white">Cantrips</h3>
              <p className="text-xs text-white/60">
                Select {CANTRIP_COUNT} ({selectedCantrips.length}/{CANTRIP_COUNT})
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: CANTRIP_COUNT }).map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  index < selectedCantrips.length ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {classSpells.cantrips.map((spell, index) => {
            const isSelected = selectedCantrips.includes(spell.id);
            const isDisabled = !isSelected && selectedCantrips.length >= CANTRIP_COUNT;
            return renderSpellCard(spell, isSelected, isDisabled, () => toggleCantrip(spell.id), index);
          })}
        </div>
      </motion.div>

      {errors.cantrips && (
        <span className="block text-sm text-red-400">{errors.cantrips.message}</span>
      )}

      {/* Level 1 Spells Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Wand2 size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white">Level 1 Spells</h3>
              <p className="text-xs text-white/60">
                Select {LEVEL1_SPELL_COUNT} ({selectedLevel1Spells.length}/{LEVEL1_SPELL_COUNT})
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: LEVEL1_SPELL_COUNT }).map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  index < selectedLevel1Spells.length ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {classSpells.level1.map((spell, index) => {
            const isSelected = selectedLevel1Spells.includes(spell.id);
            const isDisabled = !isSelected && selectedLevel1Spells.length >= LEVEL1_SPELL_COUNT;
            return renderSpellCard(
              spell,
              isSelected,
              isDisabled,
              () => toggleLevel1Spell(spell.id),
              index
            );
          })}
        </div>
      </motion.div>

      {errors.level1Spells && (
        <span className="block text-sm text-red-400">{errors.level1Spells.message}</span>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        disabled={
          selectedCantrips.length !== CANTRIP_COUNT ||
          selectedLevel1Spells.length !== LEVEL1_SPELL_COUNT
        }
        className="group bg-primary shadow-primary/30 sticky bottom-6 w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Continue
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </motion.button>
    </form>
  );
}
