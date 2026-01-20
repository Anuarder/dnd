import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

type Props = {
  initialPreview?: string | null;
  onFileChange?: (file: File | null, preview: string | null) => void;
};

export const AvatarPicker: React.FC<Props> = ({ initialPreview = null, onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileChange?.(file, url);
    } else {
      setPreview(null);
      onFileChange?.(null, null);
    }
  }

  return (
    <div className="mx-auto">
      <div className="relative inline-block overflow-visible">
        <div className="h-32 w-32 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={preview} alt="avatar preview" className="h-full w-full object-cover" />
          ) : (
            <div className="text-slate-400">No image</div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          aria-label="Choose image"
          className="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md hover:scale-105 transform transition"
        >
          <Camera size={16} />
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" />
    </div>
  );
};

export default AvatarPicker;
