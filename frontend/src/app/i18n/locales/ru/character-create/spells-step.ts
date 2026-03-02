export const characterCreateSpells = {
  title: 'Выбор заклинаний',
  description: 'Выберите начальные магические способности',
  cantripsTitle: 'Заговоры',
  level1Title: 'Заклинания 1 уровня',
  selectCount: 'Выберите {{count}} ({{selected}}/{{count}})',
  errors: {
    noSpells: 'Для этого класса нет доступных заклинаний.',
  },
  validation: {
    cantripMin: 'Выберите хотя бы один заговор',
    level1Min: 'Выберите хотя бы одно заклинание 1 уровня',
  },
  toast: {
    cantripsRequiredTitle: 'Нужны заговоры',
    cantripsRequiredDescription: 'Выберите ровно {{count}} заговора, чтобы продолжить.',
    spellsRequiredTitle: 'Нужны заклинания',
    spellsRequiredDescription: 'Выберите ровно {{count}} заклинания 1 уровня, чтобы продолжить.',
    selectionIncompleteTitle: 'Выбор не завершен',
    selectionIncompleteDescription: 'Выберите заговоры и заклинания 1 уровня.',
  },
  continue: 'Продолжить',
} as const;
