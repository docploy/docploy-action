const { CI } = process.env;

// Keep file in sync with src/utils/url
function getDocsUrl() {
  const { BASE_URL, GITHUB_SHA } = process.env;
  console.log('base url', BASE_URL);
  console.log('github sha', GITHUB_SHA);
  const shortSha = GITHUB_SHA?.substring(0, 7) || '';
  const docsUrl = new URL(shortSha, BASE_URL).toString();
  return docsUrl;
}

const docsUrl = getDocsUrl();

module.exports = {
  assetPrefix: CI ? docsUrl : '/',
  baseUrl: CI ? docsUrl : '/',
};
