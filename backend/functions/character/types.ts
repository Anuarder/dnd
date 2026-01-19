/**
 * Типы специфичные для Character Edge Function
 * 
 * Этот модуль содержит TypeScript типы и интерфейсы для работы с персонажами D&D.
 */

import type { SupabaseRecord } from "../../shared/types.ts";

/**
 * Структура одной характеристики персонажа (сила, ловкость и т.д.)
 */
export interface CharacterStat {
  /** Значение характеристики (обычно от 1 до 20) */
  value: number;
  /** Является ли эта характеристика мастерской (даёт бонус к спасброскам) */
  is_master: boolean;
}

/**
 * Все характеристики персонажа (6 основных характеристик D&D)
 */
export interface CharacterStats {
  /** Сила - влияет на физические атаки и переноску */
  strength: CharacterStat;
  /** Ловкость - влияет на инициативу, AC и дальние атаки */
  dexterity: CharacterStat;
  /** Телосложение - влияет на HP */
  constitution: CharacterStat;
  /** Интеллект - влияет на знания и магию волшебников */
  intelligence: CharacterStat;
  /** Мудрость - влияет на восприятие и магию жрецов */
  wisdom: CharacterStat;
  /** Харизма - влияет на социальные взаимодействия и магию бардов/колдунов */
  charisma: CharacterStat;
}

// NEW: ADDED MONEY INTERFACE
/**
 * Деньги персонажа
 */
export interface CharacterMoney {
  /** Золото */
  gold: number;
  /** Серебро */
  silver: number;
  /** Медь */
  copper: number;
}

// NEW: ADDED CHARACTER SIZE TYPE
/**
 * Размер персонажа
 */
export type CharacterSize = "tiny" | "small" | "medium" | "large" | "huge" | "gargantuan";

// NEW: ADDED FEATURE INTERFACE
/**
 * Способность персонажа (например "action-surge")
 */
export interface CharacterFeature {
  /** Название способности */
  name: string;
  /** Количество использований */
  use: number;
}

// NEW: ADDED SPELL INTERFACE
/**
 * Заклинание персонажа
 */
export interface CharacterSpell {
  /** Название заклинания */
  name: string;
}

// NEW: ADDED SPELL SLOT INTERFACE
/**
 * Слоты заклинаний
 */
export interface CharacterSpellSlot {
  /** Уровень слота */
  lvl: number;
  /** Количество слотов */
  count: number;
}

// NEW: ADDED MULTICLASS INTERFACE
/**
 * Мультикласс персонажа
 */
export interface CharacterMultiClass {
  /** Название класса */
  class: string;
  /** Уровень в этом классе */
  level: number;
}

/**
 * Полная структура данных персонажа (хранится в поле character_options)
 */
export interface CharacterOptions {
  /** Имя персонажа */
  name: string;
  /** Уровень персонажа (1-20) */
  level: number;
  /** Пол персонажа */
  gender: string;
  /** Раса персонажа (эльф, дварф, человек и т.д.) */
  race: string;
  /** Подраса персонажа (опционально, например "высший эльф") */
  sub_race: string | null;
  /** Класс персонажа (воин, маг, плут и т.д.) */
  class: string;
  /** Подкласс персонажа (опционально, например "чемпион") */
  sub_class: string | null;
  // NEW: ADDED ISMULTICLASS FIELD
  /** Является ли персонаж мультиклассом */
  isMulticlass: boolean;
  // NEW: ADDED MULTICLASS FIELD (EXPANDABLE ARRAY)
  /** Дополнительные классы персонажа (для мультикласса) */
  multiClass: CharacterMultiClass[];
  /** Характеристики персонажа */
  stats: CharacterStats;
  // UPDATED: CHANGED HISTORY FROM ARRAY TO STRING
  /** История персонажа */
  history: string;
  /** Бонус мастерства (зависит от уровня) */
  master_bonus: number;
  /** Навыки персонажа */
  skills: unknown[];
  /** Предметы в инвентаре */
  items: unknown[];
  /** Класс брони (Armor Class) */
  ac: number;
  /** Текущие хиты */
  hp: number;
  /** Инициатива (бонус к броску инициативы) */
  initiative: number;
  /** Скорость передвижения (в футах) */
  speed: number;
  /** Кость хитов (например "1d8") */
  hp_dice: string;
  /** Максимальные хиты */
  max_hp: number;
  /** Временные хиты */
  temp_hp: number;
  /** Спасброски от смерти */
  death_saves: number;
  /** Количество вдохновений */
  inspirations: number;
  /** Опыт персонажа */
  exp: number;
  // NEW: ADDED MONEY FIELD
  /** Деньги персонажа */
  money: CharacterMoney;
  // NEW: ADDED CHARACTER_SIZE FIELD
  /** Размер персонажа */
  character_size: CharacterSize;
  // NEW: ADDED FEATURES FIELD
  /** Способности персонажа */
  features: CharacterFeature[];
  // NEW: ADDED SPELLS FIELD
  /** Заклинания персонажа */
  spells: CharacterSpell[];
  // NEW: ADDED SPELL_SLOTS FIELD
  /** Слоты заклинаний */
  spell_slots: CharacterSpellSlot[];
  // NEW: ADDED PATH FIELD
  /** Путь персонажа */
  path: string;
  // NEW: ADDED CARRYING FIELD (CALCULATED ON BACKEND)
  /** Грузоподъёмность персонажа (рассчитывается: strength * 15, умножается на 2 для каждого размера больше medium) */
  carrying: number;
}

/**
 * Запись персонажа в базе данных Supabase
 */
export interface CharacterRecord extends SupabaseRecord {
  /** ID пользователя-владельца персонажа */
  user_id: string;
  /** Данные персонажа (JSON поле) */
  character_options: CharacterOptions;
}

/**
 * Входящие данные от клиента
 */
export interface IncomingPayload {
  /** ID пользователя */
  user_id?: string;
  /** ID персонажа (для UPDATE и DELETE) */
  character_id?: string;
  /** Данные персонажа */
  character_options?: Record<string, unknown>;
  /** Любые другие поля */
  [key: string]: unknown;
}

