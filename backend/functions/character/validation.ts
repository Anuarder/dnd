/**
 * Валидация специфичная для персонажей D&D
 * 
 * Этот модуль содержит функции валидации полей персонажа.
 * Использует общие функции валидации из shared/validation.ts
 */

import {
  validateString,
  validateInteger,
  validateArray,
  validateObject,
  validateBoolean,
} from "../../shared/validation.ts";
import type { CharacterStats, CharacterOptions } from "./types.ts";

/**
 * Валидация характеристик персонажа (strength, dexterity и т.д.)
 * 
 * @param stats - объект с характеристиками
 * @returns валидированный объект CharacterStats
 * @throws Error если валидация не прошла
 * 
 * Каждая характеристика должна содержать:
 * - value: число (значение характеристики)
 * - is_master: boolean (является ли мастерской)
 */
export function validateStats(stats: unknown): CharacterStats {
  // Проверяем что stats это объект
  const statsObj = validateObject(stats, "stats", { required: true });
  if (!statsObj) {
    throw new Error("stats is required");
  }

  // Список всех 6 характеристик D&D
  const statNames = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ] as const;

  const result: Record<string, { value: number; is_master: boolean }> = {};

  // Валидация каждой характеристики
  for (const statName of statNames) {
    const stat = statsObj[statName];

    // Проверяем что характеристика это объект
    const statObj = validateObject(stat, `stats.${statName}`, { required: true });
    if (!statObj) {
      throw new Error(`stats.${statName} is required`);
    }

    // Валидация значения характеристики (обычно 1-20, но можем разрешить больше)
    const value = validateInteger(statObj.value, `stats.${statName}.value`, {
      required: true,
      min: 1,
      max: 30,
    });

    // Валидация флага мастерства
    const isMaster = validateBoolean(statObj.is_master, `stats.${statName}.is_master`, false);

    result[statName] = {
      value,
      is_master: isMaster,
    };
  }

  return result as CharacterStats;
}

/**
 * Полная валидация и трансформация данных персонажа
 * 
 * @param options - сырые данные персонажа от клиента
 * @returns валидированный объект CharacterOptions
 * @throws Error если валидация не прошла
 * 
 * Эта функция проверяет все обязательные и опциональные поля персонажа,
 * преобразует типы данных и возвращает чистый объект для сохранения в БД.
 */
export function transformCharacterOptions(
  options: Record<string, unknown>
): CharacterOptions {
  const errors: string[] = [];

  // Функция для безопасной валидации с накоплением ошибок
  function safeValidate<T>(
    fn: () => T,
    defaultValue: T
  ): T {
    try {
      return fn();
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
      return defaultValue;
    }
  }

  // ========== ВАЛИДАЦИЯ ОБЯЗАТЕЛЬНЫХ СТРОКОВЫХ ПОЛЕЙ ==========
  
  /** Имя персонажа */
  const name = safeValidate(
    () => validateString(options.name, "name", { required: true, minLength: 1, maxLength: 100 })!,
    ""
  );

  /** Пол персонажа */
  const gender = safeValidate(
    () => validateString(options.gender, "gender", { required: true })!,
    ""
  );

  /** Раса персонажа */
  const race = safeValidate(
    () => validateString(options.race, "race", { required: true })!,
    ""
  );

  /** Класс персонажа */
  const characterClass = safeValidate(
    () => validateString(options.class, "class", { required: true })!,
    ""
  );

  /** Кость хитов */
  const hpDice = safeValidate(
    () => validateString(options.hp_dice, "hp_dice", { required: true })!,
    "1d8"
  );

  // ========== ВАЛИДАЦИЯ ОПЦИОНАЛЬНЫХ СТРОКОВЫХ ПОЛЕЙ ==========
  
  /** Подраса персонажа (может быть null) */
  const subRace = safeValidate(
    () => validateString(options.sub_race, "sub_race", { required: false }),
    null
  );

  /** Подкласс персонажа (может быть null) */
  const subClass = safeValidate(
    () => validateString(options.sub_class, "sub_class", { required: false }),
    null
  );

  // ========== ВАЛИДАЦИЯ ЧИСЛОВЫХ ПОЛЕЙ ==========
  
  /** Уровень персонажа (1-20) */
  const level = safeValidate(
    () => validateInteger(options.level, "level", { required: true, min: 1, max: 20 }),
    1
  );

  /** Бонус мастерства */
  const masterBonus = safeValidate(
    () => validateInteger(options.master_bonus, "master_bonus", { required: true, min: 0 }),
    2
  );

  /** Класс брони */
  const ac = safeValidate(
    () => validateInteger(options.ac, "ac", { required: true, min: 0 }),
    10
  );

  /** Текущие хиты */
  const hp = safeValidate(
    () => validateInteger(options.hp, "hp", { required: true, min: 0 }),
    0
  );

  /** Инициатива */
  const initiative = safeValidate(
    () => validateInteger(options.initiative, "initiative", { required: true }),
    0
  );

  /** Скорость */
  const speed = safeValidate(
    () => validateInteger(options.speed, "speed", { required: true, min: 0 }),
    30
  );

  /** Максимальные хиты */
  const maxHp = safeValidate(
    () => validateInteger(options.max_hp, "max_hp", { required: true, min: 0 }),
    0
  );

  /** Временные хиты */
  const tempHp = safeValidate(
    () => validateInteger(options.temp_hp, "temp_hp", { required: true, min: 0 }),
    0
  );

  /** Спасброски от смерти */
  const deathSaves = safeValidate(
    () => validateInteger(options.death_saves, "death_saves", { required: true, min: 0 }),
    0
  );

  /** Вдохновения (по умолчанию 0) */
  const inspirations = safeValidate(
    () => validateInteger(options.inspirations, "inspirations", { required: false, min: 0 }),
    0
  );

  /** Опыт */
  const exp = safeValidate(
    () => validateInteger(options.exp, "exp", { required: true, min: 0 }),
    0
  );

  // ========== ВАЛИДАЦИЯ ХАРАКТЕРИСТИК ==========
  
  const stats = safeValidate(
    () => validateStats(options.stats),
    {
      strength: { value: 10, is_master: false },
      dexterity: { value: 10, is_master: false },
      constitution: { value: 10, is_master: false },
      intelligence: { value: 10, is_master: false },
      wisdom: { value: 10, is_master: false },
      charisma: { value: 10, is_master: false },
    }
  );

  // ========== ВАЛИДАЦИЯ МАССИВОВ ==========
  
  /** История персонажа */
  const history = safeValidate(
    () => validateArray(options.history, "history", { required: true }),
    []
  );

  /** Навыки */
  const skills = safeValidate(
    () => validateArray(options.skills, "skills", { required: false }),
    []
  );

  /** Предметы */
  const items = safeValidate(
    () => validateArray(options.items, "items", { required: false }),
    []
  );

  // ========== ПРОВЕРКА НАКОПЛЕННЫХ ОШИБОК ==========
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join("; ")}`);
  }

  // ========== ВОЗВРАТ ВАЛИДИРОВАННОГО ОБЪЕКТА ==========
  
  return {
    name,
    level,
    gender,
    race,
    sub_race: subRace,
    class: characterClass,
    sub_class: subClass,
    stats,
    history,
    master_bonus: masterBonus,
    skills,
    items,
    ac,
    hp,
    initiative,
    speed,
    hp_dice: hpDice,
    max_hp: maxHp,
    temp_hp: tempHp,
    death_saves: deathSaves,
    inspirations,
    exp,
  };
}

