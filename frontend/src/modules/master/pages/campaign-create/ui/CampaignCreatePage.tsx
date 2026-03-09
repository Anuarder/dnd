import { ImagePlus, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { UiButton, UiPageHeader } from '~shared/ui';

function BannerPicker({
  preview,
  onFileChange,
}: {
  preview: string | null;
  onFileChange: (file: File | null, preview: string | null) => void;
}): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      onFileChange(null, null);
      return;
    }
    const url = URL.createObjectURL(file);
    onFileChange(file, url);
  }

  return (
    <button
      type="button"
      className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5 active:bg-white/10"
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <img src={preview} alt="Campaign banner" className="size-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-2 text-gray-400">
          <ImagePlus size={32} />
          <span className="text-sm">Tap to add banner image</span>
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
    </button>
  );
}

export function CampaignCreatePage(): ReactElement {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = name.trim().length > 0;

  function handleBannerChange(_file: File | null, preview: string | null) {
    setBannerPreview(preview);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Campaign created!');
      navigate('/master');
    }, 600);
  }

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <UiPageHeader
          title="Create Campaign"
          description="Set up a new adventure for your players"
          onBackClick={() => navigate('/master')}
        />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 space-y-5"
        onSubmit={handleSubmit}
      >
        <BannerPicker preview={bannerPreview} onFileChange={handleBannerChange} />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Campaign name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            maxLength={100}
            placeholder="Enter campaign name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/60 focus:outline-none"
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-right text-xs text-gray-500">{name.length}/100</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={description}
            rows={4}
            placeholder="Describe your campaign (optional)"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/60 focus:outline-none"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Users size={16} />
            Max players
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setMaxPlayers((p) => Math.max(2, p - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center text-lg font-bold">{maxPlayers}</span>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
              onClick={() => setMaxPlayers((p) => Math.min(10, p + 1))}
            >
              +
            </button>
            <span className="text-sm text-gray-400">players (2–10)</span>
          </div>
        </div>

        <div className="pt-4">
          <UiButton type="submit" fullWidth disabled={!isValid || isSubmitting}>
            Create Campaign
          </UiButton>
        </div>
      </motion.form>
    </div>
  );
}
