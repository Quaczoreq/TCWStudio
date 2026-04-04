#!/bin/bash
# Convert all PNG/JPG images in assets/images/ to WebP and minify CSS/JS

set -e

IMG_DIR="assets/images"
CSS_FILE="assets-style/styles.css"
JS_FILE="assets-style/accordion.js"

# Convert images to WebP
for img in "$IMG_DIR"/*.{png,jpg,jpeg}; do
  [ -e "$img" ] || continue
  cwebp -q 80 "$img" -o "${img%.*}.webp"
done

echo "Images converted to WebP."

# Minify CSS
if command -v npx >/dev/null 2>&1; then
  npx clean-css-cli -o "${CSS_FILE%.css}.min.css" "$CSS_FILE"
  echo "Minified CSS: ${CSS_FILE%.css}.min.css"
else
  echo "Install Node.js and clean-css-cli for CSS minification."
fi

# Minify JS
if command -v npx >/dev/null 2>&1; then
  npx terser "$JS_FILE" -o "${JS_FILE%.js}.min.js" --compress --mangle
  echo "Minified JS: ${JS_FILE%.js}.min.js"
else
  echo "Install Node.js and terser for JS minification."
fi
