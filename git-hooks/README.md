# Git Hooks

> **Note:** For setup instructions and basic usage, see the main [README.md](../README.md#git-hooks).

This directory contains all git hook templates and utility scripts for maintaining code quality and enforcing project conventions.

## 📋 Overview

Git hooks are scripts that Git executes before or after events such as commit, push, and checkout. These hooks help maintain code quality and consistency across the team.

## Directory Structure

```
git-hooks/
├── utils/                      # Utility scripts with business logic
│   └── frontend-lint.sh       # Frontend linting and formatting
├── pre-commit                  # Hook: Runs frontend linting
├── commit-msg                  # Hook: Validates message length
├── post-checkout               # Hook: Validates branch names
└── README.md                   # This file
```

## Installation

Install hooks to your local `.git/hooks/` directory:

```bash
bash bin/install-git-hooks.sh
# or
make install-hooks
```

## 🔧 Available Hooks

### 1. `pre-commit`
**Status:** ✅ Active

Runs before each commit to lint and format frontend code.

**What it does:**
- Lints Vue, TypeScript, and JavaScript files in `frontend/` and `frontend-admin/` directories
- Auto-formats files using ESLint and Prettier
- Re-stages formatted files automatically
- Prevents commit if linting errors are found

**Example:**
```bash
# When you commit with staged frontend files
git add frontend/vue-apps/apps/authentication-app/App.vue
git commit -m "update auth app"
# → Hook runs ESLint + Prettier, re-stages files, then commits
```

---

### 2. `commit-msg`
**Status:** ✅ Active (Simplified)

Runs after you enter a commit message to validate its length.

**What it does:**
- Validates commit message length:
  - Minimum: 3 characters
  - Maximum: 100 characters
- Skips validation during rebases and for merge commits

**Valid Examples:**
```bash
✅ git commit -m "fix login redirect issue"
✅ git commit -m "add user profile page with avatar support"
✅ git commit -m "refactor authentication service"
✅ git commit -m "fix"           # Short but valid (3 characters)
```

**Invalid Examples:**
```bash
❌ git commit -m "ab"            # Too short (2 characters)
❌ git commit -m "this is a very long commit message that exceeds the maximum allowed length of one hundred characters and will be rejected"  # Too long
```

---

### 3. `post-checkout`
**Status:** ✅ Active (New)

Runs after checking out a branch to validate branch names.

**What it does:**
- Validates branch names when creating **new local branches**
- Ensures branch names follow the convention: `<type>/une-<number>`
- **Automatically deletes invalid branches** and switches you back to previous branch
- Only validates new branches (not existing ones from remote)
- Skips validation for protected branches (main, master, develop)

**Valid Branch Names:**
```bash
✅ feature/une-123
✅ feat/une-0
✅ fix/une-456
✅ hotfix/une-789
✅ bugfix/une-999
✅ maintenance/une-111
✅ infra/une-1325
✅ epic/une-9999
✅ renovate/une-1
```

**Invalid Branch Names:**
```bash
❌ feature              # Missing /une-<number>
❌ une-123              # Missing type prefix
❌ some-branch-name     # Doesn't follow convention
❌ feature/UNE-123      # Should be lowercase 'une'
❌ bugfix/une-         # Missing number
```

**Allowed Types:**
- `feature` or `feat`
- `fix`, `hotfix`, or `bugfix`
- `maintenance`
- `infra`
- `epic`
- `renovate`

**Example:**
```bash
# Creating a valid branch
git checkout -b feature/une-123
# ✅ Branch created successfully

# Creating an invalid branch
git checkout -b my-feature
# ❌ Error: Invalid branch name
# ⚠️  Switching back to: previous-branch
# 🗑️  Deleted invalid branch: my-feature
# → Branch is automatically deleted
# → You're back on your previous branch
```

## Utility Scripts

### `utils/frontend-lint.sh`
**Status:** ✅ Active

**Purpose:** Runs ESLint and Prettier on provided frontend files

**Usage:**
```bash
bash git-hooks/utils/frontend-lint.sh <project-dir> <files...>
```

**Parameters:**
- `project-dir`: Path to the frontend project directory (e.g., `./frontend` or `./frontend-admin`)
- `files...`: Space-separated list of files to lint (relative to project-dir)

**Example:**
```bash
# Lint files in frontend directory
bash git-hooks/utils/frontend-lint.sh ./frontend \
  vue-apps/apps/authentication-app/App.vue \
  vue-apps/apps/match-calendar-app/main.ts

# Lint files in frontend-admin directory
bash git-hooks/utils/frontend-lint.sh ./frontend-admin \
  src/apps/matches-app/App.vue \
  src/apps/matches-app/main.ts
```

**What it does:**
- Runs ESLint with auto-fix on provided files
- Runs Prettier to format provided files
- Gracefully skips if dependencies are not installed

**Requirements:**
- Dependencies installed (`npm install` in project directory)
- Files provided as parameters (relative to project directory)

**Note:** This single utility handles both `frontend/` and `frontend-admin/` projects

## Branch Naming Convention

### Why Validate Branch Names?

Branch names should follow a consistent convention to:
- Make it easy to identify the purpose of a branch
- Link branches to JIRA tickets (UNE-xxx)
- Maintain a clean and organized repository

### Convention Details

**Format:** `<type>/une-<number>`

**Types:**
- `feature` or `feat` - New features
- `fix`, `hotfix`, or `bugfix` - Bug fixes
- `maintenance` - Maintenance tasks
- `infra` - Infrastructure changes
- `epic` - Epic branches
- `renovate` - Dependency updates (automated)

**Ticket Number:**
- Must be lowercase: `une-` (not `UNE-`)
- Followed by one or more digits: `une-123`, `une-0`, `une-9999`

### Examples

```bash
# Feature development
git checkout -b feature/une-1234
git checkout -b feat/une-1234

# Bug fixes
git checkout -b fix/une-5678
git checkout -b hotfix/une-5678
git checkout -b bugfix/une-5678

# Infrastructure
git checkout -b infra/une-1325

# Epic work
git checkout -b epic/une-9999

# Maintenance
git checkout -b maintenance/une-111
```

### Fixing Invalid Branch Names

If you created a branch with an invalid name, rename it:

```bash
# You created an invalid branch
git checkout -b my-feature

# Rename it to follow the convention
git branch -m my-feature feature/une-123

# Or if you're already on the branch
git branch -m feature/une-123
```

## Testing

### Testing Frontend Linting

```bash
# Test linting on frontend files
bash git-hooks/utils/frontend-lint.sh ./frontend \
  vue-apps/apps/authentication-app/App.vue \
  vue-apps/shared/api/auth-service.ts

# Test linting on frontend-admin files
bash git-hooks/utils/frontend-lint.sh ./frontend-admin \
  src/apps/matches-app/App.vue \
  src/shared/api/api-client.ts
```

### Testing Commit Message Validation

```bash
# Test valid message (will pass)
echo "fix login redirect issue" > /tmp/test-msg.txt
bash .git/hooks/commit-msg /tmp/test-msg.txt
echo "Exit code: $?"

# Test too short message (will fail)
echo "fix bug" > /tmp/test-msg.txt
bash .git/hooks/commit-msg /tmp/test-msg.txt
echo "Exit code: $?"

# Test too long message (will fail)
echo "this is a very long commit message that exceeds the maximum allowed length of one hundred characters" > /tmp/test-msg.txt
bash .git/hooks/commit-msg /tmp/test-msg.txt
echo "Exit code: $?"
```

### Testing Branch Name Validation

```bash
# Create a test branch (valid)
git checkout -b feature/une-test-123
# ✅ Should succeed - branch created

# Try to create invalid branch
git checkout -b invalid-branch
# ❌ Should show error and auto-delete the branch
# ⚠️  You'll be switched back to previous branch
# 🗑️  Invalid branch is automatically deleted

# Clean up
git checkout main
git branch -D feature/une-test-123
```

## Architecture

```
Developer makes commit
    ↓
.git/hooks/pre-commit (installed hook)
    ↓ calls
git-hooks/pre-commit (hook template)
    ↓ gets staged frontend files from git
    ↓ calls with parameters
git-hooks/utils/frontend-lint.sh (utility script)
    ↓ runs ESLint + Prettier on provided files
    ↓ returns to hook
    ↓ hook re-stages formatted files
    ↓ same for frontend-admin files
    ↓
.git/hooks/commit-msg (installed hook)
    ↓ calls
git-hooks/commit-msg (hook template)
    ↓ validates message length inline
    ↓ accepts or rejects commit

Developer creates new branch
    ↓
.git/hooks/post-checkout (installed hook)
    ↓ calls
git-hooks/post-checkout (hook template)
    ↓ checks if branch is new (not on remote)
    ↓ validates branch name format
    ↓ if invalid: switches back + deletes branch
    ↓ if valid: allows branch creation
```

## Separation of Concerns

**Hook Templates (pre-commit, commit-msg, post-checkout):**
- Handle all git-specific operations
- Get staged files, branch names, git state
- Pass parameters to utilities when needed
- Re-stage files after formatting
- Manage exit codes and error handling

**Utility Scripts (utils/):**
- Environment-agnostic and testable
- Accept all required data as parameters
- No git commands or environment detection
- Pure business logic (linting, validation, formatting)
- Can be used standalone or in CI/CD

## Benefits of This Structure

1. **Simplicity** - Removed complex commit message validation (we squash to main anyway)
2. **Branch Consistency** - All new branches follow naming convention
3. **Testability** - Each utility can be tested without git repository
4. **Maintainability** - Clear separation between git logic and business logic
5. **Reusability** - Utilities can be used in CI/CD pipelines or other contexts
6. **Clarity** - Each script has a single, clear responsibility

## Troubleshooting

### Hook not running
```bash
# Reinstall hooks
bash bin/install-git-hooks.sh

# Check if hook is executable
ls -la .git/hooks/
chmod +x .git/hooks/*
```

### Linting fails
```bash
# Make sure dependencies are installed
cd frontend && npm install
cd frontend-admin && npm install

# Run linting manually to see errors
cd frontend && npm run lint
```

### Branch name validation not working
```bash
# Make sure post-checkout hook is installed
bash bin/install-git-hooks.sh

# Check if hook exists and is executable
ls -la .git/hooks/post-checkout
chmod +x .git/hooks/post-checkout
```

### Invalid branch was created but not deleted
```bash
# Delete it manually
git branch -D invalid-branch-name

# Then create a new branch with correct format
git checkout -b feature/une-123
```

### Want to bypass hooks temporarily
```bash
# Skip all hooks for one commit
git commit --no-verify -m "emergency fix"

# Skip hooks for branch creation
# (not possible, but you can rename after)
git checkout -b temp-branch
git branch -m temp-branch feature/une-123
```

## Contributing

When modifying these scripts:

1. Update the hook file in `git-hooks/`
2. Test the script independently if possible
3. Reinstall hooks: `bash bin/install-git-hooks.sh`
4. Test with actual git operations
5. Update this README if behavior changes
6. Consider backward compatibility

## FAQ

**Q: Why did we remove ticket prepending?**
A: We use squash merges to main, so individual commit messages don't need ticket numbers. The branch name contains the ticket, and that's what matters for the final squash commit.

**Q: Why validate branch names?**
A: Consistent branch naming helps with organization, links to JIRA tickets, and makes it easier for the team to understand what each branch is for.

**Q: Can I use uppercase for ticket numbers in branch names?**
A: No, branch names should use lowercase `une-123`, not `UNE-123`. This is a convention for consistency.

**Q: What if I need a branch without a ticket number?**
A: Protected branches (main, master, develop) don't need to follow the convention. For other cases, create a placeholder ticket or use `une-0` for minor tasks.

**Q: How do I disable hooks temporarily?**
A: Use `git commit --no-verify` or `git commit -n` to skip hooks for one commit. Use this sparingly!

**Q: Do existing branches need to be renamed?**
A: No, the validation only applies to **new** branches created locally. Existing branches (including those from remote) are not affected.

**Q: What happens if I create a branch with an invalid name?**
A: The hook will automatically delete the invalid branch and switch you back to your previous branch. You'll see an error message explaining the issue.
