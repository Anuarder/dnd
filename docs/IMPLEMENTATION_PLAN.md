# Implementation Plan

> Step-by-step task breakdown for building the D&D Tabletop Companion App.
> Tasks are ordered by dependency — complete earlier tasks before starting later ones.
> Based on PROJECT_DESCRIPTION.md and TECHNICAL_IMPLEMENTATION.md.

---

## Current State

- Google OAuth sign-in: working
- Onboarding flow (4 pages): working (saves to localStorage only)
- Character creation wizard (10 steps): UI done, no backend
- Character details page (tabbed): UI done, mock data
- Player main page: UI done, mock data
- Player archive page: UI done, mock data
- Master main page: UI done, mock data
- Supabase client initialized at `src/shared/lib/supabase/client.ts`

---

## Phase 1 — Database & Backend Foundation

### Task 1: Supabase Local Development Setup

Set up local Supabase environment for development.

**Steps:**
1. Install Supabase CLI: `pnpm add -g supabase`
2. Run `supabase init` in project root (creates `supabase/` directory)
3. Run `supabase start` to start local stack (Docker required)
4. Create `.env.local` with local Supabase URL and anon key
5. Verify Supabase Studio accessible at `localhost:54323`

**Output:** `supabase/config.toml`, `.env.local`

---

### Task 2: Database Migrations — Core Tables

Create SQL migration files for all database tables.

**Files to create:**
- `supabase/migrations/001_create_profiles.sql` — profiles table + `handle_new_user` trigger
- `supabase/migrations/002_create_characters.sql` — characters table
- `supabase/migrations/003_create_campaigns.sql` — campaigns table
- `supabase/migrations/004_create_campaign_players.sql` — campaign_players table
- `supabase/migrations/005_create_sessions.sql` — sessions table
- `supabase/migrations/006_create_messages.sql` — messages table
- `supabase/migrations/007_create_change_log.sql` — change_log table

**Reference schemas:** TECHNICAL_IMPLEMENTATION.md section 3.

Run `supabase db push` after creating migrations.

---

### Task 3: Row-Level Security Policies

Add RLS policies for all tables (separate migration file or appended to table migrations).

**File:** `supabase/migrations/008_rls_policies.sql`

**Policies to implement:**
- `profiles`: authenticated users can SELECT all, UPDATE own row only
- `characters`: owner SELECT/INSERT/UPDATE/DELETE own; DM SELECT/UPDATE characters in their campaigns
- `campaigns`: DM sees own; players see joined campaigns; INSERT for authenticated; UPDATE/DELETE for owner only
- `campaign_players`: campaign master and members can SELECT; INSERT via Edge Function only; DELETE for master
- `sessions`: campaign master and players can SELECT; INSERT/UPDATE for master only
- `messages`: sender and recipient can SELECT; INSERT for master and campaign players
- `change_log`: character owner and campaign master can SELECT; INSERT via trigger/function only

---

### Task 4: Seed Data

Create development seed data for local testing.

**File:** `supabase/seed.sql`

**Include:**
- 2 test users (1 DM, 1 player)
- 2 sample characters
- 1 sample campaign with players

---

## Phase 2 — Character CRUD (Connect UI to Backend)

### Task 5: TypeScript Types for Database Entities

Define TypeScript interfaces matching database schema.

**File:** `frontend/src/shared/types/database.ts`

Types to define:
- `Profile`
- `Character`, `CreateCharacterInput`, `UpdateCharacterInput`
- `Campaign`, `CreateCampaignInput`
- `CampaignPlayer`
- `Session`
- `Message`
- `ChangeLogEntry`

---

### Task 6: Character Query Hooks

Implement TanStack Query hooks for character data fetching.

**File:** `frontend/src/entities/character/model.ts`

Hooks to implement:
- `useCharactersQuery(status: 'active' | 'archive')` — fetch user's characters
- `useCharacterQuery(id: string)` — fetch single character by ID

Both use `supabase.from('characters').select(...)` directly via PostgREST.

---

### Task 7: Character Mutation Hooks

Implement TanStack Query mutation hooks for character write operations.

**File:** `frontend/src/entities/character/model.ts` (extend Task 6 file)

Mutations to implement:
- `useCreateCharacterMutation()` — insert new character, invalidate character list query
- `useUpdateCharacterMutation()` — update character fields, invalidate character and list queries
- `useArchiveCharacterMutation()` — set status to 'archive'
- `useDeleteCharacterMutation()` — delete character (only if not in active campaign)

---

### Task 8: Connect Character Creation Wizard to Backend

Wire the existing 10-step character creation form to submit to Supabase on the final review step.

**Files to modify:**
- `frontend/src/modules/character/` — find the review/confirm step component
- Hook into `useCreateCharacterMutation` on form submit
- Navigate to `/player` on success
- Show error toast on failure (use existing `sonner` integration)

**Character data to map:**
- All 10 wizard steps → `CreateCharacterInput` shape
- Calculate `proficiency_bonus` from level
- Calculate `initiative_mod` from DEX modifier
- Set initial `hp` = `max_hp`

---

### Task 9: Connect Player Main Page to Backend

Replace mock data on the player main page with real character queries.

**Files to modify:**
- `frontend/src/modules/player/` — player main page component
- Use `useCharactersQuery('active')` to fetch characters
- Handle loading state (skeleton cards)
- Handle empty state (no characters yet — show "Create your first character" prompt)
- Handle error state

---

### Task 10: Connect Player Archive Page to Backend

Replace mock data on the player archive page.

**Files to modify:**
- `frontend/src/modules/player/` — player archive page component
- Use `useCharactersQuery('archive')` to fetch archived characters
- Handle loading/empty/error states

---

### Task 11: Connect Character Details Page to Backend

Replace mock data on the character details page.

**Files to modify:**
- `frontend/src/modules/character/` — character details page component
- Use `useCharacterQuery(id)` to fetch character by route param
- Wire HP +/- buttons to `useUpdateCharacterMutation` (update `hp` field)
- Wire spell slot toggles to `useUpdateCharacterMutation`
- Wire equipment add/remove to `useUpdateCharacterMutation`

---

### Task 12: Save Onboarding Role Choice to Supabase

Replace localStorage-only onboarding with saving `preferred_role` to `profiles` table.

**Files to modify:**
- `frontend/src/modules/onboarding/` — role selection step
- Add mutation: `supabase.from('profiles').update({ preferred_role: role }).eq('id', userId)`
- Keep localStorage as fallback for offline access
- After saving, navigate to appropriate main page based on role

---

## Phase 3 — Campaign Features

### Task 13: Campaign Query & Mutation Hooks

Implement TanStack Query hooks for campaign data.

**File:** `frontend/src/entities/campaign/model.ts`

Hooks to implement:
- `useCampaignsQuery()` — fetch DM's own campaigns (for master page)
- `usePlayerCampaignsQuery()` — fetch campaigns a player has joined
- `useCampaignQuery(id: string)` — fetch single campaign with players
- `useCreateCampaignMutation()` — create campaign, generates invite_code
- `useUpdateCampaignMutation()` — update campaign details
- `useArchiveCampaignMutation()` — set status to 'archive'

---

### Task 14: Campaign Creation Edge Function

Implement Supabase Edge Function to generate unique invite codes.

**File:** `supabase/functions/campaign-invite/generate.ts`

Logic:
1. Generate random 6-character alphanumeric invite code
2. Check uniqueness in database (retry if collision)
3. Hash the invite password (bcrypt via Deno)
4. Insert into `campaigns` table
5. Return campaign data with plaintext invite code (only time it's shown)

**Note:** Integrate this function call into `useCreateCampaignMutation`.

---

### Task 15: Campaign Creation Page (DM)

Build the campaign creation page.

**Route:** `/master/campaign/create`

**File:** `frontend/src/modules/master/` — create page component

**Form fields:**
- Campaign name (required, max 100 chars)
- Description (optional, textarea)
- Banner image upload (optional, Supabase Storage)
- Max players (select: 2-10, default 5)

**On submit:** Call Edge Function → navigate to `/master/campaign/:id` on success.

---

### Task 16: Master Main Page — Connect to Backend

Replace mock campaigns on master main page with real data.

**Files to modify:**
- `frontend/src/modules/master/` — master main page component
- Use `useCampaignsQuery()` to fetch campaigns
- Handle loading/empty/error states
- Show active and archived campaigns in separate sections

---

### Task 17: Campaign Detail Page (DM)

Build the DM's campaign detail page.

**Route:** `/master/campaign/:id`

**File:** `frontend/src/modules/master/` — campaign detail page

**Content:**
- Campaign banner, name, description
- Invite code display (with copy button) and regenerate button
- Player roster list (player name, character name, is_ready status)
- "Start Session" button (disabled if no players)
- "Archive Campaign" button
- "Edit Campaign" button

---

### Task 18: Campaign Join Edge Function

Implement Edge Function for players joining a campaign via invite code.

**File:** `supabase/functions/campaign-invite/join.ts`

Logic:
1. Find campaign by `invite_code`
2. Verify `invite_password` matches hashed version
3. Check campaign status is 'active'
4. Check `current_player_count < max_players`
5. Verify character belongs to requesting user
6. Verify character not already in another active campaign
7. Insert into `campaign_players`
8. Return campaign data

---

### Task 19: Join Campaign Page (Player)

Build the player's join campaign page.

**Route:** `/player/join`

**File:** `frontend/src/modules/player/` — join campaign page

**Form:**
- Invite code input (6 chars, auto-uppercase)
- Password input
- Character selector (dropdown of user's active characters)
- Submit button

**On success:** Navigate to `/player/campaign/:id`.

---

### Task 20: Campaign Detail Page (Player)

Build the player's campaign detail page.

**Route:** `/player/campaign/:id`

**File:** `frontend/src/modules/player/` — campaign detail page

**Content:**
- Campaign info (banner, name, description)
- Party members list (other players' character names)
- "Ready Up" toggle (updates `is_ready` in `campaign_players`)
- Active session indicator (if session exists and is active)
- "Join Session" button (if session active)

---

## Phase 4 — Session Management

### Task 21: Session Management Edge Functions

Implement Edge Functions for session lifecycle.

**Files:**
- `supabase/functions/session-manage/start.ts` — create new session for campaign
- `supabase/functions/session-manage/end.ts` — close active session, save ended_at

**Start logic:** Verify requester is master, check no active session exists, create session.

**End logic:** Verify requester is master, close combat if active, set status to 'completed'.

---

### Task 22: Session Query & Mutation Hooks

**File:** `frontend/src/entities/session/model.ts` (new file)

Hooks:
- `useActiveCampaignSessionQuery(campaignId: string)` — fetch active session for a campaign (polls every 5s)
- `useStartSessionMutation()` — call session-manage/start Edge Function
- `useEndSessionMutation()` — call session-manage/end Edge Function
- `useSessionQuery(sessionId: string)` — fetch session details

---

### Task 23: Session Lobby — DM View

Build the DM's pre-session lobby view (integrated into campaign detail page or separate route).

**Route:** `/master/campaign/:id/session` (or modal on campaign detail page)

**Content:**
- Player readiness list (real-time polling every 5s)
- "Start Session" button (enabled when at least 1 player is ready)
- "Cancel" button

**On "Start Session":** Call `useStartSessionMutation`, navigate to `/master/session/:id`.

---

### Task 24: Session Lobby — Player View

Build the player's session waiting view.

**Route:** `/player/campaign/:id/session`

**Content:**
- "Ready" toggle button (updates `campaign_players.is_ready`)
- "Waiting for DM to start..." indicator
- Auto-navigate to `/player/session/:id` when session becomes active (polling)

---

### Task 25: Session Active View — DM

Build the DM's main session view.

**Route:** `/master/session/:id`

**File:** `frontend/src/modules/master/` — session page

**Tabs:**
1. **Players** — list of player character cards with HP, AC, conditions (read-only overview)
2. **Combat** — initiative tracker + combat controls (see Task 27)
3. **Notes** — DM-only text editor (saves to `sessions.dm_notes`)
4. **Messages** — private messaging panel (see Task 30)

**Header:** Session name, round number (if combat), "End Session" button.

---

### Task 26: Session Active View — Player

Build the player's session view.

**Route:** `/player/session/:id`

**File:** `frontend/src/modules/player/` — session page

**Content:**
- Character sheet (HP +/- quick controls, spell slots, equipment)
- Initiative tracker (view-only — shows turn order)
- Messages tab (chat with DM)

---

## Phase 5 — Combat System

### Task 27: Initiative Tracker — DM Controls

Build the initiative tracker component for the DM's combat tab.

**File:** `frontend/src/modules/master/` — initiative tracker component

**DM actions:**
- "Start Combat" button — calls session-manage/start-combat Edge Function
- Add combatant form: name + initiative value (for NPCs and players who haven't entered theirs)
- Drag-to-reorder initiative list (or manual up/down arrows)
- "Next Turn" button — increments `current_turn_index` via PostgREST direct update
- "End Combat" button — calls session-manage/end-combat Edge Function
- Remove combatant button (for defeated enemies)

**Display:** Ordered list, current turn highlighted.

---

### Task 28: Initiative Tracker — Player View

Build the player's read-only initiative tracker.

**File:** `frontend/src/modules/player/` — initiative tracker component

**Player actions:**
- Enter own initiative value (once per combat start)
- View current turn order
- Highlight whose turn it currently is

**Data source:** Poll `sessions.initiative_order` and `sessions.current_turn_index` every 3-5s.

---

### Task 29: Combat Edge Functions

**Files:**
- `supabase/functions/session-manage/start-combat.ts` — set `combat_active = true`, `round_number = 1`
- `supabase/functions/session-manage/end-combat.ts` — clear combat state

---

## Phase 6 — Rest Mechanics

### Task 30: Short Rest Edge Function & UI

**Edge Function:** `supabase/functions/rest-mechanics/short-rest.ts`

Logic:
1. Player selects how many Hit Dice to spend
2. Calculate HP gain: for each die, roll Hit Die value + CON modifier (use average for simplicity, or let player enter rolled value)
3. Cap HP at max_hp
4. Deduct spent Hit Dice from character
5. If Warlock: restore Pact Magic slots
6. Log to `change_log`

**UI:** Modal triggered from session view. Shows available Hit Dice, input for dice to spend, preview of HP gain.

---

### Task 31: Long Rest Edge Function & UI

**Edge Function:** `supabase/functions/rest-mechanics/long-rest.ts`

Logic (applies to all characters in campaign):
1. Restore all HP to max_hp
2. Restore all spell slots
3. Restore Hit Dice: up to half of total (minimum 1)
4. Reset `death_saves` to `{successes: 0, failures: 0}`
5. Log to `change_log` for each character

**UI:** DM-only "Long Rest" button in session view. Confirmation dialog showing what will be restored.

---

## Phase 7 — DM Character Management & Change Log

### Task 32: DM Character Editor

Allow DM to modify player character stats during a session.

**Edge Function:** `supabase/functions/character-modify/dm-edit.ts`

Logic:
1. Verify requester is campaign master
2. For each change: read old value, apply new value, insert `change_log` entry with `change_type = 'dm_override'`
3. Return updated character

**UI:** Modal accessible from DM's player overview. Editable fields: HP, temp HP, conditions, spell slots. Each save writes to `change_log`.

---

### Task 33: Change Log Viewer

Display character change history.

**Location:** New tab on character details page (`/character/:id`) for players; accessible to DM from session player view.

**Content:**
- List of `change_log` entries for the character
- Each entry shows: timestamp, changed by (player or DM), field changed, old value → new value, change type badge
- Filter by session or date

**Data:** `supabase.from('change_log').select(...).eq('character_id', id).order('created_at', { ascending: false })`

---

## Phase 8 — Private Messaging

### Task 34: Message Hooks with Polling

Implement message fetching with 5-10 second polling during active sessions.

**File:** `frontend/src/entities/message/model.ts` (new file)

Hooks:
- `useMessagesQuery(sessionId, otherUserId)` — fetch messages between current user and specified user; `refetchInterval: 5000` when session is active
- `useSendMessageMutation()` — insert message via PostgREST direct
- `useMarkReadMutation()` — update `is_read = true` for messages

---

### Task 35: Private Messaging UI — DM

Build DM's messaging panel (tab in session view).

**Content:**
- Left sidebar: list of players in campaign (show unread count badge)
- Right panel: chat thread with selected player
- Message input at bottom

**Unread indicator:** Count of `is_read = false` messages where `recipient_id = currentUser.id`.

---

### Task 36: Private Messaging UI — Player

Build player's messaging panel (tab in player session view).

**Content:**
- Single chat thread (player only chats with DM)
- Message input at bottom
- Notification dot when new message arrives (polling)

---

## Phase 9 — Equipment & Inventory

### Task 37: Equipment Management UI

Build the equipment/inventory tab on character details page.

**Location:** Equipment tab on `/character/:id`

**Player flows:**
- View inventory list (name, quantity, weight, equipped toggle)
- "Add Item" button → inline form (name required, qty/weight/description optional)
- Swipe-to-delete or delete button per item
- Money tracker: gold/silver/copper with +/- controls

**All changes:** Call `useUpdateCharacterMutation` with updated `equipment` or `money` JSON.

---

### Task 38: DM Equipment Management

Allow DM to add/remove items from player inventory during session.

**Location:** Player character modal in DM session view

**DM flows:**
- View player's equipment list
- "Give Item" button → form to add item to player's inventory
- Remove any item from player's inventory

**All changes:** Call `character-modify/dm-edit` Edge Function (which logs to `change_log`).

---

## Phase 10 — Image Storage

### Task 39: Supabase Storage Setup

Configure Supabase Storage buckets for image uploads.

**Buckets to create:**
- `avatars` — user profile pictures (public read, authenticated write)
- `banners` — campaign banner images (public read, authenticated write)

**RLS policies:** Users can only upload to paths prefixed with their `user_id`.

---

### Task 40: Campaign Banner Upload

Wire up campaign banner image upload on campaign creation and edit pages.

**Implementation:**
- File input → upload to `supabase.storage.from('banners').upload(path, file)`
- Store returned public URL in `campaigns.image_url`
- Show preview before saving
- Max file size: 2MB; accepted types: `.jpg`, `.png`, `.webp`

---

## Summary Table

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-4 | Supabase local setup + database schema + RLS + seed data |
| 2 | 5-12 | Character CRUD — connect existing UI to backend |
| 3 | 13-20 | Campaign features — creation, joining, detail pages |
| 4 | 21-26 | Session management — lobby, active session views |
| 5 | 27-29 | Combat system — initiative tracker + edge functions |
| 6 | 30-31 | Rest mechanics — short rest and long rest |
| 7 | 32-33 | DM character management + change log |
| 8 | 34-36 | Private messaging with polling |
| 9 | 37-38 | Equipment & inventory management |
| 10 | 39-40 | Image storage — avatars and campaign banners |

**Total: 40 tasks across 10 phases.**

Start each phase only after the previous phase is complete, as later phases depend on earlier ones.
