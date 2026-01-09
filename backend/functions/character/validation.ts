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
// NEW: ADDED IMPORTS FOR NEW TYPES
import type { 
  CharacterStats, 
  CharacterOptions, 
  CharacterMoney, 
  CharacterSize, 
  CharacterFeature, 
  CharacterSpell, 
  CharacterSpellSlot,
  CharacterMultiClass 
} from "./types.ts";

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

  return result as unknown as CharacterStats;
}

// NEW: ADDED VALIDATION FOR MONEY
/**
 * Валидация денег персонажа
 * 
 * @param money - объект с деньгами
 * @returns валидированный объект CharacterMoney
 * @throws Error если валидация не прошла
 */
export function validateMoney(money: unknown): CharacterMoney {
  const moneyObj = validateObject(money, "money", { required: false });
  
  if (!moneyObj) {
    // DEFAULT VALUES IF NOT PROVIDED
    return { gold: 0, silver: 0, copper: 10 };
  }

  const gold = validateInteger(moneyObj.gold, "money.gold", { required: false, min: 0 }) ?? 0;
  const silver = validateInteger(moneyObj.silver, "money.silver", { required: false, min: 0 }) ?? 0;
  const copper = validateInteger(moneyObj.copper, "money.copper", { required: false, min: 0 }) ?? 10;

  return { gold, silver, copper };
}

// NEW: ADDED VALIDATION FOR CHARACTER SIZE
/**
 * Валидация размера персонажа
 * 
 * @param size - размер персонажа
 * @returns валидированный размер
 * @throws Error если валидация не прошла
 */
export function validateCharacterSize(size: unknown): CharacterSize {
  const sizeStr = validateString(size, "character_size", { required: false });
  
  const validSizes: CharacterSize[] = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
  
  if (!sizeStr || !validSizes.includes(sizeStr as CharacterSize)) {
    // DEFAULT TO MEDIUM IF NOT PROVIDED OR INVALID
    return "medium";
  }

  return sizeStr as CharacterSize;
}

// NEW: ADDED VALIDATION FOR FEATURES
/**
 * Валидация способностей персонажа
 * 
 * @param features - массив способностей
 * @returns валидированный массив способностей
 */
export function validateFeatures(features: unknown): CharacterFeature[] {
  const featuresArr = validateArray(features, "features", { required: false });
  
  if (!featuresArr) {
    return [];
  }

  return featuresArr.map((feature, index) => {
    const featureObj = validateObject(feature, `features[${index}]`, { required: true });
    
    if (!featureObj) {
      throw new Error(`features[${index}] must be an object`);
    }

    const name = validateString(featureObj.name, `features[${index}].name`, { required: true });
    const use = validateInteger(featureObj.use, `features[${index}].use`, { required: true, min: 0 });

    if (!name) {
      throw new Error(`features[${index}].name is required`);
    }

    return { name, use };
  });
}

// NEW: ADDED VALIDATION FOR SPELLS
/**
 * Валидация заклинаний персонажа
 * 
 * @param spells - массив заклинаний
 * @returns валидированный массив заклинаний
 */
export function validateSpells(spells: unknown): CharacterSpell[] {
  const spellsArr = validateArray(spells, "spells", { required: false });
  
  if (!spellsArr) {
    return [];
  }

  return spellsArr.map((spell, index) => {
    const spellObj = validateObject(spell, `spells[${index}]`, { required: true });
    
    if (!spellObj) {
      throw new Error(`spells[${index}] must be an object`);
    }

    const name = validateString(spellObj.name, `spells[${index}].name`, { required: true });

    if (!name) {
      throw new Error(`spells[${index}].name is required`);
    }

    return { name };
  });
}

// NEW: ADDED VALIDATION FOR SPELL SLOTS
/**
 * Валидация слотов заклинаний персонажа
 * 
 * @param spellSlots - массив слотов заклинаний
 * @returns валидированный массив слотов
 */
export function validateSpellSlots(spellSlots: unknown): CharacterSpellSlot[] {
  const spellSlotsArr = validateArray(spellSlots, "spell_slots", { required: false });
  
  if (!spellSlotsArr) {
    return [];
  }

  return spellSlotsArr.map((slot, index) => {
    const slotObj = validateObject(slot, `spell_slots[${index}]`, { required: true });
    
    if (!slotObj) {
      throw new Error(`spell_slots[${index}] must be an object`);
    }

    const lvl = validateInteger(slotObj.lvl, `spell_slots[${index}].lvl`, { required: true, min: 1, max: 9 });
    const count = validateInteger(slotObj.count, `spell_slots[${index}].count`, { required: true, min: 0 });

    return { lvl, count };
  });
}

// NEW: ADDED VALIDATION FOR MULTICLASS
/**
 * Валидация мультиклассов персонажа
 * 
 * @param multiClass - массив мультиклассов
 * @returns валидированный массив мультиклассов
 */
export function validateMultiClass(multiClass: unknown): CharacterMultiClass[] {
  const multiClassArr = validateArray(multiClass, "multiClass", { required: false });
  
  if (!multiClassArr) {
    return [];
  }

  return multiClassArr.map((mc, index) => {
    const mcObj = validateObject(mc, `multiClass[${index}]`, { required: true });
    
    if (!mcObj) {
      throw new Error(`multiClass[${index}] must be an object`);
    }

    const classStr = validateString(mcObj.class, `multiClass[${index}].class`, { required: true });
    const level = validateInteger(mcObj.level, `multiClass[${index}].level`, { required: true, min: 1, max: 20 });

    if (!classStr) {
      throw new Error(`multiClass[${index}].class is required`);
    }

    return { class: classStr, level };
  });
}

// NEW: ADDED FUNCTION TO CALCULATE CARRYING CAPACITY
/**
 * Рассчитывает грузоподъёмность персонажа
 * 
 * @param strength - значение силы персонажа
 * @param size - размер персонажа
 * @returns грузоподъёмность в фунтах
 * 
 * Формула: strength * 15, умножается на 2 для каждого размера больше medium
 */
export function calculateCarrying(strength: number, size: CharacterSize): number {
  let baseCarrying = strength * 15;
  
  // MULTIPLY BY 2 FOR EACH SIZE ABOVE MEDIUM
  if (size === "large") {
    baseCarrying *= 2;
  } else if (size === "huge") {
    baseCarrying *= 4; // 2 * 2
  } else if (size === "gargantuan") {
    baseCarrying *= 8; // 2 * 2 * 2
  }
  // SIZES SMALLER THAN MEDIUM DON'T MODIFY CARRYING
  
  return baseCarrying;
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

  // NEW: ADDED VALIDATION FOR ISMULTICLASS
  /** Является ли персонаж мультиклассом */
  const isMulticlass = safeValidate(
    () => validateBoolean(options.isMulticlass, "isMulticlass", false),
    false
  );

  // NEW: ADDED VALIDATION FOR MULTICLASS ARRAY
  /** Мультиклассы персонажа */
  const multiClass = safeValidate(
    () => validateMultiClass(options.multiClass),
    []
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
  
  // UPDATED: CHANGED HISTORY FROM ARRAY TO STRING
  /** История персонажа */
  const history = safeValidate(
    () => validateString(options.history, "history", { required: false }) ?? "",
    ""
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

  // NEW: ADDED VALIDATION FOR MONEY
  /** Деньги */
  const money = safeValidate(
    () => validateMoney(options.money),
    { gold: 0, silver: 0, copper: 10 }
  );

  // NEW: ADDED VALIDATION FOR CHARACTER_SIZE
  /** Размер персонажа */
  const characterSize = safeValidate(
    () => validateCharacterSize(options.character_size),
    "medium"
  );

  // NEW: ADDED VALIDATION FOR FEATURES
  /** Способности */
  const features = safeValidate(
    () => validateFeatures(options.features),
    []
  );

  // NEW: ADDED VALIDATION FOR SPELLS
  /** Заклинания */
  const spells = safeValidate(
    () => validateSpells(options.spells),
    []
  );

  // NEW: ADDED VALIDATION FOR SPELL_SLOTS
  /** Слоты заклинаний */
  const spellSlots = safeValidate(
    () => validateSpellSlots(options.spell_slots),
    []
  );

  // NEW: ADDED VALIDATION FOR PATH
  /** Путь персонажа */
  const path = safeValidate(
    () => validateString(options.path, "path", { required: false }) ?? "",
    ""
  );

  // NEW: CALCULATE CARRYING CAPACITY (NOT RECEIVED FROM FRONTEND)
  /** Грузоподъёмность (рассчитывается на бэкенде) */
  const carrying = calculateCarrying(stats.strength.value, characterSize);

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
    // NEW: ADDED ISMULTICLASS AND MULTICLASS TO RETURN OBJECT
    isMulticlass,
    multiClass,
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
    // NEW: ADDED NEW FIELDS TO RETURN OBJECT
    money,
    character_size: characterSize,
    features,
    spells,
    spell_slots: spellSlots,
    path,
    carrying, // CALCULATED ON BACKEND
  };
}

