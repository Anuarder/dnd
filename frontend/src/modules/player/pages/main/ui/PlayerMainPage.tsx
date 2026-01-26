import { ArrowRight, Link2, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { UiButton, UiPageHeader } from '~shared/ui';

import { type Campaign, MOCK_CAMPAIGNS } from '~entities/campaign';
import {
  type Character,
  CharacterBanner,
  CharacterCard,
  MOCK_CHARACTERS,
} from '~entities/character';

function CampaignBanner({
  campaign,
  legendName,
  onJoinCampaign,
  onConnectToCampaign,
}: {
  campaign: Campaign | null;
  legendName?: string;
  onJoinCampaign: () => void;
  onConnectToCampaign: () => void;
}): ReactElement {
  if (!campaign) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="bg-surface-dark flex flex-col items-center justify-center rounded-xl border border-white/5 p-8 text-center shadow-lg"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-500/20">
          <Link2 size={32} className="text-blue-400" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-white">No Active Campaign</h3>
        <p className="mb-6 max-w-sm text-sm text-gray-400">
          Connect to a campaign to start your adventure with other players.
        </p>
        <UiButton onClick={onConnectToCampaign} icon={<Link2 size={20} />}>
          Connect to Campaign
        </UiButton>
      </motion.div>
    );
  }

  const DEFAULT_CAMPAIGN_IMAGE =
    'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=300&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={14} className="text-yellow-400" />
        <span className="text-xs font-semibold tracking-wide text-yellow-400 uppercase">
          Last Active Campaign
        </span>
      </div>

      <div className="bg-surface-dark overflow-hidden rounded-xl border border-white/5 shadow-lg">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
            <img
              src={campaign.image_url || DEFAULT_CAMPAIGN_IMAGE}
              alt={campaign.name}
              className="size-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-white">{campaign.name}</h3>
            {legendName && <p className="text-sm text-gray-400">Legend: {legendName}</p>}
          </div>

          <div className="flex flex-col gap-3 sm:shrink-0">
            <UiButton onClick={onJoinCampaign} size="sm" icon={<ArrowRight size={16} />}>
              Join Campaign
            </UiButton>
            <button
              type="button"
              onClick={onConnectToCampaign}
              className="text-sm text-gray-400 transition-colors duration-200 ease-out active:text-gray-300"
            >
              Connect to another
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CharacterListItem({
  character,
  onCharacterClick,
}: {
  character: Character;
  onCharacterClick: (id: string) => void;
}): ReactElement {
  return (
    <motion.div
      key={character.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <CharacterCard character={character} onClick={onCharacterClick} />
    </motion.div>
  );
}

function CharacterList({
  characters,
  onCharacterClick,
}: {
  characters: Character[];
  onCharacterClick: (id: string) => void;
}): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-4"
    >
      {characters.map((character) => (
        <CharacterListItem
          key={character.id}
          character={character}
          onCharacterClick={onCharacterClick}
        />
      ))}
    </motion.div>
  );
}

export function PlayerMainPage() {
  // TODO: Replace with API calls using TanStack Query
  const navigate = useNavigate();
  const [characters] = useState<Character[]>(MOCK_CHARACTERS);
  const [lastActiveCampaign] = useState<Campaign | null>(
    MOCK_CAMPAIGNS.find((c) => c.status === 'active') || null
  );

  const activeCharacters = useMemo(
    () => characters.filter((character) => character.status === 'active'),
    [characters]
  );

  const hasCharacters = activeCharacters.length > 0;

  // Get the first active character's name for the campaign banner
  const activeLegendName = activeCharacters[0]?.name;

  function onCreateCharacter() {
    navigate('/character/create');
  }

  function onCharacterClick(characterId: Character['id']) {
    navigate(`/character/${characterId}`);
  }

  function onJoinCampaign() {
    console.log('Join campaign');
  }

  function onConnectToCampaign() {
    console.log('Connect to campaign');
  }

  function onViewArchive() {
    navigate('/player/archive');
  }

  function onBackClick() {
    navigate('/');
  }

  return (
    <div className="mesh-gradient min-h-dvh px-4 py-6 text-white">
      <div className="mx-auto max-w-4xl">
        <UiPageHeader
          title="Player"
          description="Your campaigns and legends"
          onBackClick={onBackClick}
        />

        {/* Campaigns Section */}
        <section className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase"
          >
            Campaigns
          </motion.h2>
          <CampaignBanner
            campaign={lastActiveCampaign}
            legendName={activeLegendName}
            onJoinCampaign={onJoinCampaign}
            onConnectToCampaign={onConnectToCampaign}
          />
        </section>

        {/* Legends Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
            className="mb-4"
          >
            <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
              Your Legends
            </h2>
          </motion.div>

          {!hasCharacters ? (
            <CharacterBanner onCreateCharacter={onCreateCharacter} />
          ) : (
            <>
              <CharacterList characters={activeCharacters} onCharacterClick={onCharacterClick} />

              {hasCharacters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
                  className="mt-6 text-center"
                >
                  <button
                    type="button"
                    onClick={onViewArchive}
                    className="text-sm text-gray-500 transition-colors duration-200 ease-out active:text-gray-400"
                  >
                    Archived Legends
                  </button>
                </motion.div>
              )}
            </>
          )}
        </section>

        {/* Sticky Create Button */}
        {hasCharacters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="pointer-events-none sticky bottom-5 z-1 mx-auto mt-6 max-w-4xl"
          >
            <UiButton
              className="pointer-events-auto"
              fullWidth
              icon={<Plus size={20} />}
              onClick={onCreateCharacter}
            >
              Create New Legend
            </UiButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
