export const characterCreateReview = {
  successTitle: 'Персонаж создан!',
  successDescription: 'Перенаправляем к вашим персонажам...',
  titleLine1: 'Проверь',
  titleLine2: 'Персонажа',
  description: 'Проверьте всё перед созданием персонажа',
  sections: {
    basicInfo: 'Основная информация',
    classRace: 'Класс и раса',
    attributes: 'Характеристики',
    skills: 'Навыки',
    spells: 'Заклинания',
  },
  labels: {
    name: 'Имя',
    gender: 'Пол',
    class: 'Класс',
    race: 'Раса',
    background: 'Происхождение',
  },
  gender: {
    male: 'Мужчина',
    female: 'Женщина',
    other: 'Другое',
  },
  spells: {
    cantrips: 'Заговоры',
    level1: 'Заклинания 1 уровня',
    selected: 'Выбрано: {{count}}',
  },
  submit: {
    create: 'Создать персонажа',
    creating: 'Создание персонажа...',
  },
  alerts: {
    incomplete: 'Пожалуйста, заполните все обязательные шаги',
    failed: 'Не удалось создать персонажа. Попробуйте еще раз.',
  },
} as const;
