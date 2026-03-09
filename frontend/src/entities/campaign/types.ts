/**
 * Campaign entity types
 */

export type CampaignStatus = 'active' | 'archive';

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  master_id: string;
  image_url?: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  image_url?: string;
  status?: CampaignStatus;
}

export interface UpdateCampaignInput {
  name?: string;
  description?: string;
  image_url?: string;
  status?: CampaignStatus;
}

export interface CampaignPlayer {
  id: string;
  user_id: string;
  player_name: string;
  character_id: string;
  character_name: string;
  character_class: string;
  character_level: number;
  is_ready: boolean;
}

export interface CampaignDetail extends Campaign {
  invite_code: string;
  invite_password: string;
  max_players: number;
  players: CampaignPlayer[];
}
