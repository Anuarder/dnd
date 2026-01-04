/**
 * Общие TypeScript типы и интерфейсы для всех Edge Functions
 * 
 * Этот модуль содержит базовые типы, которые используются во всех edge functions:
 * - Стандартные форматы API ответов
 * - Типы ошибок валидации
 * - Базовые типы записей из Supabase
 */

/**
 * Стандартный формат успешного API ответа
 * @template T - тип данных в поле data
 */
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

/**
 * Формат ответа с ошибкой
 */
export interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * Ошибка валидации одного поля
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Формат ответа с ошибками валидации
 */
export interface ValidationErrorResponse {
  error: string;
  validation_errors: ValidationError[];
}

/**
 * Базовый тип записи из Supabase
 * Все записи в БД имеют эти поля
 */
export interface SupabaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Опции для валидации строк
 */
export interface StringValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  trim?: boolean;
}

/**
 * Опции для валидации чисел
 */
export interface NumberValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
}

/**
 * Опции для валидации массивов
 */
export interface ArrayValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

/**
 * Опции для валидации объектов
 */
export interface ObjectValidationOptions {
  required?: boolean;
  allowNull?: boolean;
}

