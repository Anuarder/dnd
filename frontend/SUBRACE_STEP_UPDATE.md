# Subrace Selection - Separate Step Implementation

## Summary

Updated the character creation wizard to add a **separate step for subrace selection** when the selected race has subraces. This provides a cleaner, more intuitive flow instead of showing subraces on the same page as race selection.

## Changes Made

### 1. New Step Type ✅

Added `'subrace-selection'` to `CharacterCreationStep` type:

```typescript
export type CharacterCreationStep =
  | 'basic-info'
  | 'class-selection'
  | 'race-selection'
  | 'subrace-selection'  // ← NEW
  | 'background'
  | 'attributes'
  | 'skills'
  | 'equipment'
  | 'spells'
  | 'review';
```

### 2. New Component: SubraceSelectionForm ✅

Created a dedicated component for subrace selection:

**Location**: `subrace-selection-form/SubraceSelectionForm.tsx`

**Features**:
- Shows only subraces for the selected race
- List-style UI (consistent with race selection)
- Gradient header styling
- Touch-friendly interactions
- Displays additional traits for each subrace
- Disabled continue button until selection is made

**Props**:
```typescript
interface SubraceSelectionFormProps {
  raceId: string;
  onNext: (data: { subraceId: string }) => void;
}
```

### 3. Updated RaceSelectionForm ✅

**Removed**:
- Subrace selection UI (moved to separate step)
- `selectedSubrace` state
- `handleSubraceSelect` function

**Updated**:
- `onNext` now only accepts `{ raceId: string }` (no subraceId)
- Simplified component logic
- Cleaner, more focused UI

### 4. Dynamic Step Flow ✅

The wizard now **conditionally shows** the subrace step:

**Flow with subraces** (e.g., Elf, Dwarf, Halfling):
```
Race Selection → Subrace Selection → Background → ...
```

**Flow without subraces** (e.g., Human, Dragonborn, Tiefling):
```
Race Selection → Background → ...
      ↓
(Skip subrace step)
```

### 5. Smart Navigation ✅

Updated `getNextStep()` and `getPreviousStep()` functions:

```typescript
function getNextStep(current: CharacterCreationStep): CharacterCreationStep | null {
  // Skip subrace step if race has no subraces
  if (current === 'race-selection' && raceId) {
    const race = getRaceById(raceId);
    if (!race?.subraces || race.subraces.length === 0) {
      return 'background'; // Skip to background
    }
  }
  // ... rest of logic
}

function getPreviousStep(current: CharacterCreationStep): CharacterCreationStep | null {
  // Skip subrace step when going back if race has no subraces
  if (current === 'background' && raceId) {
    const race = getRaceById(raceId);
    if (!race?.subraces || race.subraces.length === 0) {
      return 'race-selection'; // Go back to race selection
    }
  }
  // ... rest of logic
}
```

### 6. Updated Data Handling ✅

Split race and subrace data handling:

**Race Selection**:
```typescript
case 'race-selection':
  if (data && 'raceId' in data) {
    setRace(data.raceId, undefined); // No subrace yet
  }
  break;
```

**Subrace Selection**:
```typescript
case 'subrace-selection':
  if (data && 'subraceId' in data && raceId) {
    setRace(raceId, data.subraceId); // Update with subrace
  }
  break;
```

## User Experience Improvements

### Before (Single Step)

```
┌─────────────────────────────────┐
│  Choose Your Heritage           │
│                                 │
│  [Human]                        │
│  [Elf]       ← Selected         │
│  [Dwarf]                        │
│  [Halfling]                     │
│  [Dragonborn]                   │
│  [Tiefling]                     │
│                                 │
│  Choose Subrace:                │
│  [High Elf]                     │
│  [Wood Elf]                     │
│                                 │
│  [Continue]                     │
└─────────────────────────────────┘
```

**Issues**:
- Long scrolling page
- Mixed concerns (race + subrace)
- Harder to focus on one decision

### After (Separate Steps)

**Step 1: Race Selection**
```
┌─────────────────────────────────┐
│  Choose Your Heritage           │
│                                 │
│  [Human]                        │
│  [Elf]       ← Selected         │
│  [Dwarf]                        │
│  [Halfling]                     │
│  [Dragonborn]                   │
│  [Tiefling]                     │
│                                 │
│  [Continue]                     │
└─────────────────────────────────┘
```

**Step 2: Subrace Selection** (only if race has subraces)
```
┌─────────────────────────────────┐
│  Choose Your Subrace            │
│  Select a subrace for your Elf  │
│                                 │
│  [High Elf]                     │
│  [Wood Elf]                     │
│                                 │
│  [Continue]                     │
└─────────────────────────────────┘
```

**Benefits**:
- ✅ Cleaner, focused UI
- ✅ One decision per step
- ✅ Less scrolling
- ✅ Better mobile experience
- ✅ Clearer progression

## Step Flow Examples

### Example 1: Elf (has subraces)

```
1. Basic Info
2. Class Selection
3. Race Selection → Select "Elf"
4. Subrace Selection → Select "High Elf" or "Wood Elf"
5. Background
6. Attributes
7. Skills
8. Equipment
9. Spells (if caster)
10. Review
```

### Example 2: Human (no subraces)

```
1. Basic Info
2. Class Selection
3. Race Selection → Select "Human"
4. Background (subrace step skipped automatically)
5. Attributes
6. Skills
7. Equipment
8. Spells (if caster)
9. Review
```

## Technical Details

### Type Safety ✅

All types are properly defined with **no `any` types**:

```typescript
function handleNext(
  step: CharacterCreationStep,
  data?:
    | CharacterBasicInfo
    | { classId: string }
    | { raceId: string }
    | { subraceId: string }  // ← Separate type
    | { backgroundId: string }
    | { attributes: Attributes }
    | { selectedSkills: string[] }
    | { equipmentPresetId: string }
    | { selectedCantrips: string[]; selectedLevel1Spells: string[] }
): void
```

### State Management ✅

Race and subrace are stored together in Zustand:

```typescript
// After race selection
setRace(raceId, undefined);

// After subrace selection
setRace(raceId, subraceId);
```

### Conditional Rendering ✅

Subrace step only renders when:
1. User has selected a race
2. The selected race has subraces

```typescript
case 'subrace-selection':
  return raceId ? (
    <SubraceSelectionForm
      raceId={raceId}
      onNext={(data) => handleNext('subrace-selection', data)}
    />
  ) : (
    <div className="px-4 text-white">Please select a race first</div>
  );
```

## Files Created/Modified

### Created:
```
✓ subrace-selection-form/SubraceSelectionForm.tsx (new component)
✓ subrace-selection-form/index.ts (barrel export)
```

### Modified:
```
✓ types.ts (added 'subrace-selection' step)
✓ RaceSelectionForm.tsx (removed subrace UI)
✓ CharacterCreatePage.tsx (added dynamic step logic)
```

## Testing Checklist

- [x] Select race with subraces (Elf) → Subrace step appears
- [x] Select race without subraces (Human) → Subrace step skipped
- [x] Back button from Background → Goes to Subrace (if applicable)
- [x] Back button from Background → Goes to Race (if no subraces)
- [x] Subrace data persists in Zustand store
- [x] Review step shows correct race and subrace
- [x] No linter errors
- [x] No `any` types
- [x] Type-safe throughout

## Benefits

1. **Better UX**: One decision per step, less cognitive load
2. **Cleaner Code**: Separation of concerns
3. **Flexible**: Easy to add more conditional steps
4. **Type-Safe**: Full TypeScript coverage with no `any`
5. **Mobile-Friendly**: Less scrolling, focused UI
6. **Maintainable**: Clear step logic, easy to debug

## Future Enhancements

Potential improvements:
- Add images/icons for subraces
- Show race info summary on subrace step
- Add "Skip" option for optional subraces
- Animate transition between race and subrace steps
- Add progress indicator showing conditional steps

---

## Summary

✅ **Separate subrace step** for cleaner UX
✅ **Dynamic flow** - automatically skips if no subraces
✅ **Smart navigation** - handles back button correctly
✅ **Type-safe** - no `any` types
✅ **Clean code** - separation of concerns
✅ **Mobile-friendly** - focused, scrollable UI
✅ **Production-ready** - no linter errors

The character creation wizard now provides a better user experience with a dedicated step for subrace selection that only appears when needed! 🎯
