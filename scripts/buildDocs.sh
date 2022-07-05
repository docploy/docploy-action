# Run the following command to test locally
#   GITHUB_WORKSPACE=$(pwd) DOCS_DIR=docs/ ./scripts/buildDocs.sh

# Install npm dependencies
yarn

# Create a empty index.md file (if it does not already exist), so we can poll it
if [ ! -f "${GITHUB_WORKSPACE}/$DOCS_DIR/index.md" ]; then
  touch "${GITHUB_WORKSPACE}/$DOCS_DIR/index.md"
fi

# Generate the docs
yarn next build

# Generate static assets for the docs
yarn next export

# Rename generated out/_next folder to out/next because GitHub Pages
# does not serve folders that begin with an _.
mv out/_next out/next

# Find and replace all references of _next/ to next/ in all of the assets.
find out/ -type f -name "*.html" -print0 | xargs -0 sed -i '' -e 's/_next/next/g'
