import { Link2 } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { UiButton, UiPageHeader } from '~shared/ui';
import { MOCK_CHARACTERS } from '~entities/character';

export function JoinCampaignPage(): ReactElement {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCharacters = MOCK_CHARACTERS.filter((c) => c.status === 'active');
  const isValid = inviteCode.length === 6 && password.trim().length > 0 && characterId !== '';

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInviteCode(e.target.value.toUpperCase().slice(0, 6));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Joined campaign!');
      navigate('/player');
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
          title="Join Campaign"
          description="Enter the invite code from your Dungeon Master"
          onBackClick={() => navigate('/player')}
        />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 space-y-5"
        onSubmit={handleSubmit}
      >
        {/* Invite code */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Invite code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={inviteCode}
            placeholder="XXXXXX"
            maxLength={6}
            autoCapitalize="characters"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em] text-white placeholder:text-gray-600 focus:border-primary/60 focus:outline-none"
            onChange={handleCodeChange}
          />
          <p className="text-center text-xs text-gray-500">{inviteCode.length}/6 characters</p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter campaign password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/60 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Character selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Select character <span className="text-red-400">*</span>
          </label>
          {activeCharacters.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-sm text-gray-400">No active characters.</p>
              <button
                type="button"
                className="mt-2 text-sm text-primary active:opacity-70"
                onClick={() => navigate('/character/create')}
              >
                Create a character first
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {activeCharacters.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors active:bg-white/10 ${
                    characterId === character.id
                      ? 'border-primary/60 bg-primary/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                  onClick={() => setCharacterId(character.id)}
                >
                  {character.image_url && (
                    <img
                      src={character.image_url}
                      alt={character.name}
                      className="size-10 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-white">{character.name}</span>
                    <span className="text-xs text-gray-400">
                      {character.class} Lv.{character.level} · {character.race}
                    </span>
                  </span>
                  {characterId === character.id && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <UiButton
            type="submit"
            fullWidth
            icon={<Link2 size={18} />}
            disabled={!isValid || isSubmitting}
          >
            Join Campaign
          </UiButton>
        </div>
      </motion.form>
    </div>
  );
}
