set -e

# Export the environment variables from .env
if [ -f ".env" ]; then
  set -a
  source .env
  set +a
fi

# Generate the docs
yarn next build

# Generate static assets for the docs
yarn next export