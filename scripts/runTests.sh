# Run the following command to test locally
#   GITHUB_WORKSPACE=$(pwd) DOCS_DIR=docs/ ./scripts/runTests.sh

yarn test ${GITHUB_WORKSPACE}/$DOCS_DIR

# Used for debugging
ls -la ${GITHUB_WORKSPACE}/$DOCS_DIR
ls -la ${GITHUB_WORKSPACE}/$DOCS_DIR/dir/test