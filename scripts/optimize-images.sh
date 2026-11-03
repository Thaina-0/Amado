#!/usr/bin/env bash
# why: the app serves WebP at two widths (see src/features/places/photoImage.ts); the JPEGs stay as the editable source
set -euo pipefail

command -v cwebp >/dev/null || { echo "cwebp not found (brew install webp)" >&2; exit 1; }

cd "$(dirname "$0")/../public/places"
for jpg in */*.jpg; do
  base="${jpg%.jpg}"
  cwebp -quiet -q 76 -m 6 -resize 960 0 "$jpg" -o "$base.webp"
  cwebp -quiet -q 72 -m 6 -resize 480 0 "$jpg" -o "$base-480.webp"
done
