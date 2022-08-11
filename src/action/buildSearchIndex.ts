import { DocSearchResult, SearchIndexResult } from 'src/types';
import {
  getDocsDir,
  getSlugFromPath,
  getTitleFromToken,
} from 'src/utils/helpers';

import glob from 'glob-promise';
import lunr from 'lunr';
import matter from 'gray-matter';
import path from 'path';

// TODO: this search index approach will work well when there is a small number of documents
// We generate a 1. map with all document excerpts and 2. a search index
// This will not scale when the number of documents is very high because it is like
// sending over a database and search service to the client.
// Use a database and search service if we end up needing to scale our search.

const NUM_EXCERPT_CHARACTERS = 256;

type DocStore = { [id: string]: DocSearchResult };
type SearchIndexStore = { [id: string]: SearchIndexResult };

export async function createStores(): Promise<{
  docStore: DocStore;
  searchIndexStore: SearchIndexStore;
}> {
  const baseDocsDir = getDocsDir();
  const docPaths = await glob(path.join(baseDocsDir, '**/*.md'));
  const docStore: DocStore = {};
  const searchIndexStore: SearchIndexStore = {};

  docPaths.forEach((docPath: string, i: number) => {
    const {
      data: { title: matterTitle },
      content,
    } = matter.read(docPath);
    const relPath = docPath.substring(baseDocsDir.length);
    const slug = getSlugFromPath(relPath);
    const url = slug.join('/');
    const title = matterTitle || getTitleFromToken(slug[slug.length - 1]);

    docStore[i] = {
      title,
      excerpt: content.slice(0, NUM_EXCERPT_CHARACTERS),
      url,
    };

    searchIndexStore[i] = {
      title,
      content: content,
    };
  });

  return { docStore, searchIndexStore };
}

// Returns a serialized Lunr index and a map from id to document excerpts
export async function createSearchIndex(searchIndexStore: SearchIndexStore) {
  const searchIndex: lunr.Index = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('content');

    for (const [id, searchResult] of Object.entries(searchIndexStore)) {
      const { title, content }: SearchIndexResult = searchResult;
      this.add({
        id,
        title,
        content,
      });
    }
  });

  return searchIndex;
}
