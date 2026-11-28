#!/usr/bin/env bash
# Generate the runtime config.json for one environment inside a working copy of dist/.
# Values come from environment variables (never interpolated into the script).
# Usage: APP_ENV=... SUPABASE_URL=... SUPABASE_PUBLISHABLE_KEY=... scripts/generate-runtime-config.sh <dist-dir>
set -euo pipefail

dist_dir="${1:?usage: generate-runtime-config.sh <dist-dir>}"
: "${APP_ENV:?APP_ENV is required}"
: "${SUPABASE_URL:?SUPABASE_URL is required}"
: "${SUPABASE_PUBLISHABLE_KEY:?SUPABASE_PUBLISHABLE_KEY is required}"

case "$SUPABASE_URL" in
  https://*) ;;
  *) echo "ERROR: SUPABASE_URL must start with https://" >&2; exit 1 ;;
esac

jq -n --arg environment "$APP_ENV" \
  --arg url "$SUPABASE_URL" \
  --arg key "$SUPABASE_PUBLISHABLE_KEY" \
  '{environment:$environment,supabase:{url:$url,publishableKey:$key}}' \
  > "$dist_dir/config.json"

echo "config.json generated for environment '$APP_ENV'"

# Keep every non-production environment out of search engines.
if [ "$APP_ENV" != "production" ]; then
  printf 'User-agent: *\nDisallow: /\n' > "$dist_dir/robots.txt"
  printf '\n/*\n  X-Robots-Tag: noindex, nofollow\n' >> "$dist_dir/_headers"
  echo "noindex enabled (robots.txt + X-Robots-Tag) for environment '$APP_ENV'"
fi
