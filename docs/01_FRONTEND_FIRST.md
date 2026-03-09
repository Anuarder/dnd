# Phase 1: Frontend First (UI with Mock Data)

> Build all UI screens and components with mock/static data before connecting to any backend.
> Focus on mobile-first design, component structure, and user flows.

---

## Current State (Already Built)

| Feature | Route | Status |
|---|---|---|
| Google OAuth sign-in | `/sign-in` | Working (Supabase Auth) |
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

---

## Tasks to Build (UI Only, Mock Data)

### Task F1: Campaign Creation Page (DM)

**Route:** `/master/campaign/create`

**UI elements:**
- Campaign name input (required, max 100 chars)
- Description textarea (optional)
- Banner image upload preview (file picker, show preview — no actual upload yet)
- Max players selector (2-10, default 5)
- "Create Campaign" submit button

**Mock behavior:** On submit, show success toast, navigate to `/master`.

---

### Task F2: Campaign Detail Page (DM)

**Route:** `/master/campaign/:id`

**UI elements:**
- Campaign banner, name, description display
- Invite code display with copy-to-clipboard button
- Invite password display (masked, toggle visibility)
- "Regenerate Code" button (mock: generates random string)
- Player roster list showing:
  - Player name, character name, character class/level
  - Ready status indicator (green dot / gray dot)
- "Start Session" button (disabled if no players)
- "Archive Campaign" button
- "Edit Campaign" button

**Mock data:** 3-4 players with characters.

---

### Task F3: Campaign Detail Page (Player)

**Route:** `/player/campaign/:id`

**UI elements:**
- Campaign banner, name, description
- Party members list (other players' character name, class, level)
- "Ready Up" toggle button
- Active session indicator (if session is live)
- "Join Session" button (visible when session is active)

**Mock data:** Campaign info + 2-3 party members.

---

### Task F4: Join Campaign Page (Player)

**Route:** `/player/join`

**UI elements:**
- Invite code input (6 chars, auto-uppercase)
- Password input
- Character selector dropdown (list of user's active characters — mock list)
- "Join" submit button

**Mock behavior:** On submit, show success toast, navigate to `/player`.

---

### Task F5: Session Lobby — DM View

**Route:** `/master/campaign/:id/session`

**UI elements:**
- Player readiness list (name + ready/not-ready status)
- "Begin Session" button (enabled when at least 1 player is ready)
- "Cancel" button (back to campaign detail)

**Mock data:** 3-4 players, 2 ready, 1 not ready.

---

### Task F6: Session Lobby — Player View

**Route:** `/player/campaign/:id/session`

**UI elements:**
- "Ready" toggle button
- "Waiting for DM to start..." animated indicator
- Party members ready status list

**Mock data:** Waiting state with animated dots/spinner.

---

### Task F7: Session Active View — DM

**Route:** `/master/session/:id`

**Layout:** Tabbed interface

**Tabs:**
1. **Players** — List of player character cards showing:
   - Character name, class, level
   - HP bar (current/max)
   - AC, conditions badges
   - Tap card → opens character detail modal
2. **Combat** — Initiative tracker (see Task F9)
3. **Notes** — DM-only text editor (simple textarea, saves to local state)
4. **Messages** — Private messaging panel (see Task F13)

**Header:** Campaign name, session status badge, "End Session" button.

**Bottom actions bar:** "Start Combat", "Short Rest", "Long Rest" buttons.

---

### Task F8: Session Active View — Player

**Route:** `/player/session/:id`

**UI elements:**
- Character sheet with session context:
  - HP with +/- quick action buttons
  - Spell slots with toggle (used/available)
  - Equipment list
  - Conditions badges
- Session bar at top:
  - Session status (active / combat)
  - Current turn indicator (during combat)
  - Unread message badge (notification dot)
- Initiative tracker (view-only, see Task F10)
- Messages tab (chat with DM, see Task F14)

---

### Task F9: Initiative Tracker — DM Controls

**Embedded in:** DM Session Combat tab

**UI elements:**
- "Start Combat" button
- Add combatant form: name input + initiative number input + (optional) HP/maxHP for NPCs
- Ordered list of combatants:
  - Current turn highlighted
  - Player entries show character name + initiative
  - NPC entries show name + initiative + HP bar
  - Remove button (X) per entry
- "Next Turn" button (cycles through list)
- Round counter display
- "End Combat" button

**Mock data:** 3 players + 2 goblins, pre-filled initiative values.

---

### Task F10: Initiative Tracker — Player View

**Embedded in:** Player Session view

**UI elements:**
- Read-only ordered list of combatants
- Current turn highlighted with animation
- Player's own entry emphasized (different border/background)
- Round counter

**Mock data:** Same as DM view but read-only.

---

### Task F11: Short Rest Modal

**Triggered from:** DM session view ("Short Rest" button)

**UI elements:**
- Available Hit Dice display (e.g., "3 of 5 d10 remaining")
- Dice to spend selector (+/- or slider, 0 to available)
- Preview: "Estimated HP gain: ~X" (average calculation)
- "Take Short Rest" confirm button
- "Cancel" button

**Mock behavior:** Update local HP state with calculated value.

---

### Task F12: Long Rest Confirmation Dialog

**Triggered from:** DM session view ("Long Rest" button)

**UI elements:**
- Confirmation dialog: "This will restore HP, spell slots, and Hit Dice for all party members."
- List of affected characters with current HP → max HP preview
- "Confirm Long Rest" button
- "Cancel" button

**Mock behavior:** Reset all character HPs to max, restore spell slots in local state.

---

### Task F13: Private Messages — DM View

**Embedded in:** DM Session Messages tab

**UI elements:**
- Left panel: Player list with unread count badges
- Right panel: Chat thread with selected player
  - Message bubbles (DM on right, player on left)
  - Timestamps
  - Message input at bottom with send button

**Mock data:** 2-3 conversation threads with sample messages.

---

### Task F14: Private Messages — Player View

**Embedded in:** Player Session Messages tab

**UI elements:**
- Single chat thread with DM
- Message bubbles (player on right, DM on left)
- Timestamps
- Message input at bottom with send button
- Notification dot when "new" message appears

**Mock data:** Sample conversation with DM.

---

### Task F15: DM Character Editor Modal

**Triggered from:** Tap on player card in DM session Players tab

**UI elements:**
- Character sheet in read mode with edit toggles
- Editable fields: HP (+/-), temp HP, conditions (add/remove), spell slots
- "Save Changes" button
- Change preview: "HP: 25 → 18 (DM override)"

**Mock behavior:** Update local state, show toast "Changes saved".

---

### Task F16: Change Log Viewer

**Location:** New tab "History" on character details page (`/character/:id`)

**UI elements:**
- Chronological list of changes:
  - Timestamp
  - Changed by: "You" or "DM (Dana)"
  - Field: "HP"
  - Change: "25 → 18"
  - Type badge: "Player Edit" / "DM Override" / "Rest" / "Combat"
- Filter by type dropdown
- Infinite scroll or pagination

**Mock data:** 10-15 sample change log entries.

---

### Task F17: Equipment Management Panel

**Location:** Equipment tab on character details page

**UI elements:**
- Item list with columns: equipped checkbox, name, quantity, weight
- "Add Item" button → inline form (name required, qty/weight/description optional)
- Tap item → expand for description, edit, delete
- Total weight display with carrying capacity bar
- Money section: Gold/Silver/Copper with +/- buttons

**Mock data:** 5-6 items (longsword, chain mail, rope, torches, rations).

---

### Task F18: HP Quick Actions

**Location:** Character sheet (both standalone and in-session)

**UI elements:**
- Current HP / Max HP display with progress bar
- Temp HP display (separate, smaller)
- Large +/- buttons for HP adjustment
- Number input for custom amount (tap +/- or type directly)
- HP cannot exceed max_hp, cannot go below 0

**Mock behavior:** Update local state immediately.

---

### Task F19: Spell Slot Tracker

**Location:** Spells tab on character details page

**UI elements:**
- Per spell level (1-5 for MVP):
  - Level label ("Level 1", "Level 2", etc.)
  - Row of slot circles (filled = available, empty = used)
  - Tap circle to toggle used/available
- Cantrips section (always available, no slots)
- Prepared spells list with checkboxes

**Mock data:** Level 3 Wizard with appropriate slots and spells.

---

### Task F20: Death Saving Throws Tracker

**Location:** Character sheet, visible when HP = 0

**UI elements:**
- 3 success circles (fill on tap)
- 3 failure circles (fill on tap)
- "Stabilized!" message at 3 successes
- "Character has fallen..." message at 3 failures
- Reset button

**Mock behavior:** Toggle circles, show result messages.

---

## UI Component Libraries to Set Up

Before starting tasks, install and configure:

1. **shadcn/ui** — For Dialog, Sheet, Tabs, Select, Command, Skeleton, Input, Tooltip
   ```bash
   pnpm dlx shadcn@latest init
   pnpm dlx shadcn@latest add dialog sheet select dropdown-menu tooltip skeleton input textarea command
   ```

2. **daisyUI** — For quick styling (btn, badge, card, toggle classes)
   ```bash
   pnpm add -D daisyui
   ```

Components are installed into `src/shared/ui/` following FSD structure.

---

## Responsive Design Notes

### Player Views (mobile-first)
- Default: single column, full-width, touch-friendly (44px min targets)
- `md:` (tablet): 2-column grids for lists, side-by-side stats+tabs for character sheet

### DM Views (tablet-first)
- Default (mobile): tabbed interface, stacked content
- `md:` (tablet): split views where applicable
- `lg:` (desktop): sidebar + main content layout

### Key Patterns
- Use `min-h-dvh` for full-height mobile layouts
- Use `active:` states over `hover:` for mobile
- Bottom-aligned primary actions on mobile

---

## Task Order

1. F1-F4 (Campaign pages — creation, detail, join)
2. F5-F6 (Session lobby)
3. F7-F8 (Active session views — main containers)
4. F9-F10 (Initiative tracker)
5. F11-F12 (Rest mechanics modals)
6. F13-F14 (Private messaging)
7. F15-F16 (DM editor + change log)
8. F17-F19 (Equipment, HP actions, spell slots)
9. F20 (Death saves)

**Total: 20 tasks**
