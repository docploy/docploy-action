const { getDocsUrl } = require('./src/utils/url');
const { CI } = process.env;

const docsUrl = getDocsUrl();

// We cannot use basePath because it only accepts relative urls,
// and we need to use absolute urls to support GitHub Pages
// Going forward, we should be using the `FULL_BASE_URL`.
module.exports = {
  assetPrefix: CI ? docsUrl : '/',
  env: {
    FULL_BASE_URL: CI ? docsUrl : '/',
  },
};
