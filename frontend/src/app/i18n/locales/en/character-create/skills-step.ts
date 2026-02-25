export const characterCreateSkills = {
  titleLine1: 'Choose',
  titleLine2: 'Skills',
  description: 'Select {{count}} skill from your class options',
  description_other: 'Select {{count}} skills from your class options',
  progressLabel: 'Skills Selected',
  classNotFound: 'Class not found',
  continue: 'Continue',
  aria: {
    learnMore: 'Learn more about {{skill}}',
  },
  toast: {
    invalidDescription: 'You need exactly {{count}} skills selected',
  },
  validation: {
    selectMore: 'Please select {{count}} more skill',
    selectMore_other: 'Please select {{count}} more skills',
    unselect: 'Please unselect {{count}} skill',
    unselect_other: 'Please unselect {{count}} skills',
  },
  skillInfo: '{{description}}. This skill uses your {{abilityName}} ({{abilityCode}}) ability score.',
  abilities: {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
  },
} as const;
