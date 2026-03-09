# Phase 3: Backend (Edge Functions & API Logic)

> Implement Supabase Edge Functions for complex business logic.
> Simple CRUD uses PostgREST directly (no Edge Function needed).
> Complete this phase after Infrastructure is set up.

---

## API Strategy

| Operation | Method | Reason |
|---|---|---|
| Character CRUD | PostgREST (direct) | Simple CRUD, RLS handles auth |
| Campaign CRUD | PostgREST (direct) | Simple CRUD, RLS handles auth |
| Read campaign players | PostgREST (direct) | Simple query with RLS |
| Join campaign (invite) | Edge Function | Validate code + password, check max players |
| Start/end session | Edge Function | State transition logic, validation |
| Start/end combat | Edge Function | Initialize initiative order, validate state |
| Advance combat turn | PostgREST (direct) | Simple update to current_turn_index |
| Short rest | Edge Function | Calculate HP restoration from Hit Dice |
| Long rest | Edge Function | Restore HP, slots, dice for all party |
| DM modify player character | Edge Function | Update character + insert change_log atomically |
| Send/read messages | PostgREST (direct) | Simple insert/query, RLS handles auth |

---

## Edge Functions

### Task B1: Campaign Invite — Generate

**File:** `supabase/functions/campaign-invite/generate.ts`

**Endpoint:** `POST /campaign-invite/generate`

```typescript
// Input
{ name: string, description?: string, imageUrl?: string, maxPlayers: number }

// Logic
// 1. Generate random 6-character alphanumeric invite code
// 2. Check uniqueness in database (retry if collision)
// 3. Hash the invite password (bcrypt via Deno)
// 4. Insert into campaigns table with master_id = auth.uid()
// 5. Return campaign data with plaintext invite code + password (only time shown)

// Output
{ campaign: Campaign, inviteCode: string, invitePassword: string }
```

---

### Task B2: Campaign Invite — Join

**File:** `supabase/functions/campaign-invite/join.ts`

**Endpoint:** `POST /campaign-invite/join`

```typescript
// Input
{ inviteCode: string, invitePassword: string, characterId: string }

// Logic
// 1. Find campaign by invite_code
// 2. Verify invite_password matches hashed version (bcrypt compare)
// 3. Check campaign status === 'active'
// 4. Check current player count < max_players
// 5. Check character belongs to requesting user (auth.uid())
// 6. Check character not already in another active campaign
// 7. Insert into campaign_players
// 8. Return campaign data

// Output
{ campaign: Campaign, characterId: string }
```

---

### Task B3: Session — Start

**File:** `supabase/functions/session-manage/start.ts`

**Endpoint:** `POST /session-manage/start`

```typescript
// Input
{ campaignId: string }

// Logic
// 1. Verify requester is campaign master
// 2. Check no active session exists for this campaign
// 3. Create new session with status 'active'
// 4. Return session data

// Output
{ session: Session }
```

---

### Task B4: Session — End

**File:** `supabase/functions/session-manage/end.ts`

**Endpoint:** `POST /session-manage/end`

```typescript
// Input
{ sessionId: string }

// Logic
// 1. Verify requester is campaign master
// 2. End any active combat (clear initiative_order, combat_active = false)
// 3. Set session status to 'completed', ended_at to now()
// 4. Reset all campaign_players.is_ready to false
// 5. Return session summary

// Output
{ session: Session }
```

---

### Task B5: Combat — Start

**File:** `supabase/functions/session-manage/start-combat.ts`

**Endpoint:** `POST /session-manage/start-combat`

```typescript
// Input
{ sessionId: string }

// Logic
// 1. Verify requester is campaign master
// 2. Verify session is active
// 3. Set combat_active = true, round_number = 1
// 4. Initialize empty initiative_order = []
// 5. Return updated session

// Output
{ session: Session }
```

---

### Task B6: Combat — End

**File:** `supabase/functions/session-manage/end-combat.ts`

**Endpoint:** `POST /session-manage/end-combat`

```typescript
// Input
{ sessionId: string }

// Logic
// 1. Verify requester is campaign master
// 2. Set combat_active = false
// 3. Clear initiative_order, current_turn_index, round_number
// 4. Return updated session

// Output
{ session: Session }
```

---

### Task B7: Short Rest

**File:** `supabase/functions/rest-mechanics/short-rest.ts`

**Endpoint:** `POST /rest-mechanics/short-rest`

```typescript
// Input
{ sessionId: string, characterId: string, hitDiceToSpend: number }

// Logic
// 1. Verify session is active, character is in campaign
// 2. Verify character has enough hit dice available
// 3. Calculate HP gained: for each die, hit_die_average + CON modifier
//    (or let player enter rolled values — simpler to use average for MVP)
// 4. Cap HP at max_hp
// 5. Deduct hit dice from character's available
// 6. Update character HP and hit_dice
// 7. If Warlock: restore all spell slots (Pact Magic)
// 8. Log changes in change_log with change_type = 'rest'

// Output
{ character: Character, hpGained: number }
```

**Hit Die averages by class:**
| Class | Hit Die | Average |
|---|---|---|
| Barbarian | d12 | 7 |
| Bard, Cleric, Druid, Monk, Rogue, Warlock | d8 | 5 |
| Fighter, Paladin, Ranger | d10 | 6 |
| Sorcerer, Wizard | d6 | 4 |

---

### Task B8: Long Rest

**File:** `supabase/functions/rest-mechanics/long-rest.ts`

**Endpoint:** `POST /rest-mechanics/long-rest`

```typescript
// Input
{ sessionId: string }

// Logic (applies to ALL characters in the campaign)
// 1. Verify requester is campaign master
// 2. Verify session is active
// 3. Get all characters in campaign via campaign_players
// 4. For each character:
//    a. Restore HP to max_hp
//    b. Restore all spell slots to max
//    c. Restore Hit Dice: up to half of total (minimum 1)
//    d. Reset death_saves to {successes: 0, failures: 0}
// 5. Log changes in change_log for each character with change_type = 'rest'

// Output
{ characters: Character[] }
```

---

### Task B9: DM Character Edit

**File:** `supabase/functions/character-modify/dm-edit.ts`

**Endpoint:** `POST /character-modify/dm-edit`

```typescript
// Input
{ characterId: string, sessionId: string, changes: { field: string, value: any }[] }

// Logic
// 1. Verify requester is campaign master for this session's campaign
// 2. For each change:
//    a. Read old value from character
//    b. Apply new value
//    c. Insert change_log entry with change_type = 'dm_override'
// 3. Return updated character

// Output
{ character: Character }
```

Allowed fields for DM edit: `hp`, `temp_hp`, `conditions`, `spell_slots`, `equipment`, `money`.

---

## Shared Utilities

**File:** `supabase/functions/_shared/`

### `auth.ts` — Authentication helper
```typescript
// Extract and verify JWT from request
// Return user ID or throw 401
```

### `db.ts` — Database client
```typescript
// Create Supabase client with service role key
// Used by Edge Functions that need to bypass RLS
```

### `errors.ts` — Error response helper
```typescript
// Standardized error responses (400, 401, 403, 404, 500)
```

---

## Project Structure (After Backend)

```
supabase/
├── migrations/
│   ├── 001_create_profiles.sql
│   ├── ...
│   └── 010_indexes.sql
├── functions/
│   ├── _shared/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── errors.ts
│   ├── campaign-invite/
│   │   ├── generate.ts
│   │   └── join.ts
│   ├── session-manage/
│   │   ├── start.ts
│   │   ├── end.ts
│   │   ├── start-combat.ts
│   │   └── end-combat.ts
│   ├── rest-mechanics/
│   │   ├── short-rest.ts
│   │   └── long-rest.ts
│   └── character-modify/
│       └── dm-edit.ts
├── seed.sql
└── config.toml
```

---

## Local Development

```bash
# Start Edge Functions with hot reload
supabase functions serve

# Test a function
curl -X POST http://localhost:54321/functions/v1/session-manage/start \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"campaignId": "uuid"}'
```

---

## Task Order

1. B1-B2 — Campaign invite (generate + join)
2. B3-B4 — Session start/end
3. B5-B6 — Combat start/end
4. B7-B8 — Rest mechanics (short + long)
5. B9 — DM character edit

**Total: 9 tasks**
