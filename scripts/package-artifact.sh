#!/usr/bin/env bash
# Package a built dist/ into a release candidate: archive, SHA-256 checksum and manifest.
# Usage: scripts/package-artifact.sh <dist-dir> <output-dir>
# The dist must not contain any environment-specific file (config.json).
set -euo pipefail

dist_dir="${1:?usage: package-artifact.sh <dist-dir> <output-dir>}"
out_dir="${2:?usage: package-artifact.sh <dist-dir> <output-dir>}"

[ -f "$dist_dir/index.html" ] || { echo "ERROR: $dist_dir/index.html not found" >&2; exit 1; }
[ ! -e "$dist_dir/config.json" ] || { echo "ERROR: $dist_dir/config.json must not be part of a release candidate" >&2; exit 1; }

mkdir -p "$out_dir"
out_dir="$(cd "$out_dir" && pwd)"
archive="$out_dir/dist.tar.gz"

tar -czf "$archive" -C "$dist_dir" .
(cd "$out_dir" && sha256sum dist.tar.gz > dist.tar.gz.sha256)

files_json="$(
  cd "$dist_dir" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum |
    awk 'BEGIN { first = 1 } { sub(/^\*?(\.\/)?/, "", $2); printf "%s    \"%s\": \"%s\"", (first ? "" : ",\n"), $2, $1; first = 0 } END { print "" }'
)"

printf '{\n  "commit": "%s",\n  "tree": "%s",\n  "runId": "%s",\n  "node": "%s",\n  "npm": "%s",\n  "archiveSha256": "%s",\n  "files": {\n%s\n  }\n}\n' \
  "${GITHUB_SHA:-$(git rev-parse HEAD)}" \
  "$(git rev-parse 'HEAD^{tree}')" \
  "${GITHUB_RUN_ID:-local}" \
  "$(node --version)" \
  "$(npm --version)" \
  "$(cut -d' ' -f1 "$out_dir/dist.tar.gz.sha256")" \
  "$files_json" > "$out_dir/manifest.json"

echo "Artifact written to $out_dir (dist.tar.gz, dist.tar.gz.sha256, manifest.json)"
