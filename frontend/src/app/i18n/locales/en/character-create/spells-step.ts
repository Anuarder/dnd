export const characterCreateSpells = {
  title: 'Choose Spells',
  description: 'Select your starting magical abilities',
  cantripsTitle: 'Cantrips',
  level1Title: 'Level 1 Spells',
  selectCount: 'Select {{count}} ({{selected}}/{{count}})',
  errors: {
    noSpells: 'No spells available for this class.',
  },
  validation: {
    cantripMin: 'Please select at least one cantrip',
    level1Min: 'Please select at least one level 1 spell',
  },
  toast: {
    cantripsRequiredTitle: 'Cantrips Required',
    cantripsRequiredDescription: 'Please select exactly {{count}} cantrips to proceed.',
    spellsRequiredTitle: 'Spells Required',
    spellsRequiredDescription: 'Please select exactly {{count}} level 1 spells to proceed.',
    selectionIncompleteTitle: 'Selection Incomplete',
    selectionIncompleteDescription: 'Please select both your cantrips and level 1 spells.',
  },
  continue: 'Continue',
} as const;
