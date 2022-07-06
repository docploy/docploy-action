const { BASE_URL, CI, GITHUB_SHA } = process.env;

const shortSha = GITHUB_SHA?.substring(0, 6);

module.exports = {
  assetPrefix: CI ? `${BASE_URL}/${shortSha}` : '/',
  baseUrl: CI ? `${BASE_URL}/${shortSha}` : '/',
};
