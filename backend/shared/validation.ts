/**
 * Переиспользуемые функции валидации для всех Edge Functions
 * 
 * Этот модуль содержит универсальные функции валидации, которые можно использовать
 * в любой edge function для проверки входящих данных.
 */

import type {
  StringValidationOptions,
  NumberValidationOptions,
  ArrayValidationOptions,
  ObjectValidationOptions,
} from "./types.ts";

/**
 * Валидация строковых полей
 * 
 * @param value - значение для валидации
 * @param fieldName - имя поля (для сообщений об ошибках)
 * @param options - опции валидации
 * @returns валидированная строка или null (если allowNull)
 * @throws Error если валидация не прошла
 * 
 * Пример использования:
 * const name = validateString(input.name, "name", { required: true, minLength: 2 });
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: StringValidationOptions = {}
): string | null {
  const { required = false, minLength, maxLength, pattern, trim = true } = options;

  // Проверка на null/undefined
  if (value === null || value === undefined) {
    if (required) {
      throw new Error(`${fieldName} is required`);
    }
    return null;
  }

  // Преобразование в строку
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  // Обрезка пробелов
  let str = trim ? value.trim() : value;

  // Проверка на пустую строку
  if (str.length === 0) {
    if (required) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    return null;
  }

  // Проверка минимальной длины
  if (minLength !== undefined && str.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters long`);
  }

  // Проверка максимальной длины
  if (maxLength !== undefined && str.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters long`);
  }

  // Проверка по регулярному выражению
  if (pattern && !pattern.test(str)) {
    throw new Error(`${fieldName} has invalid format`);
  }

  return str;
}

/**
 * Валидация целочисленных полей
 * 
 * @param value - значение для валидации (может быть строкой или числом)
 * @param fieldName - имя поля (для сообщений об ошибках)
 * @param options - опции валидации
 * @returns валидированное число
 * @throws Error если валидация не прошла
 * 
 * Пример использования:
 * const level = validateInteger(input.level, "level", { required: true, min: 1, max: 20 });
 */
export function validateInteger(
  value: unknown,
  fieldName: string,
  options: NumberValidationOptions = {}
): number {
  const { required = false, min, max, integer = true } = options;

  // Проверка на null/undefined
  if (value === null || value === undefined) {
    if (required) {
      throw new Error(`${fieldName} is required`);
    }
    return 0;
  }

  // Парсинг числа из строки или числа
  let num: number;

  if (typeof value === "string") {
    // Проверка что строка содержит только цифры (и опционально минус)
    if (!/^-?\d+(\.\d+)?$/.test(value)) {
      throw new Error(`${fieldName} must be a valid number`);
    }
    num = parseFloat(value);
  } else if (typeof value === "number") {
    num = value;
  } else {
    throw new Error(`${fieldName} must be a number`);
  }

  // Проверка что число валидное
  if (!Number.isFinite(num)) {
    throw new Error(`${fieldName} must be a finite number`);
  }

  // Округление до целого если требуется
  if (integer) {
    num = Math.floor(num);
  }

  // Проверка минимального значения
  if (min !== undefined && num < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }

  // Проверка максимального значения
  if (max !== undefined && num > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }

  return num;
}

/**
 * Валидация массивов
 * 
 * @param value - значение для валидации
 * @param fieldName - имя поля (для сообщений об ошибках)
 * @param options - опции валидации
 * @returns валидированный массив
 * @throws Error если валидация не прошла
 * 
 * Пример использования:
 * const items = validateArray(input.items, "items", { required: true, minLength: 1 });
 */
export function validateArray(
  value: unknown,
  fieldName: string,
  options: ArrayValidationOptions = {}
): unknown[] {
  const { required = false, minLength, maxLength } = options;

  // Проверка на null/undefined
  if (value === null || value === undefined) {
    if (required) {
      throw new Error(`${fieldName} is required`);
    }
    return [];
  }

  // Проверка что это массив
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  // Проверка минимальной длины
  if (minLength !== undefined && value.length < minLength) {
    throw new Error(`${fieldName} must contain at least ${minLength} items`);
  }

  // Проверка максимальной длины
  if (maxLength !== undefined && value.length > maxLength) {
    throw new Error(`${fieldName} must contain at most ${maxLength} items`);
  }

  return value;
}

/**
 * Валидация объектов
 * 
 * @param value - значение для валидации
 * @param fieldName - имя поля (для сообщений об ошибках)
 * @param options - опции валидации
 * @returns валидированный объект или null
 * @throws Error если валидация не прошла
 * 
 * Пример использования:
 * const stats = validateObject(input.stats, "stats", { required: true });
 */
export function validateObject(
  value: unknown,
  fieldName: string,
  options: ObjectValidationOptions = {}
): Record<string, unknown> | null {
  const { required = false, allowNull = false } = options;

  // Проверка на null/undefined
  if (value === null || value === undefined) {
    if (required && !allowNull) {
      throw new Error(`${fieldName} is required`);
    }
    return null;
  }

  // Проверка что это объект (не массив)
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return value as Record<string, unknown>;
}

/**
 * Валидация булевых значений
 * 
 * @param value - значение для валидации
 * @param fieldName - имя поля (для сообщений об ошибках)
 * @param defaultValue - значение по умолчанию
 * @returns валидированное булево значение
 * 
 * Пример использования:
 * const isMaster = validateBoolean(input.is_master, "is_master", false);
 */
export function validateBoolean(
  value: unknown,
  fieldName: string,
  defaultValue = false
): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  // Преобразование в булево значение
  return Boolean(value);
}

