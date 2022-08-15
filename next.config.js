const { getDocsUrl } = require('./src/utils/url');

const docsUrl = getDocsUrl();

// We cannot use basePath because it only accepts relative urls,
// and we need to use absolute urls to support GitHub Pages
// Going forward, we should be using the `FULL_BASE_URL`.
module.exports = {
  assetPrefix: docsUrl,
  env: {
    FULL_BASE_URL: docsUrl,
  },
  // Make it easier to debug during prototype stage
  productionBrowserSourceMaps: true,
};
