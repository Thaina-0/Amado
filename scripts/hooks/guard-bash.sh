#!/usr/bin/env bash
# PreToolUse (Bash): deny destructive commands. Prints a permissionDecision JSON when it denies.
set -u

cmd="$(jq -r '.tool_input.command // empty')"
[ -n "$cmd" ] || exit 0

deny() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# rm -rf is only allowed on regenerable build output.
stripped="$(printf '%s' "$cmd" | sed -E 's#(\./)?(node_modules|dist|dev-dist|coverage)/?##g')"
if printf '%s' "$stripped" | grep -Eq '(^|[;&|[:space:]])rm[[:space:]]+(-[a-zA-Z]*[rR][a-zA-Z]*[fF]|-[a-zA-Z]*[fF][a-zA-Z]*[rR]|-[rR][[:space:]]+-[fF]|-[fF][[:space:]]+-[rR]|--recursive)([[:space:]]+-[^[:space:]]+)*[[:space:]]+[^-[:space:];&|]'; then
  deny "Blocked: recursive rm outside node_modules, dist, dev-dist and coverage. Ask the user first."
fi

# Force push rewrites shared history; --force-with-lease is allowed.
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push\b.*([[:space:]]--force([[:space:]]|$)|[[:space:]]-f([[:space:]]|$))'; then
  deny "Blocked: git push --force. Use --force-with-lease and only with the user's approval."
fi

# Secrets: never print env files (.env.example is fine).
if printf '%s' "$cmd" | grep -Eq '(cat|less|more|head|tail|bat|grep|rg|source|\.)[[:space:]]+[^|;&]*\.env(\.(local|production|development|test))?([[:space:]]|$)'; then
  deny "Blocked: reading a .env file. Use .env.example to see which variables are needed."
fi

exit 0
