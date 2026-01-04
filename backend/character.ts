import { createClient } from "npm:@supabase/supabase-js@2.30.0";

/**
 * Supabase Edge Function for character entity
 * Handles POST (create) and PUT/PATCH (update) requests for character_options
 */

interface IncomingPayload {
  user_id?: string;
  character_id?: string;
  character_options?: Record<string, unknown>;
  [key: string]: unknown;
}

Deno.serve(async (req: Request) => {
  try {
    // Only allow POST, PUT, PATCH methods
    if (!["POST", "PUT", "PATCH"].includes(req.method)) {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate Content-Type
    const ct = req.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Expected application/json" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse and validate body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body; expected an object" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = body as IncomingPayload;
    const userId = typeof payload.user_id === "string" ? payload.user_id : undefined;
    const characterId = typeof payload.character_id === "string" ? payload.character_id : undefined;
    const isUpdate = req.method !== "POST";

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: user_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // For UPDATE requests, character_id is required (it's auto-generated for CREATE)
    if (isUpdate && !characterId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: character_id (required for update)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract character_options
    let rawOptions: Record<string, unknown> | undefined = undefined;
    if (
      payload.character_options &&
      typeof payload.character_options === "object" &&
      !Array.isArray(payload.character_options)
    ) {
      rawOptions = payload.character_options as Record<string, unknown>;
    } else {
      // Fallback: use all fields except user_id and character_id
      const copy = { ...payload } as Record<string, unknown>;
      delete copy.user_id;
      delete copy.character_id;
      if (Object.keys(copy).length > 0) rawOptions = copy;
    }

    if (!rawOptions) {
      return new Response(
        JSON.stringify({ error: "Missing character options in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ========== ВАЛИДАЦИЯ И ТРАНСФОРМАЦИЯ CHARACTER_OPTIONS ==========
    const transformOptions = (opts: Record<string, unknown>): Record<string, unknown> => {
      const out: Record<string, unknown> = { ...opts };
      const errors: string[] = [];

      // ========== ВАЛИДАЦИЯ NAME (text, not null) ==========
      if (!out.name || typeof out.name !== "string" || out.name.trim().length === 0) {
        errors.push("name is required and must be a non-empty string");
      } else {
        out.name = String(out.name).trim();
      }

      // ========== ВАЛИДАЦИЯ LEVEL (int, not null) ==========
      if (out.level === undefined || out.level === null) {
        errors.push("level is required");
      } else {
        const level = typeof out.level === "string" && /^-?\d+$/.test(out.level)
          ? parseInt(out.level, 10)
          : typeof out.level === "number" && Number.isFinite(out.level)
          ? Math.floor(out.level)
          : null;
        if (level === null || level < 0) {
          errors.push("level must be a non-negative integer");
        } else {
          out.level = level;
        }
      }

      // ========== ВАЛИДАЦИЯ GENDER (text, not null) ==========
      if (!out.gender || typeof out.gender !== "string" || out.gender.trim().length === 0) {
        errors.push("gender is required and must be a non-empty string");
      } else {
        out.gender = String(out.gender).trim();
      }

      // ========== ВАЛИДАЦИЯ RACE (text, not null) ==========
      if (!out.race || typeof out.race !== "string" || out.race.trim().length === 0) {
        errors.push("race is required and must be a non-empty string");
      } else {
        out.race = String(out.race).trim();
      }

      // ========== ВАЛИДАЦИЯ SUB_RACE (text, nullable) ==========
      if (out.sub_race !== undefined && out.sub_race !== null) {
        if (typeof out.sub_race !== "string") {
          out.sub_race = String(out.sub_race).trim() || null;
        } else {
          out.sub_race = out.sub_race.trim() || null;
        }
      } else {
        out.sub_race = null;
      }

      // ========== ВАЛИДАЦИЯ CLASS (text, not null) ==========
      if (!out.class || typeof out.class !== "string" || out.class.trim().length === 0) {
        errors.push("class is required and must be a non-empty string");
      } else {
        out.class = String(out.class).trim();
      }

      // ========== ВАЛИДАЦИЯ SUB_CLASS (text, nullable) ==========
      if (out.sub_class !== undefined && out.sub_class !== null) {
        if (typeof out.sub_class !== "string") {
          out.sub_class = String(out.sub_class).trim() || null;
        } else {
          out.sub_class = out.sub_class.trim() || null;
        }
      } else {
        out.sub_class = null;
      }

      // ========== ВАЛИДАЦИЯ STATS (object with strength, dexterity, constitution, intelligence, wisdom, charisma) ==========
      if (!out.stats || typeof out.stats !== "object" || Array.isArray(out.stats)) {
        errors.push("stats is required and must be an object");
      } else {
        const stats = out.stats as Record<string, unknown>;
        const statNames = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
        const normalizedStats: Record<string, { is_master: boolean; value: number }> = {};

        for (const statName of statNames) {
          if (!stats[statName] || typeof stats[statName] !== "object" || Array.isArray(stats[statName])) {
            errors.push(`stats.${statName} is required and must be an object`);
            normalizedStats[statName] = { is_master: false, value: 0 };
          } else {
            const stat = stats[statName] as Record<string, unknown>;
            
            // ВАЛИДАЦИЯ is_master (boolean, default false)
            let isMaster = false;
            if (stat.is_master !== undefined && stat.is_master !== null) {
              isMaster = Boolean(stat.is_master);
            }

            // ВАЛИДАЦИЯ value (int)
            let value = 0;
            if (stat.value !== undefined && stat.value !== null) {
              const parsedValue = typeof stat.value === "string" && /^-?\d+$/.test(stat.value)
                ? parseInt(stat.value, 10)
                : typeof stat.value === "number" && Number.isFinite(stat.value)
                ? Math.floor(stat.value)
                : null;
              if (parsedValue !== null) {
                value = parsedValue;
              }
            }

            normalizedStats[statName] = { is_master: isMaster, value: value };
          }
        }
        out.stats = normalizedStats;
      }

      // ========== ВАЛИДАЦИЯ HISTORY (array, not null) ==========
      if (!Array.isArray(out.history)) {
        errors.push("history is required and must be an array");
      } else {
        out.history = out.history;
      }

      // ========== ВАЛИДАЦИЯ MASTER_BONUS (int, not null) ==========
      if (out.master_bonus === undefined || out.master_bonus === null) {
        errors.push("master_bonus is required");
      } else {
        const masterBonus = typeof out.master_bonus === "string" && /^-?\d+$/.test(out.master_bonus)
          ? parseInt(out.master_bonus, 10)
          : typeof out.master_bonus === "number" && Number.isFinite(out.master_bonus)
          ? Math.floor(out.master_bonus)
          : null;
        if (masterBonus === null) {
          errors.push("master_bonus must be an integer");
        } else {
          out.master_bonus = masterBonus;
        }
      }

      // ========== ВАЛИДАЦИЯ SKILLS (array) ==========
      if (!Array.isArray(out.skills)) {
        out.skills = [];
      }

      // ========== ВАЛИДАЦИЯ ITEMS (array) ==========
      if (!Array.isArray(out.items)) {
        out.items = [];
      }

      // ========== ВАЛИДАЦИЯ AC (int, not null) ==========
      if (out.ac === undefined || out.ac === null) {
        errors.push("ac is required");
      } else {
        const ac = typeof out.ac === "string" && /^-?\d+$/.test(out.ac)
          ? parseInt(out.ac, 10)
          : typeof out.ac === "number" && Number.isFinite(out.ac)
          ? Math.floor(out.ac)
          : null;
        if (ac === null) {
          errors.push("ac must be an integer");
        } else {
          out.ac = ac;
        }
      }

      // ========== ВАЛИДАЦИЯ HP (int, not null) ==========
      if (out.hp === undefined || out.hp === null) {
        errors.push("hp is required");
      } else {
        const hp = typeof out.hp === "string" && /^-?\d+$/.test(out.hp)
          ? parseInt(out.hp, 10)
          : typeof out.hp === "number" && Number.isFinite(out.hp)
          ? Math.floor(out.hp)
          : null;
        if (hp === null || hp < 0) {
          errors.push("hp must be a non-negative integer");
        } else {
          out.hp = hp;
        }
      }

      // ========== ВАЛИДАЦИЯ INITIATIVE (int, not null) ==========
      if (out.initiative === undefined || out.initiative === null) {
        errors.push("initiative is required");
      } else {
        const initiative = typeof out.initiative === "string" && /^-?\d+$/.test(out.initiative)
          ? parseInt(out.initiative, 10)
          : typeof out.initiative === "number" && Number.isFinite(out.initiative)
          ? Math.floor(out.initiative)
          : null;
        if (initiative === null) {
          errors.push("initiative must be an integer");
        } else {
          out.initiative = initiative;
        }
      }

      // ========== ВАЛИДАЦИЯ SPEED (int, not null) ==========
      if (out.speed === undefined || out.speed === null) {
        errors.push("speed is required");
      } else {
        const speed = typeof out.speed === "string" && /^-?\d+$/.test(out.speed)
          ? parseInt(out.speed, 10)
          : typeof out.speed === "number" && Number.isFinite(out.speed)
          ? Math.floor(out.speed)
          : null;
        if (speed === null || speed < 0) {
          errors.push("speed must be a non-negative integer");
        } else {
          out.speed = speed;
        }
      }

      // ========== ВАЛИДАЦИЯ HP_DICE (text, not null) ==========
      if (!out.hp_dice || typeof out.hp_dice !== "string" || out.hp_dice.trim().length === 0) {
        errors.push("hp_dice is required and must be a non-empty string");
      } else {
        out.hp_dice = String(out.hp_dice).trim();
      }

      // ========== ВАЛИДАЦИЯ MAX_HP (int, not null) ==========
      if (out.max_hp === undefined || out.max_hp === null) {
        errors.push("max_hp is required");
      } else {
        const maxHp = typeof out.max_hp === "string" && /^-?\d+$/.test(out.max_hp)
          ? parseInt(out.max_hp, 10)
          : typeof out.max_hp === "number" && Number.isFinite(out.max_hp)
          ? Math.floor(out.max_hp)
          : null;
        if (maxHp === null || maxHp < 0) {
          errors.push("max_hp must be a non-negative integer");
        } else {
          out.max_hp = maxHp;
        }
      }

      // ========== ВАЛИДАЦИЯ TEMP_HP (int, not null) ==========
      if (out.temp_hp === undefined || out.temp_hp === null) {
        errors.push("temp_hp is required");
      } else {
        const tempHp = typeof out.temp_hp === "string" && /^-?\d+$/.test(out.temp_hp)
          ? parseInt(out.temp_hp, 10)
          : typeof out.temp_hp === "number" && Number.isFinite(out.temp_hp)
          ? Math.floor(out.temp_hp)
          : null;
        if (tempHp === null || tempHp < 0) {
          errors.push("temp_hp must be a non-negative integer");
        } else {
          out.temp_hp = tempHp;
        }
      }

      // ========== ВАЛИДАЦИЯ DEATH_SAVES (int, not null) ==========
      if (out.death_saves === undefined || out.death_saves === null) {
        errors.push("death_saves is required");
      } else {
        const deathSaves = typeof out.death_saves === "string" && /^-?\d+$/.test(out.death_saves)
          ? parseInt(out.death_saves, 10)
          : typeof out.death_saves === "number" && Number.isFinite(out.death_saves)
          ? Math.floor(out.death_saves)
          : null;
        if (deathSaves === null || deathSaves < 0) {
          errors.push("death_saves must be a non-negative integer");
        } else {
          out.death_saves = deathSaves;
        }
      }

      // ========== ВАЛИДАЦИЯ INSPIRATIONS (int, not null, default 0) ==========
      if (out.inspirations === undefined || out.inspirations === null) {
        out.inspirations = 0;
      } else {
        const inspirations = typeof out.inspirations === "string" && /^-?\d+$/.test(out.inspirations)
          ? parseInt(out.inspirations, 10)
          : typeof out.inspirations === "number" && Number.isFinite(out.inspirations)
          ? Math.floor(out.inspirations)
          : null;
        if (inspirations === null || inspirations < 0) {
          errors.push("inspirations must be a non-negative integer");
        } else {
          out.inspirations = inspirations;
        }
      }

      // ========== ВАЛИДАЦИЯ EXP (int, not null) ==========
      if (out.exp === undefined || out.exp === null) {
        errors.push("exp is required");
      } else {
        const exp = typeof out.exp === "string" && /^-?\d+$/.test(out.exp)
          ? parseInt(out.exp, 10)
          : typeof out.exp === "number" && Number.isFinite(out.exp)
          ? Math.floor(out.exp)
          : null;
        if (exp === null || exp < 0) {
          errors.push("exp must be a non-negative integer");
        } else {
          out.exp = exp;
        }
      }

      // Remove temporary/client-only fields
      delete out._temp;
      delete out.clientOnly;

      // ========== ВОЗВРАТ ОШИБОК ВАЛИДАЦИИ ==========
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join("; ")}`);
      }

      return out;
    };

    // ========== ВЫЗОВ ВАЛИДАЦИИ И ТРАНСФОРМАЦИИ ==========
    let normalizedOptions: Record<string, unknown>;
    try {
      normalizedOptions = transformOptions(rawOptions);
    } catch (validationError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationError instanceof Error ? validationError.message : String(validationError),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing Supabase env vars" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Handle UPDATE (PUT/PATCH with character_id)
    if (isUpdate) {
      const { data, error } = await sb
        .from("characters")
        .update({
          character_options: normalizedOptions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", characterId)
        .eq("user_id", userId) // Ensure user owns the character
        .select()
        .maybeSingle();

      if (error) {
        console.error("Update error:", error);
        return new Response(
          JSON.stringify({ error: "Database update failed", details: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!data) {
        return new Response(
          JSON.stringify({ error: "Character not found or access denied" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Character updated", character: data }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle CREATE (POST)
    const insertObj = {
      user_id: userId,
      character_options: normalizedOptions,
    };

    const { data, error } = await sb
      .from("characters")
      .insert([insertObj])
      .select()
      .maybeSingle();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Database insert failed", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Character created", character: data }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error", message: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

