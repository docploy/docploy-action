export function getDocsUrl() {
  const { BASE_URL, GITHUB_SHA } = process.env;
  const shortSha = GITHUB_SHA?.substring(0, 7) || '';
  const docsUrl = new URL(shortSha, BASE_URL).toString();
  return docsUrl;
}
