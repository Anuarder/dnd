import { useState } from 'react';
import { useNavigate } from 'react-router';

import { UiPageHeader } from '~shared/ui';

import { BasicInfoForm } from './basic-info-form';
import { ClassSelectionForm } from './class-selection-form';

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'basic-info' | 'class-selection'>('class-selection');

  function onBackClick() {
    if (step === 'class-selection') {
      setStep('basic-info');
    } else {
      navigate('/player');
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col text-white">
      <div className="flex flex-1 flex-col">
        <div className="px-4 pt-6">
          <UiPageHeader
            title="Create Character"
            description="Design and customize a new character"
            onBackClick={onBackClick}
          />
        </div>

        {step === 'basic-info' ? (
          <BasicInfoForm onNext={() => setStep('class-selection')} />
        ) : (
          <ClassSelectionForm gender="male" />
        )}
      </div>
    </div>
  );
}
