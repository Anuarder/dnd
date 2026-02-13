/**
 * Character entity types
 */

export type CharacterStatus = 'active' | 'archive';

export interface CharacterStat {
  value: number;
  is_master: boolean;
}

export interface CharacterStats {
  strength: CharacterStat;
  dexterity: CharacterStat;
  constitution: CharacterStat;
  intelligence: CharacterStat;
  wisdom: CharacterStat;
  charisma: CharacterStat;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  level: number;
  class: string;
  race: string;
  image_url?: string;
  hp: number;
  max_hp: number;
  ac: number;
  stats: CharacterStats;
  status: CharacterStatus;
  created_at: string;
  updated_at: string;
  last_played_at: string | null;
}

export interface CreateCharacterInput {
  name: string;
  level?: number;
  class?: string;
  race?: string;
  image_url?: string;
  status?: CharacterStatus;
}

export interface UpdateCharacterInput {
  name?: string;
  level?: number;
  class?: string;
  race?: string;
  image_url?: string;
  hp?: number;
  max_hp?: number;
  ac?: number;
  status?: CharacterStatus;
}
