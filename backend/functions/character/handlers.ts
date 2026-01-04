/**
 * HTTP обработчики для CRUD операций с персонажами
 * 
 * Этот модуль содержит функции для обработки GET, POST, PUT/PATCH и DELETE запросов.
 * Каждая функция отвечает за один тип операции и возвращает Response объект.
 */

import type { SupabaseClient } from "npm:@supabase/supabase-js@2.30.0";
import { jsonResponse, errorResponse } from "../../shared/response.ts";
import { transformCharacterOptions } from "./validation.ts";
import type { IncomingPayload, CharacterRecord } from "./types.ts";

/**
 * GET - Получение персонажа или списка персонажей
 * 
 * @param req - HTTP запрос
 * @param supabase - Supabase клиент
 * @returns Response с данными персонажа/персонажей
 * 
 * Параметры запроса:
 * - user_id (обязательный) - ID пользователя
 * - character_id (опциональный) - ID конкретного персонажа
 * 
 * Если character_id указан - возвращает один персонаж
 * Если character_id не указан - возвращает всех персонажей пользователя
 */
export async function handleGet(
  req: Request,
  supabase: SupabaseClient
): Promise<Response> {
  // Получаем параметры из URL
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const characterId = url.searchParams.get("character_id");

  // Проверка обязательного параметра user_id
  if (!userId) {
    return errorResponse("Missing required parameter: user_id", 400);
  }

  // Если указан character_id - получаем конкретного персонажа
  if (characterId) {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("id", characterId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching character:", error);
      return errorResponse("Failed to fetch character", 500, error.message);
    }

    if (!data) {
      return errorResponse("Character not found", 404);
    }

    return jsonResponse(data, 200, "Character retrieved successfully");
  }

  // Иначе получаем всех персонажей пользователя
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching characters:", error);
    return errorResponse("Failed to fetch characters", 500, error.message);
  }

  return jsonResponse(
    { characters: data, count: data.length },
    200,
    "Characters retrieved successfully"
  );
}

/**
 * POST - Создание нового персонажа
 * 
 * @param payload - данные от клиента
 * @param supabase - Supabase клиент
 * @returns Response с созданным персонажем
 * 
 * Обязательные поля:
 * - user_id - ID пользователя
 * - character_options - данные персонажа
 * 
 * character_id генерируется автоматически базой данных
 */
export async function handleCreate(
  payload: IncomingPayload,
  supabase: SupabaseClient
): Promise<Response> {
  const { user_id, character_options } = payload;

  // Проверка обязательного поля user_id
  if (!user_id || typeof user_id !== "string") {
    return errorResponse("Missing required field: user_id", 400);
  }

  // Проверка наличия данных персонажа
  if (!character_options || typeof character_options !== "object") {
    return errorResponse("Missing required field: character_options", 400);
  }

  // Валидация и трансформация данных персонажа
  let validatedOptions;
  try {
    validatedOptions = transformCharacterOptions(character_options);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return errorResponse("Validation failed", 400, errorMessage);
  }

  // Создание записи в базе данных
  const { data, error } = await supabase
    .from("characters")
    .insert([
      {
        user_id,
        character_options: validatedOptions,
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error creating character:", error);
    return errorResponse("Failed to create character", 500, error.message);
  }

  return jsonResponse(data, 201, "Character created successfully");
}

/**
 * PUT/PATCH - Обновление существующего персонажа
 * 
 * @param payload - данные от клиента
 * @param supabase - Supabase клиент
 * @returns Response с обновлённым персонажем
 * 
 * Обязательные поля:
 * - user_id - ID пользователя (для проверки прав доступа)
 * - character_id - ID персонажа для обновления
 * - character_options - новые данные персонажа
 * 
 * Проверяется что пользователь является владельцем персонажа
 */
export async function handleUpdate(
  payload: IncomingPayload,
  supabase: SupabaseClient
): Promise<Response> {
  const { user_id, character_id, character_options } = payload;

  // Проверка обязательных полей
  if (!user_id || typeof user_id !== "string") {
    return errorResponse("Missing required field: user_id", 400);
  }

  if (!character_id || typeof character_id !== "string") {
    return errorResponse("Missing required field: character_id", 400);
  }

  if (!character_options || typeof character_options !== "object") {
    return errorResponse("Missing required field: character_options", 400);
  }

  // Валидация и трансформация данных персонажа
  let validatedOptions;
  try {
    validatedOptions = transformCharacterOptions(character_options);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return errorResponse("Validation failed", 400, errorMessage);
  }

  // Обновление записи в базе данных
  // .eq("user_id", user_id) гарантирует что пользователь может обновить только своего персонажа
  const { data, error } = await supabase
    .from("characters")
    .update({
      character_options: validatedOptions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", character_id)
    .eq("user_id", user_id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error updating character:", error);
    return errorResponse("Failed to update character", 500, error.message);
  }

  // Если data === null, значит персонаж не найден или пользователь не имеет прав
  if (!data) {
    return errorResponse(
      "Character not found or access denied",
      404,
      "Make sure the character exists and belongs to you"
    );
  }

  return jsonResponse(data, 200, "Character updated successfully");
}

/**
 * DELETE - Удаление персонажа
 * 
 * @param payload - данные от клиента
 * @param supabase - Supabase клиент
 * @returns Response с подтверждением удаления
 * 
 * Обязательные поля:
 * - user_id - ID пользователя (для проверки прав доступа)
 * - character_id - ID персонажа для удаления
 * 
 * Проверяется что пользователь является владельцем персонажа.
 * После удаления персонаж невозможно восстановить.
 */
export async function handleDelete(
  payload: IncomingPayload,
  supabase: SupabaseClient
): Promise<Response> {
  const { user_id, character_id } = payload;

  // Проверка обязательных полей
  if (!user_id || typeof user_id !== "string") {
    return errorResponse("Missing required field: user_id", 400);
  }

  if (!character_id || typeof character_id !== "string") {
    return errorResponse("Missing required field: character_id", 400);
  }

  // Удаление записи из базы данных
  // .eq("user_id", user_id) гарантирует что пользователь может удалить только своего персонажа
  const { data, error } = await supabase
    .from("characters")
    .delete()
    .eq("id", character_id)
    .eq("user_id", user_id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error deleting character:", error);
    return errorResponse("Failed to delete character", 500, error.message);
  }

  // Если data === null, значит персонаж не найден или пользователь не имеет прав
  if (!data) {
    return errorResponse(
      "Character not found or access denied",
      404,
      "Make sure the character exists and belongs to you"
    );
  }

  return jsonResponse(
    { deleted_character_id: character_id },
    200,
    "Character deleted successfully"
  );
}

