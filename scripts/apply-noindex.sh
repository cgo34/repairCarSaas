#!/usr/bin/env bash
# Keep a non-production deployment out of search engines.
# Runs after verify-artifact.sh, on the working copy that is about to be deployed:
# it adds robots.txt and appends an X-Robots-Tag header to _headers.
# Usage: scripts/apply-noindex.sh <dist-dir>
set -euo pipefail

dist_dir="${1:?usage: apply-noindex.sh <dist-dir>}"

printf 'User-agent: *\nDisallow: /\n' > "$dist_dir/robots.txt"
printf '\n/*\n  X-Robots-Tag: noindex, nofollow\n' >> "$dist_dir/_headers"

echo "noindex applied to $dist_dir"
