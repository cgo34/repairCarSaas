#!/usr/bin/env bash
# Generate the runtime config.json for one environment inside a working copy of dist/.
# Values come from environment variables (never interpolated into the script).
# Usage: APP_ENV=... SUPABASE_URL=... SUPABASE_PUBLISHABLE_KEY=... [APP_VERSION=...] scripts/generate-runtime-config.sh <dist-dir>
set -euo pipefail

dist_dir="${1:?usage: generate-runtime-config.sh <dist-dir>}"
: "${APP_ENV:?APP_ENV is required}"
: "${SUPABASE_URL:?SUPABASE_URL is required}"
: "${SUPABASE_PUBLISHABLE_KEY:?SUPABASE_PUBLISHABLE_KEY is required}"

case "$SUPABASE_URL" in
  https://*) ;;
  *) echo "ERROR: SUPABASE_URL must start with https://" >&2; exit 1 ;;
esac

# APP_VERSION is optional: release tag (PROD) or build label (DEV/preview).
jq -n --arg environment "$APP_ENV" \
  --arg url "$SUPABASE_URL" \
  --arg key "$SUPABASE_PUBLISHABLE_KEY" \
  --arg version "${APP_VERSION:-}" \
  '{environment:$environment,supabase:{url:$url,publishableKey:$key}}
   + (if $version != "" then {version:$version} else {} end)' \
  > "$dist_dir/config.json"

echo "config.json generated for environment '$APP_ENV'"
