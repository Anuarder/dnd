import type {
  Background,
  CharacterClass,
  EquipmentPreset,
  Race,
  Skill,
  Spell,
} from './types';

// Import existing class images
import BarbarianFemaleImage from '../pages/create/ui/class-selection-form/assets/barbarian-female.webp';
import BarbarianMaleImage from '../pages/create/ui/class-selection-form/assets/barbarian-male.webp';
import BardFemaleImage from '../pages/create/ui/class-selection-form/assets/bard-female.webp';
import BardMaleImage from '../pages/create/ui/class-selection-form/assets/bard-male.webp';
import ClericFemaleImage from '../pages/create/ui/class-selection-form/assets/cleric-female.webp';
import ClericMaleImage from '../pages/create/ui/class-selection-form/assets/cleric-male.webp';
import DruidFemaleImage from '../pages/create/ui/class-selection-form/assets/druid-female.webp';
import DruidMaleImage from '../pages/create/ui/class-selection-form/assets/druid-male.webp';
import FighterFemaleImage from '../pages/create/ui/class-selection-form/assets/fighter-female.webp';
import FighterMaleImage from '../pages/create/ui/class-selection-form/assets/fighter-male.webp';

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'barbarian',
    name: 'Barbarian',
    description: 'Unleash primal fury. Channel rage into unstoppable devastation.',
    images: {
      male: BarbarianMaleImage,
      female: BarbarianFemaleImage,
    },
    keyTraits: ['Rage', 'Unarmored Defense'],
    hitDie: 'd12',
    primaryAbility: 'Strength',
    combatType: 'Melee',
    isCaster: false,
    skillCount: 2,
    skillOptions: [
      'animal-handling',
      'athletics',
      'intimidation',
      'nature',
      'perception',
      'survival',
    ],
  },
  {
    id: 'bard',
    name: 'Bard',
    description: 'Weave magic through music. Inspire allies, deceive foes.',
    images: {
      male: BardMaleImage,
      female: BardFemaleImage,
    },
    keyTraits: ['Jack of All Trades', 'Bardic Inspiration'],
    hitDie: 'd8',
    primaryAbility: 'Charisma',
    combatType: 'Magic',
    isCaster: true,
    skillCount: 3,
    skillOptions: [
      'acrobatics',
      'animal-handling',
      'arcana',
      'athletics',
      'deception',
      'history',
      'insight',
      'intimidation',
      'investigation',
      'medicine',
      'nature',
      'perception',
      'performance',
      'persuasion',
      'religion',
      'sleight-of-hand',
      'stealth',
      'survival',
    ],
  },
  {
    id: 'cleric',
    name: 'Cleric',
    description: 'Wield divine power. Heal the wounded, smite the unholy.',
    images: {
      male: ClericMaleImage,
      female: ClericFemaleImage,
    },
    keyTraits: ['Divine Magic', 'Channel Divinity'],
    hitDie: 'd8',
    primaryAbility: 'Wisdom',
    combatType: 'Magic',
    isCaster: true,
    skillCount: 2,
    skillOptions: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
  },
  {
    id: 'druid',
    name: 'Druid',
    description: 'Command nature itself. Shapeshift into beasts at will.',
    images: {
      male: DruidMaleImage,
      female: DruidFemaleImage,
    },
    keyTraits: ['Wild Shape', 'Nature Magic'],
    hitDie: 'd8',
    primaryAbility: 'Wisdom',
    combatType: 'Hybrid',
    isCaster: true,
    skillCount: 2,
    skillOptions: [
      'arcana',
      'animal-handling',
      'insight',
      'medicine',
      'nature',
      'perception',
      'religion',
      'survival',
    ],
  },
  {
    id: 'fighter',
    name: 'Fighter',
    description: 'Master every weapon. Dominate the battlefield with skill.',
    images: {
      male: FighterMaleImage,
      female: FighterFemaleImage,
    },
    keyTraits: ['Action Surge', 'Extra Attack'],
    hitDie: 'd10',
    primaryAbility: 'Strength',
    combatType: 'Melee',
    isCaster: false,
    skillCount: 2,
    skillOptions: [
      'acrobatics',
      'animal-handling',
      'athletics',
      'history',
      'insight',
      'intimidation',
      'perception',
      'survival',
    ],
  },
];

export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Человек',
    description: 'Универсальная и адаптивная раса, способная преуспеть в любой роли.',
    image: '', // Add image path if available
    abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    speed: 30,
    size: 'Средний',
    traits: ['Черта', 'Увеличение характеристик'],
  },
  {
    id: 'elf',
    name: 'Эльф',
    description: 'Грациозные и долгоживущие создания с острыми чувствами и связью с магией фей.',
    image: '',
    abilityBonuses: { dex: 2 },
    speed: 30,
    size: 'Средний',
    traits: ['Тёмное зрение', 'Острое чутьё', 'Наследие фей', 'Медитация'],
    subraces: [
      {
        id: 'high-elf',
        name: 'Высший эльф',
        description: 'Утончённые и интеллектуальные эльфы, посвятившие себя изучению магии и искусств.',
        abilityBonuses: { int: 1 },
        traits: ['Заговор', 'Дополнительный язык'],
      },
      {
        id: 'wood-elf',
        name: 'Лесной эльф',
        description: 'Замкнутые защитники лесов, живущие в гармонии с природой.',
        abilityBonuses: { wis: 1 },
        traits: ['Маска дикой природы', 'скорость 35 фт'],
      },
      {
        id: 'drou',
        name: 'Дроу',
        description: 'Жители Подземья с жёсткой иерархической культурой и врождённой магией.',
        abilityBonuses: { wis: 1 },
        traits: ['Чувствительность к солнечному свету', 'Магия дроу', 'тёмное зрение 120 фт'],
      },
    ],
  },
  {
    id: 'dwarf',
    name: 'Дварф',
    description: 'Крепкие и выносливые мастера гор и кузнечного дела.',
    image: '',
    abilityBonuses: { con: 2 },
    speed: 25,
    size: 'Небольшой',
    traits: ['Тёмное зрение', 'Дварфийская стойкость', 'Знание камня'],
    subraces: [
      {
        id: 'mountain-dwarf',
        name: 'Горный дварф',
        description: 'Гордые и воинственные мастера кузнечного дела.',
        abilityBonuses: { str: 2 },
        traits: ['Владение дварфийскими доспехами'],
      },
      {
        id: 'hill-dwarf',
        name: 'Холмовой дварф',
        description: 'Более миролюбивые и стойкие дварфы, известные своей выносливостью и мудростью.',
        abilityBonuses: { wis: 1 },
        traits: ['Дварфийская выносливость'],
      },
    ],
  },
  {
    id: 'halfling',
    name: 'Полурослик',
    description: 'Маленькие, ловкие и необычайно удачливые путешественники',
    image: '',
    abilityBonuses: { dex: 2 },
    speed: 25,
    size: 'Небольшой',
    traits: ['Везучий', 'Храбрый', 'Проворство полурослика'],
    subraces: [
      {
        id: 'lightfoot',
        name: 'Лёгконогий',
        description: 'Общительные и обаятельные странники, легко находящие друзей среди других народов.',
        abilityBonuses: { cha: 1 },
        traits: ['Естественная скрытность'],
      },
      {
        id: 'stout',
        name: 'Коренастый',
        description: 'Более выносливые и устойчивые к ядам представители своего народа.',
        abilityBonuses: { con: 1 },
        traits: ['Стойкость коренастого'],
      },
    ],
  },
  {
    id: 'half-ork',
    name: 'Полуорк',
    description: 'Мощные и выносливые воины с дикой боевой яростью.',
    image: '',
    abilityBonuses: { str: 2, con: 1 },
    speed: 30,
    size: 'Средний',
    traits: ['Тёмное зрение', 'Неумолимая стойкость', 'Свирепые атаки', 'Угрожающий вид'],
  },
  {
    id: 'half-elf',
    name: 'Полуэльф',
    description: 'Сочетают человеческую адаптивность и эльфийскую грацию.',
    image: '',
    abilityBonuses: { str: 1, cha: 2 },
    speed: 30,
    size: 'Средний',
    traits: ['Тёмное зрение', 'Наследие фей', 'Универсальность навыков'],
  },
  {
    id: 'dragonborn',
    name: 'Драконорождённый',
    description: 'Потомки драконов, владеющие дыхательным оружием.',
    image: '',
    abilityBonuses: { str: 2, cha: 1 },
    speed: 30,
    size: 'Средний',
    traits: ['Драконье наследие', 'Дыхательное оружие', 'Сопротивляемость урону'],
  },
  {
    id: 'tiefling',
    name: 'Тифлинг',
    description: 'Потомки инфернальных существ, обладающие врождённой магией и сопротивляемостью огню.',
    image: '',
    abilityBonuses: { int: 1, cha: 2 },
    speed: 30,
    size: 'Средний',
    traits: ['Тёмное зрение', 'Адская сопротивляемость', 'Инфернальное наследие'],
  },
];

export const BACKGROUNDS: Background[] = [
  {
    id: 'soldier',
    name: 'Soldier',
    description:
      'You served in an army, learning discipline and the ways of war. Your experience on the battlefield shapes your worldview.',
    image: '',
    skillProficiencies: ['athletics', 'intimidation'],
    toolProficiencies: ['Gaming Set', 'Vehicles (Land)'],
    feature: 'Military Rank',
  },
  {
    id: 'acolyte',
    name: 'Acolyte',
    description:
      'You spent your formative years in service to a temple, learning sacred rites and divine teachings.',
    image: '',
    skillProficiencies: ['insight', 'religion'],
    toolProficiencies: [],
    feature: 'Shelter of the Faithful',
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description:
      'You are experienced in the ways of crime, whether as a thief, smuggler, or enforcer.',
    image: '',
    skillProficiencies: ['deception', 'stealth'],
    toolProficiencies: ['Thieves Tools', 'Gaming Set'],
    feature: 'Criminal Contact',
  },
  {
    id: 'noble',
    name: 'Noble',
    description:
      'You were born into privilege and wealth, with connections to high society and political power.',
    image: '',
    skillProficiencies: ['history', 'persuasion'],
    toolProficiencies: ['Gaming Set'],
    feature: 'Position of Privilege',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description:
      'You spent years studying ancient texts and arcane knowledge in libraries and academies.',
    image: '',
    skillProficiencies: ['arcana', 'history'],
    toolProficiencies: [],
    feature: 'Researcher',
  },
  {
    id: 'outlander',
    name: 'Outlander',
    description:
      'You grew up in the wilderness, far from civilization, learning to survive in harsh environments.',
    image: '',
    skillProficiencies: ['athletics', 'survival'],
    toolProficiencies: ['Musical Instrument'],
    feature: 'Wanderer',
  },
];

export const SKILLS: Skill[] = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex', description: 'Balance and agility' },
  {
    id: 'animal-handling',
    name: 'Animal Handling',
    ability: 'wis',
    description: 'Calm and control animals',
  },
  { id: 'arcana', name: 'Arcana', ability: 'int', description: 'Magical knowledge' },
  { id: 'athletics', name: 'Athletics', ability: 'str', description: 'Physical prowess' },
  { id: 'deception', name: 'Deception', ability: 'cha', description: 'Lying and trickery' },
  { id: 'history', name: 'History', ability: 'int', description: 'Historical knowledge' },
  { id: 'insight', name: 'Insight', ability: 'wis', description: 'Read intentions' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha', description: 'Coerce through fear' },
  {
    id: 'investigation',
    name: 'Investigation',
    ability: 'int',
    description: 'Find clues and deduce',
  },
  { id: 'medicine', name: 'Medicine', ability: 'wis', description: 'Heal and diagnose' },
  { id: 'nature', name: 'Nature', ability: 'int', description: 'Natural world knowledge' },
  { id: 'perception', name: 'Perception', ability: 'wis', description: 'Notice details' },
  { id: 'performance', name: 'Performance', ability: 'cha', description: 'Entertain an audience' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha', description: 'Influence others' },
  { id: 'religion', name: 'Religion', ability: 'int', description: 'Divine knowledge' },
  {
    id: 'sleight-of-hand',
    name: 'Sleight of Hand',
    ability: 'dex',
    description: 'Manual trickery',
  },
  { id: 'stealth', name: 'Stealth', ability: 'dex', description: 'Move unseen' },
  { id: 'survival', name: 'Survival', ability: 'wis', description: 'Track and forage' },
];

export const EQUIPMENT_PRESETS: Record<string, EquipmentPreset[]> = {
  barbarian: [
    {
      id: 'barbarian-melee',
      name: 'Melee Warrior',
      description: 'Heavy weapons for close combat',
      items: ['Greataxe', 'Two Handaxes', 'Explorer\'s Pack', 'Four Javelins'],
    },
    {
      id: 'barbarian-versatile',
      name: 'Versatile Fighter',
      description: 'Mix of melee and ranged options',
      items: ['Greatsword', 'Shortbow with 20 Arrows', 'Explorer\'s Pack', 'Two Handaxes'],
    },
  ],
  bard: [
    {
      id: 'bard-diplomat',
      name: 'Diplomat',
      description: 'Social tools and light armor',
      items: ['Rapier', 'Lute', 'Leather Armor', 'Diplomat\'s Pack', 'Dagger'],
    },
    {
      id: 'bard-entertainer',
      name: 'Entertainer',
      description: 'Performance gear and versatile weapons',
      items: ['Longsword', 'Lyre', 'Leather Armor', 'Entertainer\'s Pack', 'Dagger'],
    },
  ],
  cleric: [
    {
      id: 'cleric-healer',
      name: 'Healer',
      description: 'Defensive gear for support',
      items: ['Mace', 'Scale Mail', 'Light Crossbow with 20 Bolts', 'Priest\'s Pack', 'Shield', 'Holy Symbol'],
    },
    {
      id: 'cleric-warrior',
      name: 'War Priest',
      description: 'Combat-focused equipment',
      items: ['Warhammer', 'Chain Mail', 'Shield', 'Priest\'s Pack', 'Holy Symbol'],
    },
  ],
  druid: [
    {
      id: 'druid-nature',
      name: 'Nature Guardian',
      description: 'Natural weapons and tools',
      items: ['Wooden Shield', 'Scimitar', 'Leather Armor', 'Explorer\'s Pack', 'Druidic Focus'],
    },
    {
      id: 'druid-caster',
      name: 'Spellcaster',
      description: 'Focus on magic',
      items: ['Quarterstaff', 'Leather Armor', 'Explorer\'s Pack', 'Druidic Focus', 'Herbalism Kit'],
    },
  ],
  fighter: [
    {
      id: 'fighter-defender',
      name: 'Defender',
      description: 'Heavy armor and shield',
      items: ['Longsword', 'Shield', 'Chain Mail', 'Light Crossbow with 20 Bolts', 'Dungeoneer\'s Pack'],
    },
    {
      id: 'fighter-striker',
      name: 'Striker',
      description: 'Two-handed weapons',
      items: ['Greatsword', 'Two Handaxes', 'Chain Mail', 'Dungeoneer\'s Pack'],
    },
  ],
};

export const SPELLS: Record<string, { cantrips: Spell[]; level1: Spell[] }> = {
  bard: {
    cantrips: [
      {
        id: 'vicious-mockery',
        name: 'Vicious Mockery',
        level: 0,
        school: 'Enchantment',
        castingTime: '1 action',
        range: '60 feet',
        description: 'Insult a creature, dealing psychic damage and imposing disadvantage.',
      },
      {
        id: 'minor-illusion',
        name: 'Minor Illusion',
        level: 0,
        school: 'Illusion',
        castingTime: '1 action',
        range: '30 feet',
        description: 'Create a sound or image of an object.',
      },
      {
        id: 'prestidigitation',
        name: 'Prestidigitation',
        level: 0,
        school: 'Transmutation',
        castingTime: '1 action',
        range: '10 feet',
        description: 'Perform minor magical tricks.',
      },
      {
        id: 'mage-hand',
        name: 'Mage Hand',
        level: 0,
        school: 'Conjuration',
        castingTime: '1 action',
        range: '30 feet',
        description: 'Create a spectral hand to manipulate objects.',
      },
    ],
    level1: [
      {
        id: 'healing-word',
        name: 'Healing Word',
        level: 1,
        school: 'Evocation',
        castingTime: '1 bonus action',
        range: '60 feet',
        description: 'Heal a creature with a word.',
      },
      {
        id: 'thunderwave',
        name: 'Thunderwave',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Self (15-foot cube)',
        description: 'Push creatures away with a wave of thunder.',
      },
      {
        id: 'charm-person',
        name: 'Charm Person',
        level: 1,
        school: 'Enchantment',
        castingTime: '1 action',
        range: '30 feet',
        description: 'Charm a humanoid to be friendly.',
      },
      {
        id: 'disguise-self',
        name: 'Disguise Self',
        level: 1,
        school: 'Illusion',
        castingTime: '1 action',
        range: 'Self',
        description: 'Change your appearance.',
      },
    ],
  },
  cleric: {
    cantrips: [
      {
        id: 'sacred-flame',
        name: 'Sacred Flame',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: '60 feet',
        description: 'Strike a creature with radiant flame.',
      },
      {
        id: 'spare-the-dying',
        name: 'Spare the Dying',
        level: 0,
        school: 'Necromancy',
        castingTime: '1 action',
        range: 'Touch',
        description: 'Stabilize a dying creature.',
      },
      {
        id: 'light',
        name: 'Light',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Touch',
        description: 'Make an object shed light.',
      },
      {
        id: 'guidance',
        name: 'Guidance',
        level: 0,
        school: 'Divination',
        castingTime: '1 action',
        range: 'Touch',
        description: 'Grant a bonus to one ability check.',
      },
    ],
    level1: [
      {
        id: 'cure-wounds',
        name: 'Cure Wounds',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Touch',
        description: 'Heal a creature by touch.',
      },
      {
        id: 'bless',
        name: 'Bless',
        level: 1,
        school: 'Enchantment',
        castingTime: '1 action',
        range: '30 feet',
        description: 'Bless allies with bonuses to attacks and saves.',
      },
      {
        id: 'shield-of-faith',
        name: 'Shield of Faith',
        level: 1,
        school: 'Abjuration',
        castingTime: '1 bonus action',
        range: '60 feet',
        description: 'Grant a creature +2 AC.',
      },
      {
        id: 'guiding-bolt',
        name: 'Guiding Bolt',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 feet',
        description: 'Strike with radiant energy, granting advantage on next attack.',
      },
    ],
  },
  druid: {
    cantrips: [
      {
        id: 'produce-flame',
        name: 'Produce Flame',
        level: 0,
        school: 'Conjuration',
        castingTime: '1 action',
        range: 'Self',
        description: 'Create a flame for light or attack.',
      },
      {
        id: 'shillelagh',
        name: 'Shillelagh',
        level: 0,
        school: 'Transmutation',
        castingTime: '1 bonus action',
        range: 'Touch',
        description: 'Imbue a club or staff with magic.',
      },
      {
        id: 'druidcraft',
        name: 'Druidcraft',
        level: 0,
        school: 'Transmutation',
        castingTime: '1 action',
        range: '30 feet',
        description: 'Create minor nature effects.',
      },
      {
        id: 'thorn-whip',
        name: 'Thorn Whip',
        level: 0,
        school: 'Transmutation',
        castingTime: '1 action',
        range: '30 feet',
        description: 'Strike and pull a creature with thorny vines.',
      },
    ],
    level1: [
      {
        id: 'entangle',
        name: 'Entangle',
        level: 1,
        school: 'Conjuration',
        castingTime: '1 action',
        range: '90 feet',
        description: 'Restrain creatures with grasping vines.',
      },
      {
        id: 'goodberry',
        name: 'Goodberry',
        level: 1,
        school: 'Transmutation',
        castingTime: '1 action',
        range: 'Touch',
        description: 'Create healing berries.',
      },
      {
        id: 'faerie-fire',
        name: 'Faerie Fire',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: '60 feet',
        description: 'Outline creatures in light, granting advantage.',
      },
      {
        id: 'speak-with-animals',
        name: 'Speak with Animals',
        level: 1,
        school: 'Divination',
        castingTime: '1 action',
        range: 'Self',
        description: 'Communicate with beasts.',
      },
    ],
  },
};

// Helper function to get class by ID
export function getClassById(classId: string): CharacterClass | undefined {
  return CHARACTER_CLASSES.find((c) => c.id === classId);
}

// Helper function to get race by ID
export function getRaceById(raceId: string): Race | undefined {
  return RACES.find((r) => r.id === raceId);
}

// Helper function to get background by ID
export function getBackgroundById(backgroundId: string): Background | undefined {
  return BACKGROUNDS.find((b) => b.id === backgroundId);
}

// Helper function to check if class is caster
export function isClassCaster(classId: string): boolean {
  const characterClass = getClassById(classId);
  return characterClass?.isCaster ?? false;
}
