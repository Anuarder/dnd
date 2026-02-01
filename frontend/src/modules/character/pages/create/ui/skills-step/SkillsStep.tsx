import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getClassById, SKILLS } from '~modules/character/model/mock-data';

const skillsSchema = z.object({
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

interface SkillsStepProps {
  classId: string;
  onNext: (data: { selectedSkills: string[] }) => void;
}

export function SkillsStep({ classId, onNext }: SkillsStepProps) {
  const characterClass = getClassById(classId);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  if (!characterClass) {
    return <div className="px-4 text-white">Class not found</div>;
  }

  const maxSkills = characterClass.skillCount;
  const availableSkills = SKILLS.filter((skill) =>
    characterClass.skillOptions.includes(skill.id)
  );

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

  function onSubmit(data: SkillsFormData): void {
    if (data.skills.length !== maxSkills) {
      alert(`Please select exactly ${maxSkills} skills`);
      return;
    }
    onNext({ selectedSkills: data.skills });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 pb-6">
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
            <motion.button
              key={skill.id}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
              onClick={() => toggleSkill(skill.id)}
              disabled={isDisabled}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                  : 'border-white/10 bg-white/5 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{skill.name}</h3>
                    {isSelected && <Check size={18} className="text-primary" />}
                  </div>
                  <p className="mt-1 text-sm text-white/60">{skill.description}</p>
                  <div className="mt-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-white">
                      {skill.ability}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {errors.skills && (
        <span className="block text-sm text-red-400">{errors.skills.message}</span>
      )}

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        type="submit"
        disabled={selectedSkills.length !== maxSkills}
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
