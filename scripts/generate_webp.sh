
set -euo pipefail

SRC_DIRS=("assets/art" "assets/favorites")
SIZES=(480 768 1200)
QUALITY=80

for dir in "${SRC_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Skipping $dir — not found"
    continue
  fi

  for img in "$dir"/*.{png,jpg,jpeg} ; do
    [ -e "$img" ] || continue
    base=$(basename "$img")
    name="${base%.*}"

    echo "Processing $img"

    cwebp -q $QUALITY "$img" -o "$dir/$name.webp" >/dev/null

    for s in "${SIZES[@]}"; do
      outpng="$dir/${name}-${s}.png"
      outwebp="$dir/${name}-${s}.webp"
      echo "  - $s px -> $outpng"
      convert "$img" -resize ${s}x "$outpng"
      cwebp -q $QUALITY "$outpng" -o "$outwebp" >/dev/null
    done
  done
done

echo "Done. Remember to update HTML to use <picture> or srcset pointing to the generated files."