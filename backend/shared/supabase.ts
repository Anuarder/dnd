/**
 * Помощники для работы с Supabase
 * 
 * Этот модуль содержит функции для инициализации Supabase клиента
 * и проверки переменных окружения.
 */

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.30.0";

/**
 * Результат проверки переменных окружения
 */
interface EnvCheckResult {
  success: boolean;
  error?: string;
  url?: string;
  key?: string;
}

/**
 * Проверка наличия необходимых переменных окружения Supabase
 * 
 * @returns объект с результатом проверки
 * 
 * Пример использования:
 * const envCheck = checkSupabaseEnv();
 * if (!envCheck.success) {
 *   return errorResponse(envCheck.error!, 500);
 * }
 */
export function checkSupabaseEnv(): EnvCheckResult {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      success: false,
      error: "Server misconfiguration: missing Supabase environment variables",
    };
  }

  return {
    success: true,
    url: SUPABASE_URL,
    key: SUPABASE_SERVICE_ROLE_KEY,
  };
}

/**
 * Инициализация Supabase клиента
 * 
 * @returns Supabase клиент или null если переменные окружения не настроены
 * 
 * Пример использования:
 * const supabase = initSupabaseClient();
 * if (!supabase) {
 *   return errorResponse("Server misconfiguration", 500);
 * }
 */
export function initSupabaseClient(): SupabaseClient | null {
  const envCheck = checkSupabaseEnv();

  if (!envCheck.success) {
    console.error("Supabase env check failed:", envCheck.error);
    return null;
  }

  // Создание клиента с отключенной персистентностью сессий
  // (Edge Functions не должны хранить состояние между запросами)
  const client = createClient(envCheck.url!, envCheck.key!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}

/**
 * Проверка прав доступа пользователя к ресурсу
 * 
 * @param supabase - Supabase клиент
 * @param table - имя таблицы
 * @param resourceId - ID ресурса
 * @param userId - ID пользователя
 * @returns true если пользователь имеет доступ, false иначе
 * 
 * Пример использования:
 * const hasAccess = await checkUserAccess(supabase, "characters", characterId, userId);
 * if (!hasAccess) {
 *   return errorResponse("Access denied", 403);
 * }
 */
export async function checkUserAccess(
  supabase: SupabaseClient,
  table: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", resourceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking user access:", error);
    return false;
  }

  return data !== null;
}

