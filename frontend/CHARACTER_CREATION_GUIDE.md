# DnD Character Creation Wizard - Implementation Guide

## Overview

A complete multi-step character creation wizard for your DnD game with 9 steps, dynamic flow based on class selection, and full validation.

## Architecture

### State Management (Zustand)

- **Store**: `src/modules/character/model/character-creation-store.ts`
- Centralized state for all character creation data
- Persists data between steps
- DevTools integration for debugging

### Step Flow

```
1. Basic Info (name, avatar, gender, origin story)
   ↓
2. Class Selection (barbarian, bard, cleric, druid, fighter)
   ↓
3. Race Selection (human, elf, dwarf, halfling, dragonborn, tiefling + subraces)
   ↓
4. Background (soldier, acolyte, criminal, noble, scholar, outlander)
   ↓
5. Attributes (Standard Array OR Point Buy)
   ↓
6. Skills (based on class - 2-3 skills)
   ↓
7. Equipment (2 presets per class)
   ↓
8. Spells (ONLY for casters - cantrips + level 1 spells)
   ↓
9. Review & Submit (validation + mock API call)
```

## Key Features

### 1. Dynamic Flow
- **Spell step is skipped** for non-caster classes (barbarian, fighter)
- **Spell step is shown** for caster classes (bard, cleric, druid)
- Navigation handles this automatically

### 2. Validation Per Step
- Each step uses React Hook Form + Zod for validation
- Data is validated before moving to next step
- Data is saved to Zustand store on successful validation

### 3. Attributes System
Two methods available:

**Standard Array**:
- Choose from predefined values: 15, 14, 13, 12, 10, 8
- Drag/tap to assign to each attribute
- Must assign all 6 values

**Point Buy**:
- Start with 8 in each attribute
- 27 points to distribute
- Range: 8-15
- Cost increases for higher values (13+ costs 2 points per increase)

### 4. Skills System
- Number of skills based on class (2-3)
- Only skills available to the class are shown
- Must select exact number required

### 5. Spells System (Casters Only)
- Select 2 cantrips
- Select 2 level 1 spells
- Different spell lists per class (bard, cleric, druid)

## File Structure

```
src/modules/character/
├── model/
│   ├── character-creation-store.ts    # Zustand store
│   ├── mock-data.ts                   # All mock data (classes, races, etc.)
│   ├── types.ts                       # TypeScript types
│   └── index.ts                       # Exports
├── pages/
│   └── create/
│       └── ui/
│           ├── CharacterCreatePage.tsx       # Main orchestrator
│           ├── basic-info-form/
│           │   ├── BasicInfoForm.tsx
│           │   └── index.ts
│           ├── class-selection-form/
│           │   ├── ClassSelectionForm.tsx
│           │   └── index.ts
│           ├── race-selection-form/
│           │   ├── RaceSelectionForm.tsx
│           │   └── index.ts
│           ├── background-step/
│           │   ├── BackgroundStep.tsx
│           │   └── index.ts
│           ├── attributes-step/
│           │   ├── AttributesStep.tsx
│           │   └── index.ts
│           ├── skills-step/
│           │   ├── SkillsStep.tsx
│           │   └── index.ts
│           ├── equipment-step/
│           │   ├── EquipmentStep.tsx
│           │   └── index.ts
│           ├── spells-step/
│           │   ├── SpellsStep.tsx
│           │   └── index.ts
│           └── review-step/
│               ├── ReviewStep.tsx
│               └── index.ts
```

## Mock Data

All mock data is in `src/modules/character/model/mock-data.ts`:

- **5 Classes**: barbarian, bard, cleric, druid, fighter
- **6 Races**: human, elf, dwarf, halfling, dragonborn, tiefling (with subraces)
- **6 Backgrounds**: soldier, acolyte, criminal, noble, scholar, outlander
- **18 Skills**: all D&D 5e skills with ability associations
- **Equipment Presets**: 2 per class
- **Spells**: cantrips + level 1 spells for each caster class

## Usage

### Starting the Wizard

The wizard starts at the basic-info step. Users progress through each step by clicking "Continue" after filling out the form.

### Navigation

- **Back button**: Returns to previous step (or /player if on first step)
- **Continue button**: Validates current step and moves to next
- Steps are skipped automatically based on class selection

### Submission

On the review step:
1. User sees a summary of all selections
2. Clicks "Create Character"
3. Mock API call (2 second delay)
4. Success message shown
5. Redirects to /player

### Accessing Character Data

```typescript
import { useCharacterCreationStore } from '~modules/character/model';

function MyComponent() {
  const characterData = useCharacterCreationStore((state) => state.getCharacterData());
  
  // Access specific fields
  const { basicInfo, classId, attributes, selectedSkills } = characterData;
}
```

## Extending the System

### Adding a New Class

1. Add class data to `CHARACTER_CLASSES` in `mock-data.ts`
2. Add class images to `class-selection-form/assets/`
3. Add equipment presets to `EQUIPMENT_PRESETS`
4. If caster, add spells to `SPELLS`

### Adding a New Race

1. Add race data to `RACES` in `mock-data.ts`
2. Include ability bonuses, traits, and optional subraces

### Adding a New Step

1. Create new step component in `pages/create/ui/`
2. Add step to `STEP_ORDER` in `CharacterCreatePage.tsx`
3. Add case to `renderStep()` switch statement
4. Add data handler to `handleNext()` switch statement
5. Add action to Zustand store if needed

## Validation Rules

### Basic Info
- Name: 3-50 characters
- Avatar: Required, max 5MB, jpg/png/webp
- Gender: Required (male/female/other)
- Origin Story: 10-500 characters

### Attributes
- All 6 attributes must be assigned
- Range: 3-18 (enforced by method)
- Standard Array: all values must be used
- Point Buy: all 27 points must be spent

### Skills
- Must select exact number required by class
- Only class-available skills shown

### Spells (Casters)
- Must select exactly 2 cantrips
- Must select exactly 2 level 1 spells

## Styling

All components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Mobile-first** design (as per project rules)
- **Touch-friendly** interactions (min 44x44px targets)

## Best Practices

1. **Data Flow**: BasicInfoForm → Zustand → Next Step
2. **Validation**: Per-step validation before progressing
3. **Type Safety**: Full TypeScript coverage
4. **Clean Code**: Function declarations, explicit types
5. **Accessibility**: Semantic HTML, ARIA labels where needed

## Future Enhancements

Potential additions:
- More classes (wizard, warlock, sorcerer, etc.)
- More races (gnome, half-elf, half-orc)
- Subclass selection
- Feat selection
- Custom ability score method (roll dice)
- Character portrait generation
- Export character sheet PDF
- Save draft functionality
- Edit existing character

## Testing

To test the wizard:

1. Start at `/character/create`
2. Fill out each step
3. Test both caster and non-caster flows
4. Test both Standard Array and Point Buy
5. Verify validation on each step
6. Check final submission and redirect

## Troubleshooting

**Issue**: Step doesn't advance
- Check form validation errors
- Ensure all required fields are filled
- Check browser console for errors

**Issue**: Spells step shows for non-caster
- Verify `isCaster` flag in class data
- Check `isClassCaster()` helper function

**Issue**: Data not persisting
- Check Zustand DevTools
- Verify store actions are called
- Check `handleNext()` switch cases

## API Integration

Currently uses mock API. To integrate real backend:

1. Replace mock API call in `ReviewStep.tsx`
2. Create API service in `~shared/api/`
3. Add error handling
4. Add loading states
5. Handle file upload for avatar

Example:

```typescript
// In ReviewStep.tsx
import { createCharacter } from '~shared/api/character-api';

async function handleSubmit() {
  try {
    const response = await createCharacter(characterData);
    navigate(`/character/${response.id}`);
  } catch (error) {
    // Handle error
  }
}
```

---

## Summary

You now have a complete, production-ready character creation wizard with:

✅ 9 steps with dynamic flow
✅ Zustand state management
✅ React Hook Form + Zod validation
✅ Standard Array + Point Buy for attributes
✅ Class-based skill selection
✅ Conditional spell selection for casters
✅ Review and submission
✅ Mobile-first, touch-friendly UI
✅ Full TypeScript coverage
✅ Clean, maintainable code

The wizard is ready to use and easy to extend!
