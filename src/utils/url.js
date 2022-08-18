// This module needs to be defined as CommonJS and native JS (no Typescript)
// because the function is used in next.config.js which only
// supports CommonJS modules.
function getDocsUrl() {
  const { BASE_URL, CI, GITHUB_SHA } = process.env;
  if (!CI) {
    return '';
  }
  // const shortSha = GITHUB_SHA?.substring(0, 7) || '';
  // const docsUrl = new URL(shortSha, BASE_URL).toString();
  return BASE_URL;
  // return docsUrl;
}

exports.getDocsUrl = getDocsUrl;
