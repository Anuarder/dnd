export interface CharacterBasicInfo {
  name: string;
  /** Avatar is optional when creating; may be present when fetched from API */
  avatar?: File | null;
  gender: 'male' | 'female' | 'other';
  originStory: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  images: {
    male: string;
    female: string;
  };
  keyTraits: string[];
  hitDie: string;
  primaryAbility: string;
  combatType: 'Melee' | 'Ranged' | 'Magic' | 'Hybrid';
  isCaster: boolean;
  skillCount: number;
  skillOptions: string[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  image: string;
  abilityBonuses: Record<string, number>;
  speed: number;
  size: 'Небольшой' | 'Средний';
  traits: string[];
  subraces?: Subrace[];
}

export interface Subrace {
  id: string;
  name: string;
  description: string;
  abilityBonuses: Record<string, number>;
  traits: string[];
}

export interface Background {
  id: string;
  name: string;
  description: string;
  image: string;
  skillProficiencies: string[];
  toolProficiencies: string[];
  feature: string;
}

export interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Skill {
  id: string;
  name: string;
  ability: keyof Attributes;
  description: string;
}

export interface EquipmentPreset {
  id: string;
  name: string;
  description: string;
  items: string[];
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  description: string;
}

export interface CharacterCreationData {
  // Step 1: Basic Info
  basicInfo: CharacterBasicInfo | null;

  // Step 2: Class Selection
  classId: string | null;

  // Step 3: Race Selection
  raceId: string | null;
  subraceId: string | null;

  // Step 4: Background
  backgroundId: string | null;

  // Step 5: Attributes
  attributes: Attributes | null;

  // Step 6: Skills
  selectedSkills: string[];

  // Step 7: Equipment
  equipmentPresetId: string | null;

  // Step 8: Spells (for casters only)
  selectedCantrips: string[];
  selectedLevel1Spells: string[];
}

export type CharacterCreationStep =
  | 'basic-info'
  | 'class-selection'
  | 'race-selection'
  | 'subrace-selection'
  | 'background'
  | 'attributes'
  | 'skills'
  | 'equipment'
  | 'spells'
  | 'review';
