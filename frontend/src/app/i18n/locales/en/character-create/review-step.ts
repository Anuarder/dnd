export const characterCreateReview = {
  successTitle: 'Character Created!',
  successDescription: 'Redirecting to your characters...',
  titleLine1: 'Review',
  titleLine2: 'Character',
  description: 'Check everything before creating your character',
  sections: {
    basicInfo: 'Basic Information',
    classRace: 'Class & Race',
    attributes: 'Attributes',
    skills: 'Skills',
    spells: 'Spells',
  },
  labels: {
    name: 'Name',
    gender: 'Gender',
    class: 'Class',
    race: 'Race',
    background: 'Background',
  },
  gender: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  },
  spells: {
    cantrips: 'Cantrips',
    level1: 'Level 1 Spells',
    selected: '{{count}} selected',
  },
  submit: {
    create: 'Create Character',
    creating: 'Creating Character...',
  },
  alerts: {
    incomplete: 'Please complete all required steps',
    failed: 'Failed to create character. Please try again.',
  },
} as const;
