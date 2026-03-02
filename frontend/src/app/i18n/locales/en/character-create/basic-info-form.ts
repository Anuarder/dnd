export const characterCreateBasicInfo = {
  title: 'Who are you?',
  subtitle: "Let's start with the basics of your legend.",
  nameLabel: 'Character Name',
  namePlaceholder: 'e.g. Valerius the Bold',
  identityLabel: 'Identity',
  gender: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  },
  originLabel: 'Origin Story',
  originPlaceholder: 'Briefly describe where they come from...',
  submit: {
    continue: 'Continue',
    creating: 'Creating...',
  },
  validation: {
    nameMin: 'Name must be at least 3 characters',
    nameMax: 'Name cannot exceed 50 characters',
    genderInvalid: 'Please select a valid gender',
    originMin: 'Origin story must be at least 10 characters',
    originMax: 'Origin story cannot exceed 500 characters',
  },
  toast: {
    incompleteTitle: 'Form Incomplete',
    incompleteDescription: 'Please check the required fields and ensure everything is filled correctly.',
  },
} as const;
