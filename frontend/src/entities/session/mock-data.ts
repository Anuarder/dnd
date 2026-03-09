import type { CampaignDetail } from '~entities/campaign';
import type { Combatant, Message, PlayerThread, Session } from './types';

export const MOCK_SESSION: Session = {
  id: 'session-1',
  campaign_id: '2',
  status: 'active',
  round: 3,
  started_at: '2026-03-09T18:00:00Z',
};

export const MOCK_CAMPAIGN_DETAIL: CampaignDetail = {
  id: '2',
  name: 'Curse of Strahd',
  description:
    'A gothic horror adventure in the mist-shrouded land of Barovia. Face the legendary vampire Strahd von Zarovich in his own domain.',
  master_id: 'mock-user-1',
  image_url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&h=300&fit=crop',
  status: 'active',
  created_at: '2026-01-18T14:30:00Z',
  updated_at: '2026-01-18T14:30:00Z',
  invite_code: 'STRHD5',
  invite_password: 'barovia2026',
  max_players: 5,
  players: [
    {
      id: 'p1',
      user_id: 'user-2',
      player_name: 'Alice',
      character_id: '1',
      character_name: 'Thorin Ironforge',
      character_class: 'Fighter',
      character_level: 5,
      is_ready: true,
    },
    {
      id: 'p2',
      user_id: 'user-3',
      player_name: 'Bob',
      character_id: '2',
      character_name: 'Elara Moonwhisper',
      character_class: 'Wizard',
      character_level: 7,
      is_ready: true,
    },
    {
      id: 'p3',
      user_id: 'user-4',
      player_name: 'Carol',
      character_id: '3',
      character_name: 'Shadowblade',
      character_class: 'Rogue',
      character_level: 4,
      is_ready: false,
    },
  ],
};

export const MOCK_COMBATANTS: Combatant[] = [
  {
    id: 'c1',
    name: 'Thorin Ironforge',
    initiative: 18,
    type: 'player',
    is_current_turn: true,
  },
  {
    id: 'c2',
    name: 'Elara Moonwhisper',
    initiative: 15,
    type: 'player',
    is_current_turn: false,
  },
  {
    id: 'c3',
    name: 'Shadowblade',
    initiative: 12,
    type: 'player',
    is_current_turn: false,
  },
  {
    id: 'c4',
    name: 'Goblin Scout',
    initiative: 10,
    type: 'npc',
    hp: 7,
    max_hp: 7,
    is_current_turn: false,
  },
  {
    id: 'c5',
    name: 'Goblin Archer',
    initiative: 8,
    type: 'npc',
    hp: 3,
    max_hp: 7,
    is_current_turn: false,
  },
];

export const MOCK_PLAYER_THREADS: PlayerThread[] = [
  {
    player_id: 'p1',
    player_name: 'Alice',
    unread_count: 2,
    messages: [
      { id: 'm1', from: 'player', text: 'Can I attempt to pick the lock?', timestamp: '18:02' },
      {
        id: 'm2',
        from: 'dm',
        text: 'Roll Thieves Tools — DC 15.',
        timestamp: '18:03',
      },
      { id: 'm3', from: 'player', text: 'I rolled a 17!', timestamp: '18:04' },
      { id: 'm4', from: 'dm', text: 'The lock clicks open. Well done.', timestamp: '18:05' },
    ],
  },
  {
    player_id: 'p2',
    player_name: 'Bob',
    unread_count: 0,
    messages: [
      {
        id: 'm5',
        from: 'player',
        text: 'I secretly cast Detect Magic on the chest.',
        timestamp: '17:58',
      },
      {
        id: 'm6',
        from: 'dm',
        text: 'You sense a faint abjuration aura — it may be trapped.',
        timestamp: '17:59',
      },
    ],
  },
  {
    player_id: 'p3',
    player_name: 'Carol',
    unread_count: 1,
    messages: [
      {
        id: 'm7',
        from: 'player',
        text: "I want to steal from the merchant without the party knowing.",
        timestamp: '18:10',
      },
    ],
  },
];

export const MOCK_PLAYER_MESSAGES: Message[] = [
  {
    id: 'pm1',
    from: 'dm',
    text: 'You notice something strange about the innkeeper — roll Insight.',
    timestamp: '18:00',
  },
  { id: 'pm2', from: 'player', text: 'I got a 14.', timestamp: '18:01' },
  {
    id: 'pm3',
    from: 'dm',
    text: 'You sense he is hiding something. He glances at the cellar door repeatedly.',
    timestamp: '18:02',
  },
];
