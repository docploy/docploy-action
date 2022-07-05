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