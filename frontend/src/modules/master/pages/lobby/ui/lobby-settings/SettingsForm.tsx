import React, { useState } from 'react';
import AvatarPicker from '../../../lobby-create/ui/AvatarPicker';
import MaxPlayersSelect from '../../../lobby-create/ui/MaxPlayersSelect';

type Props = {
  initial?: {
    title?: string;
    description?: string;
    maxPlayers?: number;
    bannerUrl?: string | null;
  };
  onSave?: (data: any) => void;
};

export const SettingsForm: React.FC<Props> = ({ initial, onSave }) => {
  const [title, setTitle] = useState(initial?.title ?? 'Evening of Mystery');
  const [description, setDescription] = useState(initial?.description ?? 'A short one-shot for new players.');
  const [maxPlayers, setMaxPlayers] = useState<number>(initial?.maxPlayers ?? 6);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  function handleSave() {
    const payload = { title, description, maxPlayers, bannerName: bannerFile?.name ?? null };
    onSave?.(payload);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-4 flex flex-col"
    >
      <div className="flex flex-col items-center gap-4">
        <AvatarPicker initialPreview={initial?.bannerUrl ?? null} onFileChange={(f) => setBannerFile(f)} />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-left text-sm text-slate-300">Lobby name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-[12px] border border-white/10 px-3 py-2 text-white bg-transparent"
          />
        </div>

        <div>
          <label className="block text-left text-sm text-slate-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 h-24 w-full rounded-[12px] border border-white/10 px-3 py-2 text-white bg-transparent"
          />
        </div>

        <div>
          <label className="block text-left text-sm text-slate-300">Max players</label>
          <div className="mt-2">
            <MaxPlayersSelect value={maxPlayers} onChange={setMaxPlayers} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="ml-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
