import { type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mars, Venus, VenusAndMars } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { z } from 'zod';

const characterSchema = z.object({
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

interface BasicInfoFormSubmitData {
  name: string;
  gender: 'male' | 'female' | 'other';
  originStory: string;
}

interface BasicInfoFormProps {
  onNext: (data: BasicInfoFormSubmitData) => void;
}

export function BasicInfoForm({ onNext }: BasicInfoFormProps): ReactElement {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      gender: 'male',
      originStory: '',
    },
    mode: 'onBlur',
  });

  const selectedGender = watch('gender');

  function onSubmit(data: CharacterFormData): void {
    toast.dismiss();
    onNext({
      name: data.name,
      gender: data.gender,
      originStory: data.originStory,
    });
  }

  function onInvalid(): void {
    toast.dismiss();
    toast.error('Form Incomplete', {
      description: 'Please check the required fields and ensure everything is filled correctly.',
    });
  }

  return (
    <form className="flex flex-1 flex-col gap-8 px-4 pb-6" onSubmit={handleSubmit(onSubmit, onInvalid)}>
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="font-display"
      >
        <h2 className="text-3xl font-bold text-white">Who are you?</h2>
        <p className="mt-2 text-white/60">Let&apos;s start with the basics of your legend.</p>
      </motion.div>

      <div className="flex flex-1 flex-col gap-8">
        {/* Character Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
            Character Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Valerius the Bold"
            className="focus:border-primary focus:ring-primary/50 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-200 ease-out focus:bg-white/10 focus:ring-2 focus:outline-none"
            {...register('name')}
          />
          {errors.name ? (
            <span className="mt-1 block text-sm text-red-400">{errors.name.message}</span>
          ) : null}
        </motion.div>

        {/* Identity (Gender) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        >
          <label className="mb-3 block text-sm font-medium text-white">Identity</label>

          <div className="grid grid-cols-3 gap-3">
            <label
              className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 ${selectedGender === 'male'
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
                }`}
            >
              <input
                type="radio"
                value="male"
                className="sr-only"
                {...register('gender')}
              />
              <Mars size={28} className="text-white" />
              <span className="text-sm font-semibold text-white">Male</span>
            </label>

            <label
              className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 ${selectedGender === 'female'
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
                }`}
            >
              <input
                type="radio"
                value="female"
                className="sr-only"
                {...register('gender')}
              />
              <Venus size={28} className="text-white" />
              <span className="text-sm font-semibold text-white">Female</span>
            </label>

            <label
              className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 ${selectedGender === 'other'
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
                }`}
            >
              <input
                type="radio"
                value="other"
                className="sr-only"
                {...register('gender')}
              />
              <VenusAndMars size={28} className="text-white" />
              <span className="text-sm font-semibold text-white">Other</span>
            </label>
          </div>

          {errors.gender ? (
            <span className="mt-1 block text-sm text-red-400">{errors.gender.message}</span>
          ) : null}
        </motion.div>

        {/* Origin Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-1 flex-col"
        >
          <label htmlFor="originStory" className="mb-2 block text-sm font-medium text-white">
            Origin Story
          </label>

          <textarea
            id="originStory"
            placeholder="Briefly describe where they come from..."
            rows={5}
            className="focus:border-primary focus:ring-primary/50 w-full flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-200 ease-out focus:bg-white/10 focus:ring-2 focus:outline-none"
            {...register('originStory')}
          />

          {errors.originStory ? (
            <span className="mt-1 block text-sm text-red-400">{errors.originStory.message}</span>
          ) : null}
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        disabled={isSubmitting}
        className="group bg-primary shadow-primary/30 sticky bottom-6 w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? <span>Creating...</span> : <span>Continue</span>}
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </motion.button>
    </form>
  );
}
