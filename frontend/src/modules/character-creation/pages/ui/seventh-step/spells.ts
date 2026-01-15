export type Spell = {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: string;
};

export const SPELLS: Spell[] = [
  // Cantrips (12)
  { id: 'light', name: 'Light', level: 0, school: 'Evocation' },
  { id: 'mage_hand', name: 'Mage Hand', level: 0, school: 'Conjuration' },
  { id: 'prestidigitation', name: 'Prestidigitation', level: 0, school: 'Transmutation' },
  { id: 'minor_illusion', name: 'Minor Illusion', level: 0, school: 'Illusion' },
  { id: 'fire_bolt', name: 'Fire Bolt', level: 0, school: 'Evocation' },
  { id: 'ray_of_frost', name: 'Ray of Frost', level: 0, school: 'Evocation' },
  { id: 'shocking_grasp', name: 'Shocking Grasp', level: 0, school: 'Evocation' },
  { id: 'acid_splash', name: 'Acid Splash', level: 0, school: 'Conjuration' },
  { id: 'chill_touch', name: 'Chill Touch', level: 0, school: 'Necromancy' },
  { id: 'guidance', name: 'Guidance', level: 0, school: 'Divination' },
  { id: 'mending', name: 'Mending', level: 0, school: 'Transmutation' },
  { id: 'spare_the_dying', name: 'Spare the Dying', level: 0, school: 'Necromancy' },

  // Level 1 spells (10)
  { id: 'magic_missile', name: 'Magic Missile', level: 1, school: 'Evocation' },
  { id: 'shield', name: 'Shield', level: 1, school: 'Abjuration' },
  { id: 'cure_wounds', name: 'Cure Wounds', level: 1, school: 'Evocation' },
  { id: 'burning_hands', name: 'Burning Hands', level: 1, school: 'Evocation' },
  { id: 'bless', name: 'Bless', level: 1, school: 'Enchantment' },
  { id: 'detect_magic', name: 'Detect Magic', level: 1, school: 'Divination' },
  { id: 'identify', name: 'Identify', level: 1, school: 'Divination' },
  { id: 'sleep', name: 'Sleep', level: 1, school: 'Enchantment' },
  { id: 'thunderwave', name: 'Thunderwave', level: 1, school: 'Evocation' },
  { id: 'chromatic_orb', name: 'Chromatic Orb', level: 1, school: 'Evocation' },
];

export const CANTRIP_LIMIT = 6;
export const LEVEL1_LIMIT = 4;
