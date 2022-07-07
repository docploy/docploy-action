# Run the following command to test locally
#   GITHUB_WORKSPACE=$(pwd) DOCS_DIR=docs/ ./scripts/runTests.sh

echo "docs dir"
echo ${GITHUB_WORKSPACE}/$DOCS_DIR
yarn jest ${GITHUB_WORKSPACE}/$DOCS_DIR
echo "in between"

# Used for debugging
ls -la ${GITHUB_WORKSPACE}/$DOCS_DIR
ls -la ${GITHUB_WORKSPACE}/$DOCS_DIR/dir/test