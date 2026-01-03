# Drinkie Project - Claude AI Coding Rules

> This document contains comprehensive coding standards and conventions for the Drinkie project.
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
- Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) for responsive design
- Use Tailwind's state variants (`hover:`, `focus:`, `active:`, `disabled:`) for interactive states
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
- **Package Manager**: npm >= 10.2.3

### Path Aliases

- `@` - App root directory
- `@shared` - Shared modules

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

---

## 📝 Summary

This project uses:

- **Frontend**: React + TypeScript + Vite + TanStack Query + Zustand + **Tailwind CSS** (no custom CSS!)
- **Backend**: Node.js + TypeScript + Fastify + Drizzle ORM + PostgreSQL
- **Testing**: Vitest (frontend & backend)
- **Architecture**: Feature-Sliced Design (frontend)

**Key Styling Rule**: Always use Tailwind CSS utility classes for styling. Never write custom CSS unless absolutely necessary.

Always prioritize code quality, type safety, accessibility, and maintainability!
