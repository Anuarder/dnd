import { motion } from 'motion/react';
import { useState } from 'react';
import AvatarPicker from './ui/AvatarPicker';
import CreateButton from './ui/CreateButton';
import MaxPlayersSelect from './ui/MaxPlayersSelect';

export function LobbyCreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState<number>(5);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(file: File | null, p: string | null) {
    setAvatarFile(file);
    setPreview(p);
  }

  function handleCreate() {
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      maxPlayers,
      avatarName: avatarFile?.name ?? null,
    } as const;

    console.log('create lobby', payload);
  }

  const isCreateDisabled = !title.trim();

  return (
    <div className="bg-dark-primary flex min-h-dvh justify-center px-2 pt-2 pb-9 text-center text-pretty text-white">
      <div className="flex w-full max-w-[720px] flex-col items-center gap-5 p-4">
        <div
          className="absolute inset-x-0 top-0 z-0 h-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(127, 19, 236, 0.18) 10%, rgb(25, 16, 34) 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-[1] w-full"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Create a new lobby</h1>
            <p className="text-slate-300 mt-1">Configure a session and invite players.</p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-full z-[1] pa-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className="flex flex-col gap-4">
            <AvatarPicker initialPreview={preview} onFileChange={handleFileChange} />

            <div>
              <label className="block text-left text-sm text-slate-300">Lobby name</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-[16px] border border-white/10 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none"
                style={{ background: 'linear-gradient(90deg, rgba(127,19,236,0.08) 0%, rgba(147,51,234,0.08) 100%)' }}
                placeholder="Enter a short title for your lobby"
                required
              />
            </div>

            <div>
              <label className="block text-left text-sm text-slate-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 h-28 w-full rounded-[16px] border border-white/10 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none"
                style={{ background: 'linear-gradient(90deg, rgba(127,19,236,0.04) 0%, rgba(147,51,234,0.04) 100%)' }}
                placeholder="Add a short description or session notes"
              />
            </div>

            <div>
              <label className="block text-left text-sm text-slate-300">Max players</label>
              <div className="mt-2">
                <MaxPlayersSelect value={maxPlayers} onChange={setMaxPlayers} />
              </div>
            </div>
          </div>

          <CreateButton disabled={isCreateDisabled}>Create lobby</CreateButton>
        </motion.form>
      </div>
    </div>
  );
}

export default LobbyCreatePage;
