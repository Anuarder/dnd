# DND Project - Claude AI Coding Rules

> This document contains comprehensive coding standards and conventions for the D&D project.
> When working on this project, always follow these rules to maintain consistency.

---

## 🌍 Language & Communication

- **Always respond in English**
- All code comments must be in English
- All variable names, function names, and identifiers must be in English
- Documentation and commit messages must be in English

---

## 📚 Documentation & Library References

- When you need information about libraries, frameworks, or APIs, **look up official documentation**
- **Do NOT guess** API signatures or make assumptions about library behavior
- Always fetch up-to-date official documentation when uncertain
- Common libraries in this project:
  - **Frontend**: React, TanStack Query (React Query), Zustand, axios, Vite, TypeScript
  - **Backend**: Fastify, Drizzle ORM / Prisma, Node.js, TypeScript

---

## 📁 File Naming Conventions

### Frontend Files (`frontend/`)

- **React components**: `PascalCase`
  - Examples: `AuthPasswordField.tsx`, `SignUpForm.tsx`, `UserProfile.tsx`
- **TypeScript/JavaScript files**: `kebab-case`
  - Examples: `use-input-error-tooltip.ts`, `auth-service.ts`, `validation-helpers.ts`
- **Folders**: `kebab-case`
  - Examples: `auth-app/`, `shared/ui/`, `password-reset/`
- These conventions are enforced by ESLint

### Backend Files (`backend/src/`)

- **TypeScript files**: `kebab-case`
  - Examples: `user-repository.ts`, `auth-service.ts`, `db-plugin.ts`
- **Folders**: `kebab-case`
  - Examples: `src/routes/`, `src/plugins/`, `src/services/`
- One primary export per file when possible
- Group related functionality in folders

### Public/Assets (`public/`)

- **Asset files**: `kebab-case`
  - Examples: `main-logo.svg`, `hero-image.jpg`, `user-avatar.png`
- **Folders**: `kebab-case`
  - Examples: `public/images/`, `public/assets/`

---

# 🎨 Frontend-Specific Rules

## Code Formatting (Prettier)

- Use single quotes (`'`) not double quotes (`"`)
- Semicolons are required at the end of statements
- Maximum line length: 100 characters
- Trailing commas: ES5 style (in objects, arrays)
- Bracket spacing: enabled `{ foo: bar }`

## Styling Standards

**ALWAYS use Tailwind CSS for styling** - do not write custom CSS unless absolutely necessary.

### Mobile-First Design Philosophy

**CRITICAL**: This project is **mobile-only** - all UX must be optimized for mobile devices first and foremost.

#### Mobile-First UX Principles

- ✅ **Design for touch interactions**
  - Minimum touch target size: 44x44px (use `min-h-11 min-w-11` or larger)
  - Add adequate spacing between interactive elements (minimum 8px gap)
  - Use `active:` states instead of `hover:` for primary feedback
  - Avoid hover-only interactions - they don't work on mobile

- ✅ **Optimize for thumb reach**
  - Place primary actions at the bottom of the screen
  - Keep important navigation within easy thumb reach
  - Use bottom navigation bars instead of top-only navigation

- ✅ **Use mobile-friendly patterns**
  - Bottom sheets and slide-up panels instead of modals
  - Swipe gestures for common actions
  - Pull-to-refresh for content updates
  - Full-screen experiences instead of cramped layouts

- ✅ **Responsive sizing**
  - Use `dvh` (dynamic viewport height) instead of `vh` to account for mobile browser chrome
  - Use relative units (`rem`, `em`) for scalability
  - Test on various mobile screen sizes (320px to 428px width)

- ✅ **Performance on mobile**
  - Minimize animations - mobile devices have less power
  - Use `will-change` sparingly
  - Optimize images for mobile bandwidth
  - Lazy load content below the fold

- ✅ **Typography for mobile**
  - Minimum body text size: 16px (prevents zoom on iOS)
  - Adequate line height for readability (1.5-1.6)
  - Shorter line lengths (45-75 characters)

- ❌ **Avoid desktop patterns**
  - No hover-dependent interactions
  - No small click targets (< 44px)
  - No complex multi-column layouts
  - No desktop-only navigation patterns

#### Tailwind Mobile-First Classes

```tsx
// ✅ Correct: Mobile-first with touch-friendly sizing
<button className="min-h-11 w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white active:scale-95 active:bg-primary/90">
  Tap Me
</button>

// ✅ Correct: Use dvh for full-height mobile layouts
<div className="min-h-dvh">Content</div>

// ✅ Correct: Bottom-aligned primary actions
<div className="fixed bottom-0 left-0 right-0 p-4">
  <button className="w-full">Primary Action</button>
</div>

// ❌ Wrong: Hover-only feedback (doesn't work on mobile)
<button className="hover:bg-blue-700">Click</button>

// ❌ Wrong: Small touch targets
<button className="h-6 w-6">×</button>
```

### Tailwind CSS Usage

- ✅ **Use Tailwind CSS** for all styling in:
  - React components
  - All user-facing interfaces

### When to Write Custom CSS

Custom CSS should be avoided in favor of Tailwind utility classes. Only write custom CSS when:
- Creating complex animations that Tailwind doesn't support (very rare)
- Dealing with third-party components that require custom styling
- Implementing browser-specific fixes that can't be done with Tailwind

### Best Practices

```tsx
// ✅ Correct: Use Tailwind utilities
function Card() {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900">Title</h2>
      <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
        Click me
      </button>
    </div>
  );
}

// ❌ Wrong: Custom CSS with styled-components or CSS modules
```

### Key Points

- Tailwind provides utility classes for almost everything: layout, spacing, colors, typography, shadows, borders, transitions
- **Mobile-first**: Design for mobile screens first, then enhance for larger screens if needed
- Use Tailwind's state variants (`active:`, `focus:`, `disabled:`) for interactive states - prioritize `active:` over `hover:` for mobile
- Use `dvh` (dynamic viewport height) for full-height mobile layouts
- Ensure touch targets are minimum 44x44px (`min-h-11 min-w-11`)
- Leverage Tailwind's color palette and spacing scale for consistency
- Use `@apply` directive in CSS only when absolutely necessary (prefer inline utilities)

## Import Order

Always organize imports in this exact order:

```typescript
// 1. React and third-party modules (node_modules)
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. @shared alias imports
import { useApi } from '@shared/hooks';
import { UiButton } from '@shared/ui';

// 3. @ alias imports (app-specific)
import { AuthService } from '@/services';

// 4. Relative imports
import { validateEmail } from './validators';
import type { User } from '../types';
```

## Module Exports (Barrel Files)

**NEVER use `export *` syntax in barrel files (index.ts)**. Always use explicit named exports.

✅ Correct:

```typescript
// index.ts
export { useCampaignsQuery, useCreateCampaignMutation } from './model';
export type { Campaign, CreateCampaignInput } from './types';
```

❌ Wrong:

```typescript
// index.ts
export * from './model';
export * from './types';
```

**Reasons:**
- Explicit exports make it clear what's being exported from a module
- Prevents accidental exports of internal implementation details
- Improves IDE autocomplete and refactoring
- Makes it easier to track where exports are used
- Avoids naming conflicts between modules

## Function Declarations

- **Prefer function declarations** over arrow function expressions for named functions
- ✅ Correct: `function calculateTotal() { }`
- ❌ Avoid: `const calculateTotal = () => { }`
- Arrow functions are acceptable for:
  - Callbacks (e.g., `array.map(() => {})`)
  - Array methods (e.g., `filter`, `reduce`)
  - Inline/anonymous functions
  - Event handlers in JSX

## Async Operations Syntax

- **Prefer promise syntax** (`.then()/.catch()`) for simple async operations
- Use `async/await` when it clearly improves readability (e.g., sequential operations)
- See "Error Handling & Promise Syntax" section for detailed examples

## React Best Practices

- Use functional components with hooks
- Custom hooks for shared logic (prefix with `use`, e.g., `useAuth`, `useValidation`)
- Define props using TypeScript interfaces
- Use proper typing for all props and state

### HTML Semantic Structure

**CRITICAL**: Never place block-level elements inside inline elements - this is invalid HTML and causes rendering issues.

**Block-level elements** include: `<div>`, `<p>`, `<h1>`-`<h6>`, `<section>`, `<article>`, `<nav>`, `<ul>`, `<ol>`, `<li>`, etc.
**Inline elements** include: `<span>`, `<a>`, `<button>`, `<label>`, etc.

✅ Correct pattern - Use `<span>` with Tailwind display classes inside buttons:

```tsx
// ✅ Correct: Use motion.button with only <span> elements inside
// Use Tailwind classes (flex, flex-col, block) for layout
<motion.button
  type="button"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="w-full rounded-xl border p-4 text-left"
>
  <span className="flex items-start justify-between">
    <span className="flex flex-1 flex-col">
      <span className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">Title</span>
        <CheckIcon />
      </span>
      <span className="mt-1 text-sm text-white/60">Description text</span>
      <span className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Tag 1</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Tag 2</span>
      </span>
    </span>
  </span>
</motion.button>

// ✅ Correct: Use label for radio/checkbox with only <span> elements
<label className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border">
  <input type="radio" className="sr-only" />
  <IconComponent />
  <span className="text-sm font-semibold text-white">Option</span>
</label>
```

❌ Wrong - NEVER do this:

```tsx
// ❌ Block elements (<div>, <p>, <h3>) inside <button>
<motion.button type="button">
  <div className="flex items-center">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</motion.button>

// ❌ Block elements inside <a> tag
<a href="...">
  <div className="card">...</div>
</a>

// ❌ Block elements inside <label>
<label>
  <input type="radio" />
  <div className="option-content">...</div>
</label>
```

**Why this matters:**
- Invalid HTML according to W3C standards
- Causes accessibility issues
- Can lead to unpredictable browser rendering
- Breaks semantic structure

**Key rule:** Inside `<button>`, `<a>`, and `<label>` elements, use only `<span>` elements and apply Tailwind display classes (`flex`, `flex-col`, `block`, `inline-flex`) to achieve the desired layout.

### JSX Attribute Order

**IMPORTANT**: Event handlers must ALWAYS be placed at the bottom of JSX attributes.

Follow this attribute order:

1. **Element type/key**: `key`, `ref`
2. **Boolean attributes**: `type`, `disabled`, `required`, `checked`, etc.
3. **Styling**: `className`, `style`
4. **Data attributes**: `data-*`, `aria-*`
5. **Event handlers** (ALWAYS LAST): `onClick`, `onChange`, `onSubmit`, `onFocus`, etc.

✅ Correct:

```tsx
<button
  type="button"
  disabled={isLoading}
  className="px-4 py-2 bg-blue-600 text-white rounded"
  aria-label="Submit form"
  onClick={handleClick}
  onChange={handleChange}
>
  Submit
</button>

<input
  type="text"
  name="email"
  placeholder="Enter email"
  className="w-full p-2 border rounded"
  value={email}
  onChange={handleEmailChange}
  onBlur={handleBlur}
  onFocus={handleFocus}
/>
```

❌ Wrong:

```tsx
<button
  type="button"
  onClick={handleClick}
  onChange={handleChange}
  disabled={isLoading}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Submit
</button>

<input
  onChange={handleEmailChange}
  type="text"
  className="w-full p-2 border rounded"
  value={email}
/>
```

**Why this matters:**
- Consistent attribute ordering improves code readability
- Event handlers at the bottom make it easy to see what the element does
- Follows a logical flow: what it is → how it looks → what it does

### Component Naming Convention

**IMPORTANT**: All component names MUST have at least 2 words
- ✅ Correct: `UiButton`, `AuthForm`, `UserCard`, `DataTable`, `ModalDialog`
- ❌ Wrong: `Button`, `Form`, `Card`, `Table`, `Modal`

This helps avoid naming conflicts with HTML elements and third-party libraries, and makes component purpose clearer.

### Component Structure

```tsx
interface UiButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

function UiButton({ label, variant = 'primary', disabled, onClick }: UiButtonProps): JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={variant === 'primary' ? 'bg-blue-600' : 'bg-gray-600'}
    >
      {label}
    </button>
  );
}

export { UiButton };
```

### Hooks Best Practices

- Use `useState` for local component state
- Use `useEffect` for side effects with proper cleanup
- Use `useCallback` for memoizing callbacks passed to children
- Use `useMemo` for expensive computations
- Use `useRef` for DOM references and mutable values that don't trigger re-renders
- Always include all dependencies in dependency arrays

```tsx
// ✅ Correct: Proper cleanup in useEffect
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal);
  
  return () => {
    controller.abort();
  };
}, [fetchData]);
```

## TypeScript Standards

- Always provide explicit return types for functions
- Prefer `interface` over `type` for object shapes
- Avoid `any` type - use `unknown` if type is truly uncertain
- Use type guards and type narrowing
- Define props interfaces separately for reusability

Example:

```typescript
interface UiButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function formatUser(user: User): string {
  // Explicit return type
  return `${user.firstName} ${user.lastName}`;
}
```

## Control Flow

- **Always use curly braces** for all control statements (enforced by ESLint)
- This applies to: `if`, `else`, `for`, `while`, `do-while`

✅ Correct:

```typescript
if (condition) {
  doSomething();
}

for (const item of items) {
  process(item);
}
```

❌ Wrong:

```typescript
if (condition) doSomething();

for (const item of items) process(item);
```

## Architecture Pattern: Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design**:

- Structure: `entities/`, `features/`, `shared/`, `ui/`, `model/`, `api/`, `lib/`
- Each feature is self-contained
- Dependencies flow downward: `features` → `entities` → `shared`

### Directory Structure

```
app-name/
├── entities/         # Business entities
├── features/         # User features/scenarios
├── shared/           # Shared across app
│   ├── ui/          # Reusable UI components
│   ├── api/         # API clients
│   ├── lib/         # Utilities
│   └── config/      # Configuration
└── App.tsx
```

## Component Best Practices

- Define props with TypeScript interfaces
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- Include ARIA attributes for accessibility when needed
- Handle loading and error states for async operations
- Use try-catch blocks for error handling
- Use `useRef` for DOM element references
- Always clean up side effects in useEffect return function

## Tailwind CSS Transitions & Animations

**ALWAYS use Tailwind CSS** for transitions and animations instead of custom CSS or JavaScript-based animations.

### Common Tailwind Transition Patterns

**Durations** (use appropriate timing):
- Fast interactions: `duration-150` (150ms)
- Standard: `duration-200` or `duration-300` (200-300ms)
- Slower, more deliberate: `duration-500` (500ms)

**Easing functions**:
- `ease-linear` - Constant speed
- `ease-in` - Starts slow, ends fast (good for exits)
- `ease-out` - Starts fast, ends slow (good for entrances)
- `ease-in-out` - Slow at both ends (good for hover effects)

**Common transition properties**:
- `transition-opacity` - Fade effects
- `transition-transform` - Move/scale effects
- `transition-colors` - Color changes
- `transition-all` - All properties (use sparingly for performance)

### Best Practices

- ✅ Use Tailwind transition utilities for all animations
- ✅ Prefer `ease-out` for enter animations, `ease-in` for leave animations
- ✅ Keep durations short (200-300ms) for better UX
- ✅ Use `transition-all` sparingly (prefer specific properties for performance)
- ✅ Test transitions on slower devices
- ❌ Avoid custom CSS `@keyframes` unless absolutely necessary
- ❌ Avoid JavaScript animation libraries (GSAP, anime.js) for simple transitions

## Error Handling & Promise Syntax

### Promise Syntax Preference

- **Prefer regular promise syntax** (`.then()/.catch()`) for straightforward async operations
- Use `async/await` only when it clearly improves readability (e.g., multiple sequential operations)
- Choose the syntax that makes the code most readable for the specific case

```typescript
// ✅ Good: Promise syntax for simple operations
function fetchData(): Promise<Data> {
  return api.getData()
    .then((response) => response.data)
    .catch((error) => {
      console.error('Failed to fetch data:', error);
      throw error;
    });
}

// ✅ Good: async/await when it's clearer (sequential operations)
async function fetchUserWithPosts(userId: string): Promise<UserWithPosts> {
  try {
    const user = await api.getUser(userId);
    const posts = await api.getUserPosts(userId);
    return { user, posts };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}
```

## TanStack Query (React Query)

- **Always prefer TanStack Query** for server state management and data fetching
- Provides automatic caching, background updates, and request deduplication
- Use `useQuery` for GET requests (fetching data)
- Use `useMutation` for POST/PUT/DELETE requests (modifying data)

### useQuery Example

```typescript
import { useQuery } from '@tanstack/react-query';

// With promise syntax (preferred for simple operations)
function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId).then((response) => response.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Or with async/await (when clearer)
function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.getUser(userId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// In component
const { data, isLoading, isError, error } = useUserProfile(userId);
```

### useMutation Example

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: User) => api.updateUser(userData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

// In component
const { mutate, isPending } = useUpdateUser();
```

### TanStack Query Best Practices

- Use meaningful queryKey arrays for cache management
- Set appropriate `staleTime` and `gcTime` values
- Invalidate queries after mutations to refresh data
- Handle loading and error states from TanStack Query
- Extract query logic into custom hooks (e.g., `useUserData`, `useMatchList`)
- ❌ Avoid: Manual state management for server data (use TanStack Query instead)

## Project-Specific Context

### Frontend Stack

- **React** with TypeScript
- **State Management**: Zustand (for local state)
- **Server State**: TanStack Query (React Query) for data fetching and caching
- **Testing**: Vitest with React Testing Library
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Node Version**: >= 20.10.0
- **Package Manager**: pnpm >= 10.28.1

### Path Aliases

- `@` - App root directory
- `@shared` - Shared modules

## Package Manager: pnpm

**CRITICAL**: This project uses **pnpm** as the package manager, NOT npm or yarn.

### Why pnpm?

- **Disk space efficiency**: Uses a content-addressable store for packages
- **Faster installations**: Packages are linked from a single global store
- **Strict dependency resolution**: Prevents phantom dependencies

### pnpm Commands

Always use pnpm commands instead of npm:

```bash
# ✅ Correct: Use pnpm
pnpm install              # Install dependencies
pnpm add <package>        # Add a package
pnpm add -D <package>     # Add a dev dependency
pnpm remove <package>     # Remove a package
pnpm run <script>         # Run a script
pnpm update               # Update dependencies
pnpm why <package>        # Show why a package is installed

# ❌ Wrong: Do NOT use npm
npm install
npm i <package>
npm uninstall <package>
```

### Important pnpm Rules

- ✅ **Always use `pnpm install`** when setting up the project
- ✅ **Use `pnpm add`** to install new packages
- ✅ **Commit `pnpm-lock.yaml`** to version control (NOT `package-lock.json`)
- ❌ **NEVER use npm or yarn commands** - they will create conflicting lock files
- ❌ **NEVER commit `package-lock.json` or `yarn.lock`** - only `pnpm-lock.yaml`
- ❌ **NEVER mix package managers** in the same project

### pnpm Configuration

The project may have a `.npmrc` or `pnpm-workspace.yaml` file for pnpm configuration. Always respect these settings.

### Installing pnpm

If pnpm is not installed on your system:

```bash
# Using npm (one-time installation)
npm install -g pnpm
```

## When Creating New Files (Frontend)

1. Check existing patterns in similar features first
2. Follow the Feature-Sliced Design structure
3. Apply correct naming conventions (PascalCase for React components, kebab-case for TS)
4. Include proper TypeScript types
5. Add JSDoc comments for complex functions
6. Consider accessibility from the start

## When Refactoring (Frontend)

1. Extract repeated logic into custom hooks
2. Move reusable components to `shared/ui/`
3. Keep components focused and single-responsibility
4. Maintain backward compatibility unless breaking changes are discussed
5. Update tests after refactoring

## Performance Considerations (Frontend)

- Use `useMemo` for expensive computations
- Use `useCallback` for callbacks passed to memoized children
- Use `React.memo` for components that receive the same props frequently
- Lazy load heavy components with `React.lazy` and `Suspense`
- Implement virtual scrolling for long lists
- Optimize images and assets

---

# 🟢 Backend/Node.js-Specific Rules

## TypeScript Coding Standards

- Use strict TypeScript configuration
- Always provide explicit types for function parameters and return values
- Avoid `any` type - use `unknown` if type is truly uncertain
- Use interfaces for object shapes, types for unions/primitives

## File Structure

```typescript
// src/services/user-service.ts
import type { FastifyInstance } from 'fastify';
import { db } from '../plugins/db';
import type { User } from '../types';

async function findActiveUsers(): Promise<User[]> {
  return db.query.users.findMany({
    where: (users, { eq }) => eq(users.isActive, true),
  });
}

async function getUserById(id: string): Promise<User | null> {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
}

export { findActiveUsers, getUserById };
```

## Fastify Best Practices

- Use plugins for modular code organization
- Register routes using plugins
- Use TypeScript schemas for request/response validation
- Use decorators for shared functionality
- Keep route handlers thin - business logic in services

### Route Structure

```typescript
// src/routes/users.ts
import type { FastifyPluginAsync } from 'fastify';
import { getUserById, createUser } from '../services/user-service';

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const user = await getUserById(request.params.id);
    
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    
    return user;
  });

  fastify.post<{ Body: CreateUserInput }>('/', async (request, reply) => {
    const user = await createUser(request.body);
    return reply.status(201).send(user);
  });
};

export default usersRoutes;
```

### Plugin Structure

```typescript
// src/plugins/db.ts
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { drizzle } from 'drizzle-orm/node-postgres';

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const db = drizzle(process.env.DATABASE_URL!);
  
  fastify.decorate('db', db);
  
  fastify.addHook('onClose', async () => {
    // Cleanup if needed
  });
};

export default fp(dbPlugin, {
  name: 'db',
});
```

## Database (Drizzle ORM / Prisma)

- Use migrations for schema changes
- Define schemas/models with proper types
- Use repositories or service layer for database queries
- Avoid raw queries unless necessary for performance
- Always handle connection errors gracefully

## Function Declarations

- Always use typed parameters and return types
- Use `function` declarations for named exports
- Use `async` functions for asynchronous operations

```typescript
async function calculateTotal(items: Item[]): Promise<number> {
  // Implementation
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Error Handling (Node.js)

- Use custom error classes for domain-specific errors
- Let Fastify error handler manage HTTP responses
- Log errors with proper context
- Use try-catch for async operations

```typescript
// src/errors/index.ts
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export { AppError, NotFoundError };
```

```typescript
// Usage
throw new NotFoundError('User', userId);
```

## Testing (Node.js)

- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- Use Vitest for all tests
- Mock external dependencies
- Test API endpoints with Fastify's inject method

```typescript
// tests/integration/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../src/app';

describe('Users API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return user by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('id', '123');
  });
});
```

## Backend Stack

- **Node.js** with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Testing**: Vitest
- **API**: RESTful endpoints
- **Validation**: Fastify schemas with TypeBox or Zod
- **Logging**: Pino (built into Fastify)

## Environment Configuration

- Use environment variables for all configuration
- Create a config module that validates env vars at startup
- Never commit `.env` files

```typescript
// src/config/index.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

export const config = envSchema.parse(process.env);
```

## When Creating New Files (Backend)

1. Check existing patterns in similar domain areas
2. Follow the established directory structure (`src/routes/`, `src/services/`, etc.)
3. Apply correct naming conventions (kebab-case for files)
4. Include proper TypeScript types
5. Add JSDoc comments for public functions
6. Create corresponding tests

## When Refactoring (Backend)

1. Extract repeated logic into services or utility functions
2. Use design patterns appropriately (Repository, Factory, Strategy, etc.)
3. Keep services stateless and focused on single responsibility
4. Maintain backward compatibility for public APIs
5. Update tests and ensure existing tests pass

## Performance Considerations (Backend)

- Use connection pooling for database connections
- Implement proper database indexing
- Use caching for frequently accessed data
- Batch database operations when possible
- Use pagination for large result sets
- Profile and optimize slow queries
- Use streaming for large responses

---

# 🌐 Project-Wide Rules

## Git Commit Standards (All Projects)

**Commit Messages:**
- Keep messages between **3-100 characters**
- No strict format required (we use squash merges to main)
- Write naturally and descriptively

**Examples:**
- ✅ `fix login redirect issue`
- ✅ `add user authentication`
- ✅ `wip` (work in progress)
- ❌ `ab` (too short)

**Branch Naming Convention:**
- Format: `<type>/<description>`
- Allowed types: `feature`, `feat`, `fix`, `hotfix`, `bugfix`, `maintenance`, `infra`
- Examples:
  - ✅ `feature/user-auth`
  - ✅ `fix/login-redirect`
  - ✅ `infra/docker-setup`
  - ❌ `my-feature` (missing type)

**Note:** Since we use squash merges to main, individual commit messages don't need to be perfect. Focus on descriptive squash commit messages when merging.

## Do NOT (Frontend)

- Do not use `var`, always use `const` or `let` in TypeScript/JavaScript
- Do not mutate props directly in React components
- Do not use class components (use functional components with hooks)
- Do not use `any` type without strong justification
- Do not skip TypeScript errors with `@ts-ignore` without explanation
- Do not create arrow function expressions for named functions
- Do not manually manage server state with useState (use TanStack Query)
- Do not write custom CSS - use Tailwind CSS utility classes instead
- Do not create components with single-word names (use `UiButton` not `Button`)
- **Do not design for desktop first** - this is a mobile-only application
- Do not use hover-only interactions - they don't work on mobile devices
- Do not create touch targets smaller than 44x44px
- Do not use `vh` - use `dvh` for mobile viewport height

## Do NOT (Node.js/Backend)

- Do not use global variables
- Do not use `console.log()` for production logging (use Fastify's logger)
- Do not expose internal error details to clients
- Do not store secrets in code (use environment variables)
- Do not bypass TypeScript types or use `any` without justification
- Do not use synchronous file operations in request handlers
- Do not forget to handle promise rejections

## Do NOT (All Projects)

- Do not commit commented-out code (remove it)
- Do not create files with inconsistent naming conventions
- Do not guess library APIs - look up documentation
- Do not skip tests or linting checks
- Do not commit directly to `main` or `master` branches
- Do not commit `.env` files or secrets
- **Do not use npm or yarn** - always use pnpm for package management
- Do not commit `package-lock.json` or `yarn.lock` - only commit `pnpm-lock.yaml`

---

## 📝 Summary

This project uses:

- **Frontend**: React + TypeScript + Vite + TanStack Query + Zustand + **Tailwind CSS** (no custom CSS!)
- **Backend**: Node.js + TypeScript + Fastify + Drizzle ORM + PostgreSQL
- **Testing**: Vitest (frontend & backend)
- **Architecture**: Feature-Sliced Design (frontend)
- **Platform**: **Mobile-only** application

**Key Rules**:
- **Mobile-First**: Always design for mobile devices first - this is a mobile-only application
- **Touch-Friendly**: Minimum 44x44px touch targets, use `active:` states, no hover-only interactions
- **Tailwind CSS**: Always use Tailwind utility classes for styling. Never write custom CSS unless absolutely necessary
- **Viewport**: Use `dvh` (dynamic viewport height) instead of `vh` for mobile layouts
- **Package Manager**: Always use pnpm, never npm or yarn

Always prioritize code quality, type safety, accessibility, mobile UX, and maintainability!
