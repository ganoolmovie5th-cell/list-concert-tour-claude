#!/bin/bash

# Simple CSS minification (remove comments, spaces, newlines)
minify_css() {
  sed 's|/\*.*\*/||g' "$1" | tr -d '\n' | sed 's/  */ /g' | sed 's/ *{ */ { /g' | sed 's/ *} */ } /g' | sed 's/ *: */: /g' | sed 's/ *, */,/g'
}

# Simple JS minification (remove comments, extra spaces)
minify_js() {
  sed 's|//.*||g' "$1" | sed 's|/\*[^*]*\*\+\([^/*][^*]*\*\+\)*/||g' | tr -d '\n' | sed 's/  */ /g'
}

echo "Minifying CSS..."
minify_css style.css > style.min.css
echo "✓ style.css: $(wc -c < style.css) → $(wc -c < style.min.css) bytes"

echo "Minifying JS..."
minify_js app.js > app.min.js
minify_js features.js > features.min.js
minify_js features2.js > features2.min.js
minify_js features3.js > features3.min.js
minify_js features4.js > features4.min.js
minify_js reviews.js > reviews.min.js
minify_js supabase.js > supabase.min.js

echo "✓ JS files minified"
echo ""
echo "Total before: $(du -sh . | cut -f1)"
