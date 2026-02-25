export const characterCreateBasicInfo = {
  title: 'Кто ты?',
  subtitle: 'Начнем с основ твоей легенды.',
  nameLabel: 'Имя персонажа',
  namePlaceholder: 'например, Валериус Смелый',
  identityLabel: 'Идентичность',
  gender: {
    male: 'Мужчина',
    female: 'Женщина',
    other: 'Другое',
  },
  originLabel: 'История происхождения',
  originPlaceholder: 'Кратко опиши, откуда он или она...',
  submit: {
    continue: 'Продолжить',
    creating: 'Создание...',
  },
  validation: {
    nameMin: 'Имя должно содержать минимум 3 символа',
    nameMax: 'Имя не может быть длиннее 50 символов',
    genderInvalid: 'Пожалуйста, выберите корректный пол',
    originMin: 'История должна быть минимум 10 символов',
    originMax: 'История не может быть длиннее 500 символов',
  },
  toast: {
    incompleteTitle: 'Форма не заполнена',
    incompleteDescription: 'Проверьте обязательные поля и заполните их корректно.',
  },
} as const;
