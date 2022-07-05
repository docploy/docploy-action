const { BASE_URL, CI, GITHUB_SHA } = process.env;
module.exports = {
  assetPrefix: CI ? BASE_URL : '/',
  baseUrl: CI ? `${BASE_URL}/${GITHUB_SHA}` : '/',
};
