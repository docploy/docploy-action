import { Schema, Tag } from '@markdoc/markdoc';

export const list: Schema = {
  render: 'List',
  children: ['item'],
  attributes: {
    ordered: { type: Boolean, render: false, required: true },
  },
  transform(node, config) {
    return new Tag(
      this.render,
      node.transformAttributes(config),
      node.transformChildren(config)
    );
  },
};
