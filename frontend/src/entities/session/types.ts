export type SessionStatus = 'lobby' | 'active' | 'ended';

export interface Session {
  id: string;
  campaign_id: string;
  status: SessionStatus;
  round: number;
  started_at: string | null;
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  type: 'player' | 'npc';
  hp?: number;
  max_hp?: number;
  is_current_turn: boolean;
}

export type MessageSender = 'dm' | 'player';

export interface Message {
  id: string;
  from: MessageSender;
  text: string;
  timestamp: string;
}

export interface PlayerThread {
  player_id: string;
  player_name: string;
  unread_count: number;
  messages: Message[];
}
