# Run the following command to test locally
#   BASE_URL=https://github.com CI=true GITHUB_SHA=abcdef GITHUB_WORKSPACE=$(pwd) DOCS_DIR=docs/ ./scripts/buildDocs.sh
set -e

# Export the environment variables from .env
if [ -f ".env" ]; then
  set -a
  source .env
  set +a
fi

# Create a empty index.md file (if it does not already exist), so we can poll it
if [ ! -f "${GITHUB_WORKSPACE}/$DOCS_DIR/index.md" ]; then
  touch "${GITHUB_WORKSPACE}/$DOCS_DIR/index.md"
fi

# Generate the docs
yarn next build

# Generate static assets for the docs
yarn next export

# Rename generated out/_next folder to out/next because GitHub Pages
# does not serve folders that begin with an _
mv out/_next out/next

# Move serve.json into the out/ directory to prevent the serve package from
# redirecting paths with .html appended at the end.
# (This is only used for development where we use the "serve" package to serve
# static HTML files)
# https://github.com/vercel/serve-handler#cleanurls-booleanarray
cp serve.json out/serve.json

# Find and replace all references of _next/ to next/ in all of the assets
# Note, using sed -i '' will only work on Mac, so remove -i '' to support Ubuntu
if [ `uname -s` = "Darwin" ]; then
  find out -type f -name "*.html" -print0 | xargs -0 sed -i '' 's/_next/next/g'
else
  find out -type f -name "*.html" -print0 | xargs -0 sed -i 's/_next/next/g'
fi