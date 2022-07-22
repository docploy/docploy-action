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

# Move serve.json into the out/ directory to prevent the serve package from
# redirecting paths with .html appended at the end.
# (This is only used for development where we use the "serve" package to serve
# static HTML files)
# https://github.com/vercel/serve-handler#cleanurls-booleanarray
cp serve.json out/serve.json
