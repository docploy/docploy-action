# Clean any existing built files
rm -rf dist/

# Build a script to detect when GitHub Pages were deployed
yarn run ncc build -s ./src/action/checkPagesDeploy.ts -o ./dist/checkPagesDeploy
