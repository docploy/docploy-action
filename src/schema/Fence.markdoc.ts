import type { Schema } from '@markdoc/markdoc';

export const fence: Schema = {
  render: 'Fence',
  attributes: {
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
  },
};
