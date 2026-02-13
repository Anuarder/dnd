import type { Campaign } from './types';

/**
 * Mock campaign data for development and testing
 */

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'The Lost Mines of Phandelver',
    description:
      'A classic adventure for new players exploring the dangers of the Sword Coast. Follow the trail of a missing dwarf and uncover ancient secrets.',
    master_id: 'mock-user-1',
    image_url: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=400&h=300&fit=crop',
    status: 'archive',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Curse of Strahd',
    description:
      'A gothic horror adventure in the mist-shrouded land of Barovia. Face the legendary vampire Strahd von Zarovich in his own domain.',
    master_id: 'mock-user-1',
    image_url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&h=300&fit=crop',
    status: 'active',
    created_at: '2026-01-18T14:30:00Z',
    updated_at: '2026-01-18T14:30:00Z',
  },
  {
    id: '3',
    name: 'Waterdeep: Dragon Heist',
    description:
      'A treasure hunt through the streets of Waterdeep. Navigate political intrigue and deadly rivals to claim a legendary hoard.',
    master_id: 'mock-user-1',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    status: 'archive',
    created_at: '2026-01-15T09:15:00Z',
    updated_at: '2026-01-15T09:15:00Z',
  },
  {
    id: '4',
    name: 'Tomb of Annihilation',
    description: null,
    master_id: 'mock-user-1',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    status: 'archive',
    created_at: '2026-01-10T16:45:00Z',
    updated_at: '2026-01-10T16:45:00Z',
  },
];

/**
 * Empty mock campaigns array for testing empty state
 */
export const MOCK_CAMPAIGNS_EMPTY: Campaign[] = [];
