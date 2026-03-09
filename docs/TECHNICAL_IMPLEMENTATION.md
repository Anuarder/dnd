# Technical Implementation Plan

> Detailed technical specification for implementing the D&D Tabletop Companion App.
> Covers backend (Supabase), frontend (React), responsive design, and all features.

---

## Table of Contents

1. [Backend: Supabase](#1-backend-supabase)
2. [Local Development Setup](#2-local-development-setup)
3. [Database Schema & RLS](#3-database-schema--rls)
4. [API Layer (Edge Functions)](#4-api-layer-edge-functions)
5. [Authentication](#5-authentication)
6. [UI Component Libraries](#6-ui-component-libraries)
7. [Responsive Design Strategy](#7-responsive-design-strategy)
8. [Frontend: Existing vs Remaining](#8-frontend-existing-vs-remaining)
9. [Feature Implementation Details](#9-feature-implementation-details)
10. [Real-Time & Polling](#10-real-time--polling)
11. [File Storage](#11-file-storage)
12. [Deployment](#12-deployment)

---

## 1. Backend: Supabase

### Why Supabase

Supabase provides everything this project needs without building a custom backend:

| Need | Supabase Feature |
|---|---|
| Auth (Google OAuth) | Supabase Auth (already integrated) |
| PostgreSQL database | Supabase Database |
| API endpoints | Edge Functions (Deno) or direct PostgREST |
| Row-level security | RLS policies |
| File uploads (avatars, banners) | Supabase Storage |
| Real-time updates (future) | Supabase Realtime |

### Architecture Approach

**Direct client-to-database via PostgREST + RLS** for simple CRUD operations (character read/write, campaign CRUD). This eliminates the need for Edge Functions for most operations.

**Edge Functions** only for complex logic:
- Campaign invite code generation & validation
- Session state transitions (start/end session, start/end combat)
- Rest mechanics (short rest / long rest calculations)
- Batch operations (DM modifying player data + logging to ChangeLog)

### Supabase Client Integration

The frontend already has `@supabase/supabase-js` initialized at `src/shared/lib/supabase/client.ts`. All database calls go through this client using the auto-generated PostgREST API.

```typescript
// Example: Direct query (no Edge Function needed)
const { data, error } = await supabase
  .from('characters')
  .select('*')
  .eq('user_id', userId);

// Example: Edge Function call (complex logic)
const { data, error } = await supabase.functions.invoke('start-session', {
  body: { campaignId },
});
```

---

## 2. Local Development Setup

### Supabase Local (Docker)

Supabase provides a full local development stack via Docker. This is the recommended approach for development.

**Prerequisites:**
- Docker Desktop installed and running
- Supabase CLI (`pnpm add -g supabase`)

**Setup:**

```bash
# From project root
supabase init          # Creates supabase/ directory (one-time)
supabase start         # Starts local Supabase (Postgres, Auth, Storage, etc.)
```

This gives you:
- Local PostgreSQL on `localhost:54322`
- Local Auth on `localhost:54321`
- Local Storage on `localhost:54321`
- Supabase Studio (admin UI) on `localhost:54323`
- Edge Functions runtime

**Environment variables for local dev (`.env.local`):**

```env
VITE_APP_SUPABASE_URL=http://localhost:54321
VITE_APP_SUPABASE_PUBLISHABLE_KEY=<local-anon-key-from-supabase-start>
```

### Database Migrations

All schema changes are managed via Supabase migrations:

```bash
supabase migration new create_characters_table   # Create migration file
supabase db push                                  # Apply migrations locally
supabase db reset                                 # Reset local DB and re-run all migrations
```

Migration files live in `supabase/migrations/` and are version-controlled.

### Seed Data

`supabase/seed.sql` contains test data for local development (test users, sample characters, campaigns).

### Edge Functions Local Dev

```bash
supabase functions serve   # Starts local Edge Functions server with hot reload
```

### Project Structure (Backend)

```
supabase/
├── migrations/                # SQL migrations (version-controlled)
│   ├── 001_create_users.sql
│   ├── 002_create_characters.sql
│   ├── 003_create_campaigns.sql
│   ├── 004_create_sessions.sql
│   ├── 005_create_messages.sql
│   └── 006_create_changelog.sql
├── functions/                 # Edge Functions (Deno/TypeScript)
│   ├── campaign-invite/       # Generate & validate invite codes
│   ├── session-manage/        # Start/end session, combat
│   ├── rest-mechanics/        # Short rest / long rest
│   └── _shared/               # Shared utilities
├── seed.sql                   # Development seed data
└── config.toml                # Supabase local config
```

---

## 3. Database Schema & RLS

### Tables

All tables use UUID primary keys (`gen_random_uuid()`), `created_at` / `updated_at` timestamps.

#### `profiles` (extends Supabase Auth users)

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  preferred_role text check (preferred_role in ('master', 'player')) not null default 'player',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

> **Note:** Supabase Auth already stores `email`. The `profiles` table extends it with app-specific fields. A trigger auto-creates a profile row on user sign-up.

#### `characters`

```sql
create table characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  level smallint not null default 1 check (level between 1 and 20),
  class text not null,
  subclass text,
  race text not null,
  subrace text,
  background text not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  origin_story text,
  stats jsonb not null default '{}',
  hp smallint not null,
  max_hp smallint not null,
  temp_hp smallint not null default 0,
  ac smallint not null,
  initiative_mod smallint not null default 0,
  speed smallint not null default 30,
  proficiency_bonus smallint not null default 2,
  skills jsonb not null default '[]',
  saving_throws jsonb not null default '[]',
  spells jsonb not null default '[]',
  spell_slots jsonb not null default '{}',
  equipment jsonb not null default '[]',
  money jsonb not null default '{"gold": 0, "silver": 0, "copper": 0}',
  features jsonb not null default '[]',
  conditions text[] not null default '{}',
  death_saves jsonb not null default '{"successes": 0, "failures": 0}',
  hit_dice jsonb not null default '{}',
  image_url text,
  status text not null default 'active' check (status in ('active', 'archive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

#### `campaigns`

```sql
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  invite_code text not null unique,
  invite_password text not null,
  max_players smallint not null default 5 check (max_players between 2 and 10),
  status text not null default 'active' check (status in ('active', 'archive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

#### `campaign_players`

```sql
create table campaign_players (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  is_ready boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (campaign_id, user_id)
);
```

#### `sessions`

```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  dm_notes text,
  combat_active boolean not null default false,
  initiative_order jsonb,
  current_turn_index smallint,
  round_number smallint,
  created_at timestamptz not null default now()
);
```

#### `messages`

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  recipient_id uuid not null references profiles(id),
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
```

#### `change_log`

```sql
create table change_log (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  session_id uuid references sessions(id),
  changed_by uuid not null references profiles(id),
  field_name text not null,
  old_value text,
  new_value text,
  change_type text not null check (change_type in ('player_edit', 'dm_override', 'rest', 'combat')),
  created_at timestamptz not null default now()
);
```

### Row-Level Security (RLS)

RLS ensures users can only access data they're authorized to see. All tables have `alter table <table> enable row level security;`.

#### Key RLS Policies

**profiles:**
- SELECT: Anyone authenticated can read any profile (needed for campaign player lists)
- UPDATE: Users can only update their own profile

**characters:**
- SELECT: Owner can read their own. DM can read characters in their campaigns.
- INSERT: Authenticated users can create characters for themselves only.
- UPDATE: Owner can update their own. DM can update characters in active sessions of their campaigns.
- DELETE: Owner can delete their own characters (if not in active campaign).

**campaigns:**
- SELECT: DM sees their own. Players see campaigns they've joined.
- INSERT: Any authenticated user can create campaigns.
- UPDATE: Only the campaign's master can update.
- DELETE: Only the campaign's master can delete (if no active session).

**campaign_players:**
- SELECT: Campaign master and campaign players can read.
- INSERT: Via Edge Function only (invite code validation).
- DELETE: Campaign master can remove players.

**sessions:**
- SELECT: Campaign master and players can read sessions of their campaigns.
- INSERT/UPDATE: Only the campaign master.

**messages:**
- SELECT: Only sender or recipient can read.
- INSERT: Only campaign master or players in the session's campaign.

**change_log:**
- SELECT: Character owner and campaign master can read.
- INSERT: Via triggers or Edge Functions only.

---

## 4. API Layer (Edge Functions)

### When to Use Edge Functions vs Direct PostgREST

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
| Long rest | Edge Function | Restore HP, spell slots, Hit Dice for all party |
| DM modify player character | Edge Function | Update character + insert change_log atomically |
| Send message | PostgREST (direct) | Simple insert, RLS handles auth |
| Read messages | PostgREST (direct) | Simple query with RLS |

### Edge Function Specifications

#### `POST /campaign-invite/join`

```typescript
// Input
{ inviteCode: string, invitePassword: string, characterId: string }

// Logic
// 1. Find campaign by invite_code
// 2. Verify invite_password matches
// 3. Check campaign status === 'active'
// 4. Check current player count < max_players
// 5. Check character belongs to requesting user
// 6. Check character not already in another active campaign
// 7. Insert into campaign_players
// 8. Return campaign data

// Output
{ campaign: Campaign, characterId: string }
```

#### `POST /session-manage/start`

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

#### `POST /session-manage/end`

```typescript
// Input
{ sessionId: string }

// Logic
// 1. Verify requester is campaign master
// 2. End any active combat
// 3. Set session status to 'completed', ended_at to now()
// 4. Return session summary

// Output
{ session: Session }
```

#### `POST /session-manage/start-combat`

```typescript
// Input
{ sessionId: string }

// Logic
// 1. Verify requester is campaign master
// 2. Set combat_active = true, round_number = 1
// 3. Initialize empty initiative_order
// 4. Return updated session

// Output
{ session: Session }
```

#### `POST /session-manage/end-combat`

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

#### `POST /rest-mechanics/short-rest`

```typescript
// Input
{ sessionId: string, characterId: string, hitDiceToSpend: number }

// Logic
// 1. Verify session is active, character is in campaign
// 2. Calculate HP gained: (hitDiceToSpend * hit_die_average) + CON_mod per die
// 3. Cap at max_hp
// 4. Deduct hit dice from character's available
// 5. Update character HP and hit_dice
// 6. Log change in change_log
// 7. If Warlock: restore spell slots

// Output
{ character: Character, hpGained: number }
```

#### `POST /rest-mechanics/long-rest`

```typescript
// Input
{ sessionId: string }

// Logic (applies to ALL characters in the campaign)
// 1. Verify requester is campaign master
// 2. For each character in the campaign:
//    a. Restore HP to max_hp
//    b. Restore all spell slots
//    c. Restore hit dice: up to half total (minimum 1)
//    d. Reset death_saves to {successes: 0, failures: 0}
// 3. Log changes in change_log for each character

// Output
{ characters: Character[] }
```

#### `POST /character-modify/dm-edit`

```typescript
// Input
{ characterId: string, sessionId: string, changes: { field: string, value: any }[] }

// Logic
// 1. Verify requester is campaign master for this session
// 2. For each change:
//    a. Read old value
//    b. Apply new value
//    c. Insert change_log entry with change_type 'dm_override'
// 3. Return updated character

// Output
{ character: Character }
```

---

## 5. Authentication

### Current State (Already Implemented)

- Google OAuth via Supabase Auth
- PKCE flow for OAuth
- Session persistence in localStorage
- TanStack Query hooks for auth state
- Route guards (ProtectedRoute, AuthRoute)

### Auth Flow (Complete)

```
1. User clicks "Continue with Google"
2. supabase.auth.signInWithOAuth({ provider: 'google' })
3. Redirect to Google → user consents → redirect to /auth/callback
4. AuthCallbackPage exchanges code for session
5. supabase.auth.getSession() returns JWT
6. JWT includes user.id (matches profiles.id)
7. All PostgREST calls include JWT automatically via supabase-js
8. RLS policies use auth.uid() to check permissions
```

### Profile Auto-Creation

A database trigger creates a `profiles` row on new user sign-up:

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

---

## 6. UI Component Libraries

### Strategy

The project uses **Tailwind CSS** as the styling foundation. On top of that, two component libraries provide pre-built, accessible UI primitives to speed up development and improve design quality:

| Library | Role | What It Provides |
|---|---|---|
| **shadcn/ui** | Primary component library | Copy-paste React components built on Radix UI + Tailwind. Full control over code — no dependency lock-in. |
| **Radix UI** | Accessibility primitives | Unstyled, accessible components (Dialog, Popover, DropdownMenu, Tooltip, etc.). Used under the hood by shadcn/ui. |
| **daisyUI** | Tailwind plugin for quick styling | Pre-designed Tailwind component classes (btn, card, badge, modal, etc.). Useful for rapid prototyping and consistent base styles. |

### Why This Combination

- **shadcn/ui** gives production-quality components (Dialog, Sheet, Tabs, Select, Command, DataTable) that are fully customizable since they live in your codebase. Ideal for complex DM dashboard UI.
- **Radix UI** (via shadcn) handles all accessibility concerns — keyboard navigation, focus trapping, screen reader support — without writing manual ARIA logic.
- **daisyUI** adds semantic Tailwind classes (`btn`, `btn-primary`, `card`, `badge`, `toggle`) that reduce verbose utility class chains for common elements. Works alongside custom Tailwind — not a replacement.

### Installation

```bash
# shadcn/ui (copies components into your project)
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button dialog sheet tabs select dropdown-menu tooltip

# daisyUI (Tailwind plugin)
pnpm add -D daisyui
```

**daisyUI Tailwind config (`src/app/css/styles.css` or Tailwind config):**

```css
@plugin "daisyui";
```

### Usage Guidelines

#### When to Use What

| Need | Use |
|---|---|
| Buttons, badges, simple cards | daisyUI classes (`btn`, `badge`, `card`) or existing `UiButton` |
| Modals, dialogs, bottom sheets | shadcn/ui `Dialog` / `Sheet` (Radix-based, accessible) |
| Dropdowns, selects, popovers | shadcn/ui `DropdownMenu` / `Select` / `Popover` |
| Tabs (already have custom) | Keep existing `UiTabs` (already animated with motion) |
| Tooltips | shadcn/ui `Tooltip` |
| Data tables (DM dashboard) | shadcn/ui `DataTable` (built on TanStack Table) |
| Toast notifications | Keep existing `sonner` (already integrated) |
| Form inputs | shadcn/ui `Input` / `Textarea` / `Checkbox` / `Switch` |
| Command palette / search | shadcn/ui `Command` (for spell search, item search) |
| Navigation menus | daisyUI `menu` / `navbar` or custom Tailwind |
| Loading states | daisyUI `loading` or shadcn/ui `Skeleton` |

#### Component Location (FSD)

shadcn/ui components are installed into `src/shared/ui/` to follow the existing project structure:

```
src/shared/ui/
├── button/              # Existing UiButton (keep as-is)
├── tabs/                # Existing UiTabs (keep as-is)
├── page-header/         # Existing UiPageHeader (keep as-is)
├── dialog/              # shadcn Dialog
├── sheet/               # shadcn Sheet (bottom sheet / side panel)
├── dropdown-menu/       # shadcn DropdownMenu
├── select/              # shadcn Select
├── input/               # shadcn Input
├── tooltip/             # shadcn Tooltip
├── skeleton/            # shadcn Skeleton
├── command/             # shadcn Command
└── data-table/          # shadcn DataTable
```

#### Theming

Both libraries integrate with Tailwind's theming. The app's existing dark theme (`bg-surface-dark`, `text-white`, `border-primary`) is preserved. shadcn/ui components are customized via CSS variables in the Tailwind config to match the existing purple/dark aesthetic:

```css
:root {
  --primary: /* existing purple */;
  --primary-foreground: /* white */;
  --background: /* dark surface */;
  --card: /* card background */;
  --border: /* white/10 */;
  --ring: /* primary/50 */;
}
```

daisyUI theme is set to match:

```css
@plugin "daisyui" {
  themes: false; /* Use Tailwind's color system, not daisyUI themes */
}
```

#### Key Patterns

```tsx
// shadcn Dialog for modals (e.g., Short Rest confirmation)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~shared/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Short Rest</DialogTitle>
    </DialogHeader>
    {/* Rest form content */}
  </DialogContent>
</Dialog>

// shadcn Sheet for mobile bottom panels (e.g., item details)
import { Sheet, SheetContent } from '~shared/ui/sheet';

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="bottom" className="rounded-t-3xl">
    {/* Item detail content */}
  </SheetContent>
</Sheet>

// daisyUI for quick element styling
<span className="badge badge-outline badge-sm">Poisoned</span>
<div className="skeleton h-4 w-full" /> {/* Loading state */}
<button className="btn btn-primary btn-lg w-full">Start Session</button>
```

### Migration Plan

No need to rewrite existing components. The libraries are additive:
- Existing `UiButton`, `UiTabs`, `UiPageHeader` stay as-is
- New features use shadcn/ui and daisyUI components
- Gradually replace one-off implementations with library components if it simplifies code

---

## 7. Responsive Design Strategy

### Device Targets

| Role | Primary Device | Secondary Device |
|---|---|---|
| Player | Mobile phone (320-428px) | Tablet (768-1024px) |
| DM (Dungeon Master) | Tablet (768-1024px) | Desktop (1024-1440px) |

### Design Approach

**Mobile-first base** for all screens. Then enhance for tablet/desktop using Tailwind breakpoints:

```
Default (no prefix) → Mobile (320-767px)
md:                  → Tablet (768-1023px)
lg:                  → Desktop (1024px+)
```

### Layout Strategy Per Feature

#### Player Features (mobile-first, tablet-enhanced)

| Feature | Mobile | Tablet (md:) |
|---|---|---|
| Character list | Single column, full-width cards | 2-column grid |
| Character sheet | Stacked tabs, full-width panels | Side-by-side layout (stats left, tabs right) |
| Character creation | Full-screen steps | Wider form with more visible context |
| Campaign view | Single column | 2-column (info left, players right) |
| Initiative tracker | Vertical list | Vertical list (wider cards) |
| Messages | Full-screen chat | Full-screen chat |

#### DM Features (tablet-first, desktop-enhanced)

| Feature | Tablet (md:) | Desktop (lg:) |
|---|---|---|
| Campaign list | 2-column grid | 3-column grid |
| Session dashboard | Tabs for different views | Split view (player list + active panel) |
| Player overview | Scrollable card list | Grid of mini character sheets |
| Initiative tracker | Vertical list with DM controls | Horizontal bar + player details below |
| DM notes | Full-width editor | Side panel alongside session view |
| Combat management | Tab-based (initiative / players) | Side-by-side (initiative left, player detail right) |
| Private messages | Player selector + chat | Player list sidebar + chat main area |

### Responsive Component Patterns

```tsx
// Character list: 1 col mobile, 2 col tablet, 3 col desktop
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {characters.map(c => <CharacterCard key={c.id} character={c} />)}
</div>

// Character sheet: stacked mobile, side-by-side tablet+
<div className="flex flex-col md:flex-row md:gap-6">
  <div className="md:w-1/3">
    {/* Stats panel - always visible on tablet+ */}
    <AbilityScores />
    <CombatStats />
  </div>
  <div className="md:w-2/3">
    {/* Tabbed content */}
    <UiTabs tabs={[...]} />
  </div>
</div>

// DM session dashboard: tabs on tablet, split on desktop
<div className="flex flex-col lg:flex-row lg:gap-6">
  <div className="lg:w-80 lg:shrink-0">
    {/* Player list sidebar - always visible on desktop */}
    <PlayerList />
  </div>
  <div className="flex-1">
    {/* Main content area */}
    <SessionContent />
  </div>
</div>
```

### Touch vs Pointer

```tsx
// Mobile: full-width tap targets, active states
// Desktop: hover states added, smaller click targets acceptable
<button className="min-h-11 w-full active:scale-95 md:w-auto md:min-h-9 md:hover:bg-primary/80">
  Action
</button>
```

### Viewport

- Mobile: `min-h-dvh` (dynamic viewport height for mobile browsers)
- Tablet/Desktop: `min-h-screen` is fine

---

## 8. Frontend: Existing vs Remaining

### Already Built (UI complete, uses mock data)

| Feature | Route | Status |
|---|---|---|
| Google OAuth sign-in | `/sign-in` | Working (Supabase) |
| OAuth callback | `/auth/callback` | Working |
| Onboarding (4 pages) | `/onboarding/*` | Working (localStorage) |
| Home page (role picker) | `/` | Working |
| Character creation (10 steps) | `/character/create` | UI done, mock data |
| Character details (tabbed) | `/character/:id` | UI done, mock data |
| Player main page | `/player` | UI done, mock data |
| Player archive | `/player/archive` | UI done, mock data |
| Master main page | `/master` | UI done, mock data |
| Master lobby (not routed) | — | UI components exist |
| Master campaign creation (not routed) | — | UI components exist |

### Needs to be Built

#### Phase 1 — Connect to Backend (replace mock data)

| Task | Description |
|---|---|
| Character CRUD hooks | TanStack Query hooks for `supabase.from('characters')` |
| Character creation submission | POST character to Supabase on review step confirm |
| Character list queries | Fetch user's characters (active / archived) |
| Character detail query | Fetch single character by ID |
| Character update mutations | Update HP, spell slots, equipment, etc. |
| Profile management | Save/read preferred_role from profiles table |
| Onboarding → profile | Save role choice to profiles table (not just localStorage) |

#### Phase 2 — Campaign Features (new pages & logic)

| Task | Route | Description |
|---|---|---|
| Campaign creation page | `/master/campaign/create` | Form: name, description, banner, max players |
| Campaign detail page (DM) | `/master/campaign/:id` | Campaign info, player list, invite code, start session |
| Campaign detail page (Player) | `/player/campaign/:id` | Campaign info, party members, character assignment |
| Join campaign page | `/player/join` | Enter invite code + password, select character |
| Campaign invite system | Edge Function | Generate code, validate code + password |
| Campaign CRUD hooks | TanStack Query | Create, read, update, archive campaigns |

#### Phase 3 — Session & Combat (new pages & logic)

| Task | Route | Description |
|---|---|---|
| Session lobby (DM) | `/master/campaign/:id/session` | Player readiness, start session button |
| Session lobby (Player) | `/player/campaign/:id/session` | Ready toggle, waiting state |
| Session active view (DM) | `/master/session/:id` | Player overview, DM notes, combat controls |
| Session active view (Player) | `/player/session/:id` | Character sheet with session context |
| Initiative tracker | Embedded in session | DM: add/remove combatants, advance turns. Player: view order |
| Combat start/end | Edge Function | State transitions, initiative management |
| HP quick actions | Embedded in character sheet | +/- buttons for fast HP changes |
| Spell slot tracker | Embedded in character sheet | Mark slots used/available per level |
| Short rest | Modal/flow in session | Player spends Hit Dice, auto-calculates healing |
| Long rest | DM triggers for party | Restores HP, slots, dice for all |
| DM character editor | Modal in session | DM modifies player stats with change logging |
| Change log viewer | Tab in character details | Who changed what and when |

#### Phase 4 — Communication (new pages)

| Task | Route | Description |
|---|---|---|
| Private messages (DM view) | Tab in DM session | Player selector + chat per player |
| Private messages (Player view) | Tab in player session | Chat with DM |
| Message polling | Background | Poll for new messages every 5-10 seconds during active session |
| Unread indicator | Session UI | Badge/dot showing unread messages |

#### Phase 5 — Equipment & Inventory (enhance existing)

| Task | Description |
|---|---|
| Equipment list (player) | Free-text CRUD: add item (name, qty, weight, description, equipped) |
| Equipment list (DM) | Same CRUD but on another player's character |
| Money tracker | Gold/silver/copper with +/- controls |
| DM give/remove item | DM adds/removes from player inventory, logged in ChangeLog |

---

## 9. Feature Implementation Details

### 8.1 Character CRUD (PostgREST)

**Hooks (TanStack Query):**

```typescript
// src/entities/character/model.ts

function useCharactersQuery(status: 'active' | 'archive') {
  return useQuery({
    queryKey: ['characters', status],
    queryFn: () =>
      supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status)
        .order('updated_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
  });
}

function useCharacterQuery(id: string) {
  return useQuery({
    queryKey: ['characters', id],
    queryFn: () =>
      supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
  });
}

function useCreateCharacterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (character: CreateCharacterInput) =>
      supabase.from('characters').insert(character).select().single()
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

function useUpdateCharacterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }: UpdateCharacterInput) =>
      supabase.from('characters').update(updates).eq('id', id).select().single()
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['characters', data.id] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}
```

### 8.2 Campaign CRUD (PostgREST)

```typescript
// src/entities/campaign/model.ts

function useCampaignsQuery(masterId: string) {
  return useQuery({
    queryKey: ['campaigns', masterId],
    queryFn: () =>
      supabase
        .from('campaigns')
        .select('*, campaign_players(count)')
        .eq('master_id', masterId)
        .order('updated_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
  });
}

function useCreateCampaignMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaign: CreateCampaignInput) =>
      supabase.from('campaigns').insert(campaign).select().single()
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
```

### 8.3 Campaign Join Flow

```
Player → /player/join → enters invite code + password
  → Frontend calls Edge Function: POST /campaign-invite/join
  → Edge Function validates code, password, capacity
  → Inserts into campaign_players
  → Returns campaign data
  → Frontend navigates to /player/campaign/:id
```

### 8.4 Session Management

**Session state machine:**

```
No Session → [DM: Start Session] → Session Active (Lobby)
  → [All Players Ready + DM: Begin] → Session Active (Exploration)
  → [DM: Start Combat] → Session Active (Combat)
    → [DM: End Combat] → Session Active (Exploration)
  → [DM: Short Rest] → Rest Modal → Session Active (Exploration)
  → [DM: Long Rest] → Rest Confirmation → Session Active (Exploration)
  → [DM: End Session] → Session Completed
```

**DM Session Dashboard layout (tablet/desktop):**

```
┌──────────────────────────────────────────────────┐
│ Campaign: "Lost Mines"          [End Session]    │
├────────────┬─────────────────────────────────────┤
│ Players    │  Main Panel (tabs)                  │
│ ┌────────┐ │  ┌─────────────────────────────────┐│
│ │ Artem  │ │  │ [Overview] [Combat] [Notes] [Chat]│
│ │ HP: 25 │ │  │                                 ││
│ │ AC: 16 │ │  │  (content changes per tab)      ││
│ ├────────┤ │  │                                 ││
│ │ Max    │ │  │                                 ││
│ │ HP: 32 │ │  │                                 ││
│ │ AC: 14 │ │  └─────────────────────────────────┘│
│ └────────┘ │                                     │
│            │  [Start Combat] [Short Rest]        │
│            │  [Long Rest]                        │
└────────────┴─────────────────────────────────────┘
```

**On mobile (player), the session view is the character sheet** with an added session bar at the top showing:
- Session status (active / combat)
- Current turn indicator (during combat)
- Unread message badge

### 8.5 Initiative Tracker

**Data structure (stored in `sessions.initiative_order`):**

```jsonc
[
  { "type": "player", "characterId": "uuid", "name": "Artem", "initiative": 18 },
  { "type": "npc", "name": "Goblin 1", "initiative": 15, "hp": 7, "maxHp": 7 },
  { "type": "player", "characterId": "uuid", "name": "Max", "initiative": 12 },
  { "type": "npc", "name": "Goblin 2", "initiative": 10, "hp": 7, "maxHp": 7 }
]
```

**DM Controls:**
- Add NPC/monster (name + initiative + HP)
- Remove combatant (defeated enemy)
- Reorder (drag or manual initiative edit)
- Next Turn button (increments `current_turn_index`, wraps to 0 + increments `round_number`)

**Player View:**
- Read-only ordered list
- Current turn highlighted
- Their own entry emphasized

### 8.6 Rest Mechanics (Edge Functions)

**Short Rest (per character, player-triggered with DM approval):**

```
Player opens Short Rest modal
  → Shows available Hit Dice (e.g., "3 of 5 d10 remaining")
  → Player chooses how many to spend (slider or +/-)
  → Submit → Edge Function calculates:
    HP gained = sum of (random d[hitDie] + CON modifier) per die spent
    New HP = min(current_hp + HP gained, max_hp)
    Hit Dice remaining -= dice spent
  → If Warlock: restore all spell slots
  → Log changes
  → Return updated character
```

**Long Rest (DM triggers for entire party):**

```
DM clicks "Long Rest" → Confirmation dialog
  → Edge Function for each character:
    HP = max_hp
    All spell slots = restored to max
    Hit Dice restored = min(floor(total / 2), total - current), minimum 1
    Death saves reset
  → Log all changes
  → Return updated characters
```

### 8.7 Equipment Management

**Equipment item structure:**

```typescript
interface EquipmentItem {
  id: string;        // UUID, generated client-side
  name: string;      // Free text
  quantity: number;   // Default 1
  weight?: number;    // In lbs, optional
  description?: string;
  equipped: boolean;  // Is it currently worn/held
}
```

**UI (Equipment panel in character sheet):**

```
┌──────────────────────────────────┐
│ Equipment            [+ Add]    │
├──────────────────────────────────┤
│ [x] Longsword        1   3 lbs │
│ [x] Chain Mail        1  55 lbs │
│ [ ] Rope (50ft)       1  10 lbs │
│ [ ] Torch             5   5 lbs │
│ [ ] Rations           10  20 lbs│
├──────────────────────────────────┤
│ Total weight: 93 / 225 lbs     │
├──────────────────────────────────┤
│ Money                           │
│ Gold: 15  [−] [+]              │
│ Silver: 3  [−] [+]            │
│ Copper: 20  [−] [+]           │
└──────────────────────────────────┘
```

- Tap item → expand for description, edit, delete
- Checkbox = equipped toggle
- DM sees same UI when viewing player's character, can add/remove items

### 8.8 Private Messages

**Polling approach (MVP):**

```typescript
// During active session, poll every 5 seconds
function useMessagesQuery(sessionId: string, userId: string) {
  return useQuery({
    queryKey: ['messages', sessionId, userId],
    queryFn: () =>
      supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: true })
        .then(({ data, error }) => {
          if (error) { throw error; }
          return data;
        }),
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: !!sessionId,  // Only poll during active session
  });
}
```

**Unread count:**

```typescript
function useUnreadCountQuery(sessionId: string, userId: string) {
  return useQuery({
    queryKey: ['messages', 'unread', sessionId, userId],
    queryFn: () =>
      supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('session_id', sessionId)
        .eq('recipient_id', userId)
        .eq('is_read', false)
        .then(({ count, error }) => {
          if (error) { throw error; }
          return count ?? 0;
        }),
    refetchInterval: 5000,
    enabled: !!sessionId,
  });
}
```

### 8.9 Change Log

**Auto-logging via database trigger (preferred):**

```sql
create or replace function log_character_change()
returns trigger as $$
declare
  col text;
  old_val text;
  new_val text;
begin
  -- Track specific fields
  foreach col in array ARRAY['hp', 'temp_hp', 'ac', 'level', 'spells', 'spell_slots',
                              'equipment', 'money', 'conditions', 'death_saves', 'hit_dice',
                              'skills', 'features', 'stats'] loop
    old_val := row_to_json(OLD)->>col;
    new_val := row_to_json(NEW)->>col;
    if old_val is distinct from new_val then
      insert into change_log (character_id, changed_by, field_name, old_value, new_value, change_type)
      values (NEW.id, auth.uid(), col, old_val, new_val, 'player_edit');
    end if;
  end loop;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger character_change_trigger
  after update on characters
  for each row execute function log_character_change();
```

> DM overrides set `change_type = 'dm_override'` via the Edge Function (not the trigger).

---

## 10. Real-Time & Polling

### MVP: Polling

All "live" features use TanStack Query's `refetchInterval`:

| Feature | Poll Interval | When Active |
|---|---|---|
| Session status | 3s | Player in campaign with active session |
| Initiative order | 2s | During combat |
| Player readiness | 3s | DM in session lobby |
| Private messages | 5s | During active session |
| Character data (DM view) | 5s | DM viewing player sheets |

### Future: Supabase Realtime

Can be added without changing the data model. Replace polling with subscriptions:

```typescript
// Future upgrade example
supabase
  .channel('session-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'sessions',
    filter: `id=eq.${sessionId}`,
  }, (payload) => {
    queryClient.setQueryData(['session', sessionId], payload.new);
  })
  .subscribe();
```

---

## 11. File Storage

### Supabase Storage Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `avatars` | User profile pictures | Public read, authenticated write (own only) |
| `campaign-banners` | Campaign banner images | Public read, campaign master write |
| `character-portraits` | Character portrait uploads | Public read, character owner write |

### Upload Pattern

```typescript
async function uploadImage(bucket: string, file: File, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) { throw error; }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
```

### Storage Policies

```sql
-- avatars bucket: users can upload to their own folder
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- campaign-banners: only campaign master can upload
create policy "Campaign master can upload banner"
  on storage.objects for insert
  with check (
    bucket_id = 'campaign-banners'
    and exists (
      select 1 from campaigns
      where id::text = (storage.foldername(name))[1]
      and master_id = auth.uid()
    )
  );
```

---

## 12. Deployment

### Frontend

- **Build:** `pnpm run build` (Vite → static files in `dist/`)
- **Host:** Vercel, Netlify, or Cloudflare Pages (any static hosting)
- **Environment:** Set `VITE_APP_SUPABASE_URL` and `VITE_APP_SUPABASE_PUBLISHABLE_KEY` in hosting env vars

### Backend (Supabase)

- **Database:** Managed by Supabase (cloud PostgreSQL)
- **Migrations:** `supabase db push` deploys migrations to production
- **Edge Functions:** `supabase functions deploy <function-name>`
- **Storage:** Managed by Supabase

### CI/CD

```yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
        working-directory: frontend
      # Deploy to hosting provider

  deploy-supabase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db push --linked
      - run: supabase functions deploy --linked
```
