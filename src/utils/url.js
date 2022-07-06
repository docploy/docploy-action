// This module needs to be defined as CommonJS and native JS (no Typescript)
// because the function is used in next.config.js which only
// supports CommonJS modules.
function getDocsUrl() {
  const { BASE_URL, GITHUB_SHA } = process.env;
  const shortSha = GITHUB_SHA?.substring(0, 7) || '';
  const docsUrl = new URL(shortSha, BASE_URL).toString();
  return docsUrl;
}

exports.getDocsUrl = getDocsUrl;
