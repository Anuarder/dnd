import { useNavigate } from 'react-router';

import { isClassCaster } from '~modules/character/model/mock-data';
import { useCharacterCreationStore } from '~modules/character/model/character-creation-store';
import type {
  Attributes,
  CharacterBasicInfo,
  CharacterCreationStep,
} from '~modules/character/model/types';
import { UiPageHeader } from '~shared/ui';

import { getRaceById } from '~modules/character/model/mock-data';

import { AttributesStep } from './attributes-step';
import { BackgroundStep } from './background-step';
import { BasicInfoForm } from './basic-info-form';
import { ClassSelectionForm } from './class-selection-form';
import { EquipmentStep } from './equipment-step';
import { RaceSelectionForm } from './race-selection-form';
import { ReviewStep } from './review-step';
import { SkillsStep } from './skills-step';
import { SpellsStep } from './spells-step';
import { SubraceSelectionForm } from './subrace-selection-form';

const STEP_ORDER: CharacterCreationStep[] = [
  'basic-info',
  'class-selection',
  'race-selection',
  'subrace-selection',
  'background',
  'attributes',
  'skills',
  'equipment',
  'spells',
  'review',
];

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    setBasicInfo,
    setClass,
    setRace,
    setBackground,
    setAttributes,
    setSkills,
    setEquipment,
    setSpells,
    getCharacterData,
    basicInfo,
    classId,
    raceId,
  } = useCharacterCreationStore();

  function getNextStep(current: CharacterCreationStep): CharacterCreationStep | null {
    const currentIndex = STEP_ORDER.indexOf(current);

    // Skip subrace step if race has no subraces
    if (current === 'race-selection' && raceId) {
      const race = getRaceById(raceId);
      if (!race?.subraces || race.subraces.length === 0) {
        return 'background';
      }
    }

    // Skip spells step if not a caster
    if (current === 'equipment' && classId && !isClassCaster(classId)) {
      return 'review';
    }

    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      return nextStep ?? null;
    }

    return null;
  }

  function getPreviousStep(current: CharacterCreationStep): CharacterCreationStep | null {
    const currentIndex = STEP_ORDER.indexOf(current);

    // Skip subrace step if race has no subraces when going back
    if (current === 'background' && raceId) {
      const race = getRaceById(raceId);
      if (!race?.subraces || race.subraces.length === 0) {
        return 'race-selection';
      }
    }

    // Skip spells step if not a caster when going back
    if (current === 'review' && classId && !isClassCaster(classId)) {
      return 'equipment';
    }

    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      return prevStep ?? null;
    }

    return null;
  }

  function handleNext(
    step: CharacterCreationStep,
    data?:
      | CharacterBasicInfo
      | { classId: string }
      | { raceId: string }
      | { subraceId: string }
      | { backgroundId: string }
      | { attributes: Attributes }
      | { selectedSkills: string[] }
      | { equipmentPresetId: string }
      | { selectedCantrips: string[]; selectedLevel1Spells: string[] }
  ): void {
    // Save data based on step
    switch (step) {
      case 'basic-info':
        if (data && 'name' in data) {
          setBasicInfo(data);
        }
        break;
      case 'class-selection':
        if (data && 'classId' in data) {
          setClass(data.classId);
        }
        break;
      case 'race-selection':
        if (data && 'raceId' in data) {
          setRace(data.raceId, undefined);
        }
        break;
      case 'subrace-selection':
        if (data && 'subraceId' in data && raceId) {
          setRace(raceId, data.subraceId);
        }
        break;
      case 'background':
        if (data && 'backgroundId' in data) {
          setBackground(data.backgroundId);
        }
        break;
      case 'attributes':
        if (data && 'attributes' in data) {
          setAttributes(data.attributes);
        }
        break;
      case 'skills':
        if (data && 'selectedSkills' in data) {
          setSkills(data.selectedSkills);
        }
        break;
      case 'equipment':
        if (data && 'equipmentPresetId' in data) {
          setEquipment(data.equipmentPresetId);
        }
        break;
      case 'spells':
        if (data && 'selectedCantrips' in data && 'selectedLevel1Spells' in data) {
          setSpells(data.selectedCantrips, data.selectedLevel1Spells);
        }
        break;
    }

    // Move to next step
    const nextStep = getNextStep(step);
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  }

  function handleBack(): void {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep);
    } else {
      navigate('/player');
    }
  }

  function renderStep(): React.ReactElement {
    switch (currentStep) {
      case 'basic-info':
        return (
          <BasicInfoForm
            onNext={(data) => {
              const basicInfo: CharacterBasicInfo = {
                name: data.name,
                avatar: data.avatar ?? null,
                gender: data.gender,
                originStory: data.originStory,
              };
              handleNext('basic-info', basicInfo);
            }}
          />
        );

      case 'class-selection':
        return (
          <ClassSelectionForm
            gender={basicInfo?.gender || 'male'}
            onNext={(classId) => handleNext('class-selection', { classId })}
          />
        );

      case 'race-selection':
        return <RaceSelectionForm onNext={(data) => handleNext('race-selection', data)} />;

      case 'subrace-selection':
        return raceId ? (
          <SubraceSelectionForm
            raceId={raceId}
            onNext={(data) => handleNext('subrace-selection', data)}
          />
        ) : (
          <div className="px-4 text-white">Please select a race first</div>
        );

      case 'background':
        return <BackgroundStep onNext={(data) => handleNext('background', data)} />;

      case 'attributes':
        return <AttributesStep onNext={(data) => handleNext('attributes', data)} />;

      case 'skills':
        return classId ? (
          <SkillsStep classId={classId} onNext={(data) => handleNext('skills', data)} />
        ) : (
          <div className="px-4 text-white">Please select a class first</div>
        );

      case 'equipment':
        return classId ? (
          <EquipmentStep classId={classId} onNext={(data) => handleNext('equipment', data)} />
        ) : (
          <div className="px-4 text-white">Please select a class first</div>
        );

      case 'spells':
        return classId ? (
          <SpellsStep classId={classId} onNext={(data) => handleNext('spells', data)} />
        ) : (
          <div className="px-4 text-white">Please select a class first</div>
        );

      case 'review':
        return <ReviewStep characterData={getCharacterData()} />;

      default:
        return <div className="px-4 text-white">Unknown step</div>;
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col text-white">
      <div className="flex flex-1 flex-col">
        <div className="px-4 pt-6">
          <UiPageHeader
            title="Create Character"
            description="Design and customize a new character"
            onBackClick={handleBack}
          />
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
