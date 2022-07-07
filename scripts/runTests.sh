# Run the following command to test locally
#   GITHUB_WORKSPACE=$(pwd) DOCS_DIR=docs/ ./scripts/runTests.sh

yarn jest ${GITHUB_WORKSPACE}/$DOCS_DIR
echo "in between"
yarn jest ${GITHUB_WORKSPACE}/$DOCS_DIR/dir/test

# Used for debugging
ls -la ${GITHUB_WORKSPACE}/$DOCS_DIR
ls -la ${GITHUB_WORKSPACE}/$DOCS_DIR/dir/test