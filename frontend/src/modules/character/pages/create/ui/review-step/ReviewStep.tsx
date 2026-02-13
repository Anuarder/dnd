import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Loader2, User, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

import {
  getBackgroundById,
  getClassById,
  getRaceById,
  SKILLS,
} from '~modules/character/model/mock-data';
import type { CharacterCreationData } from '~modules/character/model/types';

interface ReviewStepProps {
  characterData: CharacterCreationData;
}

function calculateModifier(value: number): string {
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Build create payload without avatar (avatar comes from API when fetching) */
function buildCreatePayload(data: CharacterCreationData): {
  name: string;
  level: number;
  class: string;
  race: string;
} | null {
  const { basicInfo, classId, raceId } = data;
  if (!basicInfo || !classId || !raceId) {
    return null;
  }
  const characterClass = getClassById(classId);
  const race = getRaceById(raceId);
  return {
    name: basicInfo.name,
    level: 1,
    class: characterClass?.name ?? classId,
    race: race?.name ?? raceId,
    // avatar not sent on create
  };
}

export function ReviewStep({ characterData }: ReviewStepProps): ReactElement {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const characterClass = characterData.classId ? getClassById(characterData.classId) : null;
  const race = characterData.raceId ? getRaceById(characterData.raceId) : null;
  const background = characterData.backgroundId
    ? getBackgroundById(characterData.backgroundId)
    : null;

  const selectedSkillNames = characterData.selectedSkills
    .map((skillId) => SKILLS.find((s) => s.id === skillId)?.name)
    .filter(Boolean);

  async function handleSubmit(): Promise<void> {
    setIsSubmitting(true);

    // Validate all required fields
    if (
      !characterData.basicInfo ||
      !characterData.classId ||
      !characterData.raceId ||
      !characterData.backgroundId ||
      !characterData.attributes ||
      characterData.selectedSkills.length === 0 ||
      !characterData.equipmentPresetId
    ) {
      alert('Please complete all required steps');
      setIsSubmitting(false);
      return;
    }

    // Mock API call
    try {
      const payload = buildCreatePayload(characterData);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      console.log('Character created:', payload);

      setIsSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate('/player');
      }, 2000);
    } catch (error) {
      console.error('Failed to create character:', error);
      alert('Failed to create character. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
          <Check size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white">Character Created!</h2>
        <p className="mt-2 text-white/60">Redirecting to your characters...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">Review Character</h2>
        <p className="mt-2 text-white/60">Check everything before creating your character</p>
      </motion.div>

      {/* Basic Info */}
      {characterData.basicInfo ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <User size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white">Basic Information</h3>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Name:</span>
              <span className="font-semibold text-white">{characterData.basicInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Gender:</span>
              <span className="font-semibold capitalize text-white">
                {characterData.basicInfo.gender}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Class & Race */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        className="rounded-xl border border-white/10 bg-white/5 p-5"
      >
        <h3 className="text-lg font-bold text-white">Class & Race</h3>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/60">Class:</span>
            <span className="font-semibold text-white">{characterClass?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Race:</span>
            <span className="font-semibold text-white">{race?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Background:</span>
            <span className="font-semibold text-white">{background?.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Attributes */}
      {characterData.attributes ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <h3 className="text-lg font-bold text-white">Attributes</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Object.entries(characterData.attributes).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-white/5 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-white/60">{key}</p>
                <p className="mt-1 text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50">{calculateModifier(value)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}

      {/* Skills */}
      {characterData.selectedSkills.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <h3 className="text-lg font-bold text-white">Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSkillNames.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-primary/30 bg-[#332442]/80 px-3 py-1 text-sm text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ) : null}

      {/* Spells (if caster) */}
      {characterClass?.isCaster &&
        (characterData.selectedCantrips.length > 0 ||
          characterData.selectedLevel1Spells.length > 0) ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Wand2 size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white">Spells</h3>
          </div>
          <div className="mt-4 space-y-3">
            {characterData.selectedCantrips.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-white/60">Cantrips</p>
                <p className="mt-1 text-white">{characterData.selectedCantrips.length} selected</p>
              </div>
            ) : null}
            {characterData.selectedLevel1Spells.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-white/60">Level 1 Spells</p>
                <p className="mt-1 text-white">
                  {characterData.selectedLevel1Spells.length} selected
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}

      {/* Submit Button */}
      <div className="sticky bottom-6 mt-auto pt-4">
        <motion.button
          type="button"
          disabled={isSubmitting}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          className="bg-primary/95 shadow-primary/30 block w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 ease-out active:scale-[0.98] active:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSubmit}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Creating Character...</span>
              </>
            ) : (
              <>
                <span>Create Character</span>
                <Check size={20} />
              </>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
