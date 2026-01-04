/**
 * Character Edge Function - главная точка входа
 * 
 * Эта Supabase Edge Function обрабатывает все CRUD операции с персонажами D&D:
 * - GET: получение персонажа или списка персонажей
 * - POST: создание нового персонажа
 * - PUT/PATCH: обновление существующего персонажа
 * - DELETE: удаление персонажа
 * 
 * Все запросы должны быть в формате JSON.
 * Все ответы возвращаются в формате JSON.
 */

import { initSupabaseClient } from "../../shared/supabase.ts";
import {
  errorResponse,
  methodNotAllowedResponse,
  invalidContentTypeResponse,
  invalidJsonResponse,
} from "../../shared/response.ts";
import {
  handleGet,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "./handlers.ts";
import type { IncomingPayload } from "./types.ts";

/**
 * Главная функция Edge Function
 * 
 * Обрабатывает входящие HTTP запросы и направляет их к соответствующим обработчикам
 */
Deno.serve(async (req: Request) => {
  try {
    const method = req.method;

    // ========== ИНИЦИАЛИЗАЦИЯ SUPABASE КЛИЕНТА ==========
    
    const supabase = initSupabaseClient();
    if (!supabase) {
      return errorResponse(
        "Server misconfiguration",
        500,
        "Failed to initialize Supabase client"
      );
    }

    // ========== ОБРАБОТКА GET ЗАПРОСОВ ==========
    
    // GET запросы не требуют тела запроса, параметры передаются в URL
    if (method === "GET") {
      return await handleGet(req, supabase);
    }

    // ========== ВАЛИДАЦИЯ CONTENT-TYPE ДЛЯ ОСТАЛЬНЫХ МЕТОДОВ ==========
    
    // Для POST, PUT, PATCH, DELETE требуется JSON в теле запроса
    const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    
    if (!allowedMethods.includes(method)) {
      return methodNotAllowedResponse(allowedMethods);
    }

    // Проверка Content-Type для методов с телом запроса
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return invalidContentTypeResponse();
    }

    // ========== ПАРСИНГ И ВАЛИДАЦИЯ ТЕЛА ЗАПРОСА ==========
    
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return invalidJsonResponse();
    }

    // Проверка что body это объект (не массив, не null)
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse(
        "Invalid request body",
        400,
        "Expected a JSON object"
      );
    }

    const payload = body as IncomingPayload;

    // ========== МАРШРУТИЗАЦИЯ ПО HTTP МЕТОДАМ ==========
    
    switch (method) {
      case "POST":
        // Создание нового персонажа
        return await handleCreate(payload, supabase);

      case "PUT":
      case "PATCH":
        // Обновление существующего персонажа
        return await handleUpdate(payload, supabase);

      case "DELETE":
        // Удаление персонажа
        return await handleDelete(payload, supabase);

      default:
        // Этот код не должен выполниться из-за проверки выше,
        // но добавлен для полноты
        return methodNotAllowedResponse(allowedMethods);
    }
  } catch (err) {
    // ========== ОБРАБОТКА НЕОЖИДАННЫХ ОШИБОК ==========
    
    console.error("Unexpected error in character edge function:", err);
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    return errorResponse(
      "Unexpected server error",
      500,
      errorMessage
    );
  }
});

