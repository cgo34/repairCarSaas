#!/usr/bin/env bash
# Verify that a dist/ directory is exactly the release candidate described by manifest.json:
# every file matches its recorded SHA-256, no unexpected file exists (config.json excepted).
# Usage: scripts/verify-artifact.sh <dist-dir> <manifest.json>
set -euo pipefail

dist_dir="${1:?usage: verify-artifact.sh <dist-dir> <manifest.json>}"
manifest="${2:?usage: verify-artifact.sh <dist-dir> <manifest.json>}"

expected="$(sed -n 's/^    "\(.*\)": "\([0-9a-f]\{64\}\)",\{0,1\}$/\2  \1/p' "$manifest" | LC_ALL=C sort -k2)"
[ -n "$expected" ] || { echo "ERROR: no file entries found in $manifest" >&2; exit 1; }

actual="$(
  cd "$dist_dir" && find . -type f ! -path './config.json' -print0 | LC_ALL=C sort -z |
    xargs -0 sha256sum | awk '{ sub(/^\*?(\.\/)?/, "", $2); print $1 "  " $2 }'
)"

if [ "$expected" != "$(echo "$actual" | LC_ALL=C sort -k2)" ]; then
  echo "ERROR: $dist_dir does not match $manifest" >&2
  diff <(echo "$expected") <(echo "$actual" | LC_ALL=C sort -k2) >&2 || true
  exit 1
fi

echo "Artifact verified: $(echo "$expected" | wc -l | tr -d ' ') files match the manifest"
