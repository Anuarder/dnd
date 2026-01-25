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
