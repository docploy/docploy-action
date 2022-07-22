# Change the working directory to the workspace folder
echo "changing workspace"
ls -la
cd ${GITHUB_WORKSPACE}
ls -la


# Set up git metadata
git config --global user.email "${EMAIL}"
git config --global user.name "${USERNAME}"

# Clean up pages branch
git fetch
git switch -c ${PAGES_BRANCH}
git clean -f -d

# Reset pages branch if it exists remotely
is_branch_in_remote=$(git ls-remote --heads origin ${PAGES_BRANCH})
if [[ ! -z ${is_branch_in_remote} ]]; then
  git reset --hard origin/${PAGES_BRANCH}
fi

# Move the static files into the $SHORT_SHA directory
SHORT_SHA=$(echo $GITHUB_SHA | cut -c1-7)
if [ -d "./$SHORT_SHA" ]; then
  rm -rf ./$SHORT_SHA
fi
mkdir ./$SHORT_SHA
cp -r $GITHUB_ACTION_PATH/out/* ./$SHORT_SHA

# Add a .nojekyll file if it does not exist
# This offers two advantages
# 1. We skip the jekyll build and save time
# 2. We can serve the _next/ directory
if [ ! -f "./.nojekyll" ]; then
  echo "Adding a .nojekyll file"
  touch "./.nojekyll"
fi

# Push the built docs to the GitHub Pages branch
git add .
git commit -m "Publishing docs for $SHORT_SHA"
git push origin ${PAGES_BRANCH}