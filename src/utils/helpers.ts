import path from 'path';

const DEFAULTS = {
  DOCS_DIR: '/docs',
  GITHUB_WORKSPACE: './',
};

export function getDocsDir() {
  const {
    DOCS_DIR = DEFAULTS.DOCS_DIR,
    GITHUB_WORKSPACE = DEFAULTS.GITHUB_WORKSPACE,
  } = process.env;
  let docsDir = DOCS_DIR;
  // Normalize docs dir with a trailing slash at the end
  if (!docsDir.endsWith('/')) {
    docsDir += '/';
  }
  return path.join(GITHUB_WORKSPACE, docsDir);
}
