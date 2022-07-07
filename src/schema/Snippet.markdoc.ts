import type { RenderableTreeNode, Schema } from '@markdoc/markdoc';

import { Tag } from '@markdoc/markdoc';
import detect from 'language-detect';
import lineByLine from 'n-readlines';
import pathPkg from 'path';

function getContentFromPath(path: string) {
  let source = '';
  const liner = new lineByLine(path);
  let line;
  while ((line = liner.next())) {
    source += line + '\n';
  }

  return source;
}

export const snippet: Schema = {
  render: 'Snippet',
  attributes: {
    path: {
      type: String,
    },
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { path } = attributes;

    const { GITHUB_WORKSPACE = '', DOCS_DIR = '' } = process.env;

    const baseDocsDir = pathPkg.join(GITHUB_WORKSPACE, DOCS_DIR);
    const fullPath = pathPkg.join(baseDocsDir, path);
    console.log('fullPath', fullPath);

    attributes.language = detect.sync(fullPath).toLowerCase();

    const content = getContentFromPath(fullPath);
    return new Tag('Snippet', attributes, [content]);
  },
};
