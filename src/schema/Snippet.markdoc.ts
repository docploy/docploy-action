import { RenderableTreeNode, Schema } from '@markdoc/markdoc';

import { Tag } from '@markdoc/markdoc';
import detect from 'language-detect';
import { getDocsDir } from 'src/utils/helpers';
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
    paths: {
      type: Array,
    },
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { paths } = attributes;
    const baseDocsDir = getDocsDir();

    const snippets = paths.map((path: string) => {
      const fullPath = pathPkg.join(baseDocsDir, path);
      const language = detect.sync(fullPath);
      const content = getContentFromPath(fullPath);
      return { language, content };
    });
    return new Tag('Snippet', { snippets }, []);
  },
};
