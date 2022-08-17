export type DocSearchResult = {
  title: string;
  url: string;
  excerpt: string;
};

export type SearchIndexResult = {
  title: string;
  content: string;
};

export type NavTreeType = {
  path: string;
  relPath: string;
  token: string;
  name: string;
  type: 'file' | 'directory';
  children: NavTreeType[];
};

export type TestStatus = 'passed' | 'failed' | 'unknown';
