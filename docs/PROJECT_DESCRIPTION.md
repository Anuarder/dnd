# D&D Tabletop Companion App

> A mobile-first companion application for Dungeons & Dragons 5th Edition tabletop sessions.
> This app replaces paper character sheets, simplifies session management for Dungeon Masters, and keeps everyone at the table connected through their phones.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Audience](#2-target-audience)
3. [Core Concepts](#3-core-concepts)
4. [User Roles](#4-user-roles)
5. [User Stories & Flows](#5-user-stories--flows)
6. [Feature Breakdown](#6-feature-breakdown)
7. [Game Mechanics Reference](#7-game-mechanics-reference)
8. [Content Scope & Limits](#8-content-scope--limits)
9. [Data Model Overview](#9-data-model-overview)
10. [Technical Architecture](#10-technical-architecture)
11. [Glossary](#11-glossary)

---

## 1. Product Vision

### What This App Is

This is a **physical tabletop companion** - a mobile app used by players sitting together at the same table during a D&D session. It digitizes the bookkeeping parts of D&D (character sheets, HP tracking, spell slots, inventory) so the group can focus on storytelling and role-playing.

### What This App Is NOT

- **Not a virtual tabletop (VTT)** - no maps, grids, or token movement. Maps are drawn on paper or a whiteboard.
- **Not a replacement for dice** - physical dice are rolled at the table. The app does not include dice rolling to preserve the authentic tabletop experience.
- **Not a video/voice chat tool** - players are in the same room.
- **Not a rules engine** - the DM interprets rules. The app provides data, not rulings.

### Core Value Proposition

| Pain Point | How the App Solves It |
|---|---|
| Paper character sheets get messy and lost | Digital character sheets with automatic calculations |
| DM can't easily see all player stats | DM dashboard with live view of all characters |
| Tracking HP/spell slots/conditions is tedious | One-tap updates with change history |
| Secret DM-player communication breaks immersion | In-app private messaging (no whispering across the table) |
| Initiative tracking on paper is slow | Built-in initiative tracker with turn order |
| New players are overwhelmed by character creation | Guided step-by-step character builder |

---

## 2. Target Audience

### Primary Users

- **D&D 5e players** who play in-person sessions and want to replace paper sheets
- **Dungeon Masters** who want better tools to manage sessions and track player data
- **New players** who find character creation and D&D mechanics intimidating

### User Personas

**Artem, 25 - The New Player**
- Just joined a D&D group, never played before
- Finds the Player's Handbook overwhelming
- Wants a simple way to create a character and understand what his stats mean
- During sessions, needs quick access to his abilities and spells

**Dana, 28 - The Experienced DM**
- Runs weekly sessions for a group of 4-5 players
- Tired of tracking initiative on sticky notes
- Wants to see player HP and conditions at a glance during combat
- Needs to send secret messages to players without others noticing

**Max, 23 - The Regular Player**
- Has 3 characters across different campaigns
- Wants to manage inventory and spell slots without erasing holes in paper
- Likes having a clean, readable character sheet on his phone

---

## 3. Core Concepts

### Campaign

A **campaign** is an ongoing D&D story run by a Dungeon Master. It contains:
- A title, description, and optional banner image
- A roster of players (each with one character assigned to this campaign)
- Session history and DM notes
- Status: **active** or **archived**

A DM can run multiple campaigns. A player can be in multiple campaigns with different characters.

### Session (Lobby)

A **session** is a single play meeting within a campaign. When the DM starts a session:
- Players see the session is live and can join the lobby
- The DM manages the session flow (exploration, combat, rest, etc.)
- All changes to characters during the session are tracked with history
- When the session ends, the state is saved

### Character

A **character** is a player's D&D persona. It includes:
- Identity (name, race, class, background, level)
- Ability scores (STR, DEX, CON, INT, WIS, CHA)
- Combat stats (HP, AC, initiative modifier, speed)
- Skills and saving throws
- Spells and spell slots (for casters)
- Equipment and inventory
- Features and traits
- Status: **active** or **archived**

Characters exist independently of campaigns. A player creates characters in their personal space and then assigns one to a campaign when joining.

---

## 4. User Roles

### Dungeon Master (DM / Master)

The DM is the narrator and referee. In the app, the DM can:
- Create and manage campaigns
- Invite players via code + password
- View all player character sheets in read mode
- Override/adjust player stats when needed (e.g., apply damage from a trap)
- Manage combat initiative order
- Send private messages to individual players
- Write session notes visible only to themselves
- Start and end sessions
- Apply short rest / long rest mechanics to all players
- Track NPCs and encounter data (DM notes)

### Player

A player controls one or more characters. In the app, a player can:
- Create characters through a guided wizard
- Manage their character sheet (HP, spell slots, inventory, etc.)
- Join campaigns via invite code + password
- See campaign information (description, other party members)
- Receive private messages from the DM
- View initiative order during combat
- See their own change history

---

## 5. User Stories & Flows

### 5.1 Onboarding Flow

```
App Install → Welcome Screen → Role Introduction (What is a DM? What is a Player?)
→ Sign In with Google → Choose Primary Role (Master / Player) → Main Page
```

**User Stories:**
- As a new user, I want to understand the difference between DM and Player roles so I can choose the right one.
- As a new user, I want to sign in with Google so I don't need to create a new account.
- As a user, I want to be able to switch between DM and Player views so I can play both roles in different campaigns.

### 5.2 Character Creation Flow (Player)

```
Player Main Page → "Create Character" → Step 1: Basic Info → Step 2: Class
→ Step 3: Race → Step 4: Subrace (conditional) → Step 5: Background
→ Step 6: Ability Scores → Step 7: Skills → Step 8: Equipment
→ Step 9: Spells (conditional, casters only) → Step 10: Review & Confirm
→ Character saved → Redirect to Player Main Page
```

**User Stories:**
- As a player, I want to be guided through character creation step by step so I don't miss anything.
- As a player, I want ability scores to be generated randomly (4d6 drop lowest) so it follows D&D 5e rules.
- As a player, I want the spell selection step to only appear if my class can cast spells.
- As a player, I want to see a complete review of my character before confirming.

**Ability Score Generation (Standard D&D 5e):**
The app should support the "4d6 drop lowest" method:
- Roll 4 six-sided dice, drop the lowest result, sum the remaining 3
- Repeat 6 times to get 6 scores
- Player assigns each score to an ability (STR, DEX, CON, INT, WIS, CHA)
- Racial bonuses are applied automatically based on chosen race

### 5.3 Character Management Flow (Player)

```
Player Main Page → Character List (Active) → Tap Character
→ Character Details Page (tabs: Skills, Combat, Spells, Equipment)
→ Edit any field → Changes saved with history entry
```

**User Stories:**
- As a player, I want to quickly see my character's key stats (HP, AC, level) from the main page.
- As a player, I want to update my HP with a single tap (quick +/- buttons) during combat.
- As a player, I want to track which spell slots I've used so I know what I have left.
- As a player, I want to manage my inventory (add/remove items, track gold/silver/copper).
- As a player, I want to see a history of changes to my character (who changed what and when).
- As a player, I want to archive old characters I no longer play.

### 5.4 Campaign Creation Flow (DM)

```
Master Main Page → "Create Campaign" → Enter name, description, banner image
→ Campaign created → Campaign Detail Page → Invite players
```

**User Stories:**
- As a DM, I want to create a campaign with a name and description so players know what it's about.
- As a DM, I want to upload a banner image to give the campaign visual identity.
- As a DM, I want to see all my campaigns (active and archived) on my main page.
- As a DM, I want to archive completed campaigns to keep my list clean.

### 5.5 Player Joining a Campaign

```
Player receives invite code + password from DM (verbally or via messenger)
→ Player opens app → "Join Campaign" → Enter code + password
→ Select which character to use → Joined! → Campaign appears in player's list
```

**User Stories:**
- As a DM, I want to generate an invite code and password for my campaign so only invited players can join.
- As a DM, I want to regenerate the invite code if it gets shared with unwanted people.
- As a player, I want to join a campaign by entering a code and password.
- As a player, I want to choose which of my characters to bring into the campaign.
- As a DM, I want to see a list of players who joined and approve/remove them.

### 5.6 Session Flow (DM)

```
Campaign Detail Page → "Start Session" → Lobby becomes active
→ Players see session is live → Players confirm "Ready"
→ DM sees all players ready → DM begins session
→ [Session in progress - exploration, combat, rest, etc.]
→ DM ends session → Session summary saved
```

**User Stories:**
- As a DM, I want to start a session so players know we're playing.
- As a DM, I want to see which players are ready before starting.
- As a DM, I want to view all player character sheets during the session.
- As a DM, I want to write notes during the session that only I can see.
- As a DM, I want to end the session and have all changes saved.

### 5.7 Combat Flow

```
DM initiates combat → Initiative phase:
  → Each player enters their initiative roll result (rolled physically)
  → DM enters initiative for NPCs/monsters
→ Initiative order displayed for everyone
→ DM advances turns (Next Turn button)
→ Current turn highlighted for all players
→ Players/DM update HP, conditions, spell slots as needed
→ DM ends combat → Return to exploration mode
```

**User Stories:**
- As a DM, I want to start a combat encounter and collect initiative values.
- As a player, I want to enter my initiative roll so the app tracks turn order.
- As a DM, I want to add NPCs/monsters to the initiative order.
- As a DM, I want to advance turns so everyone knows whose turn it is.
- As a player, I want to see the full turn order and know when it's my turn.
- As a DM, I want to adjust initiative order if needed (surprise rounds, held actions).
- As a DM, I want to remove defeated enemies from the initiative tracker.
- As a DM, I want to end combat and clear the initiative tracker.

### 5.8 Rest Mechanics

```
DM triggers Short Rest or Long Rest for the party:

Short Rest:
  → Players can spend Hit Dice to regain HP
  → Certain class features reset (per D&D 5e rules)
  → Spell slots do NOT reset (except Warlock)

Long Rest:
  → All HP restored to max
  → Spent Hit Dice restored (up to half of total, minimum 1)
  → All spell slots restored
  → Certain conditions/exhaustion may be removed
  → DM confirms rest completion
```

**User Stories:**
- As a DM, I want to trigger a short rest for the whole party.
- As a player, I want to spend Hit Dice during a short rest to regain HP.
- As a DM, I want to trigger a long rest that restores player HP and spell slots.
- As a player, I want to see what resources are restored after each rest type.

### 5.9 Private Messaging (DM ↔ Player)

```
DM selects a player → Opens private chat → Sends message
→ Player sees notification/indicator → Opens chat → Reads message → Can reply
→ Only DM and that specific player can see the conversation
```

**User Stories:**
- As a DM, I want to send a private message to a specific player without others seeing it.
- As a player, I want to see when the DM has sent me a private message.
- As a player, I want to reply to the DM privately.
- As a DM, I want to have separate private conversations with each player.

**Implementation note:** Messages are fetched via polling (not real-time WebSocket). The app periodically checks for new messages. This is sufficient for a tabletop companion where a few seconds of delay is acceptable.

### 5.10 Change History / Activity Log

```
Any character stat change → Log entry created:
  → Who made the change (player or DM)
  → What was changed (e.g., "HP: 25 → 18")
  → When it was changed (timestamp)
  → Session context (which session, if during active session)
```

**User Stories:**
- As a player, I want to see a log of changes to my character so I can track what happened.
- As a DM, I want to see who changed what and when, in case of disputes or mistakes.
- As a DM, I want to undo a change if it was made by mistake.

---

## 6. Feature Breakdown

### Phase 1 - Core (MVP)

| # | Feature | Description | Priority |
|---|---|---|---|
| 1 | Authentication | Google OAuth via Supabase | Done |
| 2 | Onboarding | Role selection flow (DM / Player) | Done |
| 3 | Character Creation | 10-step guided wizard | Done (UI) |
| 4 | Character Sheet | View/edit character details with tabs | Done (UI, mock data) |
| 5 | Character CRUD API | Create, read, update, delete characters via Supabase | Partial (backend exists) |
| 6 | Player Main Page | List of active characters, last campaign | Done (UI, mock data) |
| 7 | Campaign CRUD | DM creates/edits/archives campaigns | Not started |
| 8 | Master Main Page | List of active/archived campaigns | Done (UI, mock data) |
| 9 | Campaign Join | Player joins via code + password, selects character | Not started |
| 10 | Session Management | DM starts/ends session, player readiness | Not started |

### Phase 2 - Session Experience

| # | Feature | Description | Priority |
|---|---|---|---|
| 11 | DM Character Viewer | DM views all player sheets in session | Not started |
| 12 | HP Quick Actions | +/- buttons for fast HP adjustment | Not started |
| 13 | Spell Slot Tracker | Mark slots as used/available per level | Not started |
| 14 | Initiative Tracker | Combat turn order with DM controls | Not started |
| 15 | Short Rest | Spend Hit Dice, reset short-rest features | Not started |
| 16 | Long Rest | Restore HP, spell slots, Hit Dice | Not started |
| 17 | DM Notes | Per-session and per-campaign private notes | Not started |
| 18 | Change History | Log all character changes with who/what/when | Not started |

### Phase 3 - Communication & Polish

| # | Feature | Description | Priority |
|---|---|---|---|
| 19 | Private Messages | DM ↔ Player messaging with polling | Not started |
| 20 | Character Level Up | Guided level-up flow (HP increase, new features, spell slots) | Not started |
| 21 | Conditions Tracker | Apply/remove D&D conditions (poisoned, stunned, etc.) | Not started |
| 22 | Equipment Management | Full inventory with weight tracking | Not started |
| 23 | Money Management | Gold/silver/copper tracking with party sharing | Not started |
| 24 | Multiclass Support | Add second class during level up | Not started |
| 25 | Character Export/Share | Export character sheet as image or PDF | Not started |

### Phase 4 - Future Enhancements

| # | Feature | Description |
|---|---|---|
| 26 | Real-time messaging | Upgrade polling to Supabase Realtime |
| 27 | Push notifications | Notify players when session starts or DM messages |
| 28 | Campaign journal | Shared session notes/recap visible to players |
| 29 | NPC tracker | DM tool for tracking NPCs, monsters, encounters |
| 30 | Homebrew content | Custom races, classes, spells, items |
| 31 | PWA / offline mode | Install as mobile app, work offline with sync |

---

## 7. Game Mechanics Reference

This section documents the D&D 5e mechanics the app needs to support. The app does **not enforce rules** - it provides tools for tracking. The DM always has final authority.

### 7.1 Ability Scores

Six abilities define a character:

| Ability | Abbr | Used For |
|---|---|---|
| Strength | STR | Melee attacks, carrying capacity, athletics |
| Dexterity | DEX | Ranged attacks, AC, initiative, stealth |
| Constitution | CON | Hit points, concentration saves |
| Intelligence | INT | Arcana, history, investigation |
| Wisdom | WIS | Perception, insight, medicine |
| Charisma | CHA | Persuasion, deception, performance |

**Modifier formula:** `modifier = floor((score - 10) / 2)`

| Score | Modifier |
|---|---|
| 1 | -5 |
| 8-9 | -1 |
| 10-11 | 0 |
| 12-13 | +1 |
| 14-15 | +2 |
| 16-17 | +3 |
| 18-19 | +4 |
| 20 | +5 |

### 7.2 Skills

18 skills, each tied to an ability:

- **STR:** Athletics
- **DEX:** Acrobatics, Sleight of Hand, Stealth
- **INT:** Arcana, History, Investigation, Nature, Religion
- **CON:** _(none)_
- **WIS:** Animal Handling, Insight, Medicine, Perception, Survival
- **CHA:** Deception, Intimidation, Performance, Persuasion

**Skill check = d20 + ability modifier + proficiency bonus (if proficient)**

### 7.3 Proficiency Bonus

Based on character level:

| Level | Bonus |
|---|---|
| 1-4 | +2 |
| 5-8 | +3 |
| 9-12 | +4 |
| 13-16 | +5 |
| 17-20 | +6 |

### 7.4 Hit Points

- **Max HP** = base (from class Hit Die at level 1) + CON modifier per level + additional from later levels
- **Current HP** can be reduced by damage and restored by healing/rests
- **Temporary HP** = extra buffer that doesn't stack, taken before real HP
- When HP reaches 0: character falls unconscious and makes death saving throws

### 7.5 Armor Class (AC)

Base AC depends on armor type:
- **No armor:** 10 + DEX modifier
- **Light armor:** armor base + DEX modifier
- **Medium armor:** armor base + DEX modifier (max +2)
- **Heavy armor:** armor base (no DEX)
- **Shield:** +2 to AC

### 7.6 Combat

**Initiative:** d20 + DEX modifier (entered manually since dice are physical)

**Turn order:** Highest initiative goes first, descending order.

**Actions per turn:** Action, Bonus Action, Movement, Reaction (between turns). The app tracks whose turn it is, not what actions they take.

### 7.7 Spell Slots

Caster classes have spell slots per level:
- Slots are **expended** when casting a spell of that level
- Slots are **restored** on a long rest (exception: Warlock restores on short rest)
- **Cantrips** are at-will (unlimited use)

The app tracks: total slots per level, used slots per level, prepared spells list.

### 7.8 Rest Mechanics

**Short Rest (1+ hours in-game):**
- Player can spend Hit Dice to heal: roll Hit Die + CON modifier per die spent
- Some class features reset (e.g., Fighter's Action Surge, Warlock spell slots)
- Spell slots do NOT reset (except Warlock)

**Long Rest (8+ hours in-game):**
- All HP restored to maximum
- Regain spent Hit Dice: up to half total Hit Dice (minimum 1)
- All spell slots restored
- Some conditions removed, exhaustion reduced by 1

### 7.9 Conditions

The app should track these D&D conditions on characters:

| Condition | Effect Summary |
|---|---|
| Blinded | Can't see, auto-fail sight checks |
| Charmed | Can't attack the charmer |
| Deafened | Can't hear, auto-fail hearing checks |
| Frightened | Disadvantage while source is in sight |
| Grappled | Speed becomes 0 |
| Incapacitated | Can't take actions or reactions |
| Invisible | Heavily obscured for hiding |
| Paralyzed | Incapacitated, auto-fail STR/DEX saves |
| Petrified | Turned to stone, incapacitated |
| Poisoned | Disadvantage on attacks and ability checks |
| Prone | Disadvantage on attacks, must use movement to stand |
| Restrained | Speed 0, disadvantage on DEX saves |
| Stunned | Incapacitated, auto-fail STR/DEX saves |
| Unconscious | Incapacitated, drop everything, prone |
| Exhaustion | 6 levels with escalating penalties |

### 7.10 Carrying Capacity

- **Carrying capacity** = STR score x 15 (in pounds)
- **Size multiplier:** Large x2, Huge x4, Gargantuan x8
- **Push/Drag/Lift** = carrying capacity x2

### 7.11 Death Saving Throws

When a character drops to 0 HP:
- Each turn: roll d20 (entered manually)
- 10+ = success, 9 or below = failure
- 3 successes = stabilize (unconscious but alive)
- 3 failures = character dies
- Natural 20 = regain 1 HP and consciousness
- Natural 1 = counts as 2 failures

The app tracks success/failure count. The DM resets this when the character stabilizes or heals.

### 7.12 Level Up

When a character levels up, the following changes:
- Hit Points increase (roll Hit Die or take average + CON modifier)
- Proficiency bonus may increase (at levels 5, 9, 13, 17)
- New class features unlocked
- Spellcasters may gain new spell slots and known spells
- Ability Score Improvement at levels 4, 8, 12, 16, 19 (+2 to one ability or +1 to two)

---

## 8. Content Scope & Limits

> **Key principle:** This app is a **tracking tool**, not a rules engine. Players and DMs type in what they have. The app stores it and shows it cleanly. Don't build a comprehensive item/spell database with mechanical effects — that's D&D Beyond's job.

### 8.1 Classes (12 total — full PHB set, all in SRD)

| Class | Hit Die | Spellcaster? |
|---|---|---|
| Barbarian | d12 | No |
| Bard | d8 | Full |
| Cleric | d8 | Full |
| Druid | d8 | Full |
| Fighter | d10 | No (until subclass) |
| Monk | d8 | No |
| Paladin | d10 | Half |
| Ranger | d10 | Half |
| Rogue | d8 | No |
| Sorcerer | d6 | Full |
| Warlock | d8 | Pact (special) |
| Wizard | d6 | Full |

**Subclasses:** 1 subclass per class for MVP (SRD defaults: Champion Fighter, Life Cleric, Thief Rogue, etc.). More can be added later.

### 8.2 Races (9 core)

| Race | Subraces |
|---|---|
| Human | — |
| Elf | High Elf, Wood Elf |
| Dwarf | Hill Dwarf, Mountain Dwarf |
| Halfling | Lightfoot, Stout |
| Half-Elf | — |
| Half-Orc | — |
| Gnome | Rock Gnome |
| Dragonborn | — |
| Tiefling | — |

No expansion races (Aasimar, Goliath, etc.) — 9 races with subraces is enough for MVP.

### 8.3 Backgrounds (13 core)

Acolyte, Charlatan, Criminal, Entertainer, Folk Hero, Guild Artisan, Hermit, Noble, Outlander, Sage, Sailor, Soldier, Urchin.

Each background provides: 2 skill proficiencies, tool proficiencies, and a feature name. **For MVP, only skill proficiencies and a description are needed.** Background features are not implemented as mechanics.

### 8.4 Spells

Limited to **SRD spells only** (~300 spells). Stored as reference data: name, level, school, casting time, range, description. The app does not enforce spell effects — players just reference them.

**For MVP:** Cantrips + spells up to level 5. Most campaigns never reach high-level play.

### 8.5 Equipment Management

Equipment packs (e.g., "Explorer's Pack") are used **only during character creation** as a one-time bulk add. During gameplay, equipment is a **simple free-text list** managed through 3 flows:

#### Player Self-Manages (most common)
Player opens inventory → "Add Item" → types item name + optional weight/quantity. Player can remove or adjust quantity of any item.

#### DM Gives Item to Player
DM opens player's character → Equipment tab → "Add Item" → enters item details → item appears in player's inventory. Logged in ChangeLog.

#### DM Removes Item from Player
DM opens player's character → Equipment tab → selects item → "Remove" → item removed. Logged in ChangeLog.

**Items are free-text, not a database lookup.** No item database with stats/effects is needed. An item is simply:
- Name (string, typed by player or DM)
- Quantity (number, default 1)
- Weight (optional, in lbs)
- Description (optional notes)
- Equipped (optional boolean: is it currently worn/held)

**Money** (gold, silver, copper) has simple +/- controls. DM can also adjust a player's money.

### 8.6 Images & Visual Assets

| Content | Image Approach | Notes |
|---|---|---|
| Classes | Illustrated character art (male + female per class) | 24 images total, webp format |
| Races | Placeholder for now, images added later | Optional field |
| Backgrounds | Lucide-react icons | No illustrations needed |
| Spells | None | Text-only list |
| Equipment/Items | None | Text-only list |

---

## 9. Data Model Overview

### Entities and Relationships

```
User (1) ────── (*) Character
  │                    │
  │                    │ (assigned to)
  │                    ▼
  │              CampaignPlayer (*) ──── (1) Campaign
  │                                           │
  │                                           │ (owned by)
  └───────────────────────────────────────────┘
                                              │
                                         (*) Session
                                              │
                                         (*) Message
                                              │
                                         (*) ChangeLog
```

### User
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key (from Supabase Auth) |
| email | string | Google account email |
| display_name | string | User's display name |
| avatar_url | string? | Google profile picture |
| preferred_role | enum | 'master' \| 'player' |
| created_at | timestamp | Account creation date |

### Character
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Owner (FK → User) |
| name | string | Character name |
| level | number | Current level (1-20) |
| class | string | Primary class |
| race | string | Race |
| subrace | string? | Subrace (if applicable) |
| background | string | Background |
| gender | enum | 'male' \| 'female' \| 'other' |
| origin_story | string? | Character backstory |
| stats | JSON | { str, dex, con, int, wis, cha } |
| hp | number | Current hit points |
| max_hp | number | Maximum hit points |
| temp_hp | number | Temporary hit points |
| ac | number | Armor class |
| initiative_mod | number | Initiative modifier |
| speed | number | Movement speed (ft) |
| proficiency_bonus | number | Based on level |
| skills | JSON | Proficient skills list |
| saving_throws | JSON | Proficient saving throws |
| spells | JSON | Known/prepared spells |
| spell_slots | JSON | { level: { total, used } } |
| equipment | JSON | Items list |
| money | JSON | { gold, silver, copper } |
| features | JSON | Class/race features |
| conditions | string[] | Active conditions |
| death_saves | JSON | { successes, failures } |
| hit_dice | JSON | { total, used, die_type } |
| image_url | string? | Character portrait |
| status | enum | 'active' \| 'archive' |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last modified |

### Campaign
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| master_id | UUID | DM who owns this (FK → User) |
| name | string | Campaign name |
| description | string? | Campaign description |
| image_url | string? | Banner image |
| invite_code | string | 6-char alphanumeric code |
| invite_password | string | Password to join (hashed) |
| max_players | number | Maximum players (2-10) |
| status | enum | 'active' \| 'archive' |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last modified |

### CampaignPlayer
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| campaign_id | UUID | FK → Campaign |
| user_id | UUID | FK → User |
| character_id | UUID | FK → Character |
| is_ready | boolean | Player ready status |
| joined_at | timestamp | When player joined |

### Session
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| campaign_id | UUID | FK → Campaign |
| status | enum | 'active' \| 'completed' |
| started_at | timestamp | Session start |
| ended_at | timestamp? | Session end |
| dm_notes | text? | Private DM notes |
| combat_active | boolean | Is combat in progress |
| initiative_order | JSON? | Ordered list of combatants |
| current_turn_index | number? | Whose turn it is |
| round_number | number? | Current combat round |

### Message
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| session_id | UUID | FK → Session |
| sender_id | UUID | FK → User (DM or Player) |
| recipient_id | UUID | FK → User (DM or Player) |
| content | text | Message text |
| is_read | boolean | Read status |
| created_at | timestamp | Sent timestamp |

### ChangeLog
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| character_id | UUID | FK → Character |
| session_id | UUID? | FK → Session (null if outside session) |
| changed_by | UUID | FK → User |
| field_name | string | What was changed (e.g., 'hp') |
| old_value | string | Previous value |
| new_value | string | New value |
| change_type | enum | 'player_edit' \| 'dm_override' \| 'rest' \| 'combat' |
| created_at | timestamp | When the change happened |

---

## 10. Technical Architecture

### Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix UI primitives) + daisyUI (Tailwind plugin) |
| State (client) | Zustand |
| State (server) | TanStack Query (React Query) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Auth, Database, Edge Functions, Storage) |
| Database | PostgreSQL (via Supabase) |
| Auth | Google OAuth (Supabase Auth) |
| i18n | i18next (Russian + English) |
| Messaging | Polling-based (upgrade to Supabase Realtime later) |

### Frontend Architecture (Feature-Sliced Design)

```
frontend/src/
├── app/              # App shell, routing, providers, i18n
├── entities/         # Business entities (auth, character, campaign)
│   ├── auth/         # Auth session, user data
│   ├── character/    # Character types, base queries
│   └── campaign/     # Campaign types, base queries
├── modules/          # Feature modules
│   ├── auth/         # Sign-in page
│   ├── onboarding/   # Onboarding flow
│   ├── character/    # Character creation, details, management
│   ├── player/       # Player main page, archive, campaign join
│   └── master/       # DM main page, campaign management, lobby, session
├── pages/            # Top-level page compositions
└── shared/           # Shared code
    ├── ui/           # Reusable UI components
    ├── api/          # API client
    ├── lib/          # Utilities, Supabase client
    ├── config/       # App configuration
    └── types/        # Shared TypeScript types
```

### Backend Architecture (Supabase)

```
Supabase Project
├── Auth              # Google OAuth, JWT tokens
├── Database          # PostgreSQL tables (see Data Model)
├── Edge Functions    # Serverless API endpoints
│   ├── character/    # Character CRUD
│   ├── campaign/     # Campaign CRUD (planned)
│   ├── session/      # Session management (planned)
│   └── message/      # Private messaging (planned)
├── Storage           # Image uploads (avatars, banners)
└── RLS Policies      # Row-Level Security for data access
```

### Key Architectural Decisions

1. **No dice in app** - Physical dice preserve the tabletop experience. Initiative values are entered manually.

2. **Polling for messages** - Simple HTTP polling for private messages. Supabase Realtime can be added later without changing the data model.

3. **DM override with history** - The DM can modify player character data, but all changes are logged in the ChangeLog table with who made the change. This provides accountability without restricting the DM.

4. **Characters independent of campaigns** - Characters are owned by users and can be assigned to campaigns. This allows reusing characters or having unassigned characters.

5. **Session as a state container** - The Session entity tracks combat state (initiative order, current turn, round number). This is ephemeral during combat and saved when combat ends.

6. **Mobile-first, single-column layout** - The app is designed for phones held at the table. No desktop layout needed.

---

## 11. Glossary

| Term | Definition |
|---|---|
| **AC** | Armor Class - how hard a character is to hit |
| **Campaign** | An ongoing D&D story with a DM and players |
| **Cantrip** | A spell that can be cast at will (no spell slot cost) |
| **CON** | Constitution - affects HP and endurance |
| **Condition** | A status effect (e.g., poisoned, stunned) |
| **d20** | A 20-sided die (the primary die in D&D) |
| **DEX** | Dexterity - affects AC, initiative, and ranged attacks |
| **DM** | Dungeon Master - the narrator and referee of the game |
| **Edge Function** | A serverless function running on Supabase |
| **FSD** | Feature-Sliced Design - frontend architecture pattern |
| **Hit Dice** | Dice used to regain HP during short rests |
| **HP** | Hit Points - a character's health |
| **Initiative** | Determines turn order in combat |
| **INT** | Intelligence - affects knowledge and magic for some classes |
| **Lobby** | The waiting room before a session starts |
| **Long Rest** | 8-hour rest that restores all HP and spell slots |
| **NPC** | Non-Player Character - controlled by the DM |
| **Proficiency** | A bonus added to trained skills and saves |
| **RLS** | Row-Level Security - Supabase's data access control |
| **Session** | A single play meeting within a campaign |
| **Short Rest** | 1-hour rest where players can spend Hit Dice to heal |
| **Spell Slot** | A resource expended to cast a spell |
| **STR** | Strength - affects melee attacks and carrying |
| **WIS** | Wisdom - affects perception and some magic |
| **CHA** | Charisma - affects social interactions and some magic |
