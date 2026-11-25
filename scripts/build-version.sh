#!/usr/bin/env bash
# Builds ONE self-contained HTML file for a released version of the app.
#   scripts/build-version.sh 1|2|3      ->  versions/Version-N-<name>.html
# Version 1 = dark tables (23 Nov 2026), 2 = light tables (24-25 Nov), 3 = OEM redesign (25 Nov, current).
set -euo pipefail
cd "$(dirname "$0")/.."
declare -A COMMIT=( [1]=dac90a5 [2]=e7fd6cd [3]=093aa58 )
declare -A NAME=( [1]=dark-tables [2]=light-tables [3]=OEM-design )
v="${1:-}"; [[ -n "${COMMIT[$v]:-}" ]] || { echo "Usage: $0 1|2|3"; exit 1; }
out="versions/Version-$v-${NAME[$v]}.html"
work="$(mktemp -d)"; trap 'git worktree remove --force "$work/src" >/dev/null 2>&1 || true; rm -rf "$work"' EXIT
git worktree add -q --detach "$work/src" "${COMMIT[$v]}"
cp scripts/make-standalone.mjs "$work/make-standalone.mjs"   # the builder is newer than the old versions
if [[ -d node_modules ]]; then ln -s "$PWD/node_modules" "$work/src/node_modules"; else (cd "$work/src" && npm install --legacy-peer-deps >/dev/null); fi
( cd "$work/src" && npx vite build >/dev/null
  # older versions loaded an unused Tailwind script from the internet; the app styles itself without it
  python3 - <<'PY'
import re
s = open("dist/index.html").read()
s = re.sub(r'\s*<!-- Tailwind CSS Play CDN -->\s*<script src="https://cdn.tailwindcss.com"></script>', '', s)
open("dist/index.html", "w").write(s)
PY
  node "$work/make-standalone.mjs" >/dev/null )
mkdir -p versions
cp "$work/src/standalone/Tata-Service-Status-Portal.html" "$out"
echo "$out  ($(( $(wc -c < "$out") / 1024 )) KB, commit ${COMMIT[$v]})"
