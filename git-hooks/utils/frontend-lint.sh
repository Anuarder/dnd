#!/usr/bin/env sh
#
# Frontend Linting and Formatting Script
# Runs ESLint and Prettier on provided frontend files
#
# Usage: frontend-lint.sh <project-dir> <files...>
#   project-dir: Path to the frontend project directory
#   files: Space-separated list of files to lint (relative to project-dir)
#

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Project directory not provided"
  echo "Usage: frontend-lint.sh <project-dir> <files...>"
  exit 1
fi

if [ -z "$2" ]; then
  echo "No files to check."
  exit 0
fi

PROJECT_DIR=$1
shift
FILES="$*"

echo "Running linting and formatting on $(echo $FILES | wc -w | tr -d ' ') file(s)..."

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Error: Project directory does not exist: $PROJECT_DIR"
  exit 1
fi

# Check if dependencies are installed
ESLINT="${PROJECT_DIR}/node_modules/.bin/eslint"
PRETTIER="${PROJECT_DIR}/node_modules/.bin/prettier"

if [ ! -f "$ESLINT" ] || [ ! -f "$PRETTIER" ]; then
  echo "⚠️  Warning: Dependencies not found in $PROJECT_DIR"
  echo "Please run 'npm install' in the project directory to enable linting."
  echo "Skipping checks..."
  exit 0
fi

# Save current directory and navigate to project directory
ORIGINAL_DIR=$(pwd)
cd "$PROJECT_DIR" || exit 1

# Run eslint on provided files
echo "Running eslint..."
npx eslint --fix $FILES
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -ne 0 ]; then
  echo "❌ Linting failed! Please fix the errors before committing."
  cd "$ORIGINAL_DIR"
  exit 1
fi

# Run prettier on provided files
echo "Running prettier..."
npx prettier --write $FILES
FORMAT_EXIT_CODE=$?

if [ $FORMAT_EXIT_CODE -ne 0 ]; then
  echo "❌ Formatting failed!"
  cd "$ORIGINAL_DIR"
  exit 1
fi

cd "$ORIGINAL_DIR"
echo "✅ All checks passed!"

