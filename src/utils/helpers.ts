import capitalize from 'src/utils/capitalize';
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

// Returns ['path', 'to', 'doc']
export function getSlugFromPath(relPath: string): string[] {
  let slug = relPath.replace('.md', '').split('/');

  const filename = slug[slug.length - 1];

  // remove index and only keep the directory name
  if (filename === 'index') {
    slug.pop();
  }

  return slug;
}

export function getTitleFromToken(str: string) {
  if (!str) {
    return '';
  }
  const split = str.split('-');
  const capitalizedSplit = split.map((word: string) => {
    return capitalize(word);
  });
  return capitalizedSplit.join(' ');
}
