# Install npm dependencies
yarn

# Create a empty index.md file (if it does not already exist), so we can poll it
if [ ! -f "./$DOCS_DIR/index.md" ] then
  touch "./$DOCS_DIR/index.md"
fi

# Generate the docs
yarn next build

# Generate static assets for the docs
yarn next export

# Log out the contents of the generated docs folder (for debugging)
ls -la $GITHUB_ACTION_PATH/out