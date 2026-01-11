/**
 * Утилиты для создания HTTP ответов
 * 
 * Этот модуль содержит функции для создания единообразных HTTP ответов
 * во всех edge functions. Все ответы возвращаются в формате JSON.
 */

import type { ApiResponse, ErrorResponse, ValidationError } from "./types.ts";

/**
 * Создание успешного JSON ответа
 * 
 * @param data - данные для возврата
 * @param status - HTTP статус код (по умолчанию 200)
 * @param message - сообщение (опционально)
 * @returns Response объект с JSON телом
 * 
 * Пример использования:
 * return jsonResponse({ character: data }, 200, "Character created successfully");
 */
export function jsonResponse<T = unknown>(
  data: T,
  status = 200,
  message?: string
): Response {
  const body: ApiResponse<T> = {
    message: message || "Success",
    data,
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Создание ответа с ошибкой
 * 
 * @param error - текст ошибки
 * @param status - HTTP статус код (по умолчанию 500)
 * @param details - дополнительная информация об ошибке
 * @returns Response объект с JSON телом
 * 
 * Пример использования:
 * return errorResponse("Character not found", 404);
 */
export function errorResponse(
  error: string,
  status = 500,
  details?: string
): Response {
  const body: ErrorResponse = {
    error,
    ...(details && { details }),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Создание ответа с ошибками валидации
 * 
 * @param errors - массив ошибок валидации
 * @returns Response объект с JSON телом и статусом 400
 * 
 * Пример использования:
 * return validationErrorResponse([
 *   { field: "name", message: "Name is required" },
 *   { field: "level", message: "Level must be between 1 and 20" }
 * ]);
 */
export function validationErrorResponse(errors: ValidationError[]): Response {
  const body = {
    error: "Validation failed",
    validation_errors: errors,
  };

  return new Response(JSON.stringify(body), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Создание ответа для неподдерживаемого HTTP метода
 * 
 * @param allowedMethods - массив разрешённых методов
 * @returns Response объект со статусом 405
 * 
 * Пример использования:
 * return methodNotAllowedResponse(["GET", "POST", "PUT", "DELETE"]);
 */
export function methodNotAllowedResponse(allowedMethods: string[]): Response {
  return new Response(
    JSON.stringify({
      error: "Method Not Allowed",
      allowed_methods: allowedMethods,
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Allow": allowedMethods.join(", "),
      },
    }
  );
}

/**
 * Создание ответа для неверного Content-Type
 * 
 * @returns Response объект со статусом 400
 */
export function invalidContentTypeResponse(): Response {
  return errorResponse(
    "Invalid Content-Type",
    400,
    "Expected application/json"
  );
}

/**
 * Создание ответа для неверного JSON в теле запроса
 * 
 * @returns Response объект со статусом 400
 */
export function invalidJsonResponse(): Response {
  return errorResponse(
    "Invalid JSON body",
    400,
    "Expected a valid JSON object"
  );
}

