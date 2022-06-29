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
  description: 'Import a code snippet from the local filesystem',
  attributes: {
    path: {
      type: String,
      description:
        'Path (relative to the docs folder) to the code snippet file',
    },
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { path } = attributes;

    // TODO: switch this out to use the GH actions docs path
    const baseDocsDir = pathPkg.join(process.cwd(), '..', 'docs');
    const fullPath = pathPkg.join(baseDocsDir, path);
    console.log('fullPath', fullPath);

    attributes.language = detect.sync(fullPath).toLowerCase();

    const content = getContentFromPath(fullPath);
    return new Tag('Snippet', attributes, [content]);
  },
};
