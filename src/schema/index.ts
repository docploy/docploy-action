import { Tag, nodes } from '@markdoc/markdoc';

import type { Schema } from '@markdoc/markdoc';
import { callout } from './Callout.markdoc';
import { fence } from './Fence.markdoc';
import { list } from './List.markdoc';
import { snippet } from './Snippet.markdoc';

const heading: Schema = {
  render: 'Heading',
  attributes: {
    level: {
      type: Number,
      required: true,
    },
  },
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

const code: Schema = {
  render: 'InlineCode',
  attributes: {
    content: { type: String, render: false, required: true },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    return new Tag(this.render, attributes, [node.attributes.content]);
  },
};

const link: Schema = {
  ...nodes.link,
  render: 'Link',
};

const config = {
  nodes: {
    blockquote,
    code,
    fence,
    heading,
    link,
    list,
    paragraph,
  },
  tags: {
    callout,
    snippet,
  },
};

export default config;
