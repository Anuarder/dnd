# Phase 4: Frontend Second (Connect UI to Backend)

> Replace all mock data with real Supabase queries and mutations.
> Wire up Edge Function calls. Add polling for live features.
> Complete this phase after Backend Edge Functions are deployed.

---

## Task S1: TypeScript Types for Database Entities

**File:** `frontend/src/shared/types/database.ts`

Define TypeScript interfaces matching the database schema:

```typescript
interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  preferred_role: 'master' | 'player';
  created_at: string;
  updated_at: string;
}

interface Character { /* all fields from characters table */ }
interface CreateCharacterInput { /* subset for creation */ }
interface UpdateCharacterInput { id: string; /* partial fields */ }

interface Campaign { /* all fields from campaigns table */ }
interface CreateCampaignInput { /* subset for creation */ }

interface CampaignPlayer { /* all fields */ }
interface Session { /* all fields */ }
interface Message { /* all fields */ }
interface ChangeLogEntry { /* all fields */ }
```

---

## Task S2: Character Query Hooks

**File:** `frontend/src/entities/character/model.ts`

```typescript
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
```

---

## Task S3: Character Mutation Hooks

**File:** `frontend/src/entities/character/model.ts` (extend S2)

```typescript
function useCreateCharacterMutation() // insert + invalidate ['characters']
function useUpdateCharacterMutation() // update + invalidate ['characters', id] + ['characters']
function useArchiveCharacterMutation() // update status='archive' + invalidate
function useDeleteCharacterMutation() // delete (only if not in active campaign)
```

---

## Task S4: Connect Character Creation Wizard to Backend

**Files to modify:** Character creation review/confirm step component

- Map all 10 wizard steps → `CreateCharacterInput` shape
- Calculate `proficiency_bonus` from level
- Calculate `initiative_mod` from DEX modifier
- Set initial `hp` = `max_hp`
- Call `useCreateCharacterMutation` on confirm
- Navigate to `/player` on success
- Show error toast on failure (existing `sonner` integration)

---

## Task S5: Connect Player Main Page to Backend

**Files to modify:** Player main page component

- Replace mock data with `useCharactersQuery('active')`
- Handle loading state (skeleton cards)
- Handle empty state ("Create your first character" prompt)
- Handle error state

---

## Task S6: Connect Player Archive Page to Backend

- Replace mock data with `useCharactersQuery('archive')`
- Handle loading/empty/error states

---

## Task S7: Connect Character Details Page to Backend

**Files to modify:** Character details page component

- Use `useCharacterQuery(id)` to fetch by route param
- Wire HP +/- buttons to `useUpdateCharacterMutation` (update `hp` field)
- Wire spell slot toggles to `useUpdateCharacterMutation`
- Wire equipment add/remove to `useUpdateCharacterMutation`
- Wire death saves to `useUpdateCharacterMutation`

---

## Task S8: Save Onboarding Role Choice to Supabase

**Files to modify:** Onboarding role selection step

- Add mutation: `supabase.from('profiles').update({ preferred_role }).eq('id', userId)`
- Keep localStorage as fallback for offline access
- Navigate to appropriate main page based on role

---

## Task S9: Campaign Query & Mutation Hooks

**File:** `frontend/src/entities/campaign/model.ts`

```typescript
function useCampaignsQuery()          // DM's own campaigns
function usePlayerCampaignsQuery()    // campaigns player has joined
function useCampaignQuery(id: string) // single campaign with players
function useCreateCampaignMutation()  // calls campaign-invite/generate Edge Function
function useUpdateCampaignMutation()  // direct PostgREST update
function useArchiveCampaignMutation() // update status='archive'
```

---

## Task S10: Connect Campaign Creation to Edge Function

Wire campaign creation form to call `campaign-invite/generate` Edge Function:

```typescript
const { data, error } = await supabase.functions.invoke('campaign-invite/generate', {
  body: { name, description, imageUrl, maxPlayers },
});
```

- On success: navigate to `/master/campaign/:id`
- Display invite code + password to DM (only time shown)

---

## Task S11: Connect Campaign Join to Edge Function

Wire join campaign form to call `campaign-invite/join` Edge Function:

```typescript
const { data, error } = await supabase.functions.invoke('campaign-invite/join', {
  body: { inviteCode, invitePassword, characterId },
});
```

- On success: navigate to `/player/campaign/:id`
- Handle errors: invalid code, wrong password, campaign full, etc.

---

## Task S12: Connect Master Main Page to Backend

- Replace mock campaigns with `useCampaignsQuery()`
- Show active and archived campaigns in separate sections
- Handle loading/empty/error states

---

## Task S13: Connect Campaign Detail Pages to Backend

**DM:** `/master/campaign/:id`
- Use `useCampaignQuery(id)` for campaign data + player roster
- Wire "Start Session" to `session-manage/start` Edge Function
- Wire "Archive" to `useArchiveCampaignMutation`

**Player:** `/player/campaign/:id`
- Use `useCampaignQuery(id)` for campaign info + party members
- Wire "Ready Up" toggle to direct PostgREST update on `campaign_players`

---

## Task S14: Session Query & Mutation Hooks

**File:** `frontend/src/entities/session/model.ts`

```typescript
function useActiveCampaignSessionQuery(campaignId: string) {
  return useQuery({
    queryKey: ['session', 'active', campaignId],
    queryFn: () => /* fetch active session */,
    refetchInterval: 3000, // poll every 3s
  });
}

function useSessionQuery(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => /* fetch session details */,
    refetchInterval: 2000, // poll during combat
  });
}

function useStartSessionMutation()  // calls session-manage/start
function useEndSessionMutation()    // calls session-manage/end
```

---

## Task S15: Connect Session Lobby to Backend

**DM Lobby:**
- Poll `campaign_players` for readiness status (every 3s)
- Wire "Begin Session" to `useStartSessionMutation`

**Player Lobby:**
- Wire "Ready" toggle to PostgREST update on `campaign_players.is_ready`
- Poll session status — auto-navigate when session becomes active

---

## Task S16: Connect Session Views to Backend

**DM Session:**
- Poll session data for combat state (initiative_order, current_turn, round)
- Wire "End Session" to `useEndSessionMutation`
- Wire "Start Combat" to `session-manage/start-combat` Edge Function
- Wire "End Combat" to `session-manage/end-combat` Edge Function
- Wire "Next Turn" to direct PostgREST update on `current_turn_index`
- Wire DM notes to PostgREST update on `sessions.dm_notes`

**Player Session:**
- Poll session data for turn order (every 2-3s during combat)
- Wire HP/spell slot/equipment changes to `useUpdateCharacterMutation`

---

## Task S17: Connect Rest Mechanics to Edge Functions

**Short Rest:**
- Wire Short Rest modal confirm to `rest-mechanics/short-rest` Edge Function
- Display HP gained result

**Long Rest:**
- Wire Long Rest confirm to `rest-mechanics/long-rest` Edge Function
- Invalidate all character queries after success

---

## Task S18: Connect DM Character Editor to Edge Function

- Wire save button to `character-modify/dm-edit` Edge Function
- Invalidate character queries on success
- Show change summary in toast

---

## Task S19: Message Hooks with Polling

**File:** `frontend/src/entities/message/model.ts`

```typescript
function useMessagesQuery(sessionId: string, otherUserId: string) {
  return useQuery({
    queryKey: ['messages', sessionId, otherUserId],
    queryFn: () => /* fetch messages between current user and other user */,
    refetchInterval: 5000, // poll every 5s during active session
    enabled: !!sessionId,
  });
}

function useUnreadCountQuery(sessionId: string) {
  return useQuery({
    queryKey: ['messages', 'unread', sessionId],
    queryFn: () => /* count unread messages */,
    refetchInterval: 5000,
    enabled: !!sessionId,
  });
}

function useSendMessageMutation()  // direct PostgREST insert
function useMarkReadMutation()     // update is_read = true
```

---

## Task S20: Connect Private Messaging UI

**DM Messages:**
- Wire player list unread badges to `useUnreadCountQuery`
- Wire chat thread to `useMessagesQuery`
- Wire send button to `useSendMessageMutation`
- Wire opening chat to `useMarkReadMutation`

**Player Messages:**
- Wire chat thread to `useMessagesQuery(sessionId, dmUserId)`
- Wire send button to `useSendMessageMutation`
- Wire notification dot to `useUnreadCountQuery`

---

## Task S21: Connect Change Log Viewer

- Fetch change log: `supabase.from('change_log').select('*').eq('character_id', id).order('created_at', { ascending: false })`
- Replace mock data in History tab
- Add filter by change_type
- Handle loading/empty states

---

## Task S22: Image Upload Integration

Wire image uploads to Supabase Storage:

```typescript
async function uploadImage(bucket: string, file: File, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) { throw error; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
```

- Campaign banner upload on create/edit
- Character portrait upload (future)
- Max 2MB, accepted: `.jpg`, `.png`, `.webp`

---

## Polling Summary

| Feature | Poll Interval | When Active |
|---|---|---|
| Session status | 3s | Player in campaign with active session |
| Initiative order | 2s | During combat |
| Player readiness | 3s | DM in session lobby |
| Private messages | 5s | During active session |
| Character data (DM view) | 5s | DM viewing player sheets in session |

---

## Task Order

1. S1 — TypeScript types
2. S2-S3 — Character hooks (query + mutation)
3. S4-S7 — Connect character pages (creation, main, archive, details)
4. S8 — Onboarding → profile
5. S9-S13 — Campaign hooks + connect pages
6. S14-S16 — Session hooks + connect lobby + session views
7. S17-S18 — Rest mechanics + DM editor
8. S19-S21 — Messages + change log
9. S22 — Image uploads

**Total: 22 tasks**
