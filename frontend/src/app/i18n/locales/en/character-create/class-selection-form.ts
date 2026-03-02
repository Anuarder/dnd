export const characterCreateClassSelection = {
  titleLine1: 'Choose Your',
  titleLine2: 'Path',
  description: 'Select a class to define your combat style and abilities',
  keyTraitsLabel: 'Key traits',
  hitDieLabel: 'Hit Die',
  primaryAbilityLabel: 'Primary Ability',
  selectPrefix: 'Select',
  toast: {
    selectionTitle: 'Selection Required',
    selectionDescription: 'Please select a class to define your path.',
  },
  classes: {
    barbarian: {
      name: 'Barbarian',
      description:
        'A fierce warrior who relies on rage and raw strength. In battle, they enter a frenzy that resists damage and empowers their strikes.',
      keyTraits: ['Rage', 'Unarmored Defense'],
      primaryAbility: 'Strength, Constitution',
    },
    bard: {
      name: 'Bard',
      description:
        'A versatile spellcaster and master of support. Uses music and inspiration to bolster allies and hinder foes.',
      keyTraits: ['Jack of All Trades', 'Bardic Inspiration'],
      primaryAbility: 'Charisma',
    },
    cleric: {
      name: 'Cleric',
      description:
        'A divine spellcaster who channels holy power. Can heal, empower allies, or smite foes depending on their domain.',
      keyTraits: ['Divine Domain', 'Channel Divinity'],
      primaryAbility: 'Wisdom',
    },
    druid: {
      name: 'Druid',
      description:
        'A guardian of nature with access to primal magic. Can transform into beasts with Wild Shape.',
      keyTraits: ['Wild Shape', 'Nature Magic'],
      primaryAbility: 'Wisdom',
    },
    fighter: {
      name: 'Fighter',
      description:
        'A master of weapons and tactics with exceptional endurance and many combat styles.',
      keyTraits: ['Fighting Style', 'Second Wind'],
      primaryAbility: 'Strength or Dexterity',
    },
    monk: {
      name: 'Monk',
      description:
        'A martial artist who channels ki. Fast, mobile, and deadly without heavy armor.',
      keyTraits: ['Martial Arts', 'Ki'],
      primaryAbility: 'Dexterity, Wisdom',
    },
    paladin: {
      name: 'Paladin',
      description:
        'A holy warrior who blends martial skill with divine magic.',
      keyTraits: ['Divine Smite', 'Lay on Hands'],
      primaryAbility: 'Strength, Charisma',
    },
    ranger: {
      name: 'Ranger',
      description:
        'A hunter and survivalist who excels at ranged combat and tracking.',
      keyTraits: ['Favored Enemy', 'Natural Explorer'],
      primaryAbility: 'Dexterity, Wisdom',
    },
    rogue: {
      name: 'Rogue',
      description:
        'A stealth specialist who excels at precision damage and cunning tactics.',
      keyTraits: ['Sneak Attack', 'Cunning Action'],
      primaryAbility: 'Dexterity',
    },
    sorcerer: {
      name: 'Sorcerer',
      description:
        'A spellcaster born with innate magic. Manipulates spells with metamagic.',
      keyTraits: ['Metamagic', 'Font of Magic'],
      primaryAbility: 'Charisma',
    },
    warlock: {
      name: 'Warlock',
      description:
        'A spellcaster bound by a pact with a powerful patron.',
      keyTraits: ['Otherworldly Patron', 'Pact Magic'],
      primaryAbility: 'Charisma',
    },
    wizard: {
      name: 'Wizard',
      description:
        'A master of arcane magic who studies spells from a spellbook.',
      keyTraits: ['Spellbook', 'Arcane Recovery'],
      primaryAbility: 'Intelligence',
    },
  },
} as const;
