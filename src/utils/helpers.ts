import capitalize from 'src/utils/capitalize';
import path from 'path';

const DEFAULTS = {
  DOCS_DIR: '/docploy/docs',
  GITHUB_WORKSPACE: './',
  PROJECT_DIR: '/docploy',
};

export function getProjectDir() {
  const {
    PROJECT_DIR = DEFAULTS.PROJECT_DIR,
    GITHUB_WORKSPACE = DEFAULTS.GITHUB_WORKSPACE,
  } = process.env;

  return path.join(GITHUB_WORKSPACE, PROJECT_DIR);
}

export function getDocsDir() {
  const {
    DOCS_DIR = DEFAULTS.DOCS_DIR,
    GITHUB_WORKSPACE = DEFAULTS.GITHUB_WORKSPACE,
    PROJECT_DIR = DEFAULTS.PROJECT_DIR,
  } = process.env;
  let docsDir = DOCS_DIR;
  // Normalize docs dir with a trailing slash at the end
  if (!docsDir.endsWith('/')) {
    docsDir += '/';
  }
  return path.join(GITHUB_WORKSPACE, PROJECT_DIR, docsDir);
}

// Returns ['path', 'to', 'doc']
export function getSlugFromPath(relPath: string): string[] {
  if (relPath === 'index.md') {
    return [''];
  }
  let slug = relPath.replace('.md', '').split('/');

  return slug;
}

export function getPathFromSlug(slug: string[]) {
  const baseDocsDir = getDocsDir();
  const relPath = slug.join('/');
  let fullPath = path.join(baseDocsDir, relPath);

  if (relPath === '') {
    fullPath += 'index.md';
  } else {
    fullPath += '.md';
  }
  return fullPath;
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
