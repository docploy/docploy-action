# Clean any existing built files
rm -rf dist/

# Use ncc to build the script for detecting when GitHub Pages were deployed
yarn run ncc build -s ./src/action/checkPagesDeploy.ts -o ./dist/checkPagesDeploy
