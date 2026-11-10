#!/usr/bin/env bash
# Copies env files from the main checkout into this Conductor workspace.
#
# In the main checkout these files are 1Password-mounted named pipes, so no
# secrets sit on disk there. A workspace gets its own private copy instead, so
# agents can keep working after 1Password locks. Reading a pipe blocks forever
# when 1Password is locked or disconnected, so this gives up after 20 seconds.
#
# Usage: conductor-sync-env.sh [path/to/.env.local ...]   (default: .env.local)
set -euo pipefail

root="${CONDUCTOR_ROOT_PATH:?CONDUCTOR_ROOT_PATH is not set; run this from a Conductor workspace}"
workspace="${CONDUCTOR_WORKSPACE_PATH:-$PWD}"
[[ $# -gt 0 ]] || set -- .env.local

for rel in "$@"; do
  src="$root/$rel"
  dest="$workspace/$rel"

  if [[ "$src" -ef "$dest" ]]; then
    continue
  fi
  if [[ ! -f "$src" && ! -p "$src" ]]; then
    echo "No env file at $src. Mount its 1Password Environment there, then retry." >&2
    exit 1
  fi

  mkdir -p "$(dirname "$dest")"
  tmp="$(mktemp "$dest.tmp.XXXXXX")"
  cat "$src" > "$tmp" &
  reader=$!

  for _ in $(seq 200); do
    kill -0 "$reader" 2>/dev/null || break
    sleep 0.1
  done

  if kill -0 "$reader" 2>/dev/null; then
    kill "$reader" 2>/dev/null || true
    wait "$reader" 2>/dev/null || true
    rm -f "$tmp"
    echo "Timed out reading $src. Unlock 1Password, approve the prompt, then retry." >&2
    exit 1
  fi
  if ! wait "$reader" || [[ ! -s "$tmp" ]]; then
    rm -f "$tmp"
    echo "Could not read $src, or it was empty." >&2
    exit 1
  fi

  chmod 600 "$tmp"
  mv -f "$tmp" "$dest"
  echo "Loaded $rel"
done
