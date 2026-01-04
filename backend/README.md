# Backend Edge Functions для D&D приложения

Этот каталог содержит Supabase Edge Functions для управления данными D&D приложения.

## 📁 Структура проекта

```
backend/
├── shared/                          # Общие модули для всех edge functions
│   ├── types.ts                     # Общие TypeScript типы
│   ├── validation.ts                # Переиспользуемые функции валидации
│   ├── response.ts                  # Утилиты для HTTP ответов
│   └── supabase.ts                  # Помощники для работы с Supabase
│
├── functions/                       # Все edge functions
│   └── character/                   # Edge function для персонажей
│       ├── index.ts                 # Точка входа
│       ├── handlers.ts              # CRUD обработчики
│       ├── validation.ts            # Валидация персонажей
│       ├── types.ts                 # Типы персонажей
│       └── README.md                # Документация API
│
├── MIGRATION_GUIDE.md               # Руководство по миграции
├── README.md                        # Этот файл
└── character.ts.backup              # Резервная копия старого кода
```

## 🚀 Быстрый старт

### 1. Настройка базы данных

Создайте таблицу `characters` в Supabase:

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  character_options JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_created_at ON characters(created_at);

-- Row Level Security (опционально)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own characters"
  ON characters FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own characters"
  ON characters FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own characters"
  ON characters FOR DELETE
  USING (auth.uid()::text = user_id);
```

### 2. Настройка переменных окружения

В Supabase Dashboard → Project Settings → Edge Functions установите:

- `SUPABASE_URL` - URL вашего проекта (обычно уже установлен)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role ключ для обхода RLS

### 3. Деплой функций

```bash
# Установка Supabase CLI
npm install -g supabase

# Логин
supabase login

# Линк к проекту
supabase link --project-ref your-project-ref

# Деплой character функции
supabase functions deploy character
```

## 📚 Доступные Edge Functions

### Character Function

Управление персонажами D&D (CRUD операции).

**Endpoint:** `/functions/v1/character`

**Методы:**
- `GET` - Получение персонажа/списка персонажей
- `POST` - Создание нового персонажа
- `PUT/PATCH` - Обновление персонажа
- `DELETE` - Удаление персонажа

**Документация:** См. [functions/character/README.md](functions/character/README.md)

## 🔧 Shared модули

### types.ts
Общие TypeScript типы для всех функций:
- `ApiResponse<T>` - стандартный формат ответа
- `ErrorResponse` - формат ошибки
- `ValidationError` - ошибка валидации
- Опции валидации для разных типов данных

### validation.ts
Переиспользуемые функции валидации:
- `validateString()` - валидация строк
- `validateInteger()` - валидация целых чисел
- `validateArray()` - валидация массивов
- `validateObject()` - валидация объектов
- `validateBoolean()` - валидация булевых значений

### response.ts
Утилиты для создания HTTP ответов:
- `jsonResponse()` - успешный ответ
- `errorResponse()` - ответ с ошибкой
- `validationErrorResponse()` - ответ с ошибками валидации
- `methodNotAllowedResponse()` - 405 ответ
- `invalidContentTypeResponse()` - неверный Content-Type
- `invalidJsonResponse()` - неверный JSON

### supabase.ts
Помощники для работы с Supabase:
- `initSupabaseClient()` - инициализация клиента
- `checkSupabaseEnv()` - проверка переменных окружения
- `checkUserAccess()` - проверка прав доступа

## 🎯 Как добавить новую Edge Function?

1. Создайте папку в `functions/`:
```bash
mkdir -p backend/functions/items
```

2. Создайте файлы по шаблону:
```
functions/items/
├── index.ts        # Копируйте из character/index.ts
├── handlers.ts     # Реализуйте CRUD обработчики
├── validation.ts   # Валидация специфичная для items
├── types.ts        # Типы ItemOptions, ItemRecord
└── README.md       # Документация API
```

3. Используйте shared модули:
```typescript
import { validateString, validateInteger } from "../../shared/validation.ts";
import { jsonResponse, errorResponse } from "../../shared/response.ts";
import { initSupabaseClient } from "../../shared/supabase.ts";
```

4. Деплойте:
```bash
supabase functions deploy items
```

## 📖 Дополнительная документация

- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Руководство по миграции со старой структуры
- [functions/character/README.md](functions/character/README.md) - Документация Character API

## 🔍 Тестирование

### Локальное тестирование

```bash
# Запуск локального Supabase
supabase start

# Запуск функции локально
supabase functions serve character

# Тестирование
curl -X POST http://localhost:54321/functions/v1/character \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "character_options": {...}}'
```

### Примеры запросов

См. файл `test-payloads.json` для примеров тестовых данных.

## 🛠️ Разработка

### Требования
- Deno (используется Supabase Edge Functions)
- Supabase CLI
- TypeScript знания

### Стиль кода
- Все комментарии на русском языке
- Используйте JSDoc для документации функций
- Следуйте существующей структуре файлов
- Используйте shared модули для переиспользуемой логики

### Валидация
Все входящие данные должны проходить валидацию:
1. Проверка типов данных
2. Проверка обязательных полей
3. Проверка диапазонов значений
4. Нормализация данных (trim, lowercase и т.д.)

### Безопасность
- Всегда проверяйте `user_id`
- Используйте `.eq("user_id", userId)` для проверки прав
- Валидируйте все входящие данные
- Логируйте ошибки для отладки

## 📝 Changelog

### v2.0.0 (Текущая версия)
- ✨ Новая модульная структура
- ✨ Shared модули для переиспользования кода
- ✨ Добавлен GET метод для получения персонажей
- ✨ Добавлен DELETE метод для удаления персонажей
- ✨ Подробные комментарии на русском языке
- ✨ Улучшенная валидация данных
- ✨ Единообразные HTTP ответы
- 📚 Полная документация API

### v1.0.0 (Старая версия)
- Базовая реализация POST и PUT/PATCH
- Монолитный файл character.ts
- Сохранено в character.ts.backup

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи в Supabase Dashboard → Edge Functions → Logs
2. Убедитесь что переменные окружения настроены
3. Проверьте права доступа к таблицам
4. Изучите примеры в документации

## 📄 Лицензия

Этот проект является частью D&D приложения.
