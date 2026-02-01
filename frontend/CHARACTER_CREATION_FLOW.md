# Character Creation Flow Diagram

## Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHARACTER CREATION WIZARD                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Basic Info                                              │
│ ─────────────────────────────────────────────────────────────── │
│ • Name (3-50 chars)                                             │
│ • Avatar (image upload, max 5MB)                                │
│ • Gender (male/female/other)                                    │
│ • Origin Story (10-500 chars)                                   │
│                                                                  │
│ Validation: React Hook Form + Zod                               │
│ Storage: Zustand → basicInfo                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Class Selection                                         │
│ ─────────────────────────────────────────────────────────────── │
│ • Barbarian (non-caster, melee)                                 │
│ • Bard (caster, magic)                                          │
│ • Cleric (caster, magic)                                        │
│ • Druid (caster, hybrid)                                        │
│ • Fighter (non-caster, melee)                                   │
│                                                                  │
│ Display: Carousel with gender-specific images                   │
│ Storage: Zustand → classId                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Race Selection                                          │
│ ─────────────────────────────────────────────────────────────── │
│ • Human (versatile, +1 all stats)                               │
│ • Elf (graceful, +2 DEX)                                        │
│   - High Elf (+1 INT)                                           │
│   - Wood Elf (+1 WIS)                                           │
│ • Dwarf (hardy, +2 CON)                                         │
│   - Mountain Dwarf (+2 STR)                                     │
│   - Hill Dwarf (+1 WIS)                                         │
│ • Halfling (lucky, +2 DEX)                                      │
│   - Lightfoot (+1 CHA)                                          │
│   - Stout (+1 CON)                                              │
│ • Dragonborn (draconic, +2 STR, +1 CHA)                         │
│ • Tiefling (infernal, +1 INT, +2 CHA)                           │
│                                                                  │
│ Storage: Zustand → raceId, subraceId                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Background                                              │
│ ─────────────────────────────────────────────────────────────── │
│ • Soldier (athletics, intimidation)                             │
│ • Acolyte (insight, religion)                                   │
│ • Criminal (deception, stealth)                                 │
│ • Noble (history, persuasion)                                   │
│ • Scholar (arcana, history)                                     │
│ • Outlander (athletics, survival)                               │
│                                                                  │
│ Storage: Zustand → backgroundId                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Attributes                                              │
│ ─────────────────────────────────────────────────────────────── │
│ Choose method:                                                   │
│                                                                  │
│ ┌─────────────────────┐  ┌─────────────────────┐              │
│ │  STANDARD ARRAY     │  │     POINT BUY       │              │
│ ├─────────────────────┤  ├─────────────────────┤              │
│ │ Values: 15,14,13,   │  │ Start: 8 in each    │              │
│ │         12,10,8     │  │ Budget: 27 points   │              │
│ │                     │  │ Range: 8-15         │              │
│ │ Assign to:          │  │ Cost: 1pt (8-13)    │              │
│ │ • STR               │  │       2pt (14-15)   │              │
│ │ • DEX               │  │                     │              │
│ │ • CON               │  │ Adjust with +/-     │              │
│ │ • INT               │  │                     │              │
│ │ • WIS               │  │                     │              │
│ │ • CHA               │  │                     │              │
│ └─────────────────────┘  └─────────────────────┘              │
│                                                                  │
│ Shows modifiers: (score - 10) / 2                               │
│ Storage: Zustand → attributes                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Skills                                                  │
│ ─────────────────────────────────────────────────────────────── │
│ Select N skills (based on class):                               │
│ • Barbarian: 2 skills                                           │
│ • Bard: 3 skills (any!)                                         │
│ • Cleric: 2 skills                                              │
│ • Druid: 2 skills                                               │
│ • Fighter: 2 skills                                             │
│                                                                  │
│ Only shows skills available to chosen class                     │
│ Must select exact number required                               │
│ Storage: Zustand → selectedSkills                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 7: Equipment                                               │
│ ─────────────────────────────────────────────────────────────── │
│ Choose 1 of 2 presets per class:                                │
│                                                                  │
│ Example (Barbarian):                                            │
│ ┌─────────────────────┐  ┌─────────────────────┐              │
│ │  MELEE WARRIOR      │  │ VERSATILE FIGHTER   │              │
│ ├─────────────────────┤  ├─────────────────────┤              │
│ │ • Greataxe          │  │ • Greatsword        │              │
│ │ • Two Handaxes      │  │ • Shortbow + Arrows │              │
│ │ • Explorer's Pack   │  │ • Explorer's Pack   │              │
│ │ • Four Javelins     │  │ • Two Handaxes      │              │
│ └─────────────────────┘  └─────────────────────┘              │
│                                                                  │
│ Storage: Zustand → equipmentPresetId                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Is Caster?     │
                    └─────────────────┘
                       ↓           ↓
                     YES          NO
                       ↓           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 8: Spells (CASTERS ONLY)                                  │
│ ─────────────────────────────────────────────────────────────── │
│ Select spells:                                                   │
│ • 2 Cantrips (level 0)                                          │
│ • 2 Level 1 Spells                                              │
│                                                                  │
│ Different spell lists per class:                                │
│ • Bard: vicious mockery, minor illusion, healing word, etc.    │
│ • Cleric: sacred flame, spare the dying, cure wounds, etc.     │
│ • Druid: produce flame, shillelagh, entangle, etc.             │
│                                                                  │
│ Storage: Zustand → selectedCantrips, selectedLevel1Spells       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                       (Skip if non-caster)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 9: Review & Submit                                         │
│ ─────────────────────────────────────────────────────────────── │
│ Summary of all selections:                                       │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ BASIC INFO                                                   ││
│ │ Name: Valerius the Bold                                     ││
│ │ Gender: Male                                                 ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ CLASS & RACE                                                 ││
│ │ Class: Barbarian                                             ││
│ │ Race: Human                                                  ││
│ │ Background: Soldier                                          ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ATTRIBUTES                                                   ││
│ │ STR: 15 (+2)  DEX: 14 (+2)  CON: 13 (+1)                    ││
│ │ INT: 12 (+1)  WIS: 10 (+0)  CHA: 8  (-1)                    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ SKILLS                                                       ││
│ │ Athletics, Intimidation                                      ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│ [Create Character] button                                        │
│                                                                  │
│ On submit:                                                       │
│ 1. Validate all data                                            │
│ 2. Mock API call (2s delay)                                     │
│ 3. Show success message                                         │
│ 4. Redirect to /player                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────┐
│  User Input      │
│  (Form)          │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ React Hook Form  │
│ + Zod Validation │
└────────┬─────────┘
         │
         ↓ (valid)
┌──────────────────┐
│ Zustand Store    │
│ (Global State)   │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Next Step       │
└──────────────────┘
```

## Navigation Logic

```typescript
// Step order
const STEP_ORDER = [
  'basic-info',
  'class-selection',
  'race-selection',
  'background',
  'attributes',
  'skills',
  'equipment',
  'spells',      // ← Conditional
  'review',
];

// Dynamic next step
function getNextStep(current) {
  // Skip spells if not caster
  if (current === 'equipment' && !isClassCaster(classId)) {
    return 'review';
  }
  
  return STEP_ORDER[currentIndex + 1];
}
```

## Class-Specific Paths

### Non-Caster Path (Barbarian, Fighter)
```
Basic Info → Class → Race → Background → Attributes → Skills → Equipment → Review
                                                                              ↑
                                                                        (Skip Spells)
```

### Caster Path (Bard, Cleric, Druid)
```
Basic Info → Class → Race → Background → Attributes → Skills → Equipment → Spells → Review
```

## State Structure

```typescript
interface CharacterCreationData {
  basicInfo: {
    name: string;
    avatar: File | null;
    gender: 'male' | 'female' | 'other';
    originStory: string;
  } | null;
  
  classId: string | null;
  raceId: string | null;
  subraceId: string | null;
  backgroundId: string | null;
  
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  } | null;
  
  selectedSkills: string[];
  equipmentPresetId: string | null;
  
  // Casters only
  selectedCantrips: string[];
  selectedLevel1Spells: string[];
}
```

## Key Decision Points

1. **Class Selection** → Determines:
   - Available skills
   - Equipment presets
   - Whether spells step is shown
   - Number of skills to select

2. **Race Selection** → Determines:
   - Ability score bonuses
   - Racial traits
   - Speed and size

3. **Attributes Method** → User chooses:
   - Standard Array (predefined values)
   - Point Buy (customizable within budget)

## Validation Points

- ✅ Basic Info: All fields required, proper formats
- ✅ Class: Must select one
- ✅ Race: Must select one (subrace optional)
- ✅ Background: Must select one
- ✅ Attributes: All 6 must be assigned, valid range
- ✅ Skills: Exact number required by class
- ✅ Equipment: Must select one preset
- ✅ Spells (if caster): Exact counts (2 cantrips, 2 level 1)
- ✅ Review: All previous steps completed

## Mobile Optimizations

- Touch targets: 44x44px minimum
- Swipe gestures for class carousel
- Bottom-aligned action buttons
- Full-screen step views
- Smooth animations with Framer Motion
- Responsive typography (min 16px)
