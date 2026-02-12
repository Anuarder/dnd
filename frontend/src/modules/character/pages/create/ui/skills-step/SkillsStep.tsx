import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SKILLS, getClassById } from '~modules/character/model/mock-data';

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

function createSkillsSchema(maxSkills: number) {
  return z.object({
    skills: z.array(z.string()).superRefine((skills: string[], ctx) => {
      if (skills.length !== maxSkills) {
        const remaining = maxSkills - skills.length;
        const message =
          remaining > 0
            ? `Please select ${remaining} more skill${remaining > 1 ? 's' : ''}`
            : `Please unselect ${skills.length - maxSkills} skill${skills.length - maxSkills > 1 ? 's' : ''}`;

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
      }
    }),
  });
}

type SkillsFormData = { skills: string[] };

interface SkillsStepProps {
  classId: string;
  onNext: (data: { selectedSkills: string[] }) => void;
}

export function SkillsStep({ classId, onNext }: SkillsStepProps) {
  const characterClass = getClassById(classId);
  const maxSkills = characterClass?.skillCount ?? 0;

  const skillsSchema = createSkillsSchema(maxSkills);

  const { handleSubmit, setValue } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  if (!characterClass) {
    return <div className="px-4 text-white">Class not found</div>;
  }

  const availableSkills = SKILLS.filter((skill) => characterClass.skillOptions.includes(skill.id));

  function toggleSkill(skillId: string): void {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) {
        const newSkills = prev.filter((id) => id !== skillId);
        setValue('skills', newSkills);
        return newSkills;
      }

      if (prev.length >= maxSkills) {
        return prev;
      }

      const newSkills = [...prev, skillId];
      setValue('skills', newSkills);
      return newSkills;
    });
  }

  function onSubmitValid(data: SkillsFormData): void {
    onNext({ selectedSkills: data.skills });
  }

  function onSubmitInvalid(): void {
    const remaining = maxSkills - selectedSkills.length;
    const message =
      remaining > 0
        ? `Please select ${remaining} more skill${remaining > 1 ? 's' : ''}`
        : `Please unselect ${selectedSkills.length - maxSkills} skill${selectedSkills.length - maxSkills > 1 ? 's' : ''}`;

    toast.error(message, {
      description: `You need exactly ${maxSkills} skills selected`,
    });
  }

  function showSkillInfo(
    skill: { id: string; name: string; ability: string; description: string },
    e: React.MouseEvent
  ): void {
    console.log('info', skill);
    e.stopPropagation();

    const abilityName = ABILITY_NAMES[skill.ability] ?? skill.ability;

    toast.message(skill.name, {
      description: `${skill.description}. This skill uses your ${abilityName} (${skill.ability.toUpperCase()}) ability score.`,
    });
  }

  return (
    <form className="space-y-6 px-4 pb-6" onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">Choose Skills</h2>
        <p className="mt-2 text-white/60">
          Select {maxSkills} skill{maxSkills > 1 ? 's' : ''} from your class options
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="rounded-xl border border-white/10 bg-white/5 p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Skills Selected</p>
            <p className="text-2xl font-bold text-white">
              {selectedSkills.length} / {maxSkills}
            </p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: maxSkills }).map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  index < selectedSkills.length ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skills List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="space-y-3"
      >
        {availableSkills.map((skill, index) => {
          const isSelected = selectedSkills.includes(skill.id);
          const isDisabled = !isSelected && selectedSkills.length >= maxSkills;

          return (
            <motion.div
              key={skill.id}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                  : 'border-white/10 bg-white/5 backdrop-blur-sm'
              } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !isDisabled && toggleSkill(skill.id)}
            >
              <span className="flex items-start justify-between">
                <span className="flex flex-1 flex-col">
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-white">{skill.name}</span>
                    <button
                      type="button"
                      className="active:text-primary text-white/40 transition-colors hover:text-white"
                      aria-label={`Learn more about ${skill.name}`}
                      onClick={(e) => showSkillInfo(skill, e)}
                    >
                      <Info size={16} />
                    </button>
                    {isSelected && <Check size={18} className="text-primary" />}
                  </span>
                  <span className="mt-1 text-sm text-white/60">{skill.description}</span>
                  <span className="mt-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white uppercase">
                      {skill.ability}
                    </span>
                  </span>
                </span>
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
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
