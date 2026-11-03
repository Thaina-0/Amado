#!/usr/bin/env bash
# PostToolUse (Write|Edit): format the edited file with the project's Prettier.
set -u

file="$(jq -r '.tool_response.filePath // .tool_input.file_path // empty')"
[ -n "$file" ] && [ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
# Formatting is best-effort: never fail the edit because Prettier could not parse the file.
pnpm exec prettier --write --ignore-unknown --log-level warn "$file" 2>/dev/null || true
