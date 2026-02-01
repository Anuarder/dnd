import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Camera, Mars, Venus, VenusAndMars } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { UiPageHeader } from '~shared/ui';

import { ClassSelectionForm } from './class-selection-form';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const characterSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'Avatar is required')
    .refine((files) => {
      const file = files?.[0];
      return file ? file.size <= MAX_FILE_SIZE : false;
    }, 'Max file size is 5MB')
    .refine((files) => {
      const fileType = files?.[0]?.type;
      return fileType ? ACCEPTED_IMAGE_TYPES.includes(fileType) : false;
    }, 'Only .jpg, .jpeg, .png and .webp formats are supported'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select a valid gender',
  }),
  originStory: z
    .string()
    .min(10, 'Origin story must be at least 10 characters')
    .max(500, 'Origin story cannot exceed 500 characters'),
});

type CharacterFormData = z.infer<typeof characterSchema>;

function BasicInfoForm({ onNext }: { onNext: () => void }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other'>('other');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      gender: 'other',
      originStory: '',
    },
    mode: 'onBlur',
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleGenderSelect(gender: 'male' | 'female' | 'other'): void {
    setSelectedGender(gender);
  }

  function onSubmit(data: CharacterFormData): void {
    console.log('Character data:', data);
    console.log('Avatar file:', data.avatar[0]);
    // TODO: Submit data to backend
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary h-2 w-12 rounded-full"></div>
        <div className="h-2 w-2 rounded-full bg-white/20"></div>
        <div className="h-2 w-2 rounded-full bg-white/20"></div>
        <div className="h-2 w-2 rounded-full bg-white/20"></div>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <label className="border-primary/50 relative block h-36 w-36 cursor-pointer rounded-full border-4 bg-linear-to-b from-gray-800 to-gray-900 transition-all duration-200 ease-out active:scale-95">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              {...register('avatar', {
                onChange: handleAvatarChange,
              })}
              className="sr-only"
            />
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display flex h-full w-full items-center justify-center shadow-inner">
                <span className="text-white/40">No avatar</span>
              </span>
            )}
            <button className="bg-primary absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full shadow-lg">
              <Camera size={20} className="text-white" />
            </button>
          </label>
        </div>
        {errors.avatar && (
          <span className="mt-2 text-sm text-red-400">{errors.avatar.message?.toString()}</span>
        )}
      </div>

      {/* Section Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Who are you?</h2>
        <p className="mt-2 text-white/60">Let&apos;s start with the basics of your legend.</p>
      </div>

      {/* Character Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
          Character Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          placeholder="e.g. Valerius the Bold"
          className="focus:border-primary focus:ring-primary/50 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-200 ease-out focus:bg-white/10 focus:ring-2 focus:outline-none"
        />
        {errors.name && (
          <span className="mt-1 block text-sm text-red-400">{errors.name.message}</span>
        )}
      </div>

      {/* Identity (Gender) */}
      <div>
        <label className="mb-3 block text-sm font-medium text-white">Identity</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleGenderSelect('male')}
            className={`flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 ${
              selectedGender === 'male'
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
            }`}
          >
            <input
              type="radio"
              value="male"
              {...register('gender', {
                onChange: () => handleGenderSelect('male'),
              })}
              className="sr-only"
            />
            <Mars size={28} className="text-white" />
            <span className="text-sm font-semibold text-white">Male</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenderSelect('female')}
            className={`flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 ${
              selectedGender === 'female'
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
            }`}
          >
            <input
              type="radio"
              value="female"
              {...register('gender', {
                onChange: () => handleGenderSelect('female'),
              })}
              className="sr-only"
            />
            <Venus size={28} className="text-white" />
            <span className="text-sm font-semibold text-white">Female</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenderSelect('other')}
            className={`flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 ${
              selectedGender === 'other'
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
            }`}
          >
            <input
              type="radio"
              value="other"
              {...register('gender', {
                onChange: () => handleGenderSelect('other'),
              })}
              className="sr-only"
            />
            <VenusAndMars size={28} className="text-white" />
            <span className="text-sm font-semibold text-white">Other</span>
          </button>
        </div>
        {errors.gender && (
          <span className="mt-1 block text-sm text-red-400">{errors.gender.message}</span>
        )}
      </div>

      {/* Origin Story */}
      <div>
        <label htmlFor="originStory" className="mb-2 block text-sm font-medium text-white">
          Origin Story
        </label>
        <textarea
          id="originStory"
          {...register('originStory')}
          placeholder="Briefly describe where they come from..."
          rows={5}
          className="focus:border-primary focus:ring-primary/50 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-200 ease-out focus:bg-white/10 focus:ring-2 focus:outline-none"
        />
        {errors.originStory && (
          <span className="mt-1 block text-sm text-red-400">{errors.originStory.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group bg-primary shadow-primary/30 relative w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? 'Creating...' : 'Continue'}
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </button>
    </form>
  );
}

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
