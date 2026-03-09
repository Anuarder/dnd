import {
  Archive,
  Check,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  RefreshCw,
  Swords,
} from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { UiButton, UiPageHeader } from '~shared/ui';
import type { CampaignPlayer } from '~entities/campaign';
import { MOCK_CAMPAIGN_DETAIL } from '~entities/session';

function InviteCodePanel({
  code,
  password,
  onRegenerate,
}: {
  code: string;
  password: string;
  onRegenerate: () => void;
}): ReactElement {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  function handleCopyCode() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Invite</h3>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Code</p>
          <p className="font-mono text-xl font-bold tracking-widest text-primary">{code}</p>
        </div>
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-medium text-white active:bg-white/20"
          onClick={handleCopyCode}
        >
          {codeCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          <span>{codeCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Password</p>
          <p className="font-mono text-base tracking-wider text-white">
            {passwordVisible ? password : '••••••••••'}
          </p>
        </div>
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white/10 text-white active:bg-white/20"
          onClick={() => setPasswordVisible((v) => !v)}
        >
          {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <button
        type="button"
        className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm text-gray-400 active:bg-white/5"
        onClick={onRegenerate}
      >
        <RefreshCw size={14} />
        <span>Regenerate Code</span>
      </button>
    </div>
  );
}

function PlayerRosterItem({ player }: { player: CampaignPlayer }): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
      <div
        className={`size-3 shrink-0 rounded-full ${player.is_ready ? 'bg-green-400' : 'bg-gray-600'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-white">{player.player_name}</p>
        <p className="truncate text-xs text-gray-400">
          {player.character_name} · {player.character_class} Lv.{player.character_level}
        </p>
      </div>
      <span
        className={`text-xs font-medium ${player.is_ready ? 'text-green-400' : 'text-gray-500'}`}
      >
        {player.is_ready ? 'Ready' : 'Not ready'}
      </span>
    </div>
  );
}

export function MasterCampaignDetailPage(): ReactElement {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGN_DETAIL;
  const [inviteCode, setInviteCode] = useState(campaign.invite_code);

  function handleRegenerate() {
    const newCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    setInviteCode(newCode);
    toast.success('Invite code regenerated');
  }

  function handleStartSession() {
    navigate(`/master/campaign/${id}/session`);
  }

  function handleArchive() {
    toast.success('Campaign archived');
    navigate('/master');
  }

  function handleEdit() {
    navigate(`/master/campaign/create`);
  }

  const hasPlayers = campaign.players.length > 0;

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <UiPageHeader title="Campaign" onBackClick={() => navigate('/master')} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
        className="mt-6 space-y-5"
      >
        {/* Banner */}
        {campaign.image_url && (
          <div className="relative h-44 w-full overflow-hidden rounded-xl">
            <img
              src={campaign.image_url}
              alt={campaign.name}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            </div>
          </div>
        )}

        {!campaign.image_url && (
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
        )}

        {campaign.description && (
          <p className="text-sm text-gray-400">{campaign.description}</p>
        )}

        {/* Invite panel */}
        <InviteCodePanel
          code={inviteCode}
          password={campaign.invite_password}
          onRegenerate={handleRegenerate}
        />

        {/* Player roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Players ({campaign.players.length}/{campaign.max_players})
            </h3>
          </div>
          {hasPlayers ? (
            <div className="space-y-2">
              {campaign.players.map((player) => (
                <PlayerRosterItem key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">
              No players yet. Share the invite code.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <UiButton
            fullWidth
            icon={<Swords size={18} />}
            disabled={!hasPlayers}
            onClick={handleStartSession}
          >
            Start Session
          </UiButton>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex flex-1 min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 active:bg-white/10"
              onClick={handleEdit}
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="flex flex-1 min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-sm text-red-400 active:bg-red-500/20"
              onClick={handleArchive}
            >
              <Archive size={16} />
              <span>Archive</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
