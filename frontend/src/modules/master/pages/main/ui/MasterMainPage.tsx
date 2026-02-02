import { Archive, Folder, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import logoSvg from '~shared/assets/logo.svg';
import { type Tab, UiButton, UiPageHeader, UiTabs } from '~shared/ui';

import { type Campaign, CampaignCard, MOCK_CAMPAIGNS } from '~entities/campaign';

type TabType = 'active' | 'archive';

function CampaignListItem({
  campaign,
  onCampaignClick,
}: {
  campaign: Campaign;
  onCampaignClick: (id: string) => void;
}): ReactElement {
  return (
    <motion.div
      key={campaign.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <CampaignCard campaign={campaign} onClick={onCampaignClick} />
    </motion.div>
  );
}

function CampaignList({
  campaigns,
  activeTab,
  onCampaignClick,
}: {
  campaigns: Campaign[];
  activeTab: TabType;
  onCampaignClick: (id: string) => void;
}): ReactElement {
  return (
    <motion.div
      key={`campaigns-${activeTab}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-4"
    >
      {campaigns.map((campaign) => (
        <CampaignListItem key={campaign.id} campaign={campaign} onCampaignClick={onCampaignClick} />
      ))}
    </motion.div>
  );
}

function InitialEmptyState({ onCreateCampaign }: { onCreateCampaign: () => void }): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <img src={logoSvg} alt="D&D Logo" className="mb-4 size-24" />

      <h2 className="font-display mb-2 text-xl font-bold text-white">No Campaigns Yet</h2>
      <p className="mb-6 max-w-md text-sm text-gray-400">
        Start your journey by creating your first campaign. Build worlds, craft stories, and guide
        your players through epic adventures.
      </p>
      <UiButton icon={<Plus size={20} />} onClick={onCreateCampaign}>
        Create Your First Campaign
      </UiButton>
    </motion.div>
  );
}

export function MasterMainPage() {
  // TODO: Replace with API calls using TanStack Query
  const navigate = useNavigate();
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const activeCampaignsCount = useMemo(
    () => campaigns.filter((campaign) => campaign.status === 'active').length,
    [campaigns]
  );

  const archivedCampaignsCount = useMemo(
    () => campaigns.filter((campaign) => campaign.status === 'archive').length,
    [campaigns]
  );

  const hasBothTypes = activeCampaignsCount > 0 && archivedCampaignsCount > 0;

  const filteredCampaigns = useMemo(
    () =>
      hasBothTypes ? campaigns.filter((campaign) => campaign.status === activeTab) : campaigns,
    [campaigns, activeTab, hasBothTypes]
  );

  const hasCampaigns = campaigns.length > 0;

  function onCreateCampaign() {
    console.log('Create new campaign');
  }

  function onCampaignClick(campaignId: Campaign['id']) {
    console.log('Open campaign:', campaignId);
  }

  function onBackClick() {
    navigate('/');
  }

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'active',
        label: 'Active',
        icon: <Folder size={16} />,
        count: activeCampaignsCount,
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: <Archive size={16} />,
        count: archivedCampaignsCount,
      },
    ],
    [activeCampaignsCount, archivedCampaignsCount]
  );

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <UiPageHeader
        title="Dungeoun Master"
        description="Manage your campaigns and adventures"
        onBackClick={onBackClick}
      />

      {!hasCampaigns ? (
        <InitialEmptyState onCreateCampaign={onCreateCampaign} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="mb-6"
          >
            <UiButton icon={<Plus size={20} />} fullWidth onClick={onCreateCampaign}>
              Create New Campaign
            </UiButton>
          </motion.div>

          {hasBothTypes && (
            <UiTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as TabType)}
            />
          )}

          <CampaignList
            campaigns={filteredCampaigns}
            activeTab={activeTab}
            onCampaignClick={onCampaignClick}
          />
        </>
      )}
    </div>
  );
}
