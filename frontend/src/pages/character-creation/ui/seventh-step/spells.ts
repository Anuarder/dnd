export type Spell = {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: string;
  description: string;
};

export const SPELLS: Spell[] = [
  // Cantrips (12)
  {
    id: 'light',
    name: 'Light',
    level: 0,
    school: 'Evocation',
    description: 'You touch an object to make it shed bright light.',
  },
  {
    id: 'mage_hand',
    name: 'Mage Hand',
    level: 0,
    school: 'Conjuration',
    description: 'A spectral, floating hand appears and can manipulate objects at range.',
  },
  {
    id: 'prestidigitation',
    name: 'Prestidigitation',
    level: 0,
    school: 'Transmutation',
    description: 'A minor magical trick that novice spellcasters use for practice.',
  },
  {
    id: 'minor_illusion',
    name: 'Minor Illusion',
    level: 0,
    school: 'Illusion',
    description: 'Create a sound or an image of an object within range.',
  },
  {
    id: 'fire_bolt',
    name: 'Fire Bolt',
    level: 0,
    school: 'Evocation',
    description: 'A mote of fire streaks toward a creature or object.',
  },
  {
    id: 'ray_of_frost',
    name: 'Ray of Frost',
    level: 0,
    school: 'Evocation',
    description: 'A frigid beam of blue-white light slows and damages a creature.',
  },
  {
    id: 'shocking_grasp',
    name: 'Shocking Grasp',
    level: 0,
    school: 'Evocation',
    description: 'Deliver a jolt of electricity through touch.',
  },
  {
    id: 'acid_splash',
    name: 'Acid Splash',
    level: 0,
    school: 'Conjuration',
    description: 'You hurl a bubble of acid that can harm multiple foes.',
  },
  {
    id: 'chill_touch',
    name: 'Chill Touch',
    level: 0,
    school: 'Necromancy',
    description: 'A ghostly skeletal hand claws at a creature, dealing necrotic damage.',
  },
  {
    id: 'guidance',
    name: 'Guidance',
    level: 0,
    school: 'Divination',
    description: 'Touch a willing creature to grant a small bonus to an ability check.',
  },
  {
    id: 'mending',
    name: 'Mending',
    level: 0,
    school: 'Transmutation',
    description: 'Repair a single break or tear in an object.',
  },
  {
    id: 'spare_the_dying',
    name: 'Spare the Dying',
    level: 0,
    school: 'Necromancy',
    description: 'Stabilize a dying creature and prevent it from making death saves.',
  },

  // Level 1 spells (10)
  {
    id: 'magic_missile',
    name: 'Magic Missile',
    level: 1,
    school: 'Evocation',
    description: 'Create darts of magical force that strike automatically.',
  },
  {
    id: 'shield',
    name: 'Shield',
    level: 1,
    school: 'Abjuration',
    description: 'An invisible barrier of magical force appears and protects you.',
  },
  {
    id: 'cure_wounds',
    name: 'Cure Wounds',
    level: 1,
    school: 'Evocation',
    description: 'A creature you touch regains a number of hit points.',
  },
  {
    id: 'burning_hands',
    name: 'Burning Hands',
    level: 1,
    school: 'Evocation',
    description: 'A sheet of flame shoots from your fingertips.',
  },
  {
    id: 'bless',
    name: 'Bless',
    level: 1,
    school: 'Enchantment',
    description:
      'Up to three creatures of your choice gain a bonus to attack rolls and saving throws.',
  },
  {
    id: 'detect_magic',
    name: 'Detect Magic',
    level: 1,
    school: 'Divination',
    description: 'For the duration, you sense the presence of magic within 30 feet.',
  },
  {
    id: 'identify',
    name: 'Identify',
    level: 1,
    school: 'Divination',
    description: 'You choose one object and learn its properties and how to use them.',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    level: 1,
    school: 'Enchantment',
    description: 'Puts creatures into a magical slumber.',
  },
  {
    id: 'thunderwave',
    name: 'Thunderwave',
    level: 1,
    school: 'Evocation',
    description: 'A wave of thunderous force sweeps out from you.',
  },
  {
    id: 'chromatic_orb',
    name: 'Chromatic Orb',
    level: 1,
    school: 'Evocation',
    description: 'Hurl a sphere of chromatic energy that deals elemental damage.',
  },
];

export const CANTRIP_LIMIT = 6;
export const LEVEL1_LIMIT = 4;
