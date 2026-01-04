# Character Edge Function

Supabase Edge Function для управления персонажами D&D.

## Структура файлов

```
character/
├── index.ts        # Главная точка входа, маршрутизация запросов
├── handlers.ts     # Обработчики CRUD операций (GET, POST, PUT, DELETE)
├── validation.ts   # Валидация данных персонажа
├── types.ts        # TypeScript типы и интерфейсы
└── README.md       # Эта документация
```

## API Endpoints

### GET - Получение персонажа/персонажей

**Параметры URL:**
- `user_id` (обязательный) - ID пользователя
- `character_id` (опциональный) - ID конкретного персонажа

**Примеры:**
```bash
# Получить всех персонажей пользователя
GET /character?user_id=123

# Получить конкретного персонажа
GET /character?user_id=123&character_id=456
```

**Ответ:**
```json
{
  "message": "Character retrieved successfully",
  "data": {
    "id": "456",
    "user_id": "123",
    "character_options": { ... },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST - Создание персонажа

**Тело запроса:**
```json
{
  "user_id": "123",
  "character_options": {
    "name": "Арагорн",
    "level": 5,
    "gender": "Мужской",
    "race": "Человек",
    "sub_race": null,
    "class": "Следопыт",
    "sub_class": "Охотник",
    "stats": {
      "strength": { "value": 16, "is_master": true },
      "dexterity": { "value": 14, "is_master": true },
      "constitution": { "value": 15, "is_master": false },
      "intelligence": { "value": 10, "is_master": false },
      "wisdom": { "value": 13, "is_master": true },
      "charisma": { "value": 12, "is_master": false }
    },
    "history": [],
    "master_bonus": 3,
    "skills": [],
    "items": [],
    "ac": 16,
    "hp": 45,
    "initiative": 2,
    "speed": 30,
    "hp_dice": "1d10",
    "max_hp": 45,
    "temp_hp": 0,
    "death_saves": 0,
    "inspirations": 1,
    "exp": 6500
  }
}
```

**Ответ:**
```json
{
  "message": "Character created successfully",
  "data": {
    "id": "789",
    "user_id": "123",
    "character_options": { ... },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT/PATCH - Обновление персонажа

**Тело запроса:**
```json
{
  "user_id": "123",
  "character_id": "456",
  "character_options": {
    "name": "Арагорн",
    "level": 6,
    ...
  }
}
```

**Ответ:**
```json
{
  "message": "Character updated successfully",
  "data": {
    "id": "456",
    "user_id": "123",
    "character_options": { ... },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

### DELETE - Удаление персонажа

**Тело запроса:**
```json
{
  "user_id": "123",
  "character_id": "456"
}
```

**Ответ:**
```json
{
  "message": "Character deleted successfully",
  "data": {
    "deleted_character_id": "456"
  }
}
```

## Структура CharacterOptions

Полный список полей персонажа:

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `name` | string | Да | Имя персонажа |
| `level` | number | Да | Уровень (1-20) |
| `gender` | string | Да | Пол персонажа |
| `race` | string | Да | Раса (эльф, дварф и т.д.) |
| `sub_race` | string \| null | Нет | Подраса |
| `class` | string | Да | Класс (воин, маг и т.д.) |
| `sub_class` | string \| null | Нет | Подкласс |
| `stats` | CharacterStats | Да | Характеристики (см. ниже) |
| `history` | array | Да | История персонажа |
| `master_bonus` | number | Да | Бонус мастерства |
| `skills` | array | Нет | Навыки |
| `items` | array | Нет | Предметы |
| `ac` | number | Да | Класс брони |
| `hp` | number | Да | Текущие хиты |
| `initiative` | number | Да | Инициатива |
| `speed` | number | Да | Скорость |
| `hp_dice` | string | Да | Кость хитов (например "1d8") |
| `max_hp` | number | Да | Максимальные хиты |
| `temp_hp` | number | Да | Временные хиты |
| `death_saves` | number | Да | Спасброски от смерти |
| `inspirations` | number | Нет | Вдохновения (по умолчанию 0) |
| `exp` | number | Да | Опыт |

### CharacterStats

Каждая характеристика содержит:
- `value` (number) - значение характеристики (обычно 1-20)
- `is_master` (boolean) - является ли мастерской

Характеристики:
- `strength` - Сила
- `dexterity` - Ловкость
- `constitution` - Телосложение
- `intelligence` - Интеллект
- `wisdom` - Мудрость
- `charisma` - Харизма

## Коды ошибок

- `400` - Неверный запрос (невалидные данные, отсутствуют обязательные поля)
- `404` - Персонаж не найден
- `405` - Метод не поддерживается
- `500` - Ошибка сервера

## Безопасность

- Все операции требуют `user_id`
- Пользователь может работать только со своими персонажами
- Проверка прав доступа происходит на уровне базы данных (`.eq("user_id", userId)`)

