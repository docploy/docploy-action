import { Tag, nodes } from '@markdoc/markdoc';

import type { Schema } from '@markdoc/markdoc';
import { fence } from './Fence.markdoc';
import { snippet } from './Snippet.markdoc';

const heading: Schema = {
  render: 'Heading',
  transform(node, config) {
    return new Tag(
      'Heading',
      { ...node.transformAttributes(config), level: node.attributes['level'] },
      node.transformChildren(config)
    );
  },
};

const paragraph: Schema = {
  render: 'Paragraph',
};

const blockquote: Schema = {
  render: 'Blockquote',
};

const link: Schema = {
  ...nodes.link,
  render: 'Link',
};

const config = {
  nodes: {
    blockquote,
    fence,
    heading,
    link,
    paragraph,
  },
  tags: {
    snippet,
  },
};

export default config;
