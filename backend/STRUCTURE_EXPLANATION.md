# Подробное объяснение структуры backend

Этот документ объясняет архитектуру и принципы работы новой структуры backend.

## 🏗️ Общая архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                          │
│              (GET/POST/PUT/PATCH/DELETE)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         functions/character/index.ts                     │
│         (Маршрутизация и валидация запроса)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         functions/character/handlers.ts                  │
│         (Обработка конкретной операции)                 │
└────┬────────────────┬────────────────┬──────────────────┘
     │                │                │
     ▼                ▼                ▼
┌─────────┐    ┌──────────┐    ┌──────────────┐
│validation│    │ response │    │   supabase   │
│  .ts     │    │   .ts    │    │     .ts      │
└─────────┘    └──────────┘    └──────────────┘
     │                │                │
     └────────────────┴────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Supabase DB   │
            │   (characters) │
            └────────────────┘
```

## 📂 Детальное описание модулей

### 1. shared/types.ts - Общие типы

**Назначение:** Определяет TypeScript типы, используемые во всех edge functions.

**Основные типы:**

```typescript
// Успешный ответ API
interface ApiResponse<T> {
  message: string;  // Сообщение о результате
  data?: T;         // Данные (опционально)
}

// Ответ с ошибкой
interface ErrorResponse {
  error: string;    // Текст ошибки
  details?: string; // Дополнительная информация
}

// Ошибка валидации
interface ValidationError {
  field: string;    // Название поля
  message: string;  // Сообщение об ошибке
}
```

**Зачем это нужно:**
- Единообразие типов во всех функциях
- Автодополнение в IDE
- Проверка типов на этапе компиляции

---

### 2. shared/validation.ts - Функции валидации

**Назначение:** Переиспользуемые функции для проверки входящих данных.

**Основные функции:**

#### validateString()
Проверяет строковые поля:
```typescript
validateString(value, "name", {
  required: true,      // Обязательное поле
  minLength: 2,        // Минимум 2 символа
  maxLength: 100,      // Максимум 100 символов
  trim: true           // Обрезать пробелы
})
```

#### validateInteger()
Проверяет целые числа:
```typescript
validateInteger(value, "level", {
  required: true,      // Обязательное поле
  min: 1,              // Минимум 1
  max: 20              // Максимум 20
})
```

**Зачем это нужно:**
- Избежать дублирования кода валидации
- Единообразная обработка ошибок
- Легко добавлять новые правила валидации

---

### 3. shared/response.ts - HTTP ответы

**Назначение:** Создание единообразных HTTP ответов.

**Основные функции:**

#### jsonResponse()
Успешный ответ:
```typescript
jsonResponse(
  { character: data },  // Данные
  200,                  // Статус код
  "Character created"   // Сообщение
)
```

#### errorResponse()
Ответ с ошибкой:
```typescript
errorResponse(
  "Character not found",  // Ошибка
  404,                    // Статус код
  "Check character ID"    // Детали
)
```

**Зачем это нужно:**
- Все ответы в одном формате
- Автоматическая установка заголовков
- Упрощение кода обработчиков

---

### 4. shared/supabase.ts - Работа с Supabase

**Назначение:** Инициализация и работа с Supabase клиентом.

**Основные функции:**

#### initSupabaseClient()
Создаёт клиент Supabase:
```typescript
const supabase = initSupabaseClient();
// Проверяет переменные окружения
// Создаёт клиент с правильными настройками
```

#### checkUserAccess()
Проверяет права доступа:
```typescript
const hasAccess = await checkUserAccess(
  supabase,
  "characters",  // Таблица
  characterId,   // ID ресурса
  userId         // ID пользователя
);
```

**Зачем это нужно:**
- Централизованная настройка клиента
- Проверка переменных окружения
- Переиспользуемые проверки безопасности

---

### 5. functions/character/types.ts - Типы персонажа

**Назначение:** TypeScript типы специфичные для персонажей.

**Основные типы:**

#### CharacterStat
Одна характеристика (сила, ловкость и т.д.):
```typescript
interface CharacterStat {
  value: number;       // Значение (1-20)
  is_master: boolean;  // Мастерство
}
```

#### CharacterStats
Все 6 характеристик D&D:
```typescript
interface CharacterStats {
  strength: CharacterStat;      // Сила
  dexterity: CharacterStat;     // Ловкость
  constitution: CharacterStat;  // Телосложение
  intelligence: CharacterStat;  // Интеллект
  wisdom: CharacterStat;        // Мудрость
  charisma: CharacterStat;      // Харизма
}
```

#### CharacterOptions
Полные данные персонажа:
```typescript
interface CharacterOptions {
  name: string;           // Имя
  level: number;          // Уровень (1-20)
  race: string;           // Раса
  class: string;          // Класс
  stats: CharacterStats;  // Характеристики
  hp: number;             // Хиты
  // ... и другие поля
}
```

**Зачем это нужно:**
- Строгая типизация данных персонажа
- Документация структуры данных
- Проверка типов в IDE

---

### 6. functions/character/validation.ts - Валидация персонажа

**Назначение:** Проверка и нормализация данных персонажа.

**Основные функции:**

#### validateStats()
Проверяет характеристики:
```typescript
const stats = validateStats(input.stats);
// Проверяет наличие всех 6 характеристик
// Проверяет value (1-30)
// Проверяет is_master (boolean)
```

#### transformCharacterOptions()
Полная валидация персонажа:
```typescript
const validated = transformCharacterOptions(rawData);
// Проверяет все обязательные поля
// Нормализует типы данных
// Возвращает чистый объект CharacterOptions
// Выбрасывает Error если валидация не прошла
```

**Как работает:**
1. Получает сырые данные от клиента
2. Проверяет каждое поле через функции из shared/validation.ts
3. Накапливает ошибки в массив
4. Если есть ошибки - выбрасывает исключение
5. Если всё ОК - возвращает валидированный объект

**Зачем это нужно:**
- Защита от невалидных данных
- Нормализация типов (строки в числа и т.д.)
- Понятные сообщения об ошибках

---

### 7. functions/character/handlers.ts - CRUD обработчики

**Назначение:** Реализация операций с персонажами.

#### handleGet() - Получение персонажей
```typescript
// Получить всех персонажей пользователя
GET /character?user_id=123

// Получить конкретного персонажа
GET /character?user_id=123&character_id=456
```

**Логика:**
1. Получить параметры из URL
2. Проверить user_id
3. Если есть character_id - получить одного
4. Иначе - получить всех персонажей пользователя
5. Вернуть результат

#### handleCreate() - Создание персонажа
```typescript
POST /character
{
  "user_id": "123",
  "character_options": { ... }
}
```

**Логика:**
1. Проверить наличие user_id и character_options
2. Валидировать character_options через transformCharacterOptions()
3. Вставить запись в БД
4. Вернуть созданного персонажа

#### handleUpdate() - Обновление персонажа
```typescript
PUT /character
{
  "user_id": "123",
  "character_id": "456",
  "character_options": { ... }
}
```

**Логика:**
1. Проверить user_id, character_id, character_options
2. Валидировать character_options
3. Обновить запись в БД (с проверкой .eq("user_id"))
4. Если запись не найдена - вернуть 404
5. Иначе - вернуть обновлённого персонажа

#### handleDelete() - Удаление персонажа
```typescript
DELETE /character
{
  "user_id": "123",
  "character_id": "456"
}
```

**Логика:**
1. Проверить user_id и character_id
2. Удалить запись из БД (с проверкой .eq("user_id"))
3. Если запись не найдена - вернуть 404
4. Иначе - вернуть подтверждение удаления

**Зачем это нужно:**
- Разделение логики по операциям
- Каждая функция отвечает за одну задачу
- Легко тестировать отдельно

---

### 8. functions/character/index.ts - Главный файл

**Назначение:** Точка входа edge function, маршрутизация запросов.

**Логика работы:**

```
1. Получить HTTP запрос
   ↓
2. Инициализировать Supabase клиент
   ↓
3. Если GET - вызвать handleGet()
   ↓
4. Иначе - проверить Content-Type (должен быть JSON)
   ↓
5. Распарсить JSON из тела запроса
   ↓
6. Маршрутизация по методу:
   - POST → handleCreate()
   - PUT/PATCH → handleUpdate()
   - DELETE → handleDelete()
   ↓
7. Вернуть результат клиенту
```

**Обработка ошибок:**
- Неверный метод → 405 Method Not Allowed
- Неверный Content-Type → 400 Bad Request
- Неверный JSON → 400 Bad Request
- Неожиданная ошибка → 500 Internal Server Error

**Зачем это нужно:**
- Централизованная маршрутизация
- Единая обработка ошибок
- Валидация на уровне запроса

---

## 🔐 Безопасность

### Проверка прав доступа

Все операции проверяют что пользователь работает только со своими данными:

```typescript
// При обновлении
.eq("id", character_id)
.eq("user_id", user_id)  // ← Проверка владельца

// Если запись не найдена - значит либо:
// 1. Персонаж не существует
// 2. Персонаж принадлежит другому пользователю
```

### Валидация данных

Все входящие данные проходят валидацию:
1. Проверка типов (string, number, boolean)
2. Проверка обязательных полей
3. Проверка диапазонов (level: 1-20)
4. Нормализация (trim, lowercase)

### Row Level Security (RLS)

В БД можно настроить RLS политики:
```sql
-- Пользователь видит только свои записи
CREATE POLICY "Users can view their own characters"
  ON characters FOR SELECT
  USING (auth.uid()::text = user_id);
```

---

## 🎯 Преимущества новой структуры

### 1. Модульность
- Каждый файл отвечает за одну задачу
- Легко найти нужный код
- Проще понять логику

### 2. Переиспользование
- Shared модули используются везде
- Нет дублирования кода
- Легко добавлять новые функции

### 3. Масштабируемость
- Простая структура для новых edge functions
- Единообразный стиль кода
- Легко поддерживать

### 4. Тестируемость
- Каждая функция независима
- Можно тестировать отдельно
- Моки для Supabase клиента

### 5. Документация
- Подробные комментарии
- Примеры использования
- Объяснение логики

---

## 📝 Пример потока данных

### Создание персонажа (POST)

```
1. Клиент отправляет POST запрос
   {
     "user_id": "123",
     "character_options": {
       "name": "Aragorn",
       "level": 5,
       ...
     }
   }
   ↓
2. index.ts получает запрос
   - Проверяет Content-Type
   - Парсит JSON
   ↓
3. Вызывается handleCreate(payload, supabase)
   ↓
4. handleCreate проверяет наличие полей
   - user_id ✓
   - character_options ✓
   ↓
5. Вызывается transformCharacterOptions()
   - Валидирует name (string, required)
   - Валидирует level (number, 1-20)
   - Валидирует stats (6 характеристик)
   - ... все остальные поля
   ↓
6. Если валидация прошла:
   - Вставка в БД через Supabase
   - Получение созданной записи
   ↓
7. jsonResponse() создаёт ответ
   {
     "message": "Character created successfully",
     "data": { ... }
   }
   ↓
8. Клиент получает ответ со статусом 201
```

### Обработка ошибки валидации

```
1. Клиент отправляет невалидные данные
   {
     "user_id": "123",
     "character_options": {
       "name": "",        // ← Пустое имя
       "level": 99,       // ← Уровень > 20
       "stats": {}        // ← Нет характеристик
     }
   }
   ↓
2. transformCharacterOptions() собирает ошибки:
   - "name cannot be empty"
   - "level must be at most 20"
   - "stats.strength is required"
   - ... и т.д.
   ↓
3. Выбрасывается Error с текстом:
   "Validation errors: name cannot be empty; level must be at most 20; ..."
   ↓
4. handleCreate перехватывает ошибку
   ↓
5. errorResponse() создаёт ответ
   {
     "error": "Validation failed",
     "details": "Validation errors: ..."
   }
   ↓
6. Клиент получает ответ со статусом 400
```

---

## 🚀 Добавление новой edge function

Пример: создание функции для управления предметами (items).

### Шаг 1: Создать структуру файлов

```
backend/functions/items/
├── index.ts
├── handlers.ts
├── validation.ts
├── types.ts
└── README.md
```

### Шаг 2: Определить типы (types.ts)

```typescript
import type { SupabaseRecord } from "../../shared/types.ts";

export interface ItemOptions {
  name: string;
  description: string;
  weight: number;
  value: number;
  rarity: string;
}

export interface ItemRecord extends SupabaseRecord {
  user_id: string;
  item_options: ItemOptions;
}
```

### Шаг 3: Создать валидацию (validation.ts)

```typescript
import { validateString, validateInteger } from "../../shared/validation.ts";

export function transformItemOptions(options: Record<string, unknown>): ItemOptions {
  const name = validateString(options.name, "name", { required: true });
  const description = validateString(options.description, "description", { required: false });
  const weight = validateInteger(options.weight, "weight", { required: true, min: 0 });
  const value = validateInteger(options.value, "value", { required: true, min: 0 });
  const rarity = validateString(options.rarity, "rarity", { required: true });
  
  return { name, description, weight, value, rarity };
}
```

### Шаг 4: Создать обработчики (handlers.ts)

```typescript
import { jsonResponse, errorResponse } from "../../shared/response.ts";
import { transformItemOptions } from "./validation.ts";

export async function handleCreate(payload, supabase) {
  // Аналогично character/handlers.ts
  // Но работаем с таблицей "items"
}

export async function handleUpdate(payload, supabase) {
  // ...
}

// и т.д.
```

### Шаг 5: Создать главный файл (index.ts)

```typescript
import { initSupabaseClient } from "../../shared/supabase.ts";
import { handleGet, handleCreate, handleUpdate, handleDelete } from "./handlers.ts";

Deno.serve(async (req: Request) => {
  const supabase = initSupabaseClient();
  // Маршрутизация аналогично character/index.ts
});
```

### Шаг 6: Деплой

```bash
supabase functions deploy items
```

**Готово!** Новая edge function работает с теми же shared модулями.

---

## 💡 Советы по разработке

### 1. Всегда используйте shared модули
```typescript
// ✅ Хорошо
import { validateString } from "../../shared/validation.ts";

// ❌ Плохо - дублирование кода
function myValidateString(value) { ... }
```

### 2. Добавляйте подробные комментарии
```typescript
/**
 * Валидация характеристик персонажа
 * 
 * @param stats - объект с характеристиками
 * @returns валидированный объект CharacterStats
 * @throws Error если валидация не прошла
 */
```

### 3. Проверяйте права доступа
```typescript
// Всегда добавляйте .eq("user_id", userId)
.eq("id", resourceId)
.eq("user_id", userId)  // ← Важно!
```

### 4. Логируйте ошибки
```typescript
if (error) {
  console.error("Error creating character:", error);
  return errorResponse(...);
}
```

### 5. Используйте TypeScript типы
```typescript
// ✅ Хорошо - строгая типизация
function handleCreate(payload: IncomingPayload, supabase: SupabaseClient)

// ❌ Плохо - any
function handleCreate(payload: any, supabase: any)
```

---

## 📚 Дополнительные ресурсы

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

