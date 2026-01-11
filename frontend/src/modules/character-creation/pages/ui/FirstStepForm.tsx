import { ArrowRight, Camera, Mars, Venus, Transgender } from 'lucide-react';
import { RadioGender } from './RadioGender';
import { useRef, useState } from 'react';

type FormData = {
  name: string;
  gender: 'male' | 'female' | 'other';
  backstory: string;
  avatar?: File | null;
};

export function FirstStepForm({
  defaultValues,
  onNext,
}: {
  defaultValues?: Partial<FormData>;
  onNext: (data: FormData) => void;
}) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [gender, setGender] = useState<FormData['gender']>(
    (defaultValues?.gender as FormData['gender']) ?? 'male'
  );
  const [backstory, setBackstory] = useState(defaultValues?.backstory ?? '');
  const [avatar, setAvatar] = useState<File | null>(defaultValues?.avatar ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatar(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function removeAvatar() {
    setAvatar(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!name.trim()) {
      // minimal validation
      return;
    }

    const data: FormData = { name: name.trim(), gender, backstory, avatar };
    onNext(data);
  }

  const isNextDisabled = !name.trim();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4 pb-18">
        <div className="mx-auto">
          <div className="relative inline-block overflow-visible">
            <div className="h-28 w-28 overflow-hidden rounded-full bg-white/5 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="text-slate-400">No avatar</div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              aria-label="Choose avatar"
              className="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md hover:scale-105 transform transition"
            >
              <Camera size={16} />
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />
        </div>

        <div className="flex items-center justify-center">
          {preview && (
            <button
              type="button"
              className="text-sm text-red-400 underline"
              onClick={removeAvatar}
            >
              Remove
            </button>
          )}
        </div>

        <div>
          <h4 className='text-[38px] text-white text-left'>Who are you?</h4>
          <p className='text-lg text-slate-300 text-left'>Let's start with the basics of your legend.</p>
        </div>

        <div>
          <label className="block text-left text-sm text-slate-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-[16px] border border-white/10 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none"
            style={{ background: 'linear-gradient(90deg, rgba(127,19,236,0.2) 0%, rgba(147,51,234,0.2) 100%)' }}
            placeholder="Your character's name"
            required
          />
        </div>

        <div>
          <label className="block text-left text-sm text-slate-300">Gender</label>
          <div role="radiogroup" aria-label="Gender" className="mt-2 grid grid-cols-3 gap-3">
            <RadioGender
              name="gender"
              value="male"
              label="Male"
              selected={gender === 'male'}
              onSelect={() => setGender('male')}
              icon={<Mars className={gender === 'male' ? 'text-primary' : 'text-slate-400'} size={24} />}
            />

            <RadioGender
              name="gender"
              value="female"
              label="Female"
              selected={gender === 'female'}
              onSelect={() => setGender('female')}
              icon={<Venus className={gender === 'female' ? 'text-primary' : 'text-slate-400'} size={24} />}
            />

            <RadioGender
              name="gender"
              value="other"
              label="Other"
              selected={gender === 'other'}
              onSelect={() => setGender('other')}
              icon={<Transgender className={gender === 'other' ? 'text-primary' : 'text-slate-400'} size={24} />}
            />
          </div>
        </div>

        <div>
          <label className="block text-left text-sm text-slate-300">Backstory</label>
          <textarea
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            className="mt-2 h-28 w-full rounded-[16px] border border-white/10 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none"
            style={{ background: 'linear-gradient(90deg, rgba(127,19,236,0.2) 0%, rgba(147,51,234,0.2) 100%)' }}
            placeholder="Tell a short pre-history of your character"
          />
        </div>

      </div>

      {/* Fixed submit button at viewport bottom */}
      <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[400px] px-4 pointer-events-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isNextDisabled}
            aria-disabled={isNextDisabled}
            className={
              `relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium shadow-lg duration-300 active:scale-95 ` +
              (isNextDisabled
                ? 'bg-primary/40 text-white cursor-not-allowed opacity-60'
                : 'bg-primary text-white active:bg-primary/90')
            }
          >
            <span>Next</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default FirstStepForm;
