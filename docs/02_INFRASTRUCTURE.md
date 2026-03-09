# Phase 2: Infrastructure

> Set up local Supabase development environment, database schema, storage, and deployment pipeline.
> Complete this phase after Frontend First UI is done.

---

## Task I1: Supabase Local Development Setup

Set up local Supabase environment for development using Docker.

**Prerequisites:**
- Docker Desktop installed and running
- Supabase CLI installed: `pnpm add -g supabase`

**Steps:**
1. Run `supabase init` in project root (creates `supabase/` directory with `config.toml`)
2. Run `supabase start` to start local stack
3. Create `.env.local` with local Supabase URL and anon key

**Local services provided:**
- PostgreSQL on `localhost:54322`
- Auth on `localhost:54321`
- Storage on `localhost:54321`
- Supabase Studio (admin UI) on `localhost:54323`
- Edge Functions runtime

**Environment variables (`.env.local`):**
```env
VITE_APP_SUPABASE_URL=http://localhost:54321
VITE_APP_SUPABASE_PUBLISHABLE_KEY=<local-anon-key-from-supabase-start>
```

**Output:** `supabase/config.toml`, `.env.local`, working local Supabase instance.

---

## Task I2: Database Migrations — Core Tables

Create SQL migration files for all database tables.

**Files to create:**
- `supabase/migrations/001_create_profiles.sql`
- `supabase/migrations/002_create_characters.sql`
- `supabase/migrations/003_create_campaigns.sql`
- `supabase/migrations/004_create_campaign_players.sql`
- `supabase/migrations/005_create_sessions.sql`
- `supabase/migrations/006_create_messages.sql`
- `supabase/migrations/007_create_change_log.sql`

### Table Schemas

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

Auto-creation trigger:

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

**Run:** `supabase db push` after creating all migrations.

---

## Task I3: Row-Level Security Policies

**File:** `supabase/migrations/008_rls_policies.sql`

Enable RLS on all tables and add policies:

### profiles
- SELECT: Any authenticated user can read any profile
- UPDATE: Users can only update their own profile

### characters
- SELECT: Owner reads own; DM reads characters in their campaigns
- INSERT: Authenticated users create for themselves only (`user_id = auth.uid()`)
- UPDATE: Owner updates own; DM updates characters in active sessions of their campaigns
- DELETE: Owner deletes own (if not in active campaign)

### campaigns
- SELECT: DM sees own; Players see campaigns they've joined
- INSERT: Any authenticated user
- UPDATE/DELETE: Only the campaign's master

### campaign_players
- SELECT: Campaign master and campaign players
- INSERT: Via Edge Function only (service role)
- DELETE: Campaign master can remove players

### sessions
- SELECT: Campaign master and players can read their campaign's sessions
- INSERT/UPDATE: Only the campaign master

### messages
- SELECT: Only sender or recipient
- INSERT: Campaign master or players in the session's campaign

### change_log
- SELECT: Character owner and campaign master
- INSERT: Via triggers or Edge Functions only (service role)

---

## Task I4: Database Triggers

### Character Change Log Trigger

Auto-log changes to tracked character fields:

```sql
create or replace function log_character_change()
returns trigger as $$
declare
  col text;
  old_val text;
  new_val text;
begin
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

### Updated_at Auto-Update Trigger

For `profiles`, `characters`, `campaigns`:

```sql
create or replace function update_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger set_updated_at before update on characters
  for each row execute function update_updated_at();

create trigger set_updated_at before update on campaigns
  for each row execute function update_updated_at();
```

---

## Task I5: Seed Data

**File:** `supabase/seed.sql`

Create development seed data for local testing:
- 2 test users (1 DM, 1 player) — insert into `auth.users` and `profiles`
- 2 sample characters with full data
- 1 sample campaign with both players joined
- 1 completed session with sample change log entries

---

## Task I6: Supabase Storage Buckets

Create storage buckets for image uploads:

| Bucket | Purpose | Access |
|---|---|---|
| `avatars` | User profile pictures | Public read, authenticated write (own folder only) |
| `campaign-banners` | Campaign banner images | Public read, campaign master write |
| `character-portraits` | Character portrait uploads | Public read, character owner write |

### Storage Policies

```sql
-- avatars: users upload to their own folder
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

**Max file size:** 2MB. Accepted types: `.jpg`, `.png`, `.webp`.

---

## Task I7: Deployment Pipeline

### Frontend Deployment

- **Build:** `pnpm run build` (Vite → static files in `dist/`)
- **Host:** Vercel, Netlify, or Cloudflare Pages
- **Env vars:** `VITE_APP_SUPABASE_URL`, `VITE_APP_SUPABASE_PUBLISHABLE_KEY`

### Supabase Deployment

- **Database:** `supabase db push` deploys migrations to production
- **Edge Functions:** `supabase functions deploy <function-name>`
- **Storage:** Managed by Supabase cloud

### CI/CD (GitHub Actions)

```yaml
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

  deploy-supabase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db push --linked
      - run: supabase functions deploy --linked
```

---

## Task I8: Database Indexes

Add indexes for frequently queried columns:

```sql
create index idx_characters_user_id on characters(user_id);
create index idx_characters_status on characters(status);
create index idx_campaigns_master_id on campaigns(master_id);
create index idx_campaigns_invite_code on campaigns(invite_code);
create index idx_campaign_players_campaign_id on campaign_players(campaign_id);
create index idx_campaign_players_user_id on campaign_players(user_id);
create index idx_sessions_campaign_id on sessions(campaign_id);
create index idx_sessions_status on sessions(status);
create index idx_messages_session_id on messages(session_id);
create index idx_messages_recipient_id on messages(recipient_id);
create index idx_change_log_character_id on change_log(character_id);
```

---

## Project Structure (After Infrastructure)

```
supabase/
├── migrations/
│   ├── 001_create_profiles.sql
│   ├── 002_create_characters.sql
│   ├── 003_create_campaigns.sql
│   ├── 004_create_campaign_players.sql
│   ├── 005_create_sessions.sql
│   ├── 006_create_messages.sql
│   ├── 007_create_change_log.sql
│   ├── 008_rls_policies.sql
│   ├── 009_triggers.sql
│   └── 010_indexes.sql
├── functions/          # (created in Backend phase)
├── seed.sql
└── config.toml
```

---

## Task Order

1. I1 — Local Supabase setup
2. I2 — Database migrations (all tables)
3. I3 — RLS policies
4. I4 — Database triggers
5. I5 — Seed data
6. I6 — Storage buckets
7. I7 — Deployment pipeline (can be done later)
8. I8 — Database indexes

**Total: 8 tasks**
